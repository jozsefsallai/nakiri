import { Column, Entity } from 'typeorm';
import {
  GuildRestrictableBlacklist,
  IGuildRestrictableBlacklist,
} from '../../common/GuildRestrictableBlacklist';

export interface IDiscordGuild extends IGuildRestrictableBlacklist {
  blacklistedId: string;
  name?: string;
}

@Entity()
export class DiscordGuild
  extends GuildRestrictableBlacklist
  implements IDiscordGuild
{
  @Column('varchar')
  blacklistedId: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  name?: string;

  toJSON(): IDiscordGuild {
    return {
      ...super.toJSON(),
      blacklistedId: this.blacklistedId,
      name: this.name,
    };
  }
}
