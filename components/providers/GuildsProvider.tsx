import { useUserGuildsState, GuildContext } from '@/hooks/useGuilds';

export const GuildsProvider = ({ children }) => {
  const [guilds, setGuilds, errored] = useUserGuildsState();

  return (
    <GuildContext.Provider value={[guilds, setGuilds, errored]}>
      {children}
    </GuildContext.Provider>
  );
};
