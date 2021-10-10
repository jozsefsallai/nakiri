import { IGuild } from '@/controllers/guilds/IGuild';
import { IGroup } from '@/db/models/groups/Group';
import { APIPaginationData } from '@/services/axios';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { Filter } from 'react-feather';
import MessageBox, { MessageBoxLevel } from '../common/messagebox/MessageBox';
import Pagination from '../common/pagination/Pagination';
import ZeroDataState from '../common/zds/ZeroDataState';
import CompactGroupList from '../groups/CompactGroupList';
import GuildList from '../guilds/GuildList';
import Loading from '../loading/Loading';

import { BlacklistAction } from './BlacklistActions';
import FilteredBlacklist, { BlacklistItem } from './FilteredBlacklist';

export interface IFetcherOptions {
  group?: string;
  guild?: string;
  page?: number;
}

export interface BlacklistProps {
  items: BlacklistItem[];
  groups?: IGroup[];
  guilds?: IGuild[];
  pagination?: APIPaginationData;
  fetcher(opts?: IFetcherOptions);
  zdsMessage?: string;
  error?: string;
  onTextClick?(text: string): void;
  actions?: BlacklistAction[];
  entryComponent?: React.FC<any> | React.ComponentClass<any>;
  hideGlobal?: boolean;
}

const Blacklist: React.FC<BlacklistProps> = ({
  items,
  groups,
  guilds,
  pagination,
  fetcher,
  error,
  zdsMessage,
  onTextClick,
  actions,
  entryComponent,
  hideGlobal,
}) => {
  const [activeGroup, setActiveGroup] = useState<IGroup | null>(
    hideGlobal && groups ? groups[0] : null,
  );
  const [activeGuild, setActiveGuild] = useState<IGuild | null>(
    hideGlobal && guilds ? guilds[0] : null,
  );

  const [filtersVisible, setFiltersVisible] = useState(false);

  const handleGuildClick = (guild: IGuild | null) => {
    if (guild === null && activeGuild === null) {
      return;
    }

    if (guild?.id === activeGuild?.id) {
      return;
    }

    setActiveGuild(guild);
    fetcher({
      guild: guild?.id,
    });
  };

  const handleGroupClick = (group: IGroup | null, guild?: IGuild) => {
    if (group === null && activeGroup === null) {
      return;
    }

    if (group?.id === activeGroup?.id && guild?.id === activeGuild?.id) {
      return;
    }

    setActiveGroup(group);
    setActiveGuild(guild);
    fetcher({
      group: group?.id,
      guild: guild?.id,
    });
  };

  const handleGlobalClick = () => {
    if (activeGroup === null && activeGuild === null) {
      return;
    }

    setActiveGuild(null);
    setActiveGroup(null);
    fetcher();
  };

  const handlePaginationChange = (page: number) => {
    fetcher({
      group: activeGroup?.id,
      guild: activeGuild?.id,
      page,
    });
  };

  useEffect(() => {
    if (hideGlobal && groups?.length > 0) {
      fetcher({
        group: groups[0].id,
        guild: groups[0].guilds[0].guildId,
      });
      return;
    }

    if (hideGlobal && guilds) {
      fetcher({
        guild: guilds[0].id,
      });
      return;
    }

    fetcher();
  }, []);

  const toggleFiltersVisibility = () =>
    setFiltersVisible((filtersVisible) => !filtersVisible);

  return (
    <div className="lg:flex gap-4">
      {((guilds && guilds.length > 0) || (groups && groups.length > 0)) && (
        <>
          <div
            className="lg:hidden select-none py-4 flex items-center justify-center gap-3 mt-4"
            onClick={toggleFiltersVisibility}
          >
            <Filter />
            <div>Toggle filters</div>
          </div>

          <div
            className={clsx('py-4 lg:w-80 lg:block', {
              'block': filtersVisible,
              'hidden': !filtersVisible,
            })}
          >
            {!hideGlobal && (
              <div
                className={clsx(
                  'py-3 px-4 hover:bg-ayame-secondary-200 rounded-md cursor-pointer',
                  {
                    'bg-ayame-secondary-200':
                      activeGroup === null && activeGuild === null,
                  },
                )}
                onClick={handleGlobalClick}
              >
                Global
              </div>
            )}

            {guilds && (
              <GuildList
                compact
                guilds={guilds}
                onGuildClick={handleGuildClick}
                activeGuild={activeGuild}
              />
            )}
            {groups && (
              <CompactGroupList
                groups={groups}
                onChange={handleGroupClick}
                activeGroup={activeGroup}
                activeGuild={activeGuild}
              />
            )}
          </div>
        </>
      )}

      <div className="flex-1">
        {items && items.length > 0 && (
          <FilteredBlacklist
            items={items}
            onTextClick={onTextClick}
            actions={actions}
            entryComponent={entryComponent}
          />
        )}

        {items?.length === 0 && <ZeroDataState message={zdsMessage} />}
        {!items && !error && <Loading />}
        {error?.length > 0 && (
          <MessageBox level={MessageBoxLevel.DANGER}>{error}</MessageBox>
        )}

        {pagination && (
          <Pagination
            currentPage={pagination.page}
            pageCount={pagination.pageCount}
            onChange={handlePaginationChange}
          />
        )}
      </div>
    </div>
  );
};

export default Blacklist;
