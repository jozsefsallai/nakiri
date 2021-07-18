import { isValidRegex } from '@/lib/commonValidators';
import { AddLinkPatternAPIRequest } from '@/services/apis/blacklists/LinkPatternsAPIService';

export const validate = (fields: AddLinkPatternAPIRequest): Partial<AddLinkPatternAPIRequest> => {
  const errors: Partial<AddLinkPatternAPIRequest> = {};

  if (!isValidRegex(fields.pattern)) {
    errors.pattern = 'Invalid regex pattern.';
  }

  return errors;
};
