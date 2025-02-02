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
      className="text-red-500 border-2 border-red-500 px-6 py-2 rounded-md hover:bg-red-50 transition-all flex items-center gap-2 font-medium"
    >
      <span>→</span>
      Log Out
    </button>
  );
};

export default Signout;