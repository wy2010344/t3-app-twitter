import { Channel, Members } from "pusher-js"
import { useEffect, useState } from "react"
import { pusherClient } from "../libs/Pusher"
import useActiveList from "./useActiveList"

export default function useActiveChannel() {
  const { set, add, remove } = useActiveList()

  const [activeChannel, setActiveChannel] = useState<Channel>()

  useEffect(() => {
    let channel = activeChannel
    if (!channel) {
      channel = pusherClient.subscribe('presence-messenger')
      setActiveChannel(channel)
    }
    channel.bind('pusher:subscription_succeeded', function (members: Members) {
      const initialMembers: string[] = []
      members.each((member: Record<string, any>) => {
        initialMembers.push(member.id)
      })
      set(initialMembers)
    })
    channel.bind('pusher:member_added', (member: Record<string, any>) => {
      add(member.id)
    })
    channel.bind('pusher:member_removed', (member: Record<string, any>) => {
      remove(member.id)
    })
    return () => {
      if (activeChannel) {
        pusherClient.unsubscribe('presence-messenger')
        setActiveChannel(undefined)
      }
    }
  }, [activeChannel, set, add, remove])


}