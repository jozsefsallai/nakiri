package pool

import (
	"log"
	"sync"
	"time"

	"github.com/jozsefsallai/nakiri/workers/config"
	"github.com/jozsefsallai/nakiri/workers/database"
	"github.com/jozsefsallai/nakiri/workers/database/models"
)

func worker(id int, jobs <-chan models.MonitoredKeyword, wg *sync.WaitGroup) {
	defer wg.Done()

	for job := range jobs {
		log.Println("worker", id, "is working on job", job.Keyword)
		time.Sleep(time.Second) // TODO: perform API checks
		log.Println("worker", id, "finished job", job.Keyword)
	}
}

func CreateWorkerPools() {
	log.Println("Bootstrapping worker pools.")

	var wg sync.WaitGroup

	entries := database.GetMonitoredKeywords()
	entryCount := len(entries)

	jobs := make(chan models.MonitoredKeyword, entryCount)
	for i := 0; i < config.Config.Workers.Count; i++ {
		wg.Add(1)
		go worker(i+1, jobs, &wg)
	}

	for i := 0; i < entryCount; i++ {
		jobs <- entries[i]
	}
	close(jobs)

	wg.Wait()
	log.Println("Worker pool finished.")
}
