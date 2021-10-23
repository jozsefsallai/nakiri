import { AddPhraseAPIRequest } from '@/services/apis/blacklists/PhrasesAPIService';

import { errors as _errors } from '@/lib/errors';

export const validate = (
  fields: AddPhraseAPIRequest,
): Partial<AddPhraseAPIRequest> => {
  const errors: Partial<AddPhraseAPIRequest> = {};

  if (fields.content?.length < 2) {
    errors.content = _errors.PHRASE_TOO_SHORT;
  }

  return errors;
};
