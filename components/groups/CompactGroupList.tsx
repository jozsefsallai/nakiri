import { IGuild } from '@/controllers/guilds/IGuild';
import { IAuthorizedGuild } from '@/db/models/auth/AuthorizedGuild';
import { IGroup } from '@/db/models/groups/Group';
import { useGuilds } from '@/hooks/useGuilds';
import { bulkMapGuildMetadata } from '@/lib/guildMetadata';
import clsx from 'clsx';
import GuildList from '../guilds/GuildList';

export interface CompactGroupListProps {
  groups: IGroup[];
  onChange?(group: IGroup, guild?: IGuild);
  activeGroup?: IGroup;
  activeGuild?: IGuild;
}

const CompactGroupList: React.FC<CompactGroupListProps> = ({
  groups,
  onChange,
  activeGroup,
  activeGuild,
}) => {
  const [guilds] = useGuilds();

  const baseClasses = clsx(
    'my-1 py-3 px-4 hover:bg-ayame-secondary-200 rounded-md cursor-pointer',
    {
      'hover:bg-ayame-secondary-200': !!onChange,
      'cursor-pointer': !!onChange,
    },
  );

  return (
    <div>
      {guilds &&
        groups.map((group) => (
          <div key={group.id}>
            <div
              className={clsx(baseClasses, {
                'bg-ayame-secondary-200': activeGroup === group,
              })}
              onClick={() => onChange(group)}
            >
              {group.name}
            </div>

            <div className="border-l-4 border-gray pl-1 ml-3">
              <GuildList
                guilds={bulkMapGuildMetadata(
                  guilds,
                  group.guilds as IAuthorizedGuild[],
                )}
                onGuildClick={(guild: IGuild) => onChange(group, guild)}
                activeGuild={activeGroup === group ? activeGuild : undefined}
                compact
              />
            </div>
          </div>
        ))}
    </div>
  );
};

export default CompactGroupList;
