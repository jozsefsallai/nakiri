import { IDiscordUser } from '@/typings/IDiscordUser';
import clsx from 'clsx';
import DiscordAvatar from '../common/DiscordAvatar';

export interface DiscordCardProps {
  user: IDiscordUser;
  small?: boolean;
  squareCorners?: boolean;
  noMargins?: boolean;
}

const DiscordCard = ({
  user,
  small,
  squareCorners,
  noMargins,
}: DiscordCardProps) => {
  return (
    <section
      className={clsx(
        'flex items-center gap-4 bg-discord-dark text-nakiri-base-invert px-6 py-4',
        {
          'rounded-lg': !squareCorners,
          'my-3': !noMargins,
        },
      )}
    >
      <div
        className={clsx({
          'w-24': !small,
          'h-24': !small,
          'w-16': small,
          'h-16': small,
        })}
      >
        <DiscordAvatar
          url={user.avatar}
          id={user.id}
          discriminator={user.discriminator}
          className="rounded-full"
          alt={user.username}
        />
      </div>

      <div className="font-bold text-white">
        {user.username}
        <span className="text-discord-gray">#{user.discriminator}</span>
      </div>
    </section>
  );
};

export default DiscordCard;
