import type { FC } from 'react';
import { Conversation } from '../actions/getConversations';
import useOtherUser from '@/app/hooks/useOtherUser';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import Avatar from '@/app/components/Avatar';
import { format } from 'date-fns';
import AvatarGroup from '@/app/components/AvatarGroup';

interface ConverationBoxProps {
  data: Conversation
  selected: boolean
}

const ConverationBox: FC<ConverationBoxProps> = ({
  data,
  selected
}) => {
  const otherUser = useOtherUser(data)
  const session = useSession()
  const router = useRouter()


  const lastMessage = data.messages?.at(-1)
  const userEmail = session.data?.user?.email

  const hasSeend = userEmail && lastMessage?.seen.some(v => v.email == userEmail)

  const lastMessageText = lastMessage?.image
    ? 'Sent an image'
    : lastMessage?.body || 'Started a conversation'

  let name = data.name
  if (otherUser.length == 1) {
    name = otherUser[0].name
  }
  return (<div
    className={clsx(
      'w-full relative flex items-center space-x-3 hover:bg-netural-100 rounded-lg transition cursor-pointer p-3',
      selected ? 'bg-neutral-100' : 'bg-white'
    )}
    onClick={() => {
      router.push(`/conversations/${data.id}`)
    }}
  >
    {data.isGroup ? <AvatarGroup users={data.users} />
      : <Avatar user={otherUser[0]} />}

    <div className="min-w-0 flex-1">
      <div className="focus:outline-none">
        <div className="flex justify-between items-center mb-1">
          <p>
            {name}
          </p>
          {lastMessage?.createdAt && <p className='text-xs text-gray-400 font-light'>
            {format(new Date(lastMessage.createdAt), 'p')}
          </p>}
        </div>
        <p className={clsx(
          'truncate text-sm',
          hasSeend ? 'text-gray-500' : 'text-black font-medium'
        )}>{lastMessageText}</p>
      </div>
    </div>
  </div>);
}

export default ConverationBox;
