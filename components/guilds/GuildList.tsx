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
  return (
    <div>
      {guilds.map(guild => (
        <div key={guild.id}>
          {compact && <CompactGuildListItem guild={guild} onClick={onGuildClick} active={activeGuild?.id === guild.id} />}
          {!compact && <GuildListItem guild={guild} onClick={onGuildClick} />}
        </div>
      ))}
    </div>
  );
};

export default GuildList;
