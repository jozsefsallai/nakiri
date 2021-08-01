package webhooks

import (
	"bytes"
	"crypto/sha256"
	"encoding/binary"
	"fmt"
	"io"
	"math/rand"
	"net/http"

	"github.com/jozsefsallai/nakiri/workers/database/models"
	"github.com/jozsefsallai/nakiri/workers/youtube"
)

func getEmbedColor(keyword *models.MonitoredKeyword) int {
	hash := sha256.New()
	io.WriteString(hash, fmt.Sprintf("%snakiriseed", keyword.Keyword))
	seed := binary.BigEndian.Uint64(hash.Sum(nil))

	rng := rand.New(rand.NewSource(int64(seed)))

	r := rng.Intn(256)
	g := rng.Intn(256)
	b := rng.Intn(256)

	return int(r<<16 | g<<8 | b)
}

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
	embed.Color = getEmbedColor(keyword)

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
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}

	if res.StatusCode >= 300 {
		return fmt.Errorf("received status code %d while trying to POST webhook. %s", res.StatusCode, item.ID.VideoID)
	}

	return nil
}
