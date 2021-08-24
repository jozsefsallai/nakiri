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

// YTSnippet returns a snippet of information about a search result entry.
type YTSnippet struct {
	PublishedAt string
	ChannelID   string
	Title       string
	Description string
	Thumbnails  struct {
		Default  *YTThumbnailData `json:"default,omitempty"`
		Medium   *YTThumbnailData `json:"medium,omitempty"`
		High     *YTThumbnailData `json:"high,omitempty"`
		Standard *YTThumbnailData `json:"standard,omitempty"`
		MaxRes   *YTThumbnailData `json:"maxres,omitempty"`
	}
	ChannelTitle string
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

// YTListResponse represents the response to a video list request from the
// YouTube API.
type YTListResponse struct {
	Kind     string
	ETag     string
	Items    []*YTVideoListItem
	PageInfo *YTPageInfo
}

func (snippet *YTSnippet) GetBestThumbnail() string {
	if snippet.Thumbnails.MaxRes != nil {
		return snippet.Thumbnails.MaxRes.URL
	}

	if snippet.Thumbnails.Standard != nil {
		return snippet.Thumbnails.Standard.URL
	}

	if snippet.Thumbnails.High != nil {
		return snippet.Thumbnails.High.URL
	}

	if snippet.Thumbnails.Medium != nil {
		return snippet.Thumbnails.Medium.URL
	}

	if snippet.Thumbnails.Default != nil {
		return snippet.Thumbnails.Default.URL
	}

	return ""
}
