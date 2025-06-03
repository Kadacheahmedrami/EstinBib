import type { Metadata } from "next"
import ChatPageClient from "@/components/ChatPageClient"

export const metadata: Metadata = {
  title: "Book Chat | Talk About Our Library",
  description: "Chat with our AI assistant about books in our library",
}


import { getServerAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";


export default async function ChatPage() {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/auth/login");
  }

  return <ChatPageClient />
}

 

