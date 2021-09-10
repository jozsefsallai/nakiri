import Box from '@/components/common/box/Box';
import Button from '@/components/common/button/Button';
import Loading from '@/components/loading/Loading';
import ZeroDataState from '@/components/common/zds/ZeroDataState';
import { IGuildWithKey } from '@/controllers/guilds/IGuild';
import { IAuthorizedGuild } from '@/db/models/auth/AuthorizedGuild';
import { useGuilds } from '@/hooks/useGuilds';
import GroupGuildListItem from './GroupGuildListItem';

export interface GroupGuildListProps {
  guilds: IAuthorizedGuild[];
  onAddGuildClick: () => void | Promise<void>;
};

const GroupGuildList: React.FC<GroupGuildListProps> = ({ guilds, onAddGuildClick }) => {
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

      <div className="text-center mt-5">
        <Button onClick={onAddGuildClick}>Add guild</Button>
      </div>
    </Box>
  );
};

export default GroupGuildList;
