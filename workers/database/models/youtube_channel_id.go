package models

import (
	"time"

	"github.com/jozsefsallai/nakiri/workers/database/dbutils"
	"gopkg.in/guregu/null.v3"
)

// YouTubeChannelID represents a single blacklisted channel ID entry.
type YouTubeChannelID struct {
	ID           string `gorm:"primaryKey" json:"id"`
	CreatedAt    time.Time `json:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt"`
	GroupID      null.String `json:"groupId"`
	GuildID      null.String `json:"guildId"`
	ChannelID    string `json:"channelId"`
	Status       dbutils.ProcessingState `json:"status"`
	Name         null.String `json:"name"`
	Description  null.String `json:"description"`
	PublishedAt  null.Time `json:"publishedAt"`
	ThumbnailURL null.String `json:"thumbnailUrl"`
}

func (*YouTubeChannelID) TableName() string {
	return "youTubeChannelIDs"
}
