import Box from '@/components/common/box/Box';
import ZeroDataState from '@/components/common/zds/ZeroDataState';
import { IAuthorizedUser } from '@/db/models/auth/AuthorizedUser';
import { IGroup } from '@/db/models/groups/Group';
import { IGroupMember } from '@/db/models/groups/GroupMember';
import GroupMemberListItem from './GroupMemberListItem';
import AddMemberButton from './AddMemberButton';
import { GroupMemberPermissionsUtil } from '@/lib/GroupMemberPermissions';
import toaster from '@/lib/toaster';
import { useState } from 'react';
import apiService from '@/services/apis';
import { errors } from '@/lib/errors';

import Swal from 'sweetalert2';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export interface GroupMemberListProps {
  group: IGroup;
  setGroup(group: IGroup): void;

  members: IGroupMember[];
}

const GroupMemberList: React.FC<GroupMemberListProps> = ({
  group,
  setGroup,
  members,
}) => {
  const [currentUser] = useCurrentUser();
  const [requestInProgress, setRequestInProgress] = useState(false);

  const removeMemberFromGroup = async (
    member: IAuthorizedUser,
  ): Promise<IGroup> => {
    if (requestInProgress) {
      return;
    }

    setRequestInProgress(true);

    try {
      const res = await apiService.groups.removeGroupMember(
        group.id,
        member.id,
      );
      toaster.success('Member removed from group successfully!');
      setRequestInProgress(false);
      return res.group;
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

  const handleMemberRemoveClick = async (member: IAuthorizedUser) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Are you sure you want to remove ${member.name}#${member.discriminator} from the group?`,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    });

    if (!result.isConfirmed) {
      return;
    }

    const newGroup = await removeMemberFromGroup(member);
    setGroup({
      ...group,
      ...newGroup,
    });
  };

  return (
    <Box title="Members">
      {members.length === 0 && (
        <ZeroDataState message="There are no members in this group." />
      )}

      {members.length > 0 &&
        members.map((member) => (
          <GroupMemberListItem
            member={member.user as IAuthorizedUser}
            permissions={member.permissions}
            canManageMembers={
              GroupMemberPermissionsUtil.canManageGroupMembers(
                group.myPermissions,
              ) &&
              member.user.id !== group.creator.id &&
              member.user.id !== currentUser.id
            }
            onMemberRemoveClicked={handleMemberRemoveClick}
            key={member.id}
          />
        ))}

      {GroupMemberPermissionsUtil.canManageGroupMembers(
        group.myPermissions,
      ) && (
        <div className="text-center mt-5">
          <AddMemberButton group={group} onSuccess={setGroup} />
        </div>
      )}
    </Box>
  );
};

export default GroupMemberList;
