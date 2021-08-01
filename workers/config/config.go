package config

import (
	"log"
	"os"
	"path/filepath"
	"strconv"

	"github.com/joho/godotenv"
)

// Config holds the base configuration of the service.
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

// Load will attempt to load the environment configuration from a dotenv file,
// in the following order:
// 	1. The environment variable "DOTENV_PATH"
// 	2. The executable's directory
// 	3. The parent directory of the executable's directory
// 	4. The parent directory of the parent directory of the executable's
//     directory
// If a valid dotenv configuration was found, it will be loaded into the global
// Config variable.
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
			APIKey: os.Getenv("WORKERS_YOUTUBE_API_KEY"),
		},

		Workers: &WorkersConfig{
			Count:        workerCount,
			ScanInterval: workerScanInterval,
		},
	}
}
