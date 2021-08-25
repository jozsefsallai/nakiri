package cleanup

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

func videoWorker(id int, jobs <-chan *models.YouTubeVideoID, throttler *utils.Throttler, wg *sync.WaitGroup) {
	defer wg.Done()

	hub := sentry.CurrentHub().Clone()
	hub.ConfigureScope(func(scope *sentry.Scope) {
		scope.SetTag("scope", "job")
		scope.SetTag("job_name", "cleanup_video")
		scope.SetTag("worker_id", strconv.Itoa(id))
	})

	for job := range jobs {
		log.Printf("cleanup started by worker %d for ID %s\n", id, job.VideoID)

		throttler.Throttle()

		entry, err := youtubeClient.GetVideo(job.VideoID)
		if err != nil {
			log.Printf("cleanup failed by worker %d for ID %s: %v\n", id, job.VideoID, err)
			hub.CaptureException(err)
			continue
		}

		handleVideo(job, entry)

		log.Printf("cleanup finished by worker %d for ID %s\n", id, job.VideoID)
	}
}

func channelWorker(id int, jobs <-chan *models.YouTubeChannelID, throttler *utils.Throttler, wg *sync.WaitGroup) {
	defer wg.Done()

	hub := sentry.CurrentHub().Clone()
	hub.ConfigureScope(func(scope *sentry.Scope) {
		scope.SetTag("scope", "job")
		scope.SetTag("job_name", "cleanup_channel")
		scope.SetTag("worker_id", strconv.Itoa(id))
	})

	for job := range jobs {
		log.Printf("cleanup started by worker %d for ID %s\n", id, job.ChannelID)

		throttler.Throttle()

		entry, err := youtubeClient.GetChannel(job.ChannelID)
		if err != nil {
			log.Printf("cleanup failed by worker %d for ID %s: %v\n", id, job.ChannelID, err)
			hub.CaptureException(err)
			continue
		}

		handleChannel(job, entry)

		log.Printf("cleanup finished by worker %d for ID %s\n", id, job.ChannelID)
	}
}

func CreateWorkerPools() {
	log.Println("Bootstrapping cleanup worker pool.")

	youtubeClient = youtube.NewClient(config.Config.YouTube.APIKey)
	throttler := utils.Throttler{
		MaxInvocations: 2,
		Delay:          300 * time.Millisecond,
	}

	var wg sync.WaitGroup

	videoIDs := database.GetAllYouTubeVideoIDs()
	videoIDCount := len(videoIDs)

	videoJobs := make(chan *models.YouTubeVideoID, videoIDCount)
	for i := 0; i < config.Config.Workers.Count; i++ {
		wg.Add(1)
		go videoWorker(i, videoJobs, &throttler, &wg)
	}

	for i := 0; i < videoIDCount; i++ {
		videoJobs <- videoIDs[i]
	}
	close(videoJobs)

	wg.Wait()

	channelIDs := database.GetAllYouTubeChannelIDs()
	channelIDCount := len(channelIDs)

	channelJobs := make(chan *models.YouTubeChannelID, channelIDCount)
	for i := 0; i < config.Config.Workers.Count; i++ {
		wg.Add(1)
		go channelWorker(i, channelJobs, &throttler, &wg)
	}

	for i := 0; i < channelIDCount; i++ {
		channelJobs <- channelIDs[i]
	}
	close(channelJobs)

	wg.Wait()

	log.Println("Cleanup worker pool finished.")
}
