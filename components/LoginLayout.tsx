// components/LoginLayout.tsx

import Image from 'next/image';
// import { signIn } from "next-auth/react";
const LoginLayout = ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <div className="min-h-screen flex items-center  justify-center bg-gray-50 p-4">
      <div className="w-full max-w-[1100px] flex flex-col md:flex-row bg-white rounded-[30px] shadow-2xl overflow-hidden">
        {/* Left side - Image */}
        <div className="w-full md:w-2/5 lg:w-2/6 relative bg-blue-600 min-h-[200px] md:min-h-full">
          <div
            className="absolute inset-0 bg-gradient-to-br from-blue-[] to-blue-800/90"
            style={{
              backgroundImage: "url(/jpg/1.png)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </div>

        {/* Right side - Login Form */}
        <div className="w-full md:w-3/5 lg:w-4/6 px-4 py-8 md:p-16 min-h-[500px] md:min-h-0">
          <div className="w-full max-w-[400px] mx-auto h-full flex flex-col justify-center">
          <Image 
          src={"/svg/sstud.svg"}
          height={77}
          width={77}
          alt="estin"
          className="mx-auto"
        /> 
        <div className="text-center mb-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Welcome Back Student</h2>
          <p className=" text-gray-600">Please Login in to your estin email</p>
        </div>
            {children}

            <div className="flex flex-col space-y-6">
      <div className="mt-6 space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
          {/* onClick={() => signIn("google")}  */}
          <button  className="w-full flex items-center justify-center px-4 h-[48px]  border border-gray-300 rounded-[14px] hover:bg-gray-50 transition-colors">
            <Image
                  src={"/svg/google.svg"}
                  height={35}
                  width={35}
                  alt="google"
                  className="m-1"
            />
            <span className="text-gray-700">Sign in with Google</span>
          </button>
        </div>
        <p className="text-center text-sm text-gray-600">
          Having trouble signing in?{' '}
          <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
            Get help
          </a>
        </p>
      </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginLayout;