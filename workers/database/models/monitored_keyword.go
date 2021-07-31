package models

import "time"

type MonitoredKeyword struct {
	ID         string `gorm:"primaryKey"`
	CreatedAt  time.Time
	UpdatedAt  time.Time
	Keyword    string
	GuildID    string
	WebhookURL string
}
