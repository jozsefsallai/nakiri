package youtube

// YTIdentificationData returns information about the identification data of a
// search result entry (in our case, we only use it for grabbing the ID of the
// video).
type YTIdentificationData struct {
	Kind       string
	VideoID    string `json:"videoId,omitempty"`
	ChannelID  string `json:"channelId,omitempty"`
	PlaylistID string `json:"playlistId,omitempty"`
}

// YTThumbnailData returns information about the thumbnail data of a search
// result entry.
type YTThumbnailData struct {
	URL    string
	Width  int
	Height int
}

// YTThumbnails returns information about the thumbnail data of a search result
// entry.
type YTThumbnails struct {
	Default  *YTThumbnailData `json:"default,omitempty"`
	Medium   *YTThumbnailData `json:"medium,omitempty"`
	High     *YTThumbnailData `json:"high,omitempty"`
	Standard *YTThumbnailData `json:"standard,omitempty"`
	MaxRes   *YTThumbnailData `json:"maxres,omitempty"`
}

// YTSnippet returns a snippet of information about a search result entry.
type YTSnippet struct {
	PublishedAt  string
	ChannelID    string
	Title        string
	Description  string
	Thumbnails   *YTThumbnails
	ChannelTitle string
}

// YTChannelSnippet returns a snippet of information about a channel.
type YTChannelSnippet struct {
	PublishedAt string
	Title       string
	Description string
	CustomURL   string
	Thumbnails  *YTThumbnails
}

// YTListItem is a single search result entry.
type YTListItem struct {
	Kind    string
	ETag    string
	ID      YTIdentificationData
	Snippet YTSnippet
}

// YTVideoListItem is a single video item.
type YTVideoListItem struct {
	Kind    string
	ETag    string
	ID      string
	Snippet YTSnippet
}

// YTChannelListItem is a single channel item.
type YTChannelListItem struct {
	Kind    string
	ETag    string
	ID      string
	Snippet YTChannelSnippet
}

// YTListResponse represents the response to a video list request from the
// YouTube API.
type YTListResponse struct {
	Kind     string
	ETag     string
	Items    []*YTVideoListItem
	PageInfo *YTPageInfo
}

// YTChannelListResponse represents the response to a channel list request from
// the YouTube API.
type YTChannelListResponse struct {
	Kind     string
	ETag     string
	Items    []*YTChannelListItem
	PageInfo *YTPageInfo
}

// Best will return the best available thumbnail from a thumbnail data struct.
func (thumbnails *YTThumbnails) Best() string {
	if thumbnails.MaxRes != nil {
		return thumbnails.MaxRes.URL
	}

	if thumbnails.Standard != nil {
		return thumbnails.Standard.URL
	}

	if thumbnails.High != nil {
		return thumbnails.High.URL
	}

	if thumbnails.Medium != nil {
		return thumbnails.Medium.URL
	}

	if thumbnails.Default != nil {
		return thumbnails.Default.URL
	}

	return ""
}
