package config

type DatabaseConfig struct {
	Host     string
	Port     int
	Username string
	Password string
	Name     string
}

type YouTubeConfig struct {
	APIKey string
}

type WorkersConfig struct {
	Count        int
	ScanInterval int
}

type BaseConfig struct {
	Database *DatabaseConfig
	YouTube  *YouTubeConfig
	Workers  *WorkersConfig
}
