import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { signOut } from 'next-auth/client';

import NavigationItem, { NavigationItemProps } from './Navigationitem';

const TheHeader = () => {
  const [ currentUser, _ ] = useCurrentUser();

  const navigationItems: NavigationItemProps[] = [
    { url: '/manage/guilds', label: 'My Guilds' },
    { url: '/manage/videos', label: 'Videos' },
    { url: '/manage/channels', label: 'Channels' },
    { url: '/manage/patterns', label: 'Link patterns' }
  ];

  if (currentUser?.canManageAuthorizedUsers()) {
    navigationItems.push({
      url: '/manage/users',
      label: 'Users'
    });
  }

  const router = useRouter();

  const isActive = (url: string): boolean => {
    return router.pathname.startsWith(url);
  };

  return (
    <header className="bg-white p-2 py-4 shadow-sm">
      <div className="container flex items-center justify-between">
        <Link href="/manage/guilds">
          <a className="text-2xl font-bold text-ayame-primary hover:text-ayame-primary">
            NakiriAPI
          </a>
        </Link>

        {currentUser && <div className="flex items-center gap-3">
          <nav>
            {navigationItems.map((item, idx) => (
              <NavigationItem key={idx} {...item} active={isActive(item.url)} />
            ))}
          </nav>

          <div className="text-xs text-gray">
            {currentUser.name}#{currentUser.discriminator}

            <div
              className="inline-block px-3 py-2 rounded-md text-white bg-ayame-primary hover:bg-ayame-primary-900 cursor-pointer ml-3"
              onClick={() => signOut()}
            >
              Log out
            </div>
          </div>
        </div>}
      </div>
    </header>
  );
};

export default TheHeader;
