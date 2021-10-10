import { isValidYouTubeVideoID } from '@/lib/commonValidators';
import { AddVideoIDAPIRequest } from '@/services/apis/blacklists/VideoIDsAPIService';

import { errors as _errors } from '@/lib/errors';

export const validate = (
  fields: AddVideoIDAPIRequest,
): Partial<AddVideoIDAPIRequest> => {
  const errors: Partial<AddVideoIDAPIRequest> = {};

  if (!isValidYouTubeVideoID(fields.videoID)) {
    errors.videoID = _errors.INVALID_VIDEO_ID;
  }

  return errors;
};
