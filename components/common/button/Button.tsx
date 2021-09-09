import clsx from 'clsx';
import { ButtonHTMLAttributes, DetailedHTMLProps, forwardRef } from 'react';

export enum ButtonSize {
  SMALL,
  MEDIUM,
  LARGE
};

export interface ButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  size?: ButtonSize;
};

const Button = ({ size, ...props }: ButtonProps, ref) => {
  const finalSize = size ?? ButtonSize.MEDIUM;

  const buttonClasses = clsx(
    'bg-accent',
    'hover:bg-accent-hover',
    'disabled:bg-ayame-primary-600',
    'text-white',
    'font-bold',
    'cursor-pointer',
    'rounded-md',
    'outline-none',

    {
      'px-6 py-2': finalSize === ButtonSize.SMALL,
      'text-sm': finalSize === ButtonSize.SMALL,

      'px-8 py-3': finalSize === ButtonSize.MEDIUM,
      'text-base': finalSize === ButtonSize.MEDIUM,

      'px-10 py-5': finalSize === ButtonSize.LARGE,
      'text-lg': finalSize === ButtonSize.LARGE
    },

    props.className
  );

  return (
    <button ref={ref} {...props} className={buttonClasses}>
      { props.children }
    </button>
  );
};

export default forwardRef(Button);
