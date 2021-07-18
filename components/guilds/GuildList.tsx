import { IGuild, IGuildWithKey } from '@/controllers/guilds/IGuild';
import CompactGuildListItem from './CompactGuildListItem';
import GuildListItem from './GuildListItem';

export interface GuildListProps {
  guilds: (IGuild | IGuildWithKey)[];
  onGuildClick?(guild: IGuild);
  activeGuild?: IGuild;
  compact?: boolean;
};

const GuildList = ({ guilds, onGuildClick, activeGuild, compact }: GuildListProps) => {
  console.log(guilds);
  return (
    <div>
      {guilds.map(guild => (
        <>
          {compact && <CompactGuildListItem guild={guild} key={guild.id} onClick={onGuildClick} active={activeGuild?.id === guild.id} />}
          {!compact && <GuildListItem guild={guild} key={guild.id} onClick={onGuildClick} />}
        </>
      ))}
    </div>
  );
};

export default GuildList;
