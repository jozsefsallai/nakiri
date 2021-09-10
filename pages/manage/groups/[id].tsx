import MessageBox, { MessageBoxLevel } from '@/components/common/messagebox/MessageBox';
import Group from '@/components/groups/group-page';
import Loading from '@/components/loading/Loading';
import { IGroup } from '@/db/models/groups/Group';
import { useGuilds } from '@/hooks/useGuilds';
import DashboardLayout from '@/layouts/DashboardLayout';

import { redirectIfAnonmyous } from '@/lib/redirects';
import apiService from '@/services/apis';

import { useEffect, useRef, useState } from 'react';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { errors } from '@/lib/errors';
import toaster from '@/lib/toaster';

const MySwal = withReactContent(Swal);

interface GroupPageProps {
  id: string;
};

const GroupPage: React.FC<GroupPageProps> = ({ id }) => {
  const [ group, setGroup ] = useState<IGroup | null>(null);
  const [ title, setTitle ] = useState('Loading group...');
  const [ error, setError ] = useState<string>('');

  const [ guilds ] = useGuilds();
  const targetGuild = useRef<string | null>(null);

  const fetchGroup = async () => {
    setGroup(null);
    setError('');

    try {
      const { group } = await apiService.groups.getGroup(id);
      setGroup(group);
      setTitle(group.name);
    } catch (err) {
      const message = err.response?.data?.error;
      setError(message || 'An error occurred while fetching the group.');
      setTitle('Error');
    }
  };

  useEffect(() => {
    fetchGroup();
  }, []);

  const updateTargetGuild = (guildId: string) => {
    targetGuild.current = guildId;
  };

  const addGuildToGroup = async (guildId: string): Promise<IGroup> => {
    try {
      const { group } = await apiService.groups.addGuildToGroup(id, { guildId });
      toaster.success('Guild added to group successfully!');
      return group;
    } catch (err) {
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
              {guilds?.map(guild => (
                <option key={guild.id} value={guild.id}>{guild.name}</option>
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
    setGroup(group => {
      return {
        ...group,
        ...newGroup
      };
    });
  };

  return (
    <DashboardLayout title={title}>
      {group && (
        <Group
          group={group}
          setGroup={setGroup}
          onAddGuildClick={handleAddGuildActionClick}
        />
      )}

      {!group && !error && <Loading />}
      {!group && error && <MessageBox level={MessageBoxLevel.DANGER}>{error}</MessageBox>}
    </DashboardLayout>
  );
};

export const getServerSideProps = async ({ req, res, query }) => {
  await redirectIfAnonmyous(req, res);
  const { id } = query;

  return {
    props: {
      id
    }
  };
};

export default GroupPage;
