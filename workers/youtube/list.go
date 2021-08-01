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
		Default YTThumbnailData
		Medium  YTThumbnailData
		High    YTThumbnailData
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
