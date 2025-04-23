import { getServerAuthSession } from "@/lib/auth"
import { IdeaForm } from "@/components/IdeaForm"
import { redirect } from "next/navigation"

export default async function BoiteDesIdeesPage() {
  const session = await getServerAuthSession()

  // If no session, redirect to the login page
  if (!session) {
    redirect("/auth/login")
  }

  return (
    <>
      <main className="container mx-auto px-4 py-12 max-w-3xl">
    
        <IdeaForm />
      </main>
     
    </>
  )
}
