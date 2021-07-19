import { FormEvent, MouseEvent, useState } from 'react';

import { IAuthorizedUser } from '@/db/models/auth/AuthorizedUser';
import { UserPermissions, UserPermissionsUtil } from '@/lib/UserPermissions';
import Button, { ButtonSize } from '../common/button/Button';
import DiscordAvatar from './common/DiscordAvatar';

export interface UserListItemProps {
  user: IAuthorizedUser;
  onUpdateUserPermissions(id: string, permissions: number[]);
};

type PermissionsMap = {
  [permission in UserPermissions]: {
    label: string;
    checked: boolean;
  };
};

const UserListItem = ({ user, onUpdateUserPermissions }: UserListItemProps) => {
  const permissions = Object.keys(UserPermissions)
    .filter(permission => {
      return typeof permission === 'string' && (user.permissions & UserPermissions[permission]) === UserPermissions[permission];
    })
    .join(', ');

  const handleNotImplemented = () => {
    alert('Not implemented yet!');
  };

  const [ editMode, setEditMode ] = useState(false);
  const [ requestInProgress, setRequestInProgress ] = useState(false);

  const [ newPermissions, setNewPermissions ] = useState<PermissionsMap>({
    [UserPermissions.MANAGE_OWN_GUILD_BLACKLISTS]: {
      label: 'Manage own guild blacklists',
      checked: UserPermissionsUtil.canManageOwnGuildBlacklists(user.permissions)
    },

    [UserPermissions.MANAGE_GLOBAL_BLACKLISTS]: {
      label: 'Manage global blacklists',
      checked: UserPermissionsUtil.canManageGlobalBlacklists(user.permissions)
    },

    [UserPermissions.MANAGE_AUTHORIZED_USERS]: {
      label: 'Manage authorized users',
      checked: UserPermissionsUtil.canManageAuthorizedUsers(user.permissions)
    }
  });

  const handlePermissionUpdate = (permission: UserPermissions, state: boolean) => {
    setNewPermissions({
      ...newPermissions,
      [permission]: {
        ...newPermissions[permission],
        checked: state
      }
    });
  };

  const handlePermsButtonClick = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setEditMode(editMode => !editMode);
  };

  const handleUpdatePermsFormSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setRequestInProgress(true);

    const permissions = Object.keys(newPermissions)
      .filter(permission => newPermissions[permission].checked)
      .map(permission => parseInt(permission, 10));

    await onUpdateUserPermissions(user.id, permissions);

    setRequestInProgress(false);
    setEditMode(false);
  };

  return (
    <>
      <div className="flex items-center gap-3 my-4">
        <div className="w-24 h-24">
          <DiscordAvatar
            url={user.image}
            id={user.discordId}
            discriminator={user.discriminator}
            alt={user.name}
            className="rounded-full"
          />
        </div>

        <div className="flex-1">
          <div className="text-lg font-bold">
            {user.name}
            <span className="text-gray">#{user.discriminator}</span>
          </div>

          <div className="text-xs"><strong>Permissions:</strong> {permissions}</div>
        </div>

        <div className="flex gap-2">
          <Button size={ButtonSize.SMALL} onClick={handlePermsButtonClick}>Perms</Button>
          <Button size={ButtonSize.SMALL} onClick={handleNotImplemented}>Unauthorize</Button>
        </div>
      </div>

      {editMode && (
        <form onSubmit={handleUpdatePermsFormSubmit} className="px-6 py-3 border-2 rounded-md border-ayame-primary">
          <div className="input-group">
            {(Object.keys as (o: PermissionsMap) => Extract<keyof PermissionsMap, string>[])(newPermissions).map((permission: UserPermissions) => (
              <div className="checkbox" key={permission}>
                <input
                  type="checkbox"
                  id={`permission-${permission}`}
                  onChange={e => handlePermissionUpdate(permission, e.target.checked)}
                  checked={newPermissions[permission].checked}
                />

                <label htmlFor={`permission-${permission}`}>{newPermissions[permission].label}</label>
              </div>
            ))}
          </div>

          <div className="input-group buttons">
            <Button type="submit" disabled={requestInProgress}>Save</Button>
          </div>
        </form>
      )}
    </>
  );
};

export default UserListItem;
