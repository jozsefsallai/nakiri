import { IAuthorizedUser } from '@/db/models/auth/AuthorizedUser';
import UserListItem from './UserListItem';

export interface UserListProps {
  users: IAuthorizedUser[];
};

const UserList = ({ users }: UserListProps) => {
  return (
    <div>
      {users.map(user => <UserListItem key={user.id} user={user} />)}
    </div>
  );
};

export default UserList;
