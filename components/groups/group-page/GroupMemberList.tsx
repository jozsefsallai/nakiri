import Box from '@/components/common/box/Box';
import Button from '@/components/common/button/Button';
import ZeroDataState from '@/components/common/zds/ZeroDataState';
import { IAuthorizedUser } from '@/db/models/auth/AuthorizedUser';
import { IGroupMember } from '@/db/models/groups/GroupMember';
import toaster from '@/lib/toaster';
import GroupMemberListItem from './GroupMemberListItem';

export interface GroupMemberListProps {
  members: IGroupMember[];
};

const GroupMemberList: React.FC<GroupMemberListProps> = ({ members }) => {
  const handleAddMemberClick = () => {
    toaster.warning('Adding users to a group is not implemented yet!');
  };

  return (
    <Box title="Members">
      {members.length === 0 && <ZeroDataState message="There are no members in this group." />}

      {members.length > 0 && members.map(member => (
        <GroupMemberListItem
          member={member.user as IAuthorizedUser}
          permissions={member.permissions}
          key={member.id}
        />
      ))}

      <div className="text-center mt-5">
        <Button onClick={handleAddMemberClick}>Add member</Button>
      </div>
    </Box>
  );
};

export default GroupMemberList;
