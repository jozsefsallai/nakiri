import clsx from 'clsx';
import { HTMLProps, forwardRef } from 'react';
import Button from '../button/Button';

export interface BoxProps extends HTMLProps<HTMLDivElement> {
  title?: string;
  buttonText?: string;
  onButtonClick?();
};

const Box = ({ title, buttonText, onButtonClick, ...props }: BoxProps, ref) => {
  const classNames = clsx(
    'px-8 py-5 bg-white shadow-sm rounded-md mb-5',
    props.className
  );

  return (
    <section {...props} className={classNames}>
      {title && (
        <div className="flex items-center justify-between">
          <h1 className="text-2xl">{title}</h1>
          {buttonText && onButtonClick && <Button onClick={onButtonClick}>{buttonText}</Button>}
        </div>
      )}
      {props.children}
    </section>
  );
};

export default forwardRef(Box);
