package models

import "time"

// KeywordWhitelistedChannel represents a channel ID that is whitelisted in a
// given guild. When collecting keyword search results, the channels in this
// list will be ignored.
type KeywordWhitelistedChannel struct {
	ID        string `gorm:"primaryKey"`
	CreatedAt time.Time
	UpdatedAt time.Time
	ChannelID string
	GuildID   string
}
