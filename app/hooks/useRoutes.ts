"use client"
import { usePathname } from "next/navigation";
import useConversation from "./useConversation";
import { useMemo } from "react";
import { HiChat } from 'react-icons/hi'
import { signOut } from "next-auth/react";
import { HiUsers, HiArrowLeftOnRectangle } from 'react-icons/hi2'

export default function useRoutes() {
  const pathname = usePathname()
  const { conversationId, isOpen } = useConversation()

  const routes = useMemo(() => [
    {
      label: 'Chat',
      href: '/conversations',
      icon: HiChat,
      active: pathname == '/conversations' || isOpen
    },
    {
      label: "users",
      href: '/users',
      icon: HiUsers,
      active: pathname == '/users'
    },
    {
      label: 'Logout',
      href: "#",
      onClick() {
        signOut()
      },
      icon: HiArrowLeftOnRectangle
    }
  ], [pathname, conversationId])

  return routes
}