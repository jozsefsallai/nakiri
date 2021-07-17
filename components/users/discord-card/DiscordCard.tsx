import { IDiscordUser } from '@/typings/IDiscordUser';
import DiscordAvatar from '../common/DiscordAvatar';

export interface DiscordCardProps {
  user: IDiscordUser;
}

const DiscordCard = ({ user }: DiscordCardProps) => {
  return (
    <section className="flex items-center gap-4 bg-discord-dark text-white px-6 py-4 my-3 rounded-lg">
      <div className="w-24 h-24">
        <DiscordAvatar
          url={user.avatar}
          id={user.id}
          discriminator={user.discriminator}
          className="rounded-full"
          alt={user.username}
        />
      </div>

      <div className="font-bold">
        {user.username}<span className="text-discord-gray">#{user.discriminator}</span>
      </div>
    </section>
  );
};

export default DiscordCard;
