import { ILinkPattern } from '@/db/models/blacklists/LinkPattern';
import { IYouTubeChannelID } from '@/db/models/blacklists/YouTubeChannelID';
import { IYouTubeVideoID } from '@/db/models/blacklists/YouTubeVideoID';

import { BlacklistAction } from './BlacklistActions';
import BlacklistRow from './BlacklistRow';

export type BlacklistItem = ILinkPattern | IYouTubeVideoID | IYouTubeChannelID;

export interface FilteredBlacklistProps {
  items: BlacklistItem[];
  onTextClick?(text: string): void;
  actions?: BlacklistAction[];
};

const FilteredBlacklist = ({ items, onTextClick, actions }: FilteredBlacklistProps) => {
  const renderItem = (item: BlacklistItem) => {
    const text = 'videoId' in (item as IYouTubeVideoID)
      ? (item as IYouTubeVideoID).videoId
      : 'channelId' in (item as IYouTubeChannelID)
        ? (item as IYouTubeChannelID).channelId
        : (item as ILinkPattern).pattern;

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
