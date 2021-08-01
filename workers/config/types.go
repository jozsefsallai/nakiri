package config

// DatabaseConfig is the configuration for the database
type DatabaseConfig struct {
	Host     string
	Port     int
	Username string
	Password string
	Name     string
}

// YouTubeConfig is the configuration for the YouTube API
type YouTubeConfig struct {
	APIKey string
}

// WorkersConfig is the configuration for the workers. It contains two fields:
// the number of workers and the schedule interval in hours.
type WorkersConfig struct {
	Count        int
	ScanInterval int
}

// BaseConfig contains all of the configuration for the application (database,
// YouTube API, workers).
type BaseConfig struct {
	Database *DatabaseConfig
	YouTube  *YouTubeConfig
	Workers  *WorkersConfig
}
