import { isValidYouTubeChannelID } from '@/lib/commonValidators';
import { AddChannelIDAPIRequest } from '@/services/apis/blacklists/ChannelIDsAPIService';

export const validate = (fields: AddChannelIDAPIRequest): Partial<AddChannelIDAPIRequest> => {
  const errors: Partial<AddChannelIDAPIRequest> = {};

  if (!isValidYouTubeChannelID(fields.channelID)) {
    errors.channelID = 'Invalid YouTube channel ID.';
  }

  return errors;
};
