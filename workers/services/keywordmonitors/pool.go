package keywordmonitors

import (
	"log"
	"strconv"
	"sync"
	"time"

	"github.com/getsentry/sentry-go"
	"github.com/jozsefsallai/nakiri/workers/config"
	"github.com/jozsefsallai/nakiri/workers/database"
	"github.com/jozsefsallai/nakiri/workers/database/models"
	"github.com/jozsefsallai/nakiri/workers/utils"
	"github.com/jozsefsallai/nakiri/workers/youtube"
)

var youtubeClient *youtube.Client

func worker(id int, jobs <-chan models.MonitoredKeyword, throttler *utils.Throttler, webhookThrottlers map[string]*utils.Throttler, wg *sync.WaitGroup) {
	defer wg.Done()

	hub := sentry.CurrentHub().Clone()
	hub.ConfigureScope(func(scope *sentry.Scope) {
		scope.SetTag("scope", "job")
		scope.SetTag("job_name", "keyword_monitoring")
		scope.SetTag("worker_id", strconv.Itoa(id))
	})

	for job := range jobs {
		log.Printf("worker %d is working on job \"%s\"\n", id, job.Keyword)

		response, err := youtubeClient.Search(job.Keyword)
		if err != nil {
			log.Printf("worker %d failed job \"%s\": %v\n", id, job.Keyword, err)
			hub.CaptureException(err)
			continue
		}

		handleJob(job, response.Items, throttler, webhookThrottlers)

		log.Printf("worker %d finished job \"%s\"\n", id, job.Keyword)
	}
}

// CreateWorkerPools will create a pool of workers. The number of workers is
// defined in the config file. The pool will be created with a wait group
// that will be used to wait for all the workers to finish. The number of jobs
// is equal to the number of keyword entries in the database. These jobs will
// be distrubuted equally to the workers, depending on which worker is free to
// process the job.
func CreateWorkerPools() {
	log.Println("Bootstrapping keyword monitoring worker pools.")

	youtubeClient = youtube.NewClient(config.Config.YouTube.APIKey)
	throttler := utils.Throttler{
		MaxInvocations: 2,
		Delay:          300 * time.Millisecond,
	}

	var wg sync.WaitGroup

	entries := database.GetMonitoredKeywords()
	entryCount := len(entries)

	webhookThrottlers := make(map[string]*utils.Throttler)
	for _, entry := range entries {
		if _, ok := webhookThrottlers[entry.WebhookURL]; !ok {
			webhookThrottlers[entry.WebhookURL] = &utils.Throttler{
				MaxInvocations: 1,
				Delay:          3 * time.Second,
			}
		}
	}

	jobs := make(chan models.MonitoredKeyword, entryCount)
	for i := 0; i < config.Config.Workers.Count; i++ {
		wg.Add(1)
		go worker(i+1, jobs, &throttler, webhookThrottlers, &wg)
	}

	for i := 0; i < entryCount; i++ {
		jobs <- entries[i]
	}
	close(jobs)

	wg.Wait()
	log.Println("Keyword monitoring worker pool finished.")
}
