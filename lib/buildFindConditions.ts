import { IGroup } from '@/db/models/groups/Group';
import { FindConditions, IsNull } from 'typeorm';

interface ModelWithGroupAndGuild {
  group?: IGroup;
  guildId?: string;
}

const buildFindConditions = <T extends ModelWithGroupAndGuild>(
  groupId?: string,
  guildId?: string,
  strict: boolean = false,
  additionalConditions?: FindConditions<T>,
): FindConditions<T>[] => {
  const where: FindConditions<T>[] = [];

  if (!groupId || (groupId && !strict)) {
    where.push({ group: IsNull() });
  }

  if (groupId) {
    const groupWhere: FindConditions<T> = { group: { id: groupId } };

    if (!guildId || (guildId && !strict)) {
      groupWhere.guildId = IsNull();
      where.push(groupWhere);
    }

    if (guildId) {
      groupWhere.guildId = guildId;
      where.push(groupWhere);
    }
  }

  if (typeof additionalConditions === 'object') {
    where.forEach((condition) => {
      Object.assign(condition, additionalConditions);
    });
  }

  return where;
};

export default buildFindConditions;
