import { IGuild } from '@/controllers/guilds/IGuild';
import clsx from 'clsx';
import GuildIcon from './GuildIcon';

export interface CompactGuildListItemProps {
  guild: IGuild;
  active?: boolean;
  onClick?(guild: IGuild);
}

const CompactGuildListItem = ({
  guild,
  active,
  onClick,
}: CompactGuildListItemProps) => {
  const classNames = clsx(
    'flex flex-1 px-3 py-2 my-1 rounded-md items-center gap-2',
    {
      'hover:bg-ayame-secondary-200': !!onClick,
      'bg-ayame-secondary-200': active,
      'cursor-pointer': !!onClick,
    },
  );

  const handleGuildClick = onClick ? () => onClick(guild) : undefined;

  return (
    <div className={classNames} onClick={handleGuildClick}>
      <GuildIcon guild={guild} compact />
      <div>{guild.name}</div>
    </div>
  );
};

export default CompactGuildListItem;
