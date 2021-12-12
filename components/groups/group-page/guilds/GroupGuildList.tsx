import Box from '@/components/common/box/Box';
import Loading from '@/components/loading/Loading';
import ZeroDataState from '@/components/common/zds/ZeroDataState';
import { IGuild } from '@/controllers/guilds/IGuild';
import { IAuthorizedGuild } from '@/db/models/auth/AuthorizedGuild';
import { useGuilds } from '@/hooks/useGuilds';
import GroupGuildListItem from './GroupGuildListItem';
import { IGroup } from '@/db/models/groups/Group';
import AddGuildButton from './AddGuildButton';
import { GroupMemberPermissionsUtil } from '@/lib/GroupMemberPermissions';
import toaster from '@/lib/toaster';
import { useState } from 'react';
import apiService from '@/services/apis';
import { errors } from '@/lib/errors';

import Swal from 'sweetalert2';

export interface GroupGuildListProps {
  guilds: IAuthorizedGuild[];
  group: IGroup;
  setGroup(group: IGroup): void;
}

const GroupGuildList: React.FC<GroupGuildListProps> = ({
  guilds,
  group,
  setGroup,
}) => {
  const [allGuilds] = useGuilds();

  const [requestInProgress, setRequestInProgress] = useState(false);

  const removeGuildFromGroup = async (
    guild: IAuthorizedGuild,
  ): Promise<IGroup> => {
    if (requestInProgress) {
      return;
    }

    setRequestInProgress(true);

    try {
      const res = await apiService.groups.removeGroupGuild(
        group.id,
        guild.guildId,
      );
      toaster.success('Guild removed from group successfully!');
      setRequestInProgress(false);
      return res.group;
    } catch (err) {
      setRequestInProgress(false);
      const message = err?.response?.data?.error;

      if (message) {
        toaster.danger(errors[message]);
        return;
      }

      toaster.danger(errors.INTERNAL_SERVER_ERROR);
    }
  };

  const getGuildMetadata = (guildId: string): IGuild | undefined => {
    const guild = allGuilds.find((g) => g.id === guildId);
    return guild;
  };

  const handleGuildRemoveClick = async (guild: IAuthorizedGuild) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to remove this guild from the group? This will NOT remove entries associated to this guild in this group, so you can add the guild again later and still have the original blacklist entries.',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    });

    if (!result.isConfirmed) {
      return;
    }

    const newGroup = await removeGuildFromGroup(guild);
    setGroup({
      ...group,
      ...newGroup,
    });
  };

  return (
    <Box title="Guilds">
      {guilds.length === 0 && (
        <ZeroDataState message="There are no guilds in this group yet." />
      )}
      {guilds.length > 0 && !allGuilds && <Loading />}
      {guilds.length > 0 &&
        allGuilds &&
        guilds.map((guild) => (
          <GroupGuildListItem
            guild={guild}
            metadata={getGuildMetadata(guild.guildId)}
            canManageGuilds={GroupMemberPermissionsUtil.canManageGroupGuilds(
              group.myPermissions,
            )}
            onGuildRemoveClicked={handleGuildRemoveClick}
            key={guild.guildId}
          />
        ))}

      {GroupMemberPermissionsUtil.canManageGroupGuilds(group.myPermissions) && (
        <div className="text-center mt-5">
          <AddGuildButton group={group} onSuccess={setGroup} />
        </div>
      )}
    </Box>
  );
};

export default GroupGuildList;
