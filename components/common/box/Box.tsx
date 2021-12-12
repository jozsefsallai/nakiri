import clsx from 'clsx';
import { HTMLProps, forwardRef, ReactNode } from 'react';
import Button, { ButtonSize } from '../button/Button';
import InfoBox from '../infobox/InfoBox';

export interface BoxProps extends HTMLProps<HTMLDivElement> {
  title?: string;
  infoBox?: ReactNode;
  buttonText?: string;
  onButtonClick?();
}

const Box = (
  { title, infoBox, buttonText, onButtonClick, ...props }: BoxProps,
  ref,
) => {
  const classNames = clsx(
    'px-8 py-5 bg-nakiri-base-invert shadow-sm rounded-md mb-5',
    props.className,
  );

  return (
    <section {...props} className={classNames}>
      {title && (
        <div className="lg:flex items-center justify-between">
          <h1 className="lg:text-2xl text-xl">{title}</h1>
          {buttonText && onButtonClick && (
            <Button onClick={onButtonClick} className="hidden lg:inline-block">
              {buttonText}
            </Button>
          )}
          {buttonText && onButtonClick && (
            <Button
              onClick={onButtonClick}
              size={ButtonSize.SMALL}
              className="block lg:hidden w-full"
            >
              {buttonText}
            </Button>
          )}
        </div>
      )}

      {infoBox && <InfoBox>{infoBox}</InfoBox>}

      {props.children}
    </section>
  );
};

export default forwardRef(Box);
