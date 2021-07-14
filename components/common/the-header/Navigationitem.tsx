import clsx from 'clsx';
import Link from 'next/link';

export interface NavigationItemProps {
  url: string;
  label: string;
  active?: boolean;
};

const NavigationItem = ({ url, label, active }: NavigationItemProps) => {
  const classNames = clsx(
    'hover:text-white hover:bg-ayame-primary px-4 py-2 rounded-md text-sm mx-1',
    {
      'text-black': !active,
      'text-white': active,
      'bg-ayame-primary': active
    }
  );

  return (
    <Link href={url}>
      <a className={classNames}>
        {label}
      </a>
    </Link>
  );
};

export default NavigationItem;
