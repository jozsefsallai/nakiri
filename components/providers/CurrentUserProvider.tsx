import { useCurrentUserState, UserContext } from '@/hooks/useCurrentUser';

export const UserProvider = ({ children }) => {
  const [ currentUser, setCurrentUser ] = useCurrentUserState();

  return (
    <UserContext.Provider value={[ currentUser, setCurrentUser ]}>
      {children}
    </UserContext.Provider>
  );
};
