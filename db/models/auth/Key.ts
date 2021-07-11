import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export interface IKey {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  key: string;
  guildId: string;
};

@Entity()
export class Key implements IKey {
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

  toJSON(): IKey {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      key: this.key,
      guildId: this.guildId
    };
  }
}
