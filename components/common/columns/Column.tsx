import { ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

import clsx from 'clsx';

export interface ColumnProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children?: ReactNode;
};

const Column: React.FC<ColumnProps> = ({ children, ...rest }) => {
  const classNames = clsx('flex-1', rest.className);

  return (
    <div {...rest} className={classNames}>
      {children}
    </div>
  );
};

export default Column;
