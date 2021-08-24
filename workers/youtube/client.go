package youtube

import (
	"encoding/json"
	"errors"
	"io/ioutil"
	"net/http"
	"net/url"
	"strconv"
	"strings"
)

// Client represents a YouTube API client. The client is very limited to the
// jobs it's supposed to do.
type Client struct {
	APIKey string
}

const YOUTUBE_VIDEO_DATA_API_URL = "https://www.googleapis.com/youtube/v3/videos?id=:videoId&key=:apiKey&part=snippet"
const YOUTUBE_SEARCH_API_URL = "https://youtube.googleapis.com/youtube/v3/search?part=snippet&order=date&q=:query&maxResults=:maxResults&safeSearch=none&type=video&key=:apiKey"

func (c *Client) buildSearchUrl(query string, maxResults int) string {
	replacer := strings.NewReplacer(":apiKey", c.APIKey, ":maxResults", strconv.Itoa(maxResults), ":query", url.QueryEscape(query))
	return replacer.Replace(YOUTUBE_SEARCH_API_URL)
}

func (c *Client) buildVideoDataUrl(videoId string) string {
	replacer := strings.NewReplacer(":apiKey", c.APIKey, ":videoId", videoId)
	return replacer.Replace(YOUTUBE_VIDEO_DATA_API_URL)
}

// Search will search for a given keyword on YouTube and return the response of
// the request. The `part` parameter is "snippet", the order is "date" (desc),
// the `safeSearch` parameter is "none", the `type` parameter is "video", and
// the `maxResults` parameter is 25.
func (c *Client) Search(query string) (*YTSearchResponse, error) {
	url := c.buildSearchUrl(query, 25)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}

	defer res.Body.Close()

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}

	if res.StatusCode != 200 {
		return nil, errors.New("YouTube fetching failed. Probably exceeded quota")
	}

	var response YTSearchResponse
	err = json.Unmarshal(body, &response)
	if err != nil {
		return nil, err
	}

	return &response, nil
}

func (c *Client) GetVideo(id string) (*YTVideoListItem, error) {
	url := c.buildVideoDataUrl(id)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}

	defer res.Body.Close()

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}

	if res.StatusCode != 200 {
		return nil, errors.New("YouTube fetching failed. Probably exceeded quota")
	}

	var response YTListResponse
	err = json.Unmarshal(body, &response)
	if err != nil {
		return nil, err
	}

	if len(response.Items) == 0 {
		return nil, nil
	}

	return response.Items[0], nil
}

// NewClient instantiates a new YouTube API client.
func NewClient(apiKey string) *Client {
	return &Client{
		APIKey: apiKey,
	}
}
