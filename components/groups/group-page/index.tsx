import Column from '@/components/common/columns/Column';
import Columns from '@/components/common/columns/Columns';
import { IGuild } from '@/controllers/guilds/IGuild';

import { IAuthorizedGuild } from '@/db/models/auth/AuthorizedGuild';
import { IGroup } from '@/db/models/groups/Group';
import { IGroupMember } from '@/db/models/groups/GroupMember';

import GroupGuildList from './GroupGuildList';
import GroupHeader from './GroupHeader';
import GroupMemberList from './GroupMemberList';

export interface GroupProps {
  group: IGroup;

  onAddGuildClick: () => void | Promise<void>;
};

const Group: React.FC<GroupProps> = ({ group, onAddGuildClick }) => {
  return (
    <div>
      <GroupHeader group={group} />

      <Columns>
        <Column>
          <GroupGuildList
            guilds={group.guilds as IAuthorizedGuild[]}
            onAddGuildClick={onAddGuildClick}
          />
        </Column>

        <Column>
          <GroupMemberList members={group.members as IGroupMember[]} />
        </Column>
      </Columns>
    </div>
  );
};

export default Group;
