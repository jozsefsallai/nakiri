package models

import (
	"database/sql"
	"time"

	"github.com/jozsefsallai/nakiri/workers/database/dbutils"
)

// YouTubeChannelID represents a single blacklisted channel ID entry.
type YouTubeChannelID struct {
	ID           string `gorm:"primaryKey"`
	CreatedAt    time.Time
	UpdatedAt    time.Time
	ChannelID    string
	Status       dbutils.ProcessingState
	Name         sql.NullString
	Description  sql.NullString
	PublishedAt  sql.NullTime
	ThumbnailURL sql.NullString
}

func (*YouTubeChannelID) TableName() string {
	return "youTubeChannelIDs"
}
