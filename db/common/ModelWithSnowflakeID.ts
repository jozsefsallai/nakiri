import { PrimaryGeneratedSnowflakeColumn, snowflake } from '@/lib/snowflake';
import { BeforeInsert } from 'typeorm';

export interface IModelWithSnowflakeID {
  id: string;
}

export class ModelWithSnowflakeID {
  @PrimaryGeneratedSnowflakeColumn()
  id: string;

  @BeforeInsert()
  setID() {
    this.id = snowflake().toString();
  }
}
