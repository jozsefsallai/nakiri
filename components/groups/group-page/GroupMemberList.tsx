import Box from '@/components/common/box/Box';
import Button from '@/components/common/button/Button';
import ZeroDataState from '@/components/common/zds/ZeroDataState';
import { IAuthorizedUser } from '@/db/models/auth/AuthorizedUser';
import { IGroup } from '@/db/models/groups/Group';
import { IGroupMember } from '@/db/models/groups/GroupMember';
import toaster from '@/lib/toaster';
import GroupMemberListItem from './GroupMemberListItem';
import AddMemberButton from './members/AddMemberButton';

export interface GroupMemberListProps {
  group: IGroup;
  setGroup(group: IGroup): void;

  members: IGroupMember[];
};

const GroupMemberList: React.FC<GroupMemberListProps> = ({ group, setGroup, members }) => {
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
        <AddMemberButton group={group} onSuccess={setGroup} />
      </div>
    </Box>
  );
};

export default GroupMemberList;
