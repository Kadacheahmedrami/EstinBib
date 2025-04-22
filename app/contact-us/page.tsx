import { getServerAuthSession } from "@/lib/auth"
import { ContactForm } from '@/components/ContactForm'
import { redirect } from 'next/navigation'
import Footer from '@/components/Footer'
export default async function BookSuggestionForm() {
  const session = await getServerAuthSession()

  // If no session, redirect to the login page
  if (!session) {
    redirect('/auth/login') // You can replace this with your desired redirect path
  }

  return (
    <>
    <main>
    <ContactForm />
    </main>
      <Footer />
    </>
  )
}
