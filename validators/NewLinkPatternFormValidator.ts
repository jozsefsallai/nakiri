import { isValidRegex } from '@/lib/commonValidators';
import { AddLinkPatternAPIRequest } from '@/services/apis/blacklists/LinkPatternsAPIService';

import { errors as _errors } from '@/lib/errors';

export const validate = (
  fields: AddLinkPatternAPIRequest,
): Partial<AddLinkPatternAPIRequest> => {
  const errors: Partial<AddLinkPatternAPIRequest> = {};

  if (!isValidRegex(fields.pattern)) {
    errors.pattern = _errors.INVALID_REGEX_PATTERN;
  }

  return errors;
};
