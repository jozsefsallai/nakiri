import GuildIcon from '@/components/guilds/GuildIcon';
import { IGuildWithKey } from '@/controllers/guilds/IGuild';
import { IAuthorizedGuild } from '@/db/models/auth/AuthorizedGuild';

export interface GroupGuildListItemProps {
  guild: IAuthorizedGuild;
  metadata?: IGuildWithKey;
}

const GroupGuildListItem: React.FC<GroupGuildListItemProps> = ({
  guild,
  metadata,
}) => {
  if (!metadata) {
    return <div>{guild.guildId}</div>;
  }

  return (
    <div className="lg:flex items-center justify-between gap-3 my-4">
      <div className="flex items-center gap-3">
        <GuildIcon guild={metadata} />

        <div className="flex-1">
          <div className="font-bold text-xl">{metadata.name}</div>
        </div>
      </div>
    </div>
  );
};

export default GroupGuildListItem;
