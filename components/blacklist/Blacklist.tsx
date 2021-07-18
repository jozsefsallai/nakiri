import { IGuild } from '@/controllers/guilds/IGuild';
import clsx from 'clsx';
import { useState } from 'react';
import ZeroDataState from '../common/zds/ZeroDataState';
import GuildList from '../guilds/GuildList';

import { BlacklistAction } from './BlacklistActions';
import FilteredBlacklist, { BlacklistItem } from './FilteredBlacklist';

export interface BlacklistProps {
  items: BlacklistItem[];
  guilds: IGuild[];
  onTextClick?(text: string): void;
  actions?: BlacklistAction[];
};

const Blacklist = ({ items, guilds, onTextClick, actions }: BlacklistProps) => {
  const [ filteredItems, setFilteredItems ] = useState<BlacklistItem[]>(items);
  const [ activeGuild, setActiveGuild ] = useState<IGuild | null>(null);

  const handleGuildClick = (guild: IGuild | null) => {
    setActiveGuild(guild);
    setFilteredItems(_items => guild ? _items.filter(item => item.guildId === guild.id) : items);
  };

  return (
    <div className="flex gap-4">
      <div className="py-4 w-80">
        <div
          className={clsx('py-3 px-4 hover:bg-ayame-secondary-200 rounded-md cursor-pointer', { 'bg-ayame-secondary-200': activeGuild === null })}
          onClick={() => handleGuildClick(null)}
        >Global</div>
        <GuildList compact guilds={guilds} onGuildClick={handleGuildClick} activeGuild={activeGuild} />
      </div>

      <div className="flex-1">
        {filteredItems.length > 0 && <FilteredBlacklist
          items={filteredItems}
          onTextClick={onTextClick}
          actions={actions}
        />}

        {filteredItems.length === 0 && <ZeroDataState message="No items match your filtering criteria." />}
      </div>
    </div>
  );
};

export default Blacklist;
