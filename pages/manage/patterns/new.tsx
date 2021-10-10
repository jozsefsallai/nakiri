import Button, { ButtonSize } from '@/components/common/button/Button';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import DashboardLayout from '@/layouts/DashboardLayout';
import { errors } from '@/lib/errors';
import toaster from '@/lib/toaster';
import apiService from '@/services/apis';
import { useEffect, useState, MouseEvent } from 'react';
import { useGuilds } from '@/hooks/useGuilds';

import * as NewLinkPatternFormValidator from '@/validators/NewLinkPatternFormValidator';
import { AddLinkPatternAPIRequest } from '@/services/apis/blacklists/LinkPatternsAPIService';
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import { useRouter } from 'next/router';
import MessageBox, {
  CompactDangerMessageBox,
  MessageBoxLevel,
} from '@/components/common/messagebox/MessageBox';
import { redirectIfDoesNotHaveOneOfPermissions } from '@/lib/redirects';
import { UserPermissions } from '@/lib/UserPermissions';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import RegexTester from '@/components/common/regex-tester/RegexTester';

const MySwal = withReactContent(Swal);

const NewLinkPatternPage = () => {
  const [currentUser, _] = useCurrentUser();

  const [guilds, , guildsErrored] = useGuilds();
  const [guildID, setGuildID] = useState<string | undefined>(undefined);
  const [error, setError] = useState('');

  const router = useRouter();

  const handleFormSubmit = async (
    { pattern }: AddLinkPatternAPIRequest,
    { setSubmitting }: FormikHelpers<AddLinkPatternAPIRequest>,
  ) => {
    try {
      await apiService.patterns.addLinkPattern({ pattern, guild: guildID });

      toaster.success('Link pattern added successfully.');

      setTimeout(() => {
        router.push('/manage/patterns');
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

  const handleTestClick = async (
    e: MouseEvent<HTMLButtonElement>,
    pattern?: string,
  ) => {
    e.preventDefault();

    if (!pattern || pattern.length === 0) {
      return;
    }

    await MySwal.fire({
      title: 'Regex Tester',
      html: <RegexTester pattern={pattern} />,
    });
  };

  useEffect(() => {
    if (guildsErrored) {
      setError('Failed to fetch your guilds.');
    }
  }, [guildsErrored]);

  return (
    <DashboardLayout hasContainer title="Add link pattern">
      {error.length > 0 && (
        <MessageBox level={MessageBoxLevel.DANGER} message={error} />
      )}

      <Formik
        initialValues={{ pattern: '' }}
        validate={NewLinkPatternFormValidator.validate}
        onSubmit={handleFormSubmit}
      >
        {({ isSubmitting, errors, values }) => (
          <Form>
            <div className="input-group">
              <label htmlFor="pattern">Regex pattern:</label>
              <Field name="pattern" />
              <ErrorMessage
                name="pattern"
                component={CompactDangerMessageBox}
              />
              {values.pattern.length > 0 && !errors.pattern && (
                <Button
                  onClick={(e) => handleTestClick(e, values.pattern)}
                  size={ButtonSize.SMALL}
                >
                  Test
                </Button>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="guild">Guild</label>
              <select
                onChange={(e) => handleGuildChange(e.currentTarget.value)}
                name="guild"
              >
                {currentUser?.canManageGlobalBlacklists() && (
                  <option value="">Global</option>
                )}
                {currentUser?.canManageOwnGuildBlacklists() && !guilds && (
                  <option disabled>--- loading guilds ---</option>
                )}
                {currentUser?.canManageOwnGuildBlacklists() &&
                  guilds &&
                  guilds.map((guild) => (
                    <option value={guild.id}>{guild.name}</option>
                  ))}
              </select>
            </div>

            <div className="input-group">
              <Button type="submit" disabled={isSubmitting}>
                Add
              </Button>
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
    props: {},
  };
};

export default NewLinkPatternPage;
