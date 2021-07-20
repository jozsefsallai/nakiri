import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { signOut } from 'next-auth/client';

import NavigationItem, { NavigationItemProps } from './Navigationitem';
import { useState } from 'react';
import clsx from 'clsx';
import { Menu } from 'react-feather';

const TheHeader = () => {
  const [ currentUser, _ ] = useCurrentUser();

  const [ hamburgerOpen, setHamburgerOpen ] = useState(false);

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

  const toggleHamburger = () => setHamburgerOpen(hamburgerOpen => !hamburgerOpen);

  return (
    <header className="bg-white p-2 py-4 shadow-sm">
      <div className="container lg:flex items-center justify-between relative">
        <Link href="/manage/guilds">
          <a className="text-2xl font-bold text-ayame-primary hover:text-ayame-primary px-3 lg:px-0">
            NakiriAPI
          </a>
        </Link>

        {currentUser && <div className={clsx('lg:flex items-center gap-3 pt-3 lg:pt-0', {
          'block': hamburgerOpen,
          'hidden': !hamburgerOpen
        })}>
          <nav>
            {navigationItems.map((item, idx) => (
              <NavigationItem key={idx} {...item} active={isActive(item.url)} />
            ))}
          </nav>

          <div className="text-xs text-gray text-center">
            {currentUser.name}#{currentUser.discriminator}

            <div
              className="inline-block px-3 py-2 my-2 lg:my-0 rounded-md text-white bg-ayame-primary hover:bg-ayame-primary-900 cursor-pointer ml-3"
              onClick={() => signOut()}
            >
              Log out
            </div>
          </div>
        </div>}

        <div className="lg:hidden absolute right-0 top-0 py-1 px-3" onClick={toggleHamburger}>
          <Menu />
        </div>
      </div>
    </header>
  );
};

export default TheHeader;
