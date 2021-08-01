package webhooks

import "encoding/json"

// DiscordEmbedImage represents information about an image, such as its URL and
// its dimensions.
type DiscordEmbedImage struct {
	URL      string `json:"url"`
	ProxyURL string `json:"proxy_url,omitempty"`
	Height   int    `json:"height,omitempty"`
	Width    int    `json:"width,omitempty"`
}

// DiscordEmbedField represents a single field in an embed.
type DiscordEmbedField struct {
	Name   string `json:"name"`
	Value  string `json:"value"`
	Inline bool   `json:"inline,omitempty"`
}

// DiscordEmbedFooter represents a footer for an embed.
type DiscordEmbedFooter struct {
	IconURL string `json:"icon_url,omitempty"`
	Text    string `json:"text,omitempty"`
}

// DiscordEmbed represents a single embed that can be sent in a webhook call.
type DiscordEmbed struct {
	Title       string               `json:"title,omitempty"`
	Type        string               `json:"type,omitempty"`
	Description string               `json:"description,omitempty"`
	URL         string               `json:"url,omitempty"`
	Timestamp   string               `json:"timestamp,omitempty"`
	Thumbnail   *DiscordEmbedImage   `json:"thumbnail,omitempty"`
	Color       int                  `json:"color,omitempty"`
	Footer      *DiscordEmbedFooter  `json:"footer,omitempty"`
	Fields      []*DiscordEmbedField `json:"fields,omitempty"`
}

// DiscordWebhookPayload represents the payload for a Discord webhook.
type DiscordWebhookPayload struct {
	Username  string          `json:"username,omitempty"`
	AvatarURL string          `json:"avatar_url,omitempty"`
	Embeds    []*DiscordEmbed `json:"embeds,omitempty"`
}

// AddField will append a field to the list of embed fields in a Discord embed.
func (embed *DiscordEmbed) AddField(name, value string, inline bool) {
	embed.Fields = append(embed.Fields, &DiscordEmbedField{
		Name:   name,
		Value:  value,
		Inline: inline,
	})
}

// CreateEmbed will instantiate a Discord embed in a webhook payload.
func (p *DiscordWebhookPayload) CreateEmbed() *DiscordEmbed {
	embed := &DiscordEmbed{}
	embed.Type = "rich"
	embed.Fields = make([]*DiscordEmbedField, 0)
	p.Embeds = append(p.Embeds, embed)
	return embed
}

// ToJSON will serialize a DiscordWebhookPayload into a JSON string that can be
// sent via an HTTP call.
func (p *DiscordWebhookPayload) ToJSON() ([]byte, error) {
	return json.Marshal(p)
}

func createDiscordWebhookPayload() *DiscordWebhookPayload {
	payload := &DiscordWebhookPayload{}
	payload.Embeds = make([]*DiscordEmbed, 0)
	return payload
}
