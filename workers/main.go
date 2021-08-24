package main

import (
	"fmt"
	"log"
	"time"

	"github.com/getsentry/sentry-go"
	"github.com/go-co-op/gocron"
	"github.com/jozsefsallai/nakiri/workers/config"
	"github.com/jozsefsallai/nakiri/workers/database"
	"github.com/jozsefsallai/nakiri/workers/services/cleanup"
	"github.com/jozsefsallai/nakiri/workers/services/keywordmonitors"
)

func init() {
	config.Load()
	database.Init()
}

func main() {
	if len(config.Config.Sentry.DSN) > 0 {
		err := sentry.Init(sentry.ClientOptions{
			Dsn: config.Config.Sentry.DSN,
		})

		if err != nil {
			log.Fatalf("failed to initialize sentry: %s", err)
		}

		defer sentry.Flush(time.Second * 2)
	}

	s := gocron.NewScheduler(time.UTC)
	s.Every(config.Config.Workers.ScanInterval).Hours().Do(keywordmonitors.CreateWorkerPools)
	s.Every(config.Config.Workers.CleanupInterval).Hours().Do(cleanup.CreateWorkerPools)

	fmt.Println("NakiriAPI worker service is running.")

	s.StartBlocking()
}
