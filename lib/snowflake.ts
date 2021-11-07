import { UniqueID } from 'nodejs-snowflake';
import { Column } from 'typeorm';

const generator = new UniqueID({
  returnNumber: true,
  customEpoch: new Date('2001-03-07T00:00:00.000Z').getTime(),
});

export const snowflake = (timestamp?: number | string): bigint => {
  if (!timestamp) {
    return generator.getUniqueID() as bigint;
  }

  return generator.getIDFromTimestamp(timestamp) as bigint;
};

export const PrimaryGeneratedSnowflakeColumn = (): PropertyDecorator => {
  return Column({
    type: 'varchar',
    length: 36, // backwards compatibility
    transformer: {
      to: (value: string | bigint) => {
        if (typeof value === 'string') {
          return value;
        }

        return value.toString();
      },
      from: (value: string) => {
        // I wanted to use bigints here but the custom transformer has issues
        // with comparisons in many-to-many join tables :(
        return value;
      },
    },
    primary: true,
  });
};
