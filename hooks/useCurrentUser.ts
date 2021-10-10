import { User } from '@/lib/User';
import apiService from '@/services/apis';

import { createContext, useContext, useEffect, useState } from 'react';

export type ICurrentUser = [
  currentUser: User | null,
  setCurrentUser: (user: User) => void,
];

export const UserContext = createContext<ICurrentUser>([null, (_) => void 0]);

export const useCurrentUserState = (): ICurrentUser => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const fetchCurrentUser = async () => {
    try {
      const res = await apiService.users.getLoggedInUser();
      const user = res.ok ? new User(res.user) : null;
      setCurrentUser(user);
    } catch (err) {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    if (currentUser !== null) {
      return;
    }

    fetchCurrentUser();
  }, []);

  return [currentUser, setCurrentUser];
};

export const useCurrentUser = () => useContext(UserContext);
