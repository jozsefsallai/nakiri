import Button from '@/components/common/button/Button';
import { IGuild } from '@/controllers/guilds/IGuild';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import DashboardLayout from '@/layouts/DashboardLayout';
import { errors } from '@/lib/errors';
import toaster from '@/lib/toaster';
import apiService from '@/services/apis';
import { useEffect, useState } from 'react';

import * as NewChannelIDFormValidator from '@/validators/NewChannelIDFormValidator';
import { AddChannelIDAPIRequest } from '@/services/apis/blacklists/ChannelIDsAPIService';
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import { useRouter } from 'next/router';
import MessageBox, { CompactDangerMessageBox, MessageBoxLevel } from '@/components/common/messagebox/MessageBox';
import { redirectIfDoesNotHaveOneOfPermissions } from '@/lib/redirects';
import { UserPermissions } from '@/lib/UserPermissions';

const NewChannelIDPage = () => {
  const [ currentUser, _ ] = useCurrentUser();

  const [ guilds, setGuilds ] = useState<IGuild[] | null>(null);
  const [ guildID, setGuildID ] = useState<string | undefined>(undefined);
  const [ error, setError ] = useState('');

  const router = useRouter();

  const handleFormSubmit = async ({ channelID }: AddChannelIDAPIRequest, { setSubmitting }: FormikHelpers<AddChannelIDAPIRequest>) => {
    try {
      await apiService.channelIDs.addChannelID({ channelID, guild: guildID });

      toaster.success(`Added channel with ID ${channelID}.`);

      setTimeout(() => {
        router.push('/manage/channels');
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
    } catch (err) {
      setError('Failed to fetch guilds.');
    }
  };

  const handleGuildChange = (guildID: string) => {
    if (guildID.length === 0) {
      setGuildID(undefined);
      return;
    }

    setGuildID(guildID);
  };

  useEffect(() => {
    fetchGuilds();
  }, []);

  return (
    <DashboardLayout hasContainer title="Add YouTube channel ID">
      {error.length > 0 && <MessageBox level={MessageBoxLevel.DANGER} message={error} />}

      <Formik
        initialValues={{ channelID: '' }}
        validate={NewChannelIDFormValidator.validate}
        onSubmit={handleFormSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="input-group">
              <label htmlFor="channelID">Channel ID:</label>
              <Field name="channelID" />
              <ErrorMessage name="channelID" component={CompactDangerMessageBox} />
            </div>

            <div className="input-group">
              <label htmlFor="guild">Guild</label>
              <select onChange={e => handleGuildChange(e.currentTarget.value)} name="guild">
                {currentUser?.canManageGlobalBlacklists() && <option value="">Global</option>}
                {currentUser?.canManageOwnGuildBlacklists() && !guilds && <option disabled>--- loading guilds ---</option>}
                {currentUser?.canManageOwnGuildBlacklists() && guilds && guilds.map(guild => (
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
  await redirectIfDoesNotHaveOneOfPermissions(req, res, [
    UserPermissions.MANAGE_GLOBAL_BLACKLISTS,
    UserPermissions.MANAGE_OWN_GUILD_BLACKLISTS,
  ]);

  return {
    props: {}
  };
};

export default NewChannelIDPage;
