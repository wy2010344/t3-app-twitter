import { useParams } from "next/navigation";
import { useMemo } from "react";



export default function useConversation() {
  const params = useParams()
  return useMemo(() => {
    let conversationId = params.conversationId || ''
    const isOpen = !!conversationId
    return {
      isOpen,
      conversationId
    }
  }, [params.conversationId])
}