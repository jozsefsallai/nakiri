package youtube

// YTPageInfo contains information about the pagination of a search result.
type YTPageInfo struct {
	TotalResults   int64
	ResultsPerPage int64
}

// YTSearchResponse contains the response from a search request.
type YTSearchResponse struct {
	Kind          string
	ETag          string
	NextPageToken string
	RegionCode    string
	PageInfo      YTPageInfo
	Items         []YTListItem
}
