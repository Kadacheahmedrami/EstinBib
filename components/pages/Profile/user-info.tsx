import { getUserInfo } from "@/app/actions/user"
import { CircleUserRound } from "lucide-react"
import Signout from "../auth/signout"
import Image from "next/image"
const UserInfo = async () => {
  const info = await getUserInfo()

  return (
    <div className="max-w-7xl  mx-auto p-6 sm:p-8 bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="flex flex-col lg:flex-row justify-center items-center gap-8 lg:gap-16 max-w-7xl mx-auto">
        {/* Profile Section */}
        <div className="flex flex-col items-center text-center w-full lg:w-auto">
          <div className="relative group">
          {info?.image ? (
      <Image
      src={info.image}
      alt="Profile"
      fill
      className="object-cover"
      sizes="(max-width: 640px) 10rem, 15rem"
    />
) : (
  <CircleUserRound className="w-40 h-40 sm:w-60 sm:h-60 text-gray-400 transition-colors group-hover:text-gray-500" />
)}

          </div>
        </div>

        {/* Info Section */}
        <div className="w-full max-w-2xl space-y-6 sm:space-y-8">
          <div className="space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8">
              <label className="text-gray-900 text-lg sm:text-xl font-semibold w-full sm:w-48 shrink-0">
                Full Name :
              </label>
              <div className="w-full bg-gray-50 h-[50px] p-3 rounded-lg border border-gray-200 text-gray-900 flex items-center">
                {info?.name || "Not provided"}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8">
              <label className="text-gray-900 text-lg sm:text-xl font-semibold w-full sm:w-48 shrink-0">
                User ID :
              </label>
              <div className="w-full bg-gray-50 h-[50px] p-3 rounded-lg border border-gray-200 text-gray-900 flex items-center font-mono text-sm">
                {info?.id || "Not available"}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8">
              <label className="text-gray-900 text-lg sm:text-xl font-semibold w-full sm:w-48 shrink-0">
                Email Address :
              </label>
              <div className="w-full bg-gray-50 h-[50px] p-3 rounded-lg border border-gray-200 text-gray-900 flex items-center">
                {info?.email || "Not provided"}
              </div>
            </div>
          </div>

          {/* Sign-out Button */}
          <div className="flex justify-end pt-6">
            <Signout />
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserInfo
