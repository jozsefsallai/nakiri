package config

import (
	"log"
	"os"
	"path/filepath"
	"strconv"

	"github.com/joho/godotenv"
)

var Config *BaseConfig

func loadDotenv() error {
	customPath := os.Getenv("DOTENV_PATH")
	if len(customPath) > 0 {
		err := godotenv.Load(customPath)

		if err == nil {
			return nil
		}
	}

	exepath, err := os.Executable()
	if err != nil {
		return err
	}

	exedir := filepath.Dir(exepath)
	err = godotenv.Load(filepath.Join(exedir, ".env"))
	if err == nil {
		return nil
	}

	err = godotenv.Load(filepath.Join(exedir, "../.env"))
	if err == nil {
		return nil
	}

	return godotenv.Load(filepath.Join(exedir, "../../.env"))
}

func Load() {
	err := loadDotenv()
	if err != nil {
		log.Fatal("Failed to load the app configuration.")
	}

	dbport, _ := strconv.Atoi(os.Getenv("DATABASE_PORT"))
	workerCount, _ := strconv.Atoi(os.Getenv("WORKER_COUNT"))
	workerScanInterval, _ := strconv.Atoi(os.Getenv("WORKER_SCAN_INTERVAL"))

	Config = &BaseConfig{
		Database: &DatabaseConfig{
			Host:     os.Getenv("DATABASE_HOST"),
			Port:     dbport,
			Username: os.Getenv("DATABASE_USERNAME"),
			Password: os.Getenv("DATABASE_PASSWORD"),
			Name:     os.Getenv("DATABASE_NAME"),
		},

		YouTube: &YouTubeConfig{
			APIKey: os.Getenv("YOUTUBE_API_KEY"),
		},

		Workers: &WorkersConfig{
			Count:        workerCount,
			ScanInterval: workerScanInterval,
		},
	}
}
