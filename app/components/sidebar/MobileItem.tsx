import clsx from 'clsx';
import Link from 'next/link';
import type { FC } from 'react';
import { IconType } from 'react-icons';

interface MobileItemProps {
  href: string
  label: string
  icon: IconType,
  active?: boolean,
  onClick?(): void
}

const MobileItem: FC<MobileItemProps> = ({
  href, label,
  icon: Icon,
  active,
  onClick
}) => {
  return (<Link href={href} onClick={onClick} className={clsx(
    "group flex gap-x-3 text-sm leading-6 font-semibold w-full justify-center p-4 text-gray-500 hover:text-black hover:bg-gray-100",
    active && "bg-gray-100 text-black"
  )}>
    <Icon className='w-6 h-6' />
  </Link>);
}

export default MobileItem;
