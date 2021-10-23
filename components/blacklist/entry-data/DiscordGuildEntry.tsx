import { Severity } from '@/db/common/Severity';
import { IDiscordGuild } from '@/db/models/blacklists/DiscordGuild';

export interface DiscordGuildEntryProps {
  item: IDiscordGuild;
  onTextClick?: (id: string) => void;
}

const DiscordGuildEntry: React.FC<DiscordGuildEntryProps> = ({ item }) => {
  const name = item.name
    ? `${item.name} (${item.blacklistedId})`
    : item.blacklistedId;

  return (
    <div>
      <div className="font-bold mb-2">{name}</div>
      <div className="text-xs">
        <strong>Severity:</strong> {Severity[item.severity]}
      </div>
    </div>
  );
};

export default DiscordGuildEntry;
