import { ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

import clsx from 'clsx';

export interface ColumnsProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children: ReactNode;
}

const Columns: React.FC<ColumnsProps> = ({ children, ...rest }) => {
  const classNames = clsx('md:flex', 'gap-6', rest.className);

  return (
    <section {...rest} className={classNames}>
      {children}
    </section>
  );
};

export default Columns;
