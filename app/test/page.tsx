import { getServerAuthSession } from "@/lib/auth"
const Page = async() => {
    const session = await getServerAuthSession()
  return (
    <div>
      hello {session?.user.email}
    </div>
  )
}

export default Page
