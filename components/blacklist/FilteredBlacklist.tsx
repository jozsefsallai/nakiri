import { IDiscordGuild } from '@/db/models/blacklists/DiscordGuild';
import { ILinkPattern } from '@/db/models/blacklists/LinkPattern';
import { IPhrase } from '@/db/models/blacklists/Phrase';
import { IYouTubeChannelID } from '@/db/models/blacklists/YouTubeChannelID';
import { IYouTubeVideoID } from '@/db/models/blacklists/YouTubeVideoID';
import { IKeywordSearchResult } from '@/db/models/keywords/KeywordSearchResult';
import { IKeywordWhitelistedChannel } from '@/db/models/keywords/KeywordWhitelistedChannel';
import { IMonitoredKeyword } from '@/db/models/keywords/MonitoredKeyword';

import { BlacklistAction } from './BlacklistActions';
import BlacklistRow from './BlacklistRow';

export type BlacklistItem =
  | ILinkPattern
  | IYouTubeVideoID
  | IYouTubeChannelID
  | IMonitoredKeyword
  | IKeywordWhitelistedChannel
  | IKeywordSearchResult
  | IDiscordGuild
  | IPhrase;

export interface FilteredBlacklistProps {
  items: BlacklistItem[];
  onTextClick?(text: string): void;
  actions?: BlacklistAction[];
  entryComponent?: React.FC<any> | React.ComponentClass<any>;
}

const FilteredBlacklist = ({
  items,
  onTextClick,
  actions,
  entryComponent,
}: FilteredBlacklistProps) => {
  const getItemText = (item: BlacklistItem) => {
    if ('videoId' in item) {
      return item.videoId;
    }

    if ('channelId' in item) {
      return item.channelId;
    }

    if ('pattern' in item) {
      return item.pattern;
    }

    if ('keyword' in item) {
      return item.keyword;
    }

    if ('blacklistedId' in item) {
      return item.blacklistedId;
    }

    return '<unknown>';
  };

  const renderItem = (item: BlacklistItem) => {
    const text = getItemText(item);

    return (
      <BlacklistRow
        key={item.id}
        id={item.id}
        item={item}
        text={text}
        entryComponent={entryComponent}
        onTextClick={onTextClick}
        actions={actions}
      />
    );
  };

  return <div className="py-4">{items.map(renderItem)}</div>;
};

export default FilteredBlacklist;
