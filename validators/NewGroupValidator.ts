import { CreateGroupAPIRequest } from '@/services/apis/groups/GroupsAPIService';

import { errors as _errors } from '@/lib/errors';

export const validate = (
  fields: CreateGroupAPIRequest,
): Partial<CreateGroupAPIRequest> => {
  const errors: Partial<CreateGroupAPIRequest> = {};

  if (!fields.name.length) {
    errors.name = _errors.GROUP_NAME_NOT_PROVIDED;
  }

  return;
};
