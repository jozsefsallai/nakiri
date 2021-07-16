import { IGuild, IGuildWithKey } from '@/controllers/guilds/IGuild';
import CompactGuildListItem from './CompactGuildListItem';
import GuildListItem from './GuildListItem';

export interface GuildListProps {
  guilds: (IGuild | IGuildWithKey)[];
  onGuildClick?(guild: IGuild);
  compact?: boolean;
};

const GuildList = ({ guilds, onGuildClick, compact }: GuildListProps) => {
  return (
    <div>
      {guilds.map(guild => (
        <>
          {compact && <CompactGuildListItem guild={guild} key={guild.id} />}
          {!compact && <GuildListItem guild={guild} key={guild.id} onClick={onGuildClick} />}
        </>
      ))}
    </div>
  );
};

export default GuildList;
