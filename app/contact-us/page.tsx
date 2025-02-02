import { getServerAuthSession } from "@/lib/auth"
import { ContactForm } from '@/components/contact-form/ContactForm'
import { redirect } from 'next/navigation'

export default async function BookSuggestionForm() {
  const session = await getServerAuthSession()

  // If no session, redirect to the login page
  if (!session) {
    redirect('/login') // You can replace this with your desired redirect path
  }

  return (
    <>
      <ContactForm />
    </>
  )
}
