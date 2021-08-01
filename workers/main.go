package main

import (
	"fmt"
	"time"

	"github.com/go-co-op/gocron"
	"github.com/jozsefsallai/nakiri/workers/config"
	"github.com/jozsefsallai/nakiri/workers/database"
	"github.com/jozsefsallai/nakiri/workers/pool"
)

func init() {
	config.Load()
	database.Init()
}

func main() {
	s := gocron.NewScheduler(time.UTC)
	s.Every(config.Config.Workers.ScanInterval).Hours().Do(pool.CreateWorkerPools)
	fmt.Println("NakiriAPI worker pool service is running.")
	s.StartBlocking()
}
