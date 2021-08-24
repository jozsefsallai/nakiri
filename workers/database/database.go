package database

import (
	"database/sql"
	"errors"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/getsentry/sentry-go"
	"github.com/jozsefsallai/nakiri/workers/config"
	"github.com/jozsefsallai/nakiri/workers/database/dbutils"
	"github.com/jozsefsallai/nakiri/workers/database/models"
	"github.com/jozsefsallai/nakiri/workers/utils"
	"github.com/jozsefsallai/nakiri/workers/youtube"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"gorm.io/gorm/schema"
)

var db *gorm.DB

// Init will initialize the database connection.
func Init() {
	sentry.ConfigureScope(func(scope *sentry.Scope) {
		scope.SetTag("scope", "initialization")
		scope.SetTag("target", "gorm_init")
	})

	dsn := fmt.Sprintf(
		"%s:%s@tcp(%s:%d)/%s?parseTime=true",
		config.Config.Database.Username,
		config.Config.Database.Password,
		config.Config.Database.Host,
		config.Config.Database.Port,
		config.Config.Database.Name,
	)

	conn, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
		NamingStrategy: schema.NamingStrategy{
			NameReplacer: utils.CamelCaseReplacer{},
			NoLowerCase:  true,
		},
		Logger: logger.New(
			log.New(os.Stdout, "\n", log.LstdFlags),
			logger.Config{
				SlowThreshold:             2 * time.Second,
				IgnoreRecordNotFoundError: true,
				Colorful:                  true,
			},
		),
	})
	if err != nil {
		log.Fatalf("Failed to establish database connection to %s.", dsn)
		sentry.CaptureException(err)
	}

	db = conn
}

// GetMonitoredKeywords returns an array of all monitored keywords.
func GetMonitoredKeywords() []models.MonitoredKeyword {
	var keywords []models.MonitoredKeyword
	db.Find(&keywords)
	return keywords
}

// GetWhitelistedChannel will return a whitelisted channel entry based on a
// given guild ID and channel ID. If no entry is found, nil is returned.
func GetWhitelistedChannel(guildID, channelID string) *models.KeywordWhitelistedChannel {
	var entry models.KeywordWhitelistedChannel
	result := db.Model(&models.KeywordWhitelistedChannel{}).Where("guildId = ? AND channelId = ?", guildID, channelID).First(&entry)

	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil
	}

	return &entry
}

// CountKeywordSearchResultsByVideoID will return the number of keyword search
// results for a given video ID, paired with a keyword entry ID.
func CountKeywordSearchResultByVideoID(keywordID, videoID string) int64 {
	var count int64
	db.Model(&models.KeywordSearchResult{}).Where("videoId = ? AND keywordId = ?", videoID, keywordID).Count(&count)
	return count
}

// InsertKeywordSearchResult will insert a keyword search result into the
// database for a given keyword entry.
func InsertKeywordSearchResult(keyword *models.MonitoredKeyword, item youtube.YTListItem) {
	publishedAt, _ := time.Parse(time.RFC3339, item.Snippet.PublishedAt)

	entry := models.KeywordSearchResult{
		KeywordID:    keyword.ID,
		Title:        item.Snippet.Title,
		VideoID:      item.ID.VideoID,
		ThumbnailURL: item.Snippet.GetBestThumbnail(),
		UploadDate:   publishedAt,
		Uploader:     item.Snippet.ChannelID,
		UploaderName: item.Snippet.ChannelTitle,
	}

	db.Create(&entry)
}

// GetAllYouTubeVideoIDs will return all YouTube video IDs that are currently
// in the database.
func GetAllYouTubeVideoIDs() []*models.YouTubeVideoID {
	var entries []*models.YouTubeVideoID
	db.Model(&models.YouTubeVideoID{}).Find(&entries)
	return entries
}

// UpdateYouTubeVideoIDState is a utility function for updating the processing
// state of a YouTube video ID.
func UpdateYouTubeVideoIDState(id string, state dbutils.ProcessingState) {
	db.Model(&models.YouTubeVideoID{}).Where("id = ?", id).Update("status", state)
}

// UpdateYouTubeVideoID will update a YouTube video ID entry in the database.
func UpdateYouTubeVideoID(entry *models.YouTubeVideoID, data *youtube.YTVideoListItem) {
	uploadDate, _ := time.Parse(time.RFC3339, data.Snippet.PublishedAt)

	entry.Title = sql.NullString{
		String: data.Snippet.Title,
		Valid:  true,
	}

	entry.ThumbnailURL = sql.NullString{
		String: data.Snippet.GetBestThumbnail(),
		Valid:  true,
	}

	entry.UploadDate = sql.NullTime{
		Time:  uploadDate,
		Valid: true,
	}

	entry.UploaderID = sql.NullString{
		String: data.Snippet.ChannelID,
		Valid:  true,
	}

	entry.UploaderName = sql.NullString{
		String: data.Snippet.ChannelTitle,
		Valid:  true,
	}

	db.Save(entry)
}

// DeleteYouTubeVideoID will delete a YouTube video ID entry from the database.
func DeleteYouTubeVideoID(entry *models.YouTubeVideoID) {
	db.Model(&models.YouTubeVideoID{}).Delete(entry)
}
