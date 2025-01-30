import  UserInfo  from "@/components/user-info"
import  BorrowedBooks  from "@/components/borrowed-books"
import BorrowHistory  from "@/components/borrow-history"

export default function Profile() {
  return (
    <main className=" ">
      <div className="flex w-full flex-col">
        <UserInfo  />
        <div className="md:col-span-2 space-y-8">
        <div className='w-full flex justify-center items-center gap-[70px] flex-row' >
        <h3 className='font-bold text-[30px]'>My Borrowed Books :</h3>
        <div className='bg-black mt-2 h-[2px] w-[70%]' ></div>
      </div>
          <BorrowedBooks key={1}/>

          <div className='w-full flex justify-center items-center gap-[70px] flex-row' >
        <h3 className='font-bold text-[30px]'>My Borrow History</h3>
        <div className='bg-black mt-2 h-[2px] w-[70%]' ></div>
      </div>
          <BorrowHistory key={2} />
        </div>
      </div>
    </main>
  )
}