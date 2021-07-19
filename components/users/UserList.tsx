import { IAuthorizedUser } from '@/db/models/auth/AuthorizedUser';
import UserListItem from './UserListItem';

export interface UserListProps {
  users: IAuthorizedUser[];
  onUpdateUserPermissions(id: string, permissions: number[]);
};

const UserList = ({ users, onUpdateUserPermissions }: UserListProps) => {
  return (
    <div>
      {users.map(user => <UserListItem
        key={user.id}
        user={user}
        onUpdateUserPermissions={onUpdateUserPermissions}
      />)}
    </div>
  );
};

export default UserList;
