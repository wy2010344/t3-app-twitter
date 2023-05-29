"use client"
import useConversation from '@/app/hooks/useConversation';
import useRoutes from '@/app/hooks/useRoutes';
import type { FC } from 'react';
import MobileItem from './MobileItem';
import { User } from 'next-auth';

interface MobileFooterProps {
  currentUser: User | null
}

const MobileFooter: FC<MobileFooterProps> = () => {
  const routes = useRoutes()
  const { isOpen } = useConversation()
  if (isOpen) {
    return null
  }
  return (<div className='fixed justify-between w-full bottom-0 z-40 flex items-center bg-white border-t-[1px] lg:hidden'>
    {routes.map(router => {
      return <MobileItem key={router.label} {...router} />
    })}
  </div>);
}

export default MobileFooter;
