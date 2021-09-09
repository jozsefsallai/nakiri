import Box from '@/components/common/box/Box';
import DiscordCard from '@/components/users/discord-card/DiscordCard';
import { IGroup } from '@/db/models/groups/Group';
import { IUser } from '@/lib/User';
import { IDiscordUser } from '@/typings/IDiscordUser';
import { Clock, Key, Server, Users } from 'react-feather';
import { format as formatDate } from 'date-fns';
import { GroupMemberPermissionsUtil } from '@/lib/GroupMemberPermissions';
import Button, { ButtonSize } from '@/components/common/button/Button';
import { useState } from 'react';

export interface GroupHeaderProps {
  group: IGroup;
};

const COPY_TEXT = 'Copy';
const COPIED_TEXT = 'Copied';

const GroupHeader: React.FC<GroupHeaderProps> = ({ group }) => {
  const creatorDiscordUser: IDiscordUser = {
    ...(group.creator as IUser),
    username: group.creator.name,
    avatar: group.creator.image,
    id: group.creator.discordId,
  };

  const [ copyButtonText, setCopyButtonText ] = useState(COPY_TEXT);

  const handleCopyClick = async () => {
    await navigator.clipboard.writeText(group.apiKey);
    setCopyButtonText(COPIED_TEXT);

    setTimeout(() => {
      setCopyButtonText(COPY_TEXT);
    }, 2000);
  };

  return (
    <Box title={group.name}>
      <div className="flex justify-between gap-2">
        <div>
          {group.description && <p>{group.description}</p>}

          <div className="text-sm mt-4">
            {GroupMemberPermissionsUtil.canSeeApiKey(group.myPermissions) && (
              <div className="flex items-center gap-2 mb-4">
                <Key />

                <div>
                  <strong>API Key:</strong> {group.apiKey}
                </div>

                <Button size={ButtonSize.SMALL} onClick={handleCopyClick}>
                  {copyButtonText}
                </Button>
              </div>
            )}

            <div className="flex items-center gap-2 mb-4">
              <Clock />

              <div>
                <strong>Created at:</strong> {formatDate(new Date(group.createdAt), 'MMMM d yyyy, h:mm:ss a')}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Users />

                <div>
                  <strong>{group.members.length}</strong> member{group.members.length === 1 ? '' : 's'}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Server />

                <div>
                  <strong>{group.guilds.length}</strong> guild{group.guilds.length === 1 ? '' : 's'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="text-center text-xs font-bold uppercase p-2 bg-ayame-primary-900 text-nakiri-base-invert">Creator</div>
          <DiscordCard user={creatorDiscordUser} small squareCorners noMargins />
        </div>
      </div>
    </Box>
  );
};

export default GroupHeader;
