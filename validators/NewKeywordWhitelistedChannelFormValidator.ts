import { AddKeywordWhitelistedChannelAPIRequest } from '@/services/apis/monitored-keywords/KeywordWhitelistedChannels';

import { errors as _errors } from '@/lib/errors';
import { isValidYouTubeChannelID } from '@/lib/commonValidators';

export const validate = (fields: AddKeywordWhitelistedChannelAPIRequest): Partial<AddKeywordWhitelistedChannelAPIRequest> => {
  const errors: Partial<AddKeywordWhitelistedChannelAPIRequest> = {};

  if (!isValidYouTubeChannelID(fields.channelId?.trim())) {
    errors.channelId = _errors.INVALID_CHANNEL_ID;
  }

  return errors;
};
