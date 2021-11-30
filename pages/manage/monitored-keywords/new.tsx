import Button from '@/components/common/button/Button';
import DashboardLayout from '@/layouts/DashboardLayout';
import { errors } from '@/lib/errors';
import toaster from '@/lib/toaster';
import apiService from '@/services/apis';
import { useEffect, useState } from 'react';
import { useGuilds } from '@/hooks/useGuilds';

import * as NewMonitoredKeywordFormValidator from '@/validators/NewMonitoredKeywordFormValidator';
import { CreateMonitoredKeywordAPIRequest } from '@/services/apis/monitored-keywords/MonitoredKeywordsAPIService';
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import { useRouter } from 'next/router';
import MessageBox, {
  CompactDangerMessageBox,
  MessageBoxLevel,
} from '@/components/common/messagebox/MessageBox';

const CreateMonitoredKeywordPage = () => {
  const [guilds, , guildsErrored] = useGuilds();
  const [guildId, setGuildId] = useState<string | undefined>(undefined);
  const [error, setError] = useState('');

  const router = useRouter();

  const handleFormSubmit = async (
    { keyword, webhookUrl }: CreateMonitoredKeywordAPIRequest,
    { setSubmitting }: FormikHelpers<CreateMonitoredKeywordAPIRequest>,
  ) => {
    try {
      await apiService.monitoredKeywords.createMonitoredKeyword({
        keyword,
        guildId,
        webhookUrl,
      });

      toaster.success(`Added keyword "${keyword}".`);

      setTimeout(() => {
        router.push('/manage/monitored-keywords');
      }, 1000);
    } catch (err) {
      const message = err?.response?.data?.error;

      if (message) {
        toaster.danger(errors[message]);
        return;
      }

      toaster.danger(errors.INTERNAL_SERVER_ERROR);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGuildChange = (guildID: string) => {
    setGuildId(guildID);
  };

  useEffect(() => {
    if (guildsErrored) {
      setError('Failed to fetch your guilds.');
    }
  }, [guildsErrored]);

  return (
    <DashboardLayout hasContainer title="Create Monitored Keyword">
      {error.length > 0 && (
        <MessageBox level={MessageBoxLevel.DANGER} message={error} />
      )}

      <Formik
        initialValues={{ keyword: '', webhookUrl: '', guildId: '' }}
        validate={NewMonitoredKeywordFormValidator.validate}
        onSubmit={handleFormSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="input-group">
              <label htmlFor="keyword">Keyword:</label>
              <Field name="keyword" />
              <ErrorMessage
                name="keyword"
                component={CompactDangerMessageBox}
              />
            </div>

            <div className="input-group">
              <label htmlFor="guild">Guild</label>
              <select
                onChange={(e) => handleGuildChange(e.currentTarget.value)}
                name="guild"
              >
                {guilds === null && (
                  <option disabled>--- loading guilds ---</option>
                )}
                {guilds &&
                  guilds.map((guild) => (
                    <option value={guild.id}>{guild.name}</option>
                  ))}
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="webhookUrl">Webhook URL:</label>
              <Field name="webhookUrl" />
              <ErrorMessage
                name="webhookUrl"
                component={CompactDangerMessageBox}
              />
            </div>

            <div className="input-group">
              <Button type="submit" disabled={isSubmitting}>
                Create
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </DashboardLayout>
  );
};

export default CreateMonitoredKeywordPage;
