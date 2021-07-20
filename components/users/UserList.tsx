import { IAuthorizedUser } from '@/db/models/auth/AuthorizedUser';
import UserListItem from './UserListItem';

export interface UserListProps {
  users: IAuthorizedUser[];
  onUpdateUserPermissions(id: string, permissions: number[]);
  onUnauthorizeUser(user: IAuthorizedUser);
};

const UserList = ({ users, onUpdateUserPermissions, onUnauthorizeUser }: UserListProps) => {
  return (
    <div>
      {users.map(user => <UserListItem
        key={user.id}
        user={user}
        onUpdateUserPermissions={onUpdateUserPermissions}
        onUnauthorizeUser={onUnauthorizeUser}
      />)}
    </div>
  );
};

export default UserList;
