import Button from '@/components/common/button/Button';
import { IGuild } from '@/controllers/guilds/IGuild';
import DashboardLayout from '@/layouts/DashboardLayout';
import { errors } from '@/lib/errors';
import toaster from '@/lib/toaster';
import apiService from '@/services/apis';
import { useEffect, useState } from 'react';

import * as NewKeywordWhitelistedChannelFormValidator from '@/validators/NewKeywordWhitelistedChannelFormValidator';
import { AddKeywordWhitelistedChannelAPIRequest } from '@/services/apis/monitored-keywords/KeywordWhitelistedChannels';
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import { useRouter } from 'next/router';
import MessageBox, { CompactDangerMessageBox, MessageBoxLevel } from '@/components/common/messagebox/MessageBox';
import { redirectIfDoesNotHavePermission } from '@/lib/redirects';
import { UserPermissions } from '@/lib/UserPermissions';

const AddKeywordWhitelistedChannelPage = () => {
  const [guilds, setGuilds] = useState<IGuild[] | null>(null);
  const [guildId, setGuildId] = useState<string | undefined>(undefined);
  const [error, setError] = useState('');

  const router = useRouter();

  const handleFormSubmit = async ({ channelId }: AddKeywordWhitelistedChannelAPIRequest, { setSubmitting }: FormikHelpers<AddKeywordWhitelistedChannelAPIRequest>) => {
    try {
      await apiService.keywordWhitelistedChannels.addWhitelistedChannel({ guildId, channelId });

      toaster.success(`Added channel "${channelId} to the whitelist".`);

      setTimeout(() => {
        router.push('/manage/monitored-keywords/whitelisted-channels');
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

  const fetchGuilds = async () => {
    setGuilds(null);
    setError('');

    try {
      const { guilds } = await apiService.guilds.getGuilds();
      setGuilds(guilds);
      setGuildId(guilds[0]?.id);
    } catch (err) {
      setError('Failed to fetch guilds.');
    }
  };

  const handleGuildChange = (guildID: string) => {
    setGuildId(guildID);
  };

  useEffect(() => {
    fetchGuilds();
  }, []);

  return (
    <DashboardLayout hasContainer title="Monitored Keywords - Whitelist Channel">
      {error.length > 0 && <MessageBox level={MessageBoxLevel.DANGER} message={error} />}

      <Formik
        initialValues={{ channelId: '', guildId: '' }}
        validate={NewKeywordWhitelistedChannelFormValidator.validate}
        onSubmit={handleFormSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="input-group">
              <label htmlFor="channelId">Channel ID:</label>
              <Field name="channelId" />
              <ErrorMessage name="channelId" component={CompactDangerMessageBox} />
            </div>

            <div className="input-group">
              <label htmlFor="guild">Guild</label>
              <select onChange={e => handleGuildChange(e.currentTarget.value)} name="guild">
                {guilds === null && <option disabled>--- loading guilds ---</option>}
                {guilds && guilds.map(guild => (
                  <option value={guild.id}>{guild.name}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <Button type="submit" disabled={isSubmitting}>Add</Button>
            </div>
          </Form>
        )}
      </Formik>
    </DashboardLayout>
  );
};

export const getServerSideProps = async ({ req, res }) => {
  await redirectIfDoesNotHavePermission(req, res, UserPermissions.MANAGE_MONITORED_KEYWORDS);

  return {
    props: {}
  };
};

export default AddKeywordWhitelistedChannelPage;
