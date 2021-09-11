import { useUserGroupsState, GroupContext } from '@/hooks/useGroups';

export const GroupsProvider = ({ children }) => {
  const { groups, setGroups, errored, reloadGroups } = useUserGroupsState();

  return (
    <GroupContext.Provider value={{ groups, setGroups, errored, reloadGroups }}>
      {children}
    </GroupContext.Provider>
  );
};
