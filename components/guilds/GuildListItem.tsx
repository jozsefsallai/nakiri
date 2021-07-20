import { IGuild, IGuildWithKey } from '@/controllers/guilds/IGuild';
import clsx from 'clsx';
import { useState } from 'react';
import Button, { ButtonSize } from '../common/button/Button';
import GuildIcon from './GuildIcon';

export interface GuildListItemProps {
  guild: IGuild | IGuildWithKey;
  onClick?(guild?: IGuild);
};

const COPY_TEXT = 'Copy';
const COPIED_TEXT = 'Copied';

const GuildListItem = ({ guild, onClick }: GuildListItemProps) => {
  const [ copyButtonText, setCopyButtonText ] = useState(COPY_TEXT);

  const titleClassNames = clsx(
    'font-bold text-xl',
    {
      'cursor-pointer': !!onClick,
      'hover:text-ayame-secondary': !!onClick
    }
  );

  const handleCopyClick = async () => {
    await navigator.clipboard.writeText((guild as IGuildWithKey).key);
    setCopyButtonText(COPIED_TEXT);

    setTimeout(() => {
      setCopyButtonText(COPY_TEXT);
    }, 5000);
  };

  const handleRegenerateClick = () => {
    alert('Not implemented yet.');
  };

  const handleGuildClick = onClick
    ? async () => await onClick(guild)
    : undefined;

  return (
    <div className="lg:flex items-center justify-between gap-3 my-4">
      <div className="flex items-center gap-3">
        <GuildIcon guild={guild} onClick={handleGuildClick} />

        <div className="flex-1">
          <div className={titleClassNames} onClick={handleGuildClick}>{guild.name}</div>
          {'key' in guild && guild.key && <span className="text-xs">{guild.key}</span>}
        </div>
      </div>

      {'key' in guild && guild.key && (
        <div className="flex gap-2 my-4 lg:my-0">
          <Button size={ButtonSize.SMALL} onClick={handleCopyClick} className="mr-3 lg:mr-0">{copyButtonText}</Button>
          <Button size={ButtonSize.SMALL} onClick={handleRegenerateClick}>Regenerate</Button>
        </div>
      )}
    </div>
  );
};

export default GuildListItem;
