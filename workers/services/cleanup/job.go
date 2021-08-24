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
