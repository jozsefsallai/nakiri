import { IGuild } from '@/controllers/guilds/IGuild';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { Filter } from 'react-feather';
import MessageBox, { MessageBoxLevel } from '../common/messagebox/MessageBox';
import ZeroDataState from '../common/zds/ZeroDataState';
import GuildList from '../guilds/GuildList';
import Loading from '../loading/Loading';

import { BlacklistAction } from './BlacklistActions';
import FilteredBlacklist, { BlacklistItem } from './FilteredBlacklist';

export interface BlacklistProps {
  items: BlacklistItem[];
  guilds: IGuild[];
  fetcher(guild?: string | null);
  zdsMessage?: string;
  error?: string;
  onTextClick?(text: string): void;
  actions?: BlacklistAction[];
};

const Blacklist = ({ items, guilds, fetcher, error, zdsMessage, onTextClick, actions }: BlacklistProps) => {
  const [ activeGuild, setActiveGuild ] = useState<IGuild | null>(null);
  const [ filtersVisible, setFiltersVisible ] = useState(false);

  const handleGuildClick = (guild: IGuild | null) => {
    if (guild === null && activeGuild === null) {
      return;
    }

    if (guild?.id === activeGuild?.id) {
      return;
    }

    setActiveGuild(guild);
    fetcher(guild ? guild.id : null);
  };

  useEffect(() => {
    fetcher();
  }, []);

  const toggleFiltersVisibility = () => setFiltersVisible(filtersVisible => !filtersVisible);

  return (
    <div className="lg:flex gap-4">
      <div className="lg:hidden select-none py-4 flex items-center justify-center gap-3 mt-4" onClick={toggleFiltersVisibility}>
        <Filter />
        <div>Toggle filters</div>
      </div>

      <div className={clsx('py-4 lg:w-80 lg:block', {
        'block': filtersVisible,
        'hidden': !filtersVisible
      })}>
        <div
          className={clsx('py-3 px-4 hover:bg-ayame-secondary-200 rounded-md cursor-pointer', { 'bg-ayame-secondary-200': activeGuild === null })}
          onClick={() => handleGuildClick(null)}
        >Global</div>
        <GuildList compact guilds={guilds} onGuildClick={handleGuildClick} activeGuild={activeGuild} />
      </div>

      <div className="flex-1">
        {items && items.length > 0 && <FilteredBlacklist
          items={items}
          onTextClick={onTextClick}
          actions={actions}
        />}

        {items?.length === 0 && <ZeroDataState message={zdsMessage} />}
        {!items && !error && <Loading />}
        {error?.length > 0 && <MessageBox level={MessageBoxLevel.DANGER}>{error}</MessageBox>}
      </div>
    </div>
  );
};

export default Blacklist;
