import { factory } from 'factory-girl';
import { AuthorizedGuild } from '../models/auth/AuthorizedGuild';
import { DiscordGuild } from '../models/blacklists/DiscordGuild';
import { LinkPattern } from '../models/blacklists/LinkPattern';
import { Phrase } from '../models/blacklists/Phrase';
import { YouTubeChannelID } from '../models/blacklists/YouTubeChannelID';
import { YouTubeVideoID } from '../models/blacklists/YouTubeVideoID';
import { Group } from '../models/groups/Group';
import TypeORMAdapter from './support/TypeORMAdapter';

import { v4 as uuid } from 'uuid';
import { GroupMember } from '../models/groups/GroupMember';
import { ALL_PERMISSIONS } from '@/lib/GroupMemberPermissions';

factory.setAdapter(new TypeORMAdapter());

factory.define('authorizedGuild', AuthorizedGuild, {
  guildId: '871445016525029417',
});

factory.define('youtubeVideoID', YouTubeVideoID, {
  severity: factory.chance('integer', { min: 0, max: 4 }),
});

factory.define('youtubeChannelID', YouTubeChannelID, {
  severity: factory.chance('integer', { min: 0, max: 4 }),
});

factory.define('linkPattern', LinkPattern, {
  severity: factory.chance('integer', { min: 0, max: 4 }),
});

factory.define('discordGuild', DiscordGuild, {
  severity: factory.chance('integer', { min: 0, max: 4 }),
  blacklistedId: () =>
    factory.chance('integer', { min: 10000000, max: 99999999 })() +
    '' +
    factory.chance('integer', { min: 10000000, max: 99999999 })(),
  name: factory.chance('sentence', {
    words: factory.chance('integer', { min: 1, max: 3 })(),
  }),
});

factory.define('phrase', Phrase, {
  severity: factory.chance('integer', { min: 0, max: 4 }),
  content: factory.chance('sentence', {
    words: factory.chance('integer', { min: 1, max: 3 })(),
  }),
});

factory.define('group', Group, {
  name: factory.chance('sentence', { words: 3 }),
  description: factory.chance('sentence', { words: 10 }),
  apiKey: uuid(),
});

factory.define('groupMember', GroupMember, {
  groupId: factory.assoc('group', 'id'),
  permissions: ALL_PERMISSIONS,
});

export default factory;
