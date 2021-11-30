import { Column, Entity } from 'typeorm';
import {
  GuildRestrictableBlacklist,
  IGuildRestrictableBlacklist,
} from '../../common/GuildRestrictableBlacklist';

export interface ILinkPattern extends IGuildRestrictableBlacklist {
  pattern: string;
}

@Entity()
export class LinkPattern
  extends GuildRestrictableBlacklist
  implements ILinkPattern
{
  @Column('varchar')
  pattern: string;

  toJSON(): ILinkPattern {
    return {
      ...super.toJSON(),
      pattern: this.pattern,
    };
  }
}
