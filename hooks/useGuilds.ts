import { IGuildWithKey } from '@/controllers/guilds/IGuild';
import toaster from '@/lib/toaster';
import apiService from '@/services/apis';

import { createContext, useContext, useEffect, useState } from 'react';
import { useCurrentUser } from './useCurrentUser';

export type IUserGuilds = [
  guilds: IGuildWithKey[] | null,
  setGuilds: (guilds: IGuildWithKey[]) => void,
  errored: boolean,
];

export const GuildContext = createContext<IUserGuilds>([ null, (_) => void 0, false ]);

export const useUserGuildsState = (): IUserGuilds => {
  const [ guilds, setGuilds ] = useState<IGuildWithKey[] | null>(null);
  const [ errored, setErrored ] = useState(false);
  const [ currentUser, _ ] = useCurrentUser();

  const fetchUserGuilds = async () => {
    if (!currentUser) {
      return;
    }

    try {
      setErrored(false);
      const res = await apiService.guilds.getGuilds(true);
      const guilds = res.ok ? res.guilds : null;
      setGuilds(guilds);
    } catch (err) {
      setErrored(true);
      setGuilds(null);
      toaster.danger('Failed to fetch your guilds. Please try logging out and back in.', 'Fatal error');
    }
  };

  useEffect(() => {
    if (guilds !== null) {
      return;
    }

    fetchUserGuilds();
  }, []);

  useEffect(() => {
    if (currentUser && guilds === null) {
      fetchUserGuilds();
    }
  }, [ currentUser ]);

  return [ guilds, setGuilds, errored ];
};

export const useGuilds = () => useContext(GuildContext);
