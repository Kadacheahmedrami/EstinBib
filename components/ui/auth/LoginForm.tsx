'use client'
import { signIn, SignInResponse } from "next-auth/react";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { Lock, Mail, AlertCircle, Eye, EyeOff } from 'lucide-react';
import Image from "next/image";
import { ArrowRight, Loader } from 'lucide-react'; // Import the Loader icon

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      if (email === "test@test.com" && password === "password") {
        router.push("/dashboard");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError(err as string);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true); // Start loading
    const response: SignInResponse | undefined = await signIn("google", { redirect: false,callbackUrl:"/profile" });
    
    if (response?.error) {
      setError("Failed to sign in with Google");
    } 

    setIsLoading(false); // Stop loading
  };

  return (
    <>
      {error && (
        <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          <p className="text-sm">{error}</p>
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

          <div>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"} // Toggle between text and password
                value={password}
                placeholder="*********"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 h-[58px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-[#F1413E] flex flex-row justify-center items-center text-white py-3 rounded-[14px] font-medium hover:bg-[#D63936] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Proceed to my Account
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </form>

      <div className="flex flex-col space-y-6">
        <div className="mt-6 space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center px-4 h-[48px] border border-gray-300 rounded-[14px] hover:bg-gray-50 transition-colors"
            disabled={isLoading} // Disable the button when loading
          >
            {isLoading ? (
              <Loader className="animate-spin w-5 h-5 text-gray-400" />
            ) : (
              <>
                <Image
                  src={"/svg/google.svg"}
                  height={35}
                  width={35}
                  alt="google"
                  className="m-1"
                />
                <span className="text-gray-700">Sign in with Google</span>
              </>
            )}
          </button>
        </div>
        <p className="text-center text-sm text-gray-600">
          Having trouble signing in?{" "}
          <a
            href="#"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Get help
          </a>
        </p>
      </div>
    </>
  );
};

export default LoginForm;
