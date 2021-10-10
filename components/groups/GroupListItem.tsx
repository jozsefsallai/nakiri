import { IGroup } from '@/db/models/groups/Group';
import { ALL_PERMISSIONS } from '@/lib/GroupMemberPermissions';
import clsx from 'clsx';
import { useRouter } from 'next/router';

export interface GroupListItemProps {
  group: IGroup;
}

const GroupListItem: React.FC<GroupListItemProps> = ({ group }) => {
  const router = useRouter();

  const getUserStatus = (): JSX.Element => {
    const baseClassNames = clsx('border-2 rounded-lg text-xs px-2 py-1');

    if (group.isCreator) {
      return (
        <div className={clsx(baseClassNames, 'border-danger', 'text-danger')}>
          Creator
        </div>
      );
    }

    if (group.myPermissions === ALL_PERMISSIONS) {
      return (
        <div className={clsx(baseClassNames, 'border-warning', 'text-warning')}>
          Admin
        </div>
      );
    }

    return (
      <div className={clsx(baseClassNames, 'border-info', 'text-info')}>
        Member
      </div>
    );
  };

  const handleItemClick = (): void => {
    router.push(`/manage/groups/${group.id}`);
  };

  return (
    <div
      className="blacklist-item rounded-md cursor-pointer my-2 flex items-center px-4 py-3 hover:shadow-sm hover:bg-ayame-primary-100"
      onClick={handleItemClick}
    >
      <div className="flex-1">
        <h2 className="text-lg my-0">{group.name}</h2>
        {group.description?.length > 0 && (
          <div className="text-sm mt-2">{group.description}</div>
        )}
      </div>

      {getUserStatus()}
    </div>
  );
};

export default GroupListItem;
