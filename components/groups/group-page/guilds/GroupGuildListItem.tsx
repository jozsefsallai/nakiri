import Button, { ButtonSize } from '@/components/common/button/Button';
import GuildIcon from '@/components/guilds/GuildIcon';
import { IGuildWithKey } from '@/controllers/guilds/IGuild';
import { IAuthorizedGuild } from '@/db/models/auth/AuthorizedGuild';

export interface GroupGuildListItemProps {
  guild: IAuthorizedGuild;
  metadata?: IGuildWithKey;
  canManageGuilds: boolean;
  onGuildRemoveClicked: (guild: IAuthorizedGuild) => void;
}

const GroupGuildListItem: React.FC<GroupGuildListItemProps> = ({
  guild,
  metadata,
  canManageGuilds,
  onGuildRemoveClicked,
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

      {canManageGuilds && (
        <div className="flex items-center gap-3">
          <Button
            size={ButtonSize.SMALL}
            onClick={() => onGuildRemoveClicked(guild)}
          >
            Remove
          </Button>
        </div>
      )}
    </div>
  );
};

export default GroupGuildListItem;
