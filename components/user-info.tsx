"use client"
import React, { useState } from 'react';
import { CircleUserRound } from 'lucide-react';

const UserInfo = () => {
  const [formData, setFormData] = useState({
    fullName: 'FELIACHI ayaahlam',
    userId: '123456789',
    email: 'a_filiachi@estin.dz'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="  p-4 sm:p-8 bg-white">
      <div className="flex flex-col  lg:flex-row justify-center items-center gap-8 lg:gap-12 max-w-7xl mx-auto">
        {/* Profile Section */}
        <div className="flex flex-col items-center text-center w-full lg:w-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 sm:mb-8">My Account</h1>
          <div className="relative group">
            <CircleUserRound className="w-48 h-48 sm:w-80 sm:h-80 text-slate-600 transition-colors group-hover:text-slate-700" />
            <button className="mt-4 text-slate-600 underline text-sm hover:text-slate-800 transition-colors">
              Change profile picture
            </button>
          </div>
        </div>

        {/* Form Section */}
        <div className="w-full max-w-2xl space-y-6 sm:space-y-8">
          <div className="space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8">
              <label className="text-slate-900 text-xl sm:text-2xl font-bold w-full sm:w-48 shrink-0">
                Full Name :
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full bg-slate-100 p-3 rounded-md border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8">
              <label className="text-slate-900 text-xl sm:text-2xl font-bold w-full sm:w-48 shrink-0">
                User s ID :
              </label>
              <input
                type="text"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                className="w-full bg-slate-100 p-3 rounded-md border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
                readOnly
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8">
              <label className="text-slate-900 text-xl sm:text-2xl font-bold w-full sm:w-48 shrink-0">
                Email Address :
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-slate-100 p-3 rounded-md border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button className="text-red-500 border-2 border-red-500 px-6 py-2 rounded-md hover:bg-red-50 transition-all flex items-center gap-2 font-medium">
              <span>→</span>
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;