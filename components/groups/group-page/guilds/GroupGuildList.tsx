import Box from '@/components/common/box/Box';
import Loading from '@/components/loading/Loading';
import ZeroDataState from '@/components/common/zds/ZeroDataState';
import { IGuildWithKey } from '@/controllers/guilds/IGuild';
import { IAuthorizedGuild } from '@/db/models/auth/AuthorizedGuild';
import { useGuilds } from '@/hooks/useGuilds';
import GroupGuildListItem from './GroupGuildListItem';
import { IGroup } from '@/db/models/groups/Group';
import AddGuildButton from './AddGuildButton';
import { GroupMemberPermissionsUtil } from '@/lib/GroupMemberPermissions';

export interface GroupGuildListProps {
  guilds: IAuthorizedGuild[];
  group: IGroup;
  setGroup(group: IGroup): void;
};

const GroupGuildList: React.FC<GroupGuildListProps> = ({ guilds, group, setGroup }) => {
  const [ allGuilds ] = useGuilds();

  const getGuildMetadata = (guildId: string): IGuildWithKey | undefined => {
    const guild = allGuilds.find(g => g.id === guildId);
    return guild;
  };

  return (
    <Box title="Guilds">
      {guilds.length === 0 && <ZeroDataState message="There are no guilds in this group yet." />}
      {guilds.length > 0 && !allGuilds && <Loading />}
      {guilds.length > 0 && allGuilds && guilds.map(guild => (
        <GroupGuildListItem
          guild={guild}
          metadata={getGuildMetadata(guild.guildId)}
          key={guild.guildId}
        />
      ))}

      {GroupMemberPermissionsUtil.canManageGroupGuilds(group.myPermissions) && (
        <div className="text-center mt-5">
          <AddGuildButton group={group} onSuccess={setGroup} />
        </div>
      )}
    </Box>
  );
};

export default GroupGuildList;
