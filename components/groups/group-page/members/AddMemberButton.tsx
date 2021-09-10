import Button from '@/components/common/button/Button';
import { IGroup } from '@/db/models/groups/Group';
import clone from '@/lib/clone';
import { errors } from '@/lib/errors';
import { GroupMemberPermissions } from '@/lib/GroupMemberPermissions';
import toaster from '@/lib/toaster';
import apiService from '@/services/apis';
import React, { useRef, useState } from 'react';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export interface AddMemberButtonProps {
  group: IGroup;
  onSuccess(group: IGroup): void;
};

type PermissionsMap = {
  [permission in GroupMemberPermissions]: {
    label: string;
    checked: boolean;
  };
};

const defaultPermissionsMap: PermissionsMap = {
  [GroupMemberPermissions.VIEW_GROUP_BLACKLISTS]: {
    label: 'View the group\'s blacklists',
    checked: true,
  },

  [GroupMemberPermissions.MANAGE_GROUP_ENTRIES]: {
    label: 'Manage group blacklist entries',
    checked: false,
  },

  [GroupMemberPermissions.SEE_API_KEY]: {
    label: 'See the group\'s API key',
    checked: false,
  },

  [GroupMemberPermissions.MANAGE_GROUP_GUILDS]: {
    label: 'Manage group guilds',
    checked: false,
  },

  [GroupMemberPermissions.MANAGE_GROUP_MEMBERS]: {
    label: 'Manage group members',
    checked: false,
  },
};

const AddMemberButton: React.FC<AddMemberButtonProps> = ({ group, onSuccess }) => {
  const discordId = useRef<string | null>(null);
  const permissions = useRef<PermissionsMap>(clone(defaultPermissionsMap));

  const [ requestInProgress, setRequestInProgress ] = useState(false);

  const updateDiscordID = (id: string) => {
    discordId.current = id;
  };

  const updatePermissions = (permission: GroupMemberPermissions, checked: boolean) => {
    permissions.current[permission].checked = checked;
  };

  const addMemberToGroup = async (discordId: string, permissions: number[]): Promise<IGroup> => {
    setRequestInProgress(true);

    try {
      const res = await apiService.groups.addGroupMember(group.id, { discordId, permissions });
      toaster.success('Member added successfully!');
      setRequestInProgress(false);
      return res.group;
    } catch (err) {
      const message = err?.response?.data?.error;

      if (message) {
        toaster.danger(errors[message]);
        return;
      }

      toaster.danger(errors.INTERNAL_SERVER_ERROR);
      setRequestInProgress(false);
    }
  };

  const handleAddMemberActionClick = async () => {
    if (requestInProgress) {
      return;
    }

    discordId.current = null;
    permissions.current = clone(defaultPermissionsMap);

    const result = await MySwal.fire({
      title: 'Add member to group',
      html: (
        <form>
          <div className="input-group">
            <label htmlFor="discordId">Discord user ID:</label>
            <input
              name="discordId"
              id="discordId"
              placeholder="Discord ID"
              onChange={e => updateDiscordID(e.currentTarget.value)}
              required
            />
          </div>

          <div className="input-group">
            {(Object.keys as (o: PermissionsMap) => Extract<keyof PermissionsMap, string>[])(permissions.current).map((permission: GroupMemberPermissions) => (
              <div className="checkbox" key={permission}>
                <input
                  type="checkbox"
                  id={`permission-${permission}`}
                  onChange={e => updatePermissions(permission, e.target.checked)}
                  defaultChecked={permissions.current[permission].checked}
                />

                <label htmlFor={`permission-${permission}`}>{permissions.current[permission].label}</label>
              </div>
            ))}
          </div>
        </form>
      ),
      showCancelButton: true,
      confirmButtonText: 'Add',
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) {
      return;
    }

    const finalPermissions = Object.keys(permissions.current)
      .filter(permission => permissions.current[permission].checked)
      .map(permission => parseInt(permission, 10));

    const newGroup = await addMemberToGroup(discordId.current!, finalPermissions);
    onSuccess({
      ...group,
      ...newGroup,
    });
  };

  return (
    <Button
      onClick={handleAddMemberActionClick}
      disabled={requestInProgress}
    >
      Add member
    </Button>
  );
};

export default AddMemberButton;
