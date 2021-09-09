import { IGuild } from '@/controllers/guilds/IGuild';
import { IDiscordGuild } from '@/db/models/blacklists/DiscordGuild';
import clsx from 'clsx';
import { HTMLProps, forwardRef } from 'react';

export interface GuildIconProps extends HTMLProps<HTMLDivElement> {
  guild: IGuild;
  compact?: boolean;
};

const GuildIcon = ({ guild, compact, ...props }: GuildIconProps, ref) => {
  const guildInitials = guild.name
    ?.split(' ')
    .map(component => component[0])
    .join('')
    .slice(0, 3) || '...';

  const icon = guild.icon
    ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}`
    : null;

  const classNames = clsx(
    'flex items-center justify-center bg-ayame-secondary text-nakiri-base-invert rounded-full',
    {
      'w-10': compact,
      'h-10': compact,
      'w-20': !compact,
      'h-20': !compact,
      'cursor-pointer': !!props.onClick
    },
    props.className
  );

  const initialsClassName = clsx({
    'text-xl': !compact,
    'text-sm': compact
  });

  return (
    <div
      {...props}
      className={classNames}
      title={guild.name}
      ref={ref}
    >
      {icon && <img src={icon} className="rounded-full w-full h-full" alt={guildInitials} />}
      {!icon && <span className={initialsClassName}>{guildInitials}</span>}
    </div>
  );
};

export default forwardRef(GuildIcon);
