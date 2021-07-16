import { IGuild, IGuildWithKey } from '@/controllers/guilds/IGuild';
import clsx from 'clsx';
import GuildIcon from './GuildIcon';

export interface CompactGuildListItemProps {
  guild: IGuild | IGuildWithKey;
  onClick?(guild: IGuild);
};

const CompactGuildListItem = ({ guild, onClick }: CompactGuildListItemProps) => {
  const classNames = clsx(
    'flex px-3 py-2 my-2 rounded-md items-center gap-2',
    {
      'hover:bg-ayame-secondary-200': !!onClick,
      'cursor-pointer': !!onClick
    }
  );

  return (
    <div className={classNames}>
      <GuildIcon guild={guild} compact />
      <div>{guild.name}</div>
    </div>
  );
};

export default CompactGuildListItem;
