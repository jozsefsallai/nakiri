import { AuthorizedUser, IAuthorizedUser } from '@/db/models/auth/AuthorizedUser';

export interface IUser extends IAuthorizedUser {
  name: string;
  discriminator: string;
  image?: string;
};

export class User extends AuthorizedUser implements IUser {
  name: string;
  discriminator: string;
  image?: string;

  constructor({ id, name, image, discriminator, discordId, createdAt, updatedAt, permissions }: IUser) {
    super();

    this.id = id;
    this.name = name;
    this.image = image;
    this.discriminator = discriminator;
    this.discordId = discordId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.permissions = permissions;
  }
}
