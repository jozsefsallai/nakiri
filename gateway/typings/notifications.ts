// Type definitions for messages coming FROM the gateway server TO a websocket
// client WITHOUT a prior gateway request.

import { AnalyzerResult } from '@/core/analyzer';
import {
  IAnyBlacklistEntry,
  IAnyBlacklistName,
} from '@/typings/IAnyBlacklistEntry';
import { MessageContext } from './requests';

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
export interface BlacklistEntryAddedNotification
  extends Omit<GatewayNotification, 'notificationId'> {
  value: string;
  kind: 'substring' | 'regex';
  blacklist: IAnyBlacklistName;
  global: boolean; // if true, the entry is global, otherwise it is scoped to the session's group
  guild?: string; // if present, the entry belongs to this guild's blacklist
  metadata?: IAnyBlacklistEntry; // arbitrary metadata from the blacklist's model
}

// The fields contained by a notification the gateway server sends to a client
// when a blacklist entry is removed. Yes, I know it's exactly the same as the
// one for adding a new entry.
export interface BlacklistEntryRemovedNotification
  extends Omit<GatewayNotification, 'notificationId'> {
  value: string;
  kind: 'substring' | 'regex';
  blacklist: IAnyBlacklistName;
  global: boolean;
  guild?: string;
  metadata?: IAnyBlacklistEntry;
}

export interface AnalysisNotification
  extends Omit<GatewayNotification, 'notificationId'> {
  content: string;
  results: AnalyzerResult;
  messageContext?: MessageContext;
}

export interface NotificationQueueEntry<
  T = Omit<GatewayNotification, 'notificationId'>,
> {
  sessionId: string;
  event: string;
  data: T;
}
