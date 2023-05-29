import Modal from '@/app/components/Modal';
import { User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import createConversation from '../actions/createConversationAction';
import { toast } from 'react-hot-toast';
import Input from '@/app/components/inputs/Input';
import Select from '@/app/components/inputs/Select';
import Button from '@/app/components/Button';

interface GroupChatModalProps {
  users: User[]
  isOpen: boolean
  onClose(): void
}


interface GroupFields {
  name: string
  members: { value: string, label: string }[]
}
const GroupChatModal: FC<GroupChatModalProps> = ({
  isOpen,
  users,
  onClose
}) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {
      errors
    }
  } = useForm<GroupFields>({
    defaultValues: {
      name: '',
      members: []
    }
  })

  const members = watch('members')

  const onSubmit: SubmitHandler<GroupFields> = data => {
    setLoading(true)
    createConversation(data).then(() => {
      router.refresh()
      onClose()
    })
      .catch(err => toast.error(err + ''))
      .finally(() => {
        setLoading(false)
      })
  }

  return (<Modal isOpen={isOpen} onClose={onClose}>
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-2">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Create a group chat
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Create a chat with more than 2 people
          </p>
          <div className="mt-10 flex flex-col gap-y-8">
            <Input
              register={register}
              label='Name'
              id="name"
              disabled={loading}
              required
              errors={errors}
            />
            <Select
              disabled={loading}
              label="Member"
              options={users.map(user => ({
                value: user.id,
                label: user.name || ''
              }))}
              onChange={value => setValue('members', value, {
                shouldValidate: true
              })}
              value={members}
            />
          </div>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <Button disabled={loading} onClick={onClose} type="button" secondary>Cancel</Button>
        <Button disabled={loading} type='submit'>Create</Button>
      </div>
    </form>
  </Modal>);
}

export default GroupChatModal;
