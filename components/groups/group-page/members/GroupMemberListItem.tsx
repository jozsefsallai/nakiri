import { IAuthorizedUser } from '@/db/models/auth/AuthorizedUser';
import { GroupMemberPermissions } from '@/lib/GroupMemberPermissions';
import { UserPermissionsUtil } from '@/lib/UserPermissions';

import DiscordAvatar from '@/components/users/common/DiscordAvatar';
import Button from '@/components/common/button/Button';

export interface GroupMemberListItemProps {
  member: IAuthorizedUser;
  permissions: number;
  canManageMembers: boolean;
  onMemberRemoveClicked: (member: IAuthorizedUser) => void;
}

const GroupMemberListItem: React.FC<GroupMemberListItemProps> = ({
  member,
  permissions,
  canManageMembers,
  onMemberRemoveClicked,
}) => {
  const permissionsList = Object.keys(GroupMemberPermissions)
    .filter((permission) => {
      return (
        typeof permission === 'string' &&
        UserPermissionsUtil.hasPermission(
          permissions,
          GroupMemberPermissions[permission],
        )
      );
    })
    .join(', ');

  return (
    <div className="lg:flex items-center justify-between gap-3 my-4">
      <div className="flex items-center gap-3">
        <div className="w-24 h-24">
          <DiscordAvatar
            url={member.image}
            id={member.discordId}
            discriminator={member.discriminator}
            alt={member.name}
            className="rounded-full"
          />
        </div>

        <div className="flex-1">
          <div className="text-lg font-bold">
            {member.name}
            <span className="text-gray">#{member.discriminator}</span>
          </div>

          <div className="text-xs">
            <strong>Permissions:</strong> {permissionsList}
          </div>
        </div>
      </div>

      {canManageMembers && (
        <div className="flex items-center gap-3">
          <Button onClick={() => onMemberRemoveClicked(member)}>Remove</Button>
        </div>
      )}
    </div>
  );
};

export default GroupMemberListItem;
