import { IGroup } from '@/db/models/groups/Group';
import toaster from '@/lib/toaster';
import apiService from '@/services/apis';

import { createContext, useContext, useEffect, useState } from 'react';
import { useCurrentUser } from './useCurrentUser';

export interface IUserGroups {
  groups: IGroup[] | null;
  setGroups: (groups: IGroup[]) => void;
  reloadGroups: () => Promise<void>;
  errored: boolean;
};

export const GroupContext = createContext<IUserGroups>({
  groups: null,
  setGroups: (_) => void 0,
  reloadGroups: () => Promise.resolve(void 0),
  errored: false,
});

export const useUserGroupsState = (): IUserGroups => {
  const [ groups, setGroups ] = useState<IGroup[] | null>(null);
  const [ errored, setErrored ] = useState(false);
  const [ currentUser ] = useCurrentUser();

  const fetchGroups = async () => {
    if (!currentUser) {
      return;
    }

    try {
      setErrored(false);
      const res = await apiService.groups.getGroups();
      const groups = res.ok ? res.groups : null;
      setGroups(groups);
    } catch (err) {
      setErrored(true);
      setGroups(null);
      toaster.danger('Failed to fetch your groups.');
    }
  };

  useEffect(() => {
    if (groups !== null) {
      return;
    }

    fetchGroups();
  }, []);

  useEffect(() => {
    if (currentUser && groups === null) {
      fetchGroups();
    }
  }, [ currentUser ]);

  const reloadGroups = async () => {
    await fetchGroups();
  };

  return { groups, setGroups, errored, reloadGroups };
};

export const useUserGroups = () => useContext(GroupContext);
