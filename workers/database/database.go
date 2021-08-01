package database

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/jozsefsallai/nakiri/workers/config"
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
	}

	db = conn
}

// GetMonitoredKeywords returns an array of all monitored keywords.
func GetMonitoredKeywords() []models.MonitoredKeyword {
	var keywords []models.MonitoredKeyword
	db.Find(&keywords)
	return keywords
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
		ThumbnailURL: item.Snippet.Thumbnails.Default.URL,
		UploadDate:   publishedAt,
		Uploader:     item.Snippet.ChannelID,
		UploaderName: item.Snippet.ChannelTitle,
	}

	db.Create(&entry)
}
