package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// KeywordSearchResult represents a single video data from a keyword search.
// This is used for checking whether a video is already in the database or not.
type KeywordSearchResult struct {
	ID           string `gorm:"primaryKey"`
	CreatedAt    time.Time
	UpdatedAt    time.Time
	KeywordID    string
	Keyword      MonitoredKeyword
	Title        string
	VideoID      string
	ThumbnailURL string
	UploadDate   time.Time
	Uploader     string
	UploaderName string
}

// BeforeCreate ensures that the created keyword search result has a valid UUID
// as its primary key.
func (k *KeywordSearchResult) BeforeCreate(tx *gorm.DB) error {
	k.ID = uuid.New().String()
	return nil
}
