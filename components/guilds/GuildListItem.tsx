import { IGuild } from '@/controllers/guilds/IGuild';
import clsx from 'clsx';
import GuildIcon from './GuildIcon';

export interface GuildListItemProps {
  guild: IGuild;
  onClick?(guild?: IGuild);
}

const GuildListItem = ({ guild, onClick }: GuildListItemProps) => {
  const titleClassNames = clsx('font-bold text-xl', {
    'cursor-pointer': !!onClick,
    'hover:text-ayame-secondary': !!onClick,
  });

  const handleGuildClick = onClick
    ? async () => await onClick(guild)
    : undefined;

  return (
    <div className="lg:flex items-center justify-between gap-3 my-4">
      <div className="flex items-center gap-3">
        <GuildIcon guild={guild} onClick={handleGuildClick} />

        <div className="flex-1">
          <div className={titleClassNames} onClick={handleGuildClick}>
            {guild.name}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuildListItem;
