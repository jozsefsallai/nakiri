package youtube

// YTSearchResponse contains the response from a search request.
type YTSearchResponse struct {
	Kind          string
	ETag          string
	NextPageToken string
	RegionCode    string
	PageInfo      YTPageInfo
	Items         []YTListItem
}
