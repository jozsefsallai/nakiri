package main

import (
	"flag"
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/getsentry/sentry-go"
	"github.com/go-co-op/gocron"
	"github.com/jozsefsallai/nakiri/workers/config"
	"github.com/jozsefsallai/nakiri/workers/database"
	"github.com/jozsefsallai/nakiri/workers/services/cleanup"
	"github.com/jozsefsallai/nakiri/workers/services/keywordmonitors"
	"github.com/jozsefsallai/nakiri/workers/utils"
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

	workersString := flag.String("workers", "keyword_monitors,cleanup", "workers to run")
	once := flag.Bool("once", false, "run workers only once")

	flag.Parse()

	workers := strings.Split(*workersString, ",")

	shouldRunKeywordMonitors := utils.ArrayContainsString(workers, "keyword_monitors")
	shouldRunCleanup := utils.ArrayContainsString(workers, "cleanup")

	if *once {
		if shouldRunKeywordMonitors {
			keywordmonitors.CreateWorkerPools()
		}

		if shouldRunCleanup {
			cleanup.CreateWorkerPools()
		}

		log.Println("Done!")

		return
	}

	s := gocron.NewScheduler(time.UTC)

	if shouldRunKeywordMonitors {
		s.Every(config.Config.Workers.ScanInterval).Hours().Do(keywordmonitors.CreateWorkerPools)
	}

	if shouldRunCleanup {
		s.Every(config.Config.Workers.CleanupInterval).Hours().Do(cleanup.CreateWorkerPools)
	}

	fmt.Println("NakiriAPI worker service is running.")

	s.StartBlocking()
}
