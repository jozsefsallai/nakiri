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

import { useUserGroups } from '@/hooks/useGroups';
import { IAuthorizedGuild } from '@/db/models/auth/AuthorizedGuild';
import { bulkMapGuildMetadata } from '@/lib/guildMetadata';
import { IGuild } from '@/controllers/guilds/IGuild';
import { GroupMemberPermissionsUtil } from '@/lib/GroupMemberPermissions';

import SeverityField from '@/components/common/fields/severity-field/SeverityField';
import { Severity } from '@/db/common/Severity';

const MySwal = withReactContent(Swal);

const NewLinkPatternPage = () => {
  const [currentUser, _] = useCurrentUser();

  const { groups, errored } = useUserGroups();
  const [guilds] = useGuilds();

  const [groupGuilds, setGroupGuilds] = useState<IGuild[]>([]);

  const [groupID, setGroupID] = useState<string | undefined>(undefined);
  const [guildID, setGuildID] = useState<string | undefined>(undefined);
  const [severity, setSeverity] = useState<Severity | undefined>(undefined);

  const [error, setError] = useState('');

  const router = useRouter();

  const handleFormSubmit = async (
    { pattern }: AddLinkPatternAPIRequest,
    { setSubmitting }: FormikHelpers<AddLinkPatternAPIRequest>,
  ) => {
    try {
      await apiService.patterns.addLinkPattern({
        pattern,
        guild: guildID,
        group: groupID,
        severity,
      });

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

  const handleGroupChange = (groupID: string) => {
    setGuildID(undefined);

    if (groupID.length === 0) {
      setGroupID(undefined);
      setGroupGuilds([]);
      return;
    }

    setGroupID(groupID);

    const targetGroup = groups.find((g) => g.id === groupID);
    setGroupGuilds(
      bulkMapGuildMetadata(guilds, targetGroup.guilds as IAuthorizedGuild[]),
    );
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
    if (errored) {
      setError('Failed to fetch your guilds.');
    }
  }, [errored]);

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
              <label htmlFor="severity">Severity:</label>
              <SeverityField onChange={setSeverity} />
            </div>

            <div className="input-group">
              <label htmlFor="group">Group</label>
              <select
                onChange={(e) => handleGroupChange(e.currentTarget.value)}
                name="group"
              >
                {currentUser?.canManageGlobalBlacklists() && (
                  <option value="">No group (global blacklist)</option>
                )}
                {currentUser?.canManageGlobalBlacklists() && (
                  <option disabled> --- </option>
                )}
                {!groups && <option disabled> --- loading groups --- </option>}
                {groups &&
                  groups.map((group) => (
                    <option
                      key={group.id}
                      value={group.id}
                      disabled={
                        !GroupMemberPermissionsUtil.canManageGroupEntries(
                          group.myPermissions,
                        )
                      }
                    >
                      {group.name}
                    </option>
                  ))}
              </select>
            </div>

            {groupGuilds?.length > 0 && (
              <div className="input-group">
                <label htmlFor="guild">Guild</label>
                <select
                  onChange={(e) => handleGuildChange(e.currentTarget.value)}
                  name="guild"
                >
                  <option value="">No guild (group's blacklist)</option>
                  <option disabled> --- </option>
                  {groupGuilds.map((guild) => (
                    <option key={guild.id} value={guild.id}>
                      {guild.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

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
