'use client';
import type { FC } from 'react';
import EmptyState from '../components/EmptyState';

interface UserProps { }

const User: FC<UserProps> = () => {
  return (<div className='hidden lg:block lg:pl-80 h-full'>
    <EmptyState />
  </div>);
}

export default User;
