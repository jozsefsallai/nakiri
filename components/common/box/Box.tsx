import clsx from 'clsx';
import { HTMLProps, forwardRef } from 'react';
import Button, { ButtonSize } from '../button/Button';

export interface BoxProps extends HTMLProps<HTMLDivElement> {
  title?: string;
  buttonText?: string;
  onButtonClick?();
};

const Box = ({ title, buttonText, onButtonClick, ...props }: BoxProps, ref) => {
  const classNames = clsx(
    'px-8 py-5 bg-nakiri-base-invert shadow-sm rounded-md mb-5',
    props.className
  );

  return (
    <section {...props} className={classNames}>
      {title && (
        <div className="lg:flex items-center justify-between">
          <h1 className="lg:text-2xl text-xl">{title}</h1>
          {buttonText && onButtonClick && <Button onClick={onButtonClick} className="hidden lg:inline-block">{buttonText}</Button>}
          {buttonText && onButtonClick && <Button onClick={onButtonClick} size={ButtonSize.SMALL} className="block lg:hidden w-full">{buttonText}</Button>}
        </div>
      )}
      {props.children}
    </section>
  );
};

export default forwardRef(Box);
