import Button from '@/components/common/button/Button';
import { IGroup } from '@/db/models/groups/Group';
import { useGuilds } from '@/hooks/useGuilds';
import { errors } from '@/lib/errors';
import toaster from '@/lib/toaster';
import apiService from '@/services/apis';
import { useRef, useState } from 'react';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export interface AddGuildButtonProps {
  group: IGroup;
  onSuccess(group: IGroup): void;
}

const AddGuildButton: React.FC<AddGuildButtonProps> = ({
  group,
  onSuccess,
}) => {
  const [guilds] = useGuilds();
  const targetGuild = useRef<string | null>(null);

  const [requestInProgress, setRequestInProgress] = useState(false);

  const updateTargetGuild = (guildId: string) => {
    targetGuild.current = guildId;
  };

  const addGuildToGroup = async (guildId: string): Promise<IGroup> => {
    if (requestInProgress) {
      return;
    }

    setRequestInProgress(true);

    try {
      const res = await apiService.groups.addGuildToGroup(group.id, {
        guildId,
      });
      toaster.success('Guild added to group successfully!');
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

  const handleAddGuildActionClick = async () => {
    targetGuild.current = guilds.length > 0 ? guilds[0].id : null;

    const result = await MySwal.fire({
      title: 'Select a guild',
      html: (
        <div>
          <p>Please select the guild you'd like to add to the group.</p>
          <p>
            <select onChange={(e) => updateTargetGuild(e.target.value)}>
              {guilds?.map((guild) => (
                <option key={guild.id} value={guild.id}>
                  {guild.name}
                </option>
              ))}
            </select>
          </p>
        </div>
      ),
      showCancelButton: true,
      confirmButtonText: 'Add',
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) {
      return;
    }

    const newGroup = await addGuildToGroup(targetGuild.current);
    onSuccess({
      ...group,
      ...newGroup,
    });
  };

  return (
    <Button onClick={handleAddGuildActionClick} disabled={requestInProgress}>
      Add guild
    </Button>
  );
};

export default AddGuildButton;
