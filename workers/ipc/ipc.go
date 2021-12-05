package ipc

import (
	"encoding/json"
	"net"

	"github.com/jozsefsallai/nakiri/workers/database/models"
)

type ipcMessageBody struct {
	Type string `json:"type"`
	Data struct {
		Action string `json:"action"`
		Data   interface{} `json:"data"`
	} `json:"data"`
}

func sendIPCMessage(action string, data interface{}) error {
	body := ipcMessageBody{}
	body.Type = "message"
	body.Data.Action = action
	body.Data.Data = data

	message, err := json.Marshal(body)
	if err != nil {
		return err
	}

	message = append(message, '\f')

	conn, err := net.Dial("unix", SOCKET_PATH)
	if err != nil {
		return err
	}

	defer conn.Close()

	_, err = conn.Write(message)
	return err
}

func InformAboutVideoDeletion(video *models.YouTubeVideoID) error {
	return sendIPCMessage("videoDeleted", video)
}

func InformAboutChannelDeletion(channel *models.YouTubeChannelID) error {
	return sendIPCMessage("channelDeleted", channel)
}
