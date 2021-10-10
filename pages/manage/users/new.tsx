import Button from '@/components/common/button/Button';
import DiscordCard from '@/components/users/discord-card/DiscordCard';
import DashboardLayout from '@/layouts/DashboardLayout';
import { errors } from '@/lib/errors';
import { redirectIfDoesNotHavePermission } from '@/lib/redirects';
import toaster from '@/lib/toaster';
import { UserPermissions } from '@/lib/UserPermissions';
import apiService from '@/services/apis';
import { IDiscordUser } from '@/typings/IDiscordUser';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

type PermissionsMap = {
  [permission in UserPermissions]: {
    label: string;
    checked: boolean;
  };
};

const NewUserPage = () => {
  const [discordId, setDiscordId] = useState('');
  const [permissions, setPermissions] = useState<PermissionsMap>({
    [UserPermissions.MANAGE_OWN_GUILD_BLACKLISTS]: {
      label: 'Manage own guild blacklists',
      checked: true,
    },

    [UserPermissions.MANAGE_GLOBAL_BLACKLISTS]: {
      label: 'Manage global blacklists',
      checked: false,
    },

    [UserPermissions.MANAGE_MONITORED_KEYWORDS]: {
      label: 'Manage monitored keywords in own guilds',
      checked: false,
    },

    [UserPermissions.MANAGE_AUTHORIZED_USERS]: {
      label: 'Manage authorized users',
      checked: false,
    },
  });

  const [requestInProgress, setRequestInProgress] = useState(false);

  const router = useRouter();

  const authorizeUser = async (user: IDiscordUser) => {
    const finalPermissions = Object.keys(permissions)
      .filter((permission) => permissions[permission].checked)
      .map((permission) => parseInt(permission, 10));

    try {
      await apiService.users.authorizeDiscordUser({
        discordId,
        permissions: finalPermissions,
      });

      toaster.success(
        `User ${user.username}#${user.discriminator} authorized successfully.`,
      );

      setTimeout(() => {
        router.push('/manage/users');
      }, 1000);
    } catch (err) {
      setRequestInProgress(false);

      const message = err?.response?.data?.error;

      if (message) {
        toaster.danger(errors[message]);
        return;
      }

      toaster.danger(errors.INTERNAL_SERVER_ERROR);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (requestInProgress) {
      return;
    }

    setRequestInProgress(true);

    try {
      const { data } = await apiService.users.getDiscordUser(discordId);

      const result = await MySwal.fire({
        title: 'Authorize User',
        html: (
          <div>
            Do you want to authorize this user?
            <DiscordCard user={data} />
          </div>
        ),
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
      });

      if (result.isConfirmed) {
        await authorizeUser(data);
        return;
      }

      setRequestInProgress(false);
    } catch (err) {
      setRequestInProgress(false);

      const message = err?.response?.data?.error;

      if (message) {
        toaster.danger(errors[message]);
        return;
      }

      toaster.danger(errors.INTERNAL_SERVER_ERROR);
    }
  };

  const handlePermissionUpdate = (
    permission: UserPermissions,
    state: boolean,
  ) => {
    setPermissions({
      ...permissions,
      [permission]: {
        ...permissions[permission],
        checked: state,
      },
    });
  };

  return (
    <DashboardLayout hasContainer title="Add New User">
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="discordId">Discord user ID:</label>
          <input
            name="discordId"
            id="discordId"
            placeholder="Discord ID"
            onChange={(e) => setDiscordId(e.currentTarget.value)}
            required
          />
        </div>

        <div className="input-group">
          {(
            Object.keys as (
              o: PermissionsMap,
            ) => Extract<keyof PermissionsMap, string>[]
          )(permissions).map((permission: UserPermissions) => (
            <div className="checkbox" key={permission}>
              <input
                type="checkbox"
                id={`permission-${permission}`}
                onChange={(e) =>
                  handlePermissionUpdate(permission, e.target.checked)
                }
                checked={permissions[permission].checked}
              />

              <label htmlFor={`permission-${permission}`}>
                {permissions[permission].label}
              </label>
            </div>
          ))}
        </div>

        <div className="input-group buttons">
          <Button type="submit" disabled={requestInProgress}>
            Add
          </Button>
        </div>
      </form>
    </DashboardLayout>
  );
};

export const getServerSideProps = async ({ req, res }) => {
  await redirectIfDoesNotHavePermission(
    req,
    res,
    UserPermissions.MANAGE_AUTHORIZED_USERS,
  );
  return {
    props: {},
  };
};

export default NewUserPage;
