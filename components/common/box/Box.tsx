import clsx from 'clsx';
import { HTMLProps, forwardRef } from 'react';

export interface BoxProps extends HTMLProps<HTMLDivElement> {
  title?: string;
};

const Box = ({ title, ...props }: BoxProps, ref) => {
  const classNames = clsx(
    'px-8 py-5 bg-white shadow-sm rounded-md mb-5',
    props.className
  );

  return (
    <section className={classNames}>
      {title && <h1 className="text-2xl">{title}</h1>}
      {props.children}
    </section>
  );
};

export default forwardRef(Box);
