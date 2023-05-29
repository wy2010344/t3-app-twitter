'use client'
import useConversation from '@/app/hooks/useConversation';
import type { FC } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import sendMessageAction from '../actions/sendMessageAction';
import { HiPaperAirplane, HiPhoto } from 'react-icons/hi2';
import MessageInput from './MessageInput';
import { CldUploadButton } from 'next-cloudinary';

interface FormProps { }

const Form: FC<FormProps> = () => {
  const { conversationId } = useConversation()
  const {
    register,
    handleSubmit,
    setValue,
    formState: {
      errors
    }
  } = useForm<FieldValues>({
    defaultValues: {
      message: ''
    }
  })

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setValue('message', '', {
      shouldValidate: true
    })
    sendMessageAction({
      message: data.message,
      conversationId,
      image: ''
    })
  }
  return (<div className='py-4 px-4 bg-white border-t flex items-center gap-2 lg:gap-4 w-full'>
    <CldUploadButton options={{ maxFiles: 1 }} uploadPreset='cqsb9fdu' onUpload={(result: any) => {
      sendMessageAction({
        message: '',
        conversationId,
        image: result.info.secure_url
      })
    }}>
      <HiPhoto size={30} className='text-sky-500' />
    </CldUploadButton>
    <form onSubmit={handleSubmit(onSubmit)} className='flex items-center gap-2 lg:gap-4 w-full'>
      <MessageInput
        id="message"
        register={register}
        errors={errors}
        required
        placeholder="Write a message"
      />
      <button type="submit" className='rounded-full p-2 bg-sky-500 cursor-pointer hover:bg-sky-600 transition'>
        <HiPaperAirplane size={18} className='text-white' />
      </button>
    </form>
  </div>);
}

export default Form;
