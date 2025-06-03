import { getServerAuthSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import SNDLRequestForm from "@/components/sndl"

export default async function SNDLRequestPage() {
  const session = await getServerAuthSession()

  if (!session) {
    redirect("/auth/login")
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <SNDLRequestForm />
    </div>
  )
}
