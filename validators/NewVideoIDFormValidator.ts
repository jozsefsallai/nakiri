import { isValidYouTubeVideoID } from '@/lib/commonValidators';
import { AddVideoIDAPIRequest } from '@/services/apis/blacklists/VideoIDsAPIService';

export const validate = (fields: AddVideoIDAPIRequest): Partial<AddVideoIDAPIRequest> => {
  const errors: Partial<AddVideoIDAPIRequest> = {};

  if (!isValidYouTubeVideoID(fields.videoID)) {
    errors.videoID = 'Invalid YouTube video ID.';
  }

  return errors;
};
