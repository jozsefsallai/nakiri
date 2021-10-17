import Column from '@/components/common/columns/Column';
import Columns from '@/components/common/columns/Columns';
import { IGuild } from '@/controllers/guilds/IGuild';

import { IAuthorizedGuild } from '@/db/models/auth/AuthorizedGuild';
import { IGroup } from '@/db/models/groups/Group';
import { IGroupMember } from '@/db/models/groups/GroupMember';

import GroupGuildList from './guilds/GroupGuildList';
import GroupHeader from './GroupHeader';
import GroupMemberList from './members/GroupMemberList';
import { useState } from 'react';
import GroupDetailsEditor from './GroupDetailsEditor';

export interface GroupProps {
  group: IGroup;
  setGroup(group: IGroup): void;
}

const Group: React.FC<GroupProps> = ({ group, setGroup }) => {
  const [editMode, setEditMode] = useState(false);

  return (
    <div>
      <GroupHeader group={group} setEditMode={setEditMode} />
      {editMode && (
        <GroupDetailsEditor
          group={group}
          setEditMode={setEditMode}
          setGroup={setGroup}
        />
      )}

      <Columns>
        <Column>
          <GroupGuildList
            guilds={group.guilds as IAuthorizedGuild[]}
            group={group}
            setGroup={setGroup}
          />
        </Column>

        <Column>
          <GroupMemberList
            members={group.members as IGroupMember[]}
            group={group}
            setGroup={setGroup}
          />
        </Column>
      </Columns>
    </div>
  );
};

export default Group;
