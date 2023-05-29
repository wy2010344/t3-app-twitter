import { useSession } from "next-auth/react";
import { Conversation } from "../conversations/actions/getConversations";
import { useMemo } from "react";
import { User } from "@prisma/client";

export default function useOtherUser(converation: {
  users: User[]
}) {
  const session = useSession()

  return useMemo(() => {
    const currentUserEmail = session.data?.user?.email
    return converation.users.filter(user => {
      return user.email != currentUserEmail
    })
  }, [session.data?.user?.email, converation?.users])
}