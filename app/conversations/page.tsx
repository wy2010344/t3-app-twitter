'use client';
import clsx from 'clsx';
import type { FC } from 'react';
import useConversation from '../hooks/useConversation';
import EmptyState from '../components/EmptyState';

interface PageProps { }

const Page: FC<PageProps> = () => {
  const { isOpen } = useConversation()
  return (<div className={clsx(
    "lg:pl-80 h-full lg:block",
    isOpen ? 'block' : 'hidden'
  )}>
    <EmptyState />
  </div>);
}

export default Page;
