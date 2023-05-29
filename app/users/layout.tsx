import type { FC } from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import getUsers from '../actions/getUsers';
import UserList from './components/UserList';

interface LayoutProps {
  children: React.ReactNode
}

const Layout = async ({ children }: LayoutProps) => {
  const users = await getUsers()
  return (
    //@ts-expect-error Server Component
    <Sidebar>
      <div className='h-full'>
        <UserList items={users} />
        {children}
      </div>
    </Sidebar>);
}

export default Layout;
