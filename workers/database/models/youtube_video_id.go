package models

import (
	"database/sql"
	"time"

	"github.com/jozsefsallai/nakiri/workers/database/dbutils"
)

// YouTubeVideoID represents a single blacklisted video ID entry.
type YouTubeVideoID struct {
	ID           string `gorm:"primaryKey"`
	CreatedAt    time.Time
	UpdatedAt    time.Time
	VideoID      string
	Status       dbutils.ProcessingState
	Title        sql.NullString
	Description  sql.NullString
	ThumbnailURL sql.NullString
	UploadDate   sql.NullTime
	UploaderID   sql.NullString
	UploaderName sql.NullString
}

func (_ *YouTubeVideoID) TableName() string {
	return "youTubeVideoIDs"
}
