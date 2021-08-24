import Button from '@/components/common/button/Button';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import DashboardLayout from '@/layouts/DashboardLayout';
import { errors } from '@/lib/errors';
import toaster from '@/lib/toaster';
import apiService from '@/services/apis';
import { useEffect, useState } from 'react';
import { useGuilds } from '@/hooks/useGuilds';

import * as NewVideoIDFormValidator from '@/validators/NewVideoIDFormValidator';
import { AddVideoIDAPIRequest } from '@/services/apis/blacklists/VideoIDsAPIService';
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import { useRouter } from 'next/router';
import MessageBox, { CompactDangerMessageBox, MessageBoxLevel } from '@/components/common/messagebox/MessageBox';
import { redirectIfDoesNotHaveOneOfPermissions } from '@/lib/redirects';
import { UserPermissions } from '@/lib/UserPermissions';

const NewVideoIDPage = () => {
  const [ currentUser, _ ] = useCurrentUser();

  const [ guilds, , guildsErrored ] = useGuilds();
  const [ guildID, setGuildID ] = useState<string | undefined>(undefined);
  const [ error, setError ] = useState('');

  const router = useRouter();

  const handleFormSubmit = async ({ videoID }: AddVideoIDAPIRequest, { setSubmitting }: FormikHelpers<AddVideoIDAPIRequest>) => {
    try {
      await apiService.videoIDs.addVideoID({ videoID, guild: guildID });

      toaster.success(`Added video with ID ${videoID}.`);

      setTimeout(() => {
        router.push('/manage/videos');
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
    if (guildID.length === 0) {
      setGuildID(undefined);
      return;
    }

    setGuildID(guildID);
  };

  useEffect(() => {
    if (guildsErrored) {
      setError('Failed to fetch your guilds.');
    }
  }, [guildsErrored]);

  return (
    <DashboardLayout hasContainer title="Add YouTube video ID">
      {error.length > 0 && <MessageBox level={MessageBoxLevel.DANGER} message={error} />}

      <Formik
        initialValues={{ videoID: '' }}
        validate={NewVideoIDFormValidator.validate}
        onSubmit={handleFormSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="input-group">
              <label htmlFor="videoID">Video ID:</label>
              <Field name="videoID" />
              <ErrorMessage name="videoID" component={CompactDangerMessageBox} />
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

export default NewVideoIDPage;
