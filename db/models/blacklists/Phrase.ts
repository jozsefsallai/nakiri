import { Column, Entity } from 'typeorm';
import {
  GuildRestrictableBlacklist,
  IGuildRestrictableBlacklist,
} from '../../common/GuildRestrictableBlacklist';

export interface IPhrase extends IGuildRestrictableBlacklist {
  content: string;
}

@Entity()
export class Phrase extends GuildRestrictableBlacklist implements IPhrase {
  @Column({ type: 'text', nullable: false })
  content: string;

  toJSON(): IPhrase {
    return {
      ...super.toJSON(),
      content: this.content,
    };
  }
}
