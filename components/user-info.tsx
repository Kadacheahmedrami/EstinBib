import { getUserInfo } from "@/app/actions/user";
import { CircleUserRound } from "lucide-react";
import Signout from "./signout";

const UserInfo = async () => {
  const info = await getUserInfo();

  return (
    <div className="p-4 sm:p-8 bg-white">
      <div className="flex flex-col lg:flex-row justify-center items-center gap-8 lg:gap-12 max-w-7xl mx-auto">
        {/* Profile Section */}
        <div className="flex flex-col items-center text-center w-full lg:w-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 sm:mb-8">
            My Account
          </h1>
          <div className="relative group">
            <CircleUserRound className="w-48 h-48 sm:w-80 sm:h-80 text-slate-600 transition-colors group-hover:text-slate-700" />
            <button className="mt-4 text-slate-600 underline text-sm hover:text-slate-800 transition-colors">
              Change profile picture
            </button>
          </div>
        </div>

        {/* Info Section */}
        <div className="w-full max-w-2xl space-y-6 sm:space-y-8">
          <div className="space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8">
              <label className="text-slate-900 text-xl sm:text-2xl font-bold w-full sm:w-48 shrink-0">
                Full Name :
              </label>
              <div className="w-full bg-slate-100 h-[50px] p-3 rounded-md border border-slate-200 text-slate-900">
                {info?.name}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8">
              <label className="text-slate-900 text-xl sm:text-2xl font-bold w-full sm:w-48 shrink-0">
                User s ID :
              </label>
              <div className="w-full bg-slate-100 h-[50px] p-3 rounded-md border border-slate-200 text-slate-900">
                {info?.id}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8">
              <label className="text-slate-900 text-xl sm:text-2xl font-bold w-full sm:w-48 shrink-0">
                Email Address :
              </label>
              <div className="w-full bg-slate-100 h-[50px] p-3 rounded-md border border-slate-200 text-slate-900">
                {info?.email}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Signout />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
