import { IAuthorizedUser } from '@/db/models/auth/AuthorizedUser';
import { UserPermissions } from '@/lib/UserPermissions';
import Button, { ButtonSize } from '../common/button/Button';
import DiscordAvatar from './common/DiscordAvatar';

export interface UserListItemProps {
  user: IAuthorizedUser;
};

const UserListItem = ({ user }: UserListItemProps) => {
  const permissions = Object.keys(UserPermissions)
    .filter(permission => {
      return typeof permission === 'string' && (user.permissions & UserPermissions[permission]) === UserPermissions[permission];
    })
    .join(', ');

  const handleNotImplemented = () => {
    alert('Not implemented yet!');
  };

  return (
    <div className="flex items-center gap-3 my-4">
      <div className="w-24 h-24">
        <DiscordAvatar
          url={user.image}
          id={user.discordId}
          discriminator={user.discriminator}
          alt={user.name}
          className="rounded-full"
        />
      </div>

      <div className="flex-1">
        <div className="text-lg font-bold">
          {user.name}
          <span className="text-gray">#{user.discriminator}</span>
        </div>

        <div className="text-xs"><strong>Permissions:</strong> {permissions}</div>
      </div>

      <div className="flex gap-2">
        <Button size={ButtonSize.SMALL} onClick={handleNotImplemented}>Perms</Button>
        <Button size={ButtonSize.SMALL} onClick={handleNotImplemented}>Unauthorize</Button>
      </div>
    </div>
  );
};

export default UserListItem;
