import { redirect } from "next/navigation"
import UserInfo from "@/components/pages/Profile/user-info"
import BorrowedBooks from "@/components/pages/Profile/Borrowed-Books"
import BorrowHistory from "@/components/pages/Profile/Borrow-History"
import { getServerAuthSession } from "@/lib/auth"
import { borrowsHistory, getActiveBorrows } from "@/app/actions/user"

export default async function Profile() {
  const session = await getServerAuthSession()

  if (!session) {
    redirect("/auth/login")
  }
  const borrowHistory = await borrowsHistory()
  const activeBorrows = await getActiveBorrows()

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        {/* My Account Section */}
        <div className="w-full flex md:flex-row flex-col justify-start items-center md:gap-[20px] mb-8">
          <h3 className="font-bold px-4 text-[24px] lg:text-[30px] text-gray-900">My Account :</h3>
          <div className="bg-gray-300 mt-2 h-[3px] rounded-full w-full md:w-[75%]"></div>
        </div>

        <UserInfo />

        <div className="w-full flex flex-col justify-start items-center md:gap-[20px] mt-12">
          {/* Borrowed Books Section */}
          <div className="w-full flex px-4 md:flex-row flex-col justify-start items-center md:gap-[20px] mb-8">
            <h3 className="font-bold text-[24px] lg:text-[30px] text-gray-900">My Borrowed Books :</h3>
            <div className="bg-gray-300 mt-2 h-[3px] rounded-full w-full md:w-[75%]"></div>
          </div>
          <BorrowedBooks books={activeBorrows} />

          {/* Borrow History Section */}
          <div className="w-full px-4 flex md:flex-row flex-col justify-start items-center md:gap-[20px] mt-12 mb-8">
            <h3 className="font-bold text-[24px] lg:text-[30px] text-gray-900">My Borrow History</h3>
            <div className="bg-gray-300 mt-2 h-[3px] rounded-full w-full md:w-[75%]"></div>
          </div>
          <BorrowHistory books={borrowHistory} />
        </div>
      </div>
    </main>
  )
}
