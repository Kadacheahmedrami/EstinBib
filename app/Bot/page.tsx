import type { Metadata } from "next"
import ChatPageClient from "@/components/ChatPageClient"

export const metadata: Metadata = {
  title: "Book Chat | Talk About Our Library",
  description: "Chat with our AI assistant about books in our library",
}

export default function ChatPage() {
  return <ChatPageClient />
}
