import { useParams } from "next/navigation";
import { useMemo } from "react";


/**
 * 获得当前路径中的对话ID
 * @returns 
 */
export default function useConversation() {
  const params = useParams()
  return useMemo(() => {
    let conversationId = (params?.conversationId || '') as string
    const isOpen = !!conversationId
    return {
      isOpen,
      conversationId
    }
  }, [params?.conversationId])
}