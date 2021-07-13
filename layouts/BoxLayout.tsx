import { ReactNode } from 'react';

const BoxLayout = ({ children }: { children: ReactNode }) => {
  return (
    <section className="flex min-h-screen items-center justify-center">
      <div className="px-6 py-4 w-full max-w-4xl bg-white shadow-md rounded-md">
        {children}
      </div>
    </section>
  );
};

export default BoxLayout;
