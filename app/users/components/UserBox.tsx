import Avatar from '@/app/components/Avatar';
import { User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';
import getConversation from '../actions/getConversation';
import { toast } from 'react-hot-toast';
import LoadingModal from '@/app/components/LoadingModal';

interface UserBoxProps {
  data: User
}

const UserBox: FC<UserBoxProps> = ({ data }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false);
  return (<>
    {loading && <LoadingModal />}
    <div className='w-full relative flex items-center space-x-3 bg-white p-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer'
      onClick={() => {
        setLoading(true)
        getConversation({
          userId: data.id
        }).then(data => {
          router.push(`/conversations/${data.id}`)
        }).catch(err => {
          console.error(err)
          toast(err + '')
        }).finally(() => {
          setLoading(false)
        })
      }}>
      <Avatar user={data} />
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm font-medium text-gray-900">{data.name}</p>
          </div>
        </div>
      </div>
    </div>
  </>);
}

export default UserBox;
