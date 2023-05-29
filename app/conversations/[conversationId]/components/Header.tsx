"use client"
import { FC, useMemo, useState } from 'react';
import { ConversationById } from '../actions/getConversationById';
import useOtherUser from '@/app/hooks/useOtherUser';
import Link from 'next/link';
import { HiChevronLeft, HiEllipsisHorizontal } from 'react-icons/hi2';
import Avatar from '@/app/components/Avatar';
import ProfileDrawer from './ProfileDrawer';
import AvatarGroup from '@/app/components/AvatarGroup';
import useActiveList from '@/app/hooks/useActiveList';

interface HeaderProps {
  conversation: ConversationById
}

const Header: FC<HeaderProps> = ({
  conversation
}) => {
  const otherUser = useOtherUser(conversation)

  const [drawerOpen, setDrawerOpen] = useState(false);
  const { members } = useActiveList()
  const statusText = useMemo(() => {
    if (conversation?.isGroup) {
      return `${conversation.users.length} members`
    }
    return members.includes(otherUser[0].email || '') ? 'Active' : 'offline'
  }, [conversation, members, otherUser])


  let name = conversation?.name
  if (otherUser.length == 1) {
    name = otherUser[0].name
  }
  return (<>
    <ProfileDrawer
      data={conversation}
      isOpen={drawerOpen}
      onClose={() => setDrawerOpen(false)}
    />
    <div className='bg-white w-full flex border-b-[1px] sm:px-4 py-3 px-4 lg:px-6 justify-between items-center shadow-sm'>
      <div className="flex gap-3 items-center">
        <Link href="/conversations" className='lg:hidden block text-sky-500 hover:text-sky-600 transition cursor-pointer'>
          <HiChevronLeft size={32} />
        </Link>
        {conversation.isGroup ? <AvatarGroup
          users={conversation.users}
        /> : <Avatar user={otherUser[0]} />}
        <div className="flex flex-col">
          <div>
            {name}
          </div>
          <div className="text-sm font-light text-neutral-500">
            {statusText}
          </div>
        </div>
      </div>
      <HiEllipsisHorizontal size={32} className='text-sky-500 cursor-pointer hover:text-sky-600 transition' onClick={() => {
        setDrawerOpen(true)
      }} />
    </div>
  </>);
}

export default Header;
