import { CreateMonitoredKeywordAPIRequest } from '@/services/apis/monitored-keywords/MonitoredKeywordsAPIService';

import { errors as _errors } from '@/lib/errors';
import { isValidUrl } from '@/lib/commonValidators';

export const validate = (
  fields: CreateMonitoredKeywordAPIRequest,
): Partial<CreateMonitoredKeywordAPIRequest> => {
  const errors: Partial<CreateMonitoredKeywordAPIRequest> = {};

  if (!fields.keyword?.trim()) {
    errors.keyword = _errors.KEYWORD_NOT_PROVIDED;
  }

  if (!fields.webhookUrl?.trim()) {
    errors.webhookUrl = _errors.WEBHOOK_URL_NOT_PROVIDED;
  }

  if (!isValidUrl(fields.webhookUrl?.trim())) {
    errors.webhookUrl = _errors.INVALID_WEBHOOK_URL;
  }

  return errors;
};
