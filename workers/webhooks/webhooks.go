package webhooks

import (
	"bytes"
	"fmt"
	"net/http"

	"github.com/jozsefsallai/nakiri/workers/database/models"
	"github.com/jozsefsallai/nakiri/workers/youtube"
)

// SendWebhook will send information about a given YouTube video to a webhook
// URL.
func SendWebhook(keyword *models.MonitoredKeyword, item youtube.YTListItem) error {
	payload := createDiscordWebhookPayload()

	payload.Username = fmt.Sprintf("Keyword Result [%s]", keyword.Keyword)

	embed := payload.CreateEmbed()
	embed.Title = item.Snippet.Title
	embed.Description = item.Snippet.Description
	embed.URL = fmt.Sprintf("https://www.youtube.com/watch?v=%s", item.ID.VideoID)
	embed.Thumbnail = &DiscordEmbedImage{
		URL:    item.Snippet.Thumbnails.Default.URL,
		Width:  item.Snippet.Thumbnails.Default.Width,
		Height: item.Snippet.Thumbnails.Default.Height,
	}

	embed.AddField("Channel ID", item.Snippet.ChannelID, true)
	embed.AddField("Channel name", item.Snippet.ChannelTitle, true)
	embed.AddField("Published at", item.Snippet.PublishedAt, false)

	payloadBody, err := payload.ToJSON()
	if err != nil {
		return err
	}

	req, err := http.NewRequest("POST", keyword.WebhookURL, bytes.NewReader(payloadBody))
	if err != nil {
		return err
	}

	req.Header.Set("Content-Type", "application/json")
	_, err = http.DefaultClient.Do(req)
	if err != nil {
		return err
	}

	return nil
}
