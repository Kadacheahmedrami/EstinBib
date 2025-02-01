// components/LoginLayout.tsx

import Image from "next/image";

const LoginLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="md:my-12 flex items-center  justify-center p-4">
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
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Welcome Back Student
              </h2>
              <p className=" text-gray-600">
                Please Login in to your estin email
              </p>
            </div>
            {children}

         
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginLayout;
