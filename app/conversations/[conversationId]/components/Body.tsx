'use client'
import { FC, useEffect, useRef, useState } from 'react';
import { Message } from '../actions/getMessages';
import useConversation from '@/app/hooks/useConversation';
import MessageBox from './MessageBox';
import seenAction from '../actions/seenAction';
import { toast } from 'react-hot-toast';
import { pusherClient } from '@/app/libs/Pusher';
import { SendMessage } from '../actions/sendMessageAction';
import { find } from 'lodash';

interface BodyProps {
  initialMessages?: Message[]
}

const Body: FC<BodyProps> = ({ initialMessages = [] }) => {
  const [messages, setMessages] = useState(initialMessages);

  const bottomRef = useRef<HTMLDivElement>(null)
  const { conversationId } = useConversation()

  useEffect(() => {
    seenAction({
      conversationId
    }).catch(err => toast.error(err + ''))
  }, [conversationId])


  useEffect(() => {
    pusherClient.subscribe(conversationId)
    bottomRef.current?.scrollIntoView()

    function messageHandler(message: SendMessage) {
      seenAction({
        conversationId
      }).catch(err => toast.error(err + ''))
      setMessages(current => {
        if (find(current, { id: message.id })) {
          return current
        }
        return [
          ...current,
          message
        ]
      })
      bottomRef.current?.scrollIntoView()
    }
    function updateMessageHandler(newMessage: SendMessage) {
      console.log("xxx-update", newMessage)
      setMessages(current => {
        return current.map(currentMessage => {
          if (currentMessage.id == newMessage.id) {
            return newMessage
          }
          return currentMessage
        })
      })
    }
    pusherClient.bind('messages:new', messageHandler)
    pusherClient.bind('message:update', updateMessageHandler)
    return () => {
      pusherClient.unsubscribe(conversationId)
      pusherClient.unbind('messages:new', messageHandler)
      pusherClient.unbind('message:update', updateMessageHandler)
    }
  }, [conversationId])
  return (<div className='flex-1 overflow-y-auto'>
    {messages?.map((message, i) => {
      return <MessageBox
        key={message.id}
        data={message}
        isLast={i == messages.length - 1}
      />
    })}
    <div ref={bottomRef} className="pt-24" />
  </div>);
}

export default Body;
