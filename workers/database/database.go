package database

import (
	"fmt"
	"log"

	"github.com/jozsefsallai/nakiri/workers/config"
	"github.com/jozsefsallai/nakiri/workers/database/models"
	"github.com/jozsefsallai/nakiri/workers/utils"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/schema"
)

var db *gorm.DB

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
	})
	if err != nil {
		log.Fatalf("Failed to establish database connection to %s.", dsn)
	}

	db = conn
}

func CountMonitoredKeywords() int64 {
	var count int64
	db.Model(&models.MonitoredKeyword{}).Count(&count)
	return count
}

func GetMonitoredKeywords() []models.MonitoredKeyword {
	var keywords []models.MonitoredKeyword
	db.Find(&keywords)
	return keywords
}
