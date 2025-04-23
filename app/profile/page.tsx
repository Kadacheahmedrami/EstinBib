import { redirect } from "next/navigation";
import UserInfo from "@/components/pages/Profile/user-info";
import BorrowedBooks from "@/components/pages/Profile/Borrowed-Books"
import BorrowHistory from "@/components/pages/Profile/Borrow-History";
import { getServerAuthSession } from "@/lib/auth";
import { borrowsHistory, getActiveBorrows } from "@/app/actions/user";

export default async function Profile() {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/auth/login");
  }
  const borrowHistory = await borrowsHistory();
 
  const activeBorrows = await getActiveBorrows();
 
  return (
    <main >
         <div className="w-full flex md:flex-row flex-col  justifystart  items-center md:gap-[20px] ">
          <h3 className="font-bold   px-10  text-[24px] lg:text-[30px]">My Account :</h3>
          <div className="bg-black mt-2 h-[4px] opacity-20 rounded-full  w-full md:w-[75%]"></div>
        </div>
      <UserInfo />
      <div className="w-full flex flex-col   justifystart   items-center md:gap-[20px] ">
        <div className="w-full flex  px-10 md:flex-row flex-col justify-start mx-10 items-center md:gap-[20px] ">
          <h3 className="font-bold  text-[24px] lg:text-[30px]">My Borrowed Books :</h3>
          <div className="bg-black mt-2 h-[4px] opacity-20 rounded-full w-full md:w-[75%]"></div>
        </div>
        <BorrowedBooks key={1} books={activeBorrows}  />
 
        <div className="w-full   px-10 flex md:flex-row flex-col  justifystart md:mx-10  items-center md:gap-[20px] ">
          <h3 className="font-bold  text-[24px] lg:text-[30px]">My Borrow History</h3>
          <div className="bg-black mt-2 h-[4px] opacity-20 rounded-full w-full md:w-[75%]"></div>
        </div>
        <BorrowHistory key={2} books={borrowHistory} />
      </div>
    </main>
  );
}
