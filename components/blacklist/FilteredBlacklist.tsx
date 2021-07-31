import { ILinkPattern } from '@/db/models/blacklists/LinkPattern';
import { IYouTubeChannelID } from '@/db/models/blacklists/YouTubeChannelID';
import { IYouTubeVideoID } from '@/db/models/blacklists/YouTubeVideoID';
import { IMonitoredKeyword } from '@/db/models/keywords/MonitoredKeyword';

import { BlacklistAction } from './BlacklistActions';
import BlacklistRow from './BlacklistRow';

export type BlacklistItem = ILinkPattern | IYouTubeVideoID | IYouTubeChannelID | IMonitoredKeyword;

export interface FilteredBlacklistProps {
  items: BlacklistItem[];
  onTextClick?(text: string): void;
  actions?: BlacklistAction[];
};

const FilteredBlacklist = ({ items, onTextClick, actions }: FilteredBlacklistProps) => {
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
      text={text}
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
