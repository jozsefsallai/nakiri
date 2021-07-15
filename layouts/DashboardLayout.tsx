import { ReactNode } from 'react';

import TheHeader from '@/components/common/the-header/TheHeader';
import Box from '@/components/common/box/Box';

export interface DashboardLayoutProps {
  children: ReactNode;
  hasContainer?: boolean;
  title?: string;
};

const DashboardLayout = ({ children, hasContainer, title }: DashboardLayoutProps) => {
  return (
    <section>
      <TheHeader />

      <div className="container py-10">
        {!hasContainer && children}
        {hasContainer && <Box title={title}>{children}</Box>}
      </div>

      <footer className="p-4 text-center text-xs">
        <a href="/docs" target="_blank" className="text-gray hover:text-black">API docs</a>
      </footer>
    </section>
  );
};

export default DashboardLayout;
