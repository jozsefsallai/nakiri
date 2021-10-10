import { isValidYouTubeChannelID } from '@/lib/commonValidators';
import { AddChannelIDAPIRequest } from '@/services/apis/blacklists/ChannelIDsAPIService';

import { errors as _errors } from '@/lib/errors';

export const validate = (
  fields: AddChannelIDAPIRequest,
): Partial<AddChannelIDAPIRequest> => {
  const errors: Partial<AddChannelIDAPIRequest> = {};

  if (!isValidYouTubeChannelID(fields.channelID)) {
    errors.channelID = _errors.INVALID_CHANNEL_ID;
  }

  return errors;
};
