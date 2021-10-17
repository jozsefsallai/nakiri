import Box from '@/components/common/box/Box';
import DiscordCard from '@/components/users/discord-card/DiscordCard';
import { IGroup } from '@/db/models/groups/Group';
import { IUser } from '@/lib/User';
import { IDiscordUser } from '@/typings/IDiscordUser';
import { Clock, Key, Server, Users } from 'react-feather';
import { format as formatDate } from 'date-fns';
import { GroupMemberPermissionsUtil } from '@/lib/GroupMemberPermissions';
import Button, { ButtonSize } from '@/components/common/button/Button';
import { Dispatch, SetStateAction, useState } from 'react';

import Swal from 'sweetalert2';
import apiService from '@/services/apis';
import toaster from '@/lib/toaster';
import { useUserGroups } from '@/hooks/useGroups';
import router from 'next/router';
import { errors } from '@/lib/errors';

export interface GroupHeaderProps {
  group: IGroup;
  setEditMode: Dispatch<SetStateAction<boolean>>;
}

const COPY_TEXT = 'Copy';
const COPIED_TEXT = 'Copied';

const GroupHeader: React.FC<GroupHeaderProps> = ({ group, setEditMode }) => {
  const { reloadGroups } = useUserGroups();

  const creatorDiscordUser: IDiscordUser = {
    ...(group.creator as IUser),
    username: group.creator.name,
    avatar: group.creator.image,
    id: group.creator.discordId,
  };

  const [copyButtonText, setCopyButtonText] = useState(COPY_TEXT);

  const handleCopyClick = async () => {
    await navigator.clipboard.writeText(group.apiKey);
    setCopyButtonText(COPIED_TEXT);

    setTimeout(() => {
      setCopyButtonText(COPY_TEXT);
    }, 2000);
  };

  const toggleEditMode = () => setEditMode((editMode) => !editMode);

  const deleteGroup = async () => {
    try {
      await apiService.groups.deleteGroup(group.id);
      toaster.success('Group deleted successfully.');
      await reloadGroups();
      router.push('/manage/groups');
    } catch (err) {
      const message = err?.response?.data?.error;

      if (message) {
        toaster.danger(errors[message]);
        return;
      }

      toaster.danger(errors.INTERNAL_SERVER_ERROR);
    }
  };

  const handleDeleteClick = async () => {
    let result = await Swal.fire({
      title: `Delete group "${group.name}"?`,
      text: 'Are you extra very sure you want to delete the group? This action is IRREVERSIBLE and will DELETE ALL BLACKLIST ENTRIES attached to the group.',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete group and entries',
      cancelButtonText: 'No, do NOT delete anything',
    });

    if (!result.isConfirmed) {
      return;
    }

    result = await Swal.fire({
      title: 'Are you really really sure?',
      text: 'You should only need to delete a group if you REALLY know what you\'re doing. If you want to transfer the ownership you can do so using the "Edit" button.',
      showCancelButton: true,
      confirmButtonText: "Yes, I know what I'm doing",
      cancelButtonText: 'Nevermind, keep the group',
    });

    if (!result.isConfirmed) {
      return;
    }

    await deleteGroup();
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
                <strong>Created at:</strong>{' '}
                {formatDate(
                  new Date(group.createdAt),
                  'MMMM d yyyy, h:mm:ss a',
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Users />

                <div>
                  <strong>{group.members.length}</strong> member
                  {group.members.length === 1 ? '' : 's'}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Server />

                <div>
                  <strong>{group.guilds.length}</strong> guild
                  {group.guilds.length === 1 ? '' : 's'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="text-center text-xs font-bold uppercase p-2 bg-ayame-primary-900 text-nakiri-base-invert">
            Owner
          </div>
          <DiscordCard
            user={creatorDiscordUser}
            small
            squareCorners
            noMargins
          />

          {group.isCreator && (
            <div className="flex items-center justify-center gap-2 mt-2">
              <Button size={ButtonSize.SMALL} onClick={toggleEditMode}>
                Edit
              </Button>

              <Button size={ButtonSize.SMALL} onClick={handleDeleteClick}>
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>
    </Box>
  );
};

export default GroupHeader;
