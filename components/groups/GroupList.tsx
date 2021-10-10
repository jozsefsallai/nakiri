import { IGroup } from '@/db/models/groups/Group';
import ZeroDataState from '../common/zds/ZeroDataState';
import GroupListItem from './GroupListItem';

export interface GroupListProps {
  groups: IGroup[];
}

const GroupList: React.FC<GroupListProps> = ({ groups }) => {
  if (groups.length === 0) {
    return <ZeroDataState message="You do not have access to any groups." />;
  }

  return (
    <div className="py-4">
      {groups.map((group) => (
        <GroupListItem key={group.id} group={group} />
      ))}
    </div>
  );
};

export default GroupList;
