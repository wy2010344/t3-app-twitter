'use client'

import { FC, useEffect, useState } from 'react';
import { Conversation } from '../actions/getConversations';
import { useRouter } from 'next/navigation';
import useConversation from '@/app/hooks/useConversation';
import clsx from 'clsx';
import { MdOutlineGroupAdd } from 'react-icons/md'
import ConverationBox from './ConversationBox';
import GroupChatModal from './GroupChatModal';
import { User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { pusherClient } from '@/app/libs/Pusher';
import { find } from 'lodash';

interface ConversationListProps {
  initialItems: Conversation[]
  users: User[]
}

const ConversationList: FC<ConversationListProps> = ({ initialItems, users }) => {
  const [items, setItems] = useState(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter()
  const { conversationId, isOpen } = useConversation()

  const email = useSession().data?.user?.email

  useEffect(() => {
    if (!email) {
      return
    }
    function newHandler(conversation: Conversation) {
      setItems(current => {
        if (find(current, { id: conversation.id })) {
          return current
        }
        return [
          conversation,
          ...current
        ]
      })
    }

    function updateHandler(conversation: Conversation) {
      setItems(current => {
        return current.map(currentConversation => {
          if (currentConversation.id == conversation.id) {
            return {
              ...currentConversation,
              messages: conversation.messages
            }
          }
          return currentConversation
        })
      })
    }
    function removeHander(conversation: Conversation) {

      setItems(current => {
        return current.filter(currentConversation => {
          return currentConversation.id != conversation.id
        })
      })
      if (conversationId == conversation.id) {
        router.push('/conversations')
      }
    }
    pusherClient.subscribe(email)
    pusherClient.bind('conversation:new', newHandler)
    pusherClient.bind('conversation:update', updateHandler)
    pusherClient.bind('conversation:remove', removeHander)
    return () => {
      pusherClient.unsubscribe(email)
      pusherClient.unbind('conversation:new', newHandler)
      pusherClient.unbind('conversation:update', updateHandler)
      pusherClient.unbind('conversation:remove', removeHander)
    }

  }, [email, conversationId, router])
  return (<>
    <GroupChatModal
      users={users}
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
    />
    <aside className={clsx(
      'fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200',
      isOpen ? 'hidden' : 'block w-full left-0'
    )}>
      <div className="px-5">
        <div className="flex justify-between mb-4 pt-4">
          <div className="text-2xl font-bold text-neutral-800">
            Message
          </div>
          <div className='rounded-full p-2 bg-gray-100 text-gray-600 cursor-pointer hover:opacity-75 transition' onClick={() => setIsModalOpen(true)}>
            <MdOutlineGroupAdd size={20} />
          </div>
        </div>
        {items.map(item => {
          return <ConverationBox key={item.id} data={item} selected={conversationId == item.id} />
        })}
      </div>
    </aside>
  </>);
}

export default ConversationList;
