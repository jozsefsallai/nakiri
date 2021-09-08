import Box from '@/components/common/box/Box';
import Button from '@/components/common/button/Button';
import ZeroDataState from '@/components/common/zds/ZeroDataState';
import { IAuthorizedGuild } from '@/db/models/auth/AuthorizedGuild';
import toaster from '@/lib/toaster';

export interface GroupGuildListProps {
  guilds: IAuthorizedGuild[];
};

const GroupGuildList: React.FC<GroupGuildListProps> = ({ guilds }) => {
  const handleAddGuildClick = () => {
    toaster.warning('Adding guilds to a group is not implemented yet.');
  };

  return (
    <Box title="Guilds">
      {guilds.length === 0 && <ZeroDataState message="There are no guilds in this group yet." />}
      {guilds.length > 0 && guilds.map(guild => (
        <div key={guild.id}>
          {guild.guildId}
        </div>
      ))}

      <div className="text-center mt-5">
        <Button onClick={handleAddGuildClick}>Add guild</Button>
      </div>
    </Box>
  );
};

export default GroupGuildList;
