'use client'
// components/PasswordRecoveryForm.tsx
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { Mail, AlertCircle, CheckCircle } from 'lucide-react';

const PasswordRecoveryForm = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false); // State to track successful submission
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your registered email address");
      return;
    }

    // Simulate a successful password recovery request
    try {
      // Here you would typically make an API call to your backend
      // For demonstration purposes, we'll assume the request is successful
      setSuccess(true);
      setError(null);
    } catch (err) {
      setError("Failed to send recovery email. Please try again.");
      console.log(err)
      setSuccess(false);
    }
  };

  return (
    <>
      {error && (
        <div className="mb-6 bg-red-50 text-red-700 p-4  rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-lg flex items-center">
          <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          <p className="text-sm">A password recovery email has been sent to {email}. Please check your inbox.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
        <div className="space-y-4 w-full">
          <div>
            <div className="relative">
              <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                placeholder="example@estin.dz"
                className="w-full pl-10 pr-4 h-[58px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-[#F1413E] text-white py-3 rounded-[14px] font-medium hover:bg-[#D63936] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Recover Password
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => router.push("/login")}
          className="text-sm text-gray-600 hover:text-gray-800 focus:outline-none"
        >
          Return to Login
        </button>
      </div>
    </>
  );
};

export default PasswordRecoveryForm;