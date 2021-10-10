import { IDiscordGuild } from '@/db/models/blacklists/DiscordGuild';

export interface DiscordGuildEntryProps {
  item: IDiscordGuild;
  onTextClick?: (id: string) => void;
}

const DiscordGuildEntry: React.FC<DiscordGuildEntryProps> = ({ item }) => {
  const name = item.name
    ? `${item.name} (${item.blacklistedId})`
    : item.blacklistedId;

  return <span className="font-bold">{name}</span>;
};

export default DiscordGuildEntry;
