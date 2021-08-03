package pool

import (
	"log"

	"github.com/jozsefsallai/nakiri/workers/database"
	"github.com/jozsefsallai/nakiri/workers/database/models"
	"github.com/jozsefsallai/nakiri/workers/webhooks"
	"github.com/jozsefsallai/nakiri/workers/youtube"
)

func isChannelWhitelisted(guildID, channelID string) bool {
	entry := database.GetWhitelistedChannel(guildID, channelID)
	return entry != nil
}

func handleItem(job models.MonitoredKeyword, item youtube.YTListItem, throttler *Throttler) error {
	if isChannelWhitelisted(job.GuildID, item.Snippet.ChannelID) {
		return nil
	}

	count := database.CountKeywordSearchResultByVideoID(job.ID, item.ID.VideoID)
	if count != 0 {
		return nil
	}

	database.InsertKeywordSearchResult(&job, item)

	throttler.Throttle()
	return webhooks.SendWebhook(&job, item)
}

func handleJob(job models.MonitoredKeyword, response []youtube.YTListItem, throttler *Throttler, webhookThrottlers map[string]*Throttler) {
	for i := len(response) - 1; i >= 0; i-- {
		item := response[i]

		throttler.Throttle()

		err := handleItem(job, item, webhookThrottlers[job.WebhookURL])
		if err != nil {
			log.Println(err)
		}
	}
}
