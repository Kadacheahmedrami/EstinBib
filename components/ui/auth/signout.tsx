"use client";
import { signOut } from "next-auth/react";
const Signout = () => {
  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  return (
    <button
      onClick={handleSignOut}
      className="text-[#F1413E] border-2 w-full md:w-auto justify-center text-[20px] border-[#F1413E] px-6 py-2 rounded-md hover:bg-[#F1413E] hover:text-white transition-all flex items-center gap-2 font-medium"
    >
      <span>→</span>
      Log Out
    </button>
  );
};

export default Signout;
