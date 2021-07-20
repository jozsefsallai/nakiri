import clsx from 'clsx';
import { ImgHTMLAttributes, DetailedHTMLProps, forwardRef } from 'react';

export interface DiscordAvatarProps extends DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
  id: string;
  discriminator: string;
  url?: string | null;
};

const DiscordAvatar = ({ id, discriminator, url, ...props }: DiscordAvatarProps, ref) => {
  const userAvatarUrl = url
    ? `https://cdn.discordapp.com/avatars/${id}/${url}`
    : `https://cdn.discordapp.com/embed/avatars/${parseInt(discriminator, 10) % 5}.png`;

  return (
    <img src={userAvatarUrl} {...props} className={clsx('w-full h-full', props.className)} ref={ref} />
  );
};

export default forwardRef(DiscordAvatar);
