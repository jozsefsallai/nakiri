package cleanup

import (
	"log"

	"github.com/jozsefsallai/nakiri/workers/database"
	"github.com/jozsefsallai/nakiri/workers/database/dbutils"
	"github.com/jozsefsallai/nakiri/workers/database/models"
	"github.com/jozsefsallai/nakiri/workers/youtube"
)

func handleVideo(job *models.YouTubeVideoID, item *youtube.YTVideoListItem) {
	database.UpdateYouTubeVideoIDState(job.ID, dbutils.PSPending)

	if item == nil {
		log.Printf("-> video %s is no longer available... deleting.\n", job.VideoID)
		database.DeleteYouTubeVideoID(job)
		return
	}

	database.UpdateYouTubeVideoID(job, item)
	database.UpdateYouTubeVideoIDState(job.ID, dbutils.PSDone)
}

func handleChannel(job *models.YouTubeChannelID, item *youtube.YTChannelListItem) {
	database.UpdateYouTubeChannelIDState(job.ID, dbutils.PSPending)

	if item == nil {
		log.Printf("-> channel %s is no longer available... deleting.\n", job.ChannelID)
		database.DeleteYouTubeChannelID(job)
		return
	}

	database.UpdateYouTubeChannelID(job, item)
	database.UpdateYouTubeChannelIDState(job.ID, dbutils.PSDone)
}
