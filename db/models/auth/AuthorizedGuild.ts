import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export interface IAuthorizedGuild {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  key: string;
  guildId: string;
};

@Entity()
export class AuthorizedGuild implements IAuthorizedGuild {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  key: string;

  @Column()
  guildId: string;

  toJSON(): IAuthorizedGuild {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      key: this.key,
      guildId: this.guildId
    };
  }
}
