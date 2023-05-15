import { FC, useEffect, useRef, useState } from 'react';
import Button from './Button';
import { useSession } from 'next-auth/react';
import ProfileImage from './ProfileImage';
import { api } from '~/utils/api';

interface NewTweetFormProps { }

function updateTextAreaSize(textarea?: HTMLTextAreaElement) {
  if (!textarea) return
  textarea.style.height = "0"
  textarea.style.height = `${textarea.scrollHeight}px`
}
const NewTweetForm: FC<NewTweetFormProps> = () => {
  const session = useSession()
  console.log('session', session)
  if (session.status != 'authenticated') return <></>
  return <Form />
}

function Form() {
  const session = useSession()
  const [inputValue, setInputValue] = useState('');
  const areaRef = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    updateTextAreaSize(areaRef.current!)
  }, [inputValue])
  const createTweet = api.tweet.create.useMutation({
    onSuccess(data, variables, context) {
      console.log(data)
      setInputValue('')
    },
  })

  if (session.status != 'authenticated') return <></>
  return (<form className='flex flex-col gap-2 border-b px-4 py-2' onSubmit={e => {
    e.preventDefault()
    createTweet.mutate({
      content: inputValue
    })
  }}>
    <div className='flex gap-4'>
      <ProfileImage src={session.data.user.image} />
      <textarea ref={areaRef} className='flex-grow resize-none overflow-hidden p-4 text-lg outline-none'
        style={{ height: 0 }}
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        placeholder="What's happen?" />
    </div>
    <Button className='self-end'>New Tweet</Button>
  </form>);
}

export default NewTweetForm;
