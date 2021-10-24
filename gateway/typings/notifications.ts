// Type definitions for messages coming FROM the gateway server TO a websocket
// client WITHOUT a prior gateway request.

// Fields all gateway notifications should have.
export interface GatewayNotification {
  notificationId: string;
}

// The fields a client should send to acknowledge a gateway notification.
//   nakiri.gateway.emit('ack', { notificationId: '...' })
export interface GatewayClientACK {
  notificationId: string;
}

// The fields contained by a notification the gateway server sends to a client
// when a new blacklist entry is added.
export interface BlacklistEntryAddedNotification extends GatewayNotification {
  value: string;
  kind: 'substring' | 'regex';
  blacklist:
    | 'youTubeVideoID'
    | 'youTubeChannelID'
    | 'linkPattern'
    | 'discordGuildID'
    | 'phrase';
  global: boolean; // if true, the entry is global, otherwise it is scoped to the session's group
  guild?: string; // if present, the entry belongs to this guild's blacklist
  metadata?: any; // arbitrary metadata from the blacklist's model
}

// The fields contained by a notification the gateway server sends to a client
// when a blacklist entry is removed. Yes, I know it's exactly the same as the
// one for adding a new entry.
export interface BlacklistEntryRemovedNotification extends GatewayNotification {
  value: string;
  kind: 'substring' | 'regex';
  blacklist:
    | 'youTubeVideoID'
    | 'youTubeChannelID'
    | 'linkPattern'
    | 'discordGuildID'
    | 'phrase';
  global: boolean;
  guild?: string;
  metadata?: any;
}
