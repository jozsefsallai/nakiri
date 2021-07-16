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
    <div className="flex items-center gap-4 py-3 my-2">
      <GuildIcon guild={guild} onClick={handleGuildClick} />

      <div>
        <div className={titleClassNames} onClick={handleGuildClick}>{guild.name}</div>

        {'key' in guild && guild.key && (
          <div className="flex items-center gap-3 text-sm">
            {guild.key}
            <Button size={ButtonSize.SMALL} onClick={handleCopyClick}>{copyButtonText}</Button>
            <Button size={ButtonSize.SMALL} onClick={handleRegenerateClick}>Regenerate</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuildListItem;
