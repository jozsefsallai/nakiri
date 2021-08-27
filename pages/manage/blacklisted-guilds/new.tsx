import Button from '@/components/common/button/Button';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import DashboardLayout from '@/layouts/DashboardLayout';
import { errors } from '@/lib/errors';
import toaster from '@/lib/toaster';
import apiService from '@/services/apis';
import { useEffect, useState } from 'react';
import { useGuilds } from '@/hooks/useGuilds';

import { AddDiscordGuildAPIRequest } from '@/services/apis/blacklists/DiscordGuildsAPIService';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { useRouter } from 'next/router';
import MessageBox, { MessageBoxLevel } from '@/components/common/messagebox/MessageBox';
import { redirectIfDoesNotHaveOneOfPermissions } from '@/lib/redirects';
import { UserPermissions } from '@/lib/UserPermissions';

const NewGuildPage = () => {
  const [ currentUser, _ ] = useCurrentUser();

  const [ guilds, , guildsErrored ] = useGuilds();
  const [ guildID, setGuildID ] = useState<string | undefined>(undefined);
  const [ error, setError ] = useState('');

  const router = useRouter();

  const handleFormSubmit = async ({ id, name }: AddDiscordGuildAPIRequest, { setSubmitting }: FormikHelpers<AddDiscordGuildAPIRequest>) => {
    try {
      await apiService.guildIDs.addDiscordGuild({ id, name, guild: guildID });

      toaster.success(`Added guild with ID ${id}.`);

      setTimeout(() => {
        router.push('/manage/blacklisted-guilds');
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
    <DashboardLayout hasContainer title="Add Discord Guild">
      {error.length > 0 && <MessageBox level={MessageBoxLevel.DANGER} message={error} />}

      <Formik
        initialValues={{ id: '', name: '' }}
        onSubmit={handleFormSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="input-group">
              <label htmlFor="name">Friendly name:</label>
              <Field name="name" />
            </div>

            <div className="input-group">
              <label htmlFor="id">Guild ID:</label>
              <Field name="id" />
            </div>

            <div className="input-group">
              <label htmlFor="guild">Blacklist:</label>
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

export default NewGuildPage;