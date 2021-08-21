import { ILinkPattern } from '@/db/models/blacklists/LinkPattern';
import { IYouTubeChannelID } from '@/db/models/blacklists/YouTubeChannelID';
import { IYouTubeVideoID } from '@/db/models/blacklists/YouTubeVideoID';
import { IKeywordWhitelistedChannel } from '@/db/models/keywords/KeywordWhitelistedChannel';
import { IMonitoredKeyword } from '@/db/models/keywords/MonitoredKeyword';

import { BlacklistAction } from './BlacklistActions';
import BlacklistRow from './BlacklistRow';

export type BlacklistItem = ILinkPattern | IYouTubeVideoID | IYouTubeChannelID | IMonitoredKeyword | IKeywordWhitelistedChannel;

export interface FilteredBlacklistProps {
  items: BlacklistItem[];
  onTextClick?(text: string): void;
  actions?: BlacklistAction[];
  entryComponent?: React.FC<any> | React.ComponentClass<any>;
};

const FilteredBlacklist = ({ items, onTextClick, actions, entryComponent }: FilteredBlacklistProps) => {
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

    return '<unknown>';
  };

  const renderItem = (item: BlacklistItem) => {
    const text = getItemText(item);

    return <BlacklistRow
      key={item.id}
      id={item.id}
      item={item}
      text={text}
      entryComponent={entryComponent}
      onTextClick={onTextClick}
      actions={actions}
    />;
  };

  return (
    <div className="py-4">
      {items.map(renderItem)}
    </div>
  );
};

export default FilteredBlacklist;
