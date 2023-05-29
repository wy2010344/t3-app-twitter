import settingsAction from '@/app/actions/settingsAction';
import { User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import Modal from '../Modal';
import Input from '../inputs/Input';
import Image from 'next/image';
import { CldUploadButton } from 'next-cloudinary';
import Button from '../Button';

interface SettingsModalProps {

  currentUser: User | null
  isOpen: boolean
  onClose(): void
}

const SettingsModal: FC<SettingsModalProps> = ({
  currentUser,
  isOpen,
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
  } = useForm<FieldValues>({
    defaultValues: {
      name: currentUser?.name,
      image: currentUser?.image
    }
  })

  const image = watch('image')

  function handleUpload(result: any) {
    setValue('image', result?.info?.secure_url, {
      shouldValidate: true
    })
  }

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setLoading(true)
    settingsAction({
      name: data.name!,
      image: data.image
    }).then(() => {
      router.refresh()
      onClose()
    }).catch(err => {
      toast.error(err + '')
    }).finally(() => {
      setLoading(false)
    })
  }

  return (<Modal isOpen={isOpen} onClose={onClose}>
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Profile
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Edit your public information.
          </p>
          <div className="mt-10 flex flex-col gap-y-8">
            <Input
              disabled={loading}
              label='Name'
              id="name"
              errors={errors}
              required
              register={register}
            />
            <div>
              <label htmlFor='photo' className="block text-sm font-medium leading-6 text-gray-900">
                Photo
              </label>
              <div className="mt-2 flex items-center gap-x-3">
                <Image width={48} height={48} className='rounded-full' src={image || currentUser?.image || '/images/placeholder.jpg'}
                  alt='Avatar' />
                <CldUploadButton options={{ maxFiles: 1 }} onUpload={handleUpload} uploadPreset='cqsb9fdu'>
                  <Button disabled={loading} secondary type='button'>
                    Change
                  </Button>
                </CldUploadButton>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <Button disabled={loading} secondary onClick={onClose}>Cancel</Button>
          <Button disabled={loading} type="submit">Save</Button>
        </div>
      </div>
    </form>
  </Modal>);
}

export default SettingsModal;