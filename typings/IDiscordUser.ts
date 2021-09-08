export interface IDiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar?: string;
  public_flags?: number;
  banner?: string;
  banner_color?: string;
};
