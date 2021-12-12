import { ReactNode } from 'react';

import TheHeader from '@/components/common/the-header/TheHeader';
import Box from '@/components/common/box/Box';

import Head from 'next/head';
import ThemeSwitcher from '@/components/common/theme-switcher/ThemeSwitcher';

export interface DashboardLayoutProps {
  children: ReactNode;
  hasContainer?: boolean;
  title?: string;
  infoBox?: ReactNode;
  buttonText?: string;
  onButtonClick?();
}

const DashboardLayout = ({
  children,
  hasContainer,
  buttonText,
  onButtonClick,
  title,
  infoBox,
}: DashboardLayoutProps) => {
  return (
    <>
      <Head>
        <title>
          {title ? `${title} - NakiriAPI Panel` : 'NakiriAPI Panel'}
        </title>
      </Head>
      <section>
        <TheHeader />

        <div className="container py-10">
          {!hasContainer && children}
          {hasContainer && (
            <Box
              title={title}
              infoBox={infoBox}
              buttonText={buttonText}
              onButtonClick={onButtonClick}
            >
              {children}
            </Box>
          )}
        </div>

        <footer className="p-4 text-center text-xs">
          <div>
            <a
              href="/docs"
              target="_blank"
              className="text-gray hover:text-nakiri-base"
            >
              API docs
            </a>
          </div>

          <div className="flex justify-center py-4">
            <ThemeSwitcher />
          </div>
        </footer>
      </section>
    </>
  );
};

export default DashboardLayout;
