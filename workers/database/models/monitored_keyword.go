package models

import "time"

// MonitoredKeyword represents a monitored keyword. This model is meant to be
// read-only and can only be configured from within the NakiriAPI frontend.
type MonitoredKeyword struct {
	ID         string `gorm:"primaryKey"`
	CreatedAt  time.Time
	UpdatedAt  time.Time
	Keyword    string
	GuildID    string
	WebhookURL string
}
