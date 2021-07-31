package models

import "time"

type KeywordSearchResult struct {
	ID           string `gorm:"primaryKey"`
	CreatedAt    time.Time
	UpdatedAt    time.Time
	KeywordID    string
	Keyword      MonitoredKeyword
	Title        string
	URL          string
	ThumbnailURL string
	UploadDate   time.Time
	Uploader     string
}
