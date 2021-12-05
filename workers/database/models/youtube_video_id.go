package models

import (
	"time"

	"github.com/jozsefsallai/nakiri/workers/database/dbutils"
	"gopkg.in/guregu/null.v3"
)

// YouTubeVideoID represents a single blacklisted video ID entry.
type YouTubeVideoID struct {
	ID           string `gorm:"primaryKey" json:"id"`
	CreatedAt    time.Time `json:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt"`
	GroupID      null.String `json:"groupId"`
	GuildID      null.String `json:"guildId"`
	VideoID      string `json:"videoID"`
	Status       dbutils.ProcessingState `json:"status"`
	Title        null.String `json:"title"`
	Description  null.String `json:"description"`
	ThumbnailURL null.String `json:"thumbnailUrl"`
	UploadDate   null.Time `json:"uploadDate"`
	UploaderID   null.String `json:"uploaderId"`
	UploaderName null.String `json:"uploaderName"`
}

func (*YouTubeVideoID) TableName() string {
	return "youTubeVideoIDs"
}
