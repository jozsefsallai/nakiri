import clsx from 'clsx';
import Link from 'next/link';

export interface NavigationItemProps {
  url: string;
  label: string;
  active?: boolean;
}

const NavigationItem = ({ url, label, active }: NavigationItemProps) => {
  const classNames = clsx(
    'hover:text-white hover:bg-accent px-4 py-2 rounded-md text-sm mx-1 my-1 lg:my-0 block lg:inline-block',
    {
      'text-nakiri-base': !active,
      'text-white': active,
      'bg-accent': active,
    },
  );

  return (
    <Link href={url}>
      <a className={classNames}>{label}</a>
    </Link>
  );
};

export default NavigationItem;
