"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Clock, Sun, Moon } from "lucide-react"

export default function LibraryHoursPage() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isOpen, setIsOpen] = useState(false)
  const [isDaytime, setIsDaytime] = useState(true)

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime(now)

      // Check if library is open (7:30am to 11:00pm)
      const hours = now.getHours()
      const minutes = now.getMinutes()
      const currentMinutes = hours * 60 + minutes
      const openingMinutes = 7 * 60 + 30
      const closingMinutes = 23 * 60

      setIsOpen(currentMinutes >= openingMinutes && currentMinutes < closingMinutes)

      // Check if it's daytime (6am to 6pm for visual effect)
      setIsDaytime(hours >= 6 && hours < 18)
    }, 60000)

    // Initial check
    const hours = currentTime.getHours()
    const minutes = currentTime.getMinutes()
    const currentMinutes = hours * 60 + minutes
    const openingMinutes = 7 * 60 + 30
    const closingMinutes = 23 * 60

    setIsOpen(currentMinutes >= openingMinutes && currentMinutes < closingMinutes)
    setIsDaytime(hours >= 6 && hours < 18)

    return () => clearInterval(timer)
  }, [])

  // Format time as HH:MM AM/PM
  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })

  return (
    <div
      className={`h-full flex flex-col items-center justify-center transition-colors duration-1000 overflow-hidden relative ${
        isDaytime
          ? "bg-gradient-to-b from-sky-300 via-sky-400 to-sky-500"
          : "bg-gradient-to-b from-indigo-900 via-purple-900 to-slate-900"
      }`}
    >
      {/* Sun/Moon */}
      <motion.div
        className="absolute"
        initial={false}
        animate={{
          top: isDaytime ? "15%" : "20%",
          right: isDaytime ? "15%" : "20%",
        }}
        transition={{ duration: 1 }}
      >
        {isDaytime ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              rotate: 360,
            }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{
              opacity: { duration: 1 },
              rotate: { duration: 120, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
            }}
            className="w-20 h-20 rounded-full bg-yellow-300 shadow-[0_0_70px_rgba(255,200,50,0.7)] flex items-center justify-center"
          >
            <Sun size={40} className="text-yellow-600" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 1 }}
            className="w-16 h-16 rounded-full bg-gray-200 shadow-[0_0_50px_rgba(255,255,255,0.3)] flex items-center justify-center"
          >
            <Moon size={30} className="text-gray-500" />
          </motion.div>
        )}
      </motion.div>

      {/* Stars (visible at night) */}
      {!isDaytime && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: Math.random() * 2 + 1 + "px",
                height: Math.random() * 2 + 1 + "px",
                top: Math.random() * 70 + "%",
                left: Math.random() * 100 + "%",
                opacity: Math.random() * 0.7 + 0.3,
                animation: `twinkle ${Math.random() * 3 + 2}s infinite alternate`,
              }}
            />
          ))}
        </div>
      )}

      {/* Clouds */}
      {isDaytime && (
        <>
          <motion.div
            className="absolute top-[10%] left-[10%] w-24 h-10 bg-white rounded-full opacity-80 blur-sm"
            animate={{ x: [0, 100, 0] }}
            transition={{ duration: 120, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
          <motion.div
            className="absolute top-[15%] left-[30%] w-32 h-12 bg-white rounded-full opacity-90 blur-sm"
            animate={{ x: [0, 80, 0] }}
            transition={{ duration: 150, repeat: Number.POSITIVE_INFINITY, ease: "linear", delay: 10 }}
          />
          <motion.div
            className="absolute top-[8%] left-[60%] w-20 h-8 bg-white rounded-full opacity-70 blur-sm"
            animate={{ x: [0, 60, 0] }}
            transition={{ duration: 180, repeat: Number.POSITIVE_INFINITY, ease: "linear", delay: 20 }}
          />
        </>
      )}

      {/* Ground */}
      <div
        className={`absolute bottom-0   z-[2] left-0 right-0 h-[30vh] transition-colors duration-1000 ${
          isDaytime ? "bg-gradient-to-t from-green-800 to-green-600" : "bg-gradient-to-t from-gray-900 to-gray-800"
        }`}
      />

      {/* Trees and Nature */}
      <div className="absolute bottom-0 z-[2] left-0 right-0 h-[30vh] overflow-hidden">
        {/* Left side trees */}
        <div className="absolute bottom-0 left-[5%]">
          <div
            className={`w-12 h-40 rounded-full transition-colors duration-1000 ${
              isDaytime ? "bg-green-700" : "bg-gray-800"
            }`}
          />
          <div
            className={`w-16 h-16 rounded-full absolute -top-8 -left-2 transition-colors duration-1000 ${
              isDaytime ? "bg-green-600" : "bg-gray-700"
            }`}
          />
          <div
            className={`w-16 h-16 rounded-full absolute -top-8 -right-2 transition-colors duration-1000 ${
              isDaytime ? "bg-green-600" : "bg-gray-700"
            }`}
          />
          <div
            className={`w-16 h-16 rounded-full absolute -top-16 left-1/2 -translate-x-1/2 transition-colors duration-1000 ${
              isDaytime ? "bg-green-600" : "bg-gray-700"
            }`}
          />
        </div>

        {/* Right side trees */}
        <div className="absolute bottom-0 right-[10%]">
          <div
            className={`w-10 h-32 rounded-full transition-colors duration-1000 ${
              isDaytime ? "bg-green-700" : "bg-gray-800"
            }`}
          />
          <div
            className={`w-14 h-14 rounded-full absolute -top-6 -left-2 transition-colors duration-1000 ${
              isDaytime ? "bg-green-600" : "bg-gray-700"
            }`}
          />
          <div
            className={`w-14 h-14 rounded-full absolute -top-6 -right-2 transition-colors duration-1000 ${
              isDaytime ? "bg-green-600" : "bg-gray-700"
            }`}
          />
          <div
            className={`w-14 h-14 rounded-full absolute -top-14 left-1/2 -translate-x-1/2 transition-colors duration-1000 ${
              isDaytime ? "bg-green-600" : "bg-gray-700"
            }`}
          />
        </div>

        {/* Center trees */}
        <div className="absolute bottom-0 left-[40%]">
          <div
            className={`w-14 h-48 rounded-full transition-colors duration-1000 ${
              isDaytime ? "bg-green-700" : "bg-gray-800"
            }`}
          />
          <div
            className={`w-20 h-20 rounded-full absolute -top-10 -left-3 transition-colors duration-1000 ${
              isDaytime ? "bg-green-600" : "bg-gray-700"
            }`}
          />
          <div
            className={`w-20 h-20 rounded-full absolute -top-10 -right-3 transition-colors duration-1000 ${
              isDaytime ? "bg-green-600" : "bg-gray-700"
            }`}
          />
          <div
            className={`w-20 h-20 rounded-full absolute -top-20 left-1/2 -translate-x-1/2 transition-colors duration-1000 ${
              isDaytime ? "bg-green-600" : "bg-gray-700"
            }`}
          />
        </div>

        {/* Small bushes */}
        {[10, 25, 55, 70, 85].map((left, i) => (
          <div
            key={i}
            className={`absolute bottom-2 rounded-full transition-colors duration-1000 ${
              isDaytime ? "bg-green-500" : "bg-gray-700"
            }`}
            style={{
              left: `${left}%`,
              width: `${15 + i * 2}px`,
              height: `${15 + i * 2}px`,
            }}
          />
        ))}
      </div>

      {/* Library SVG - Simplified */}
      <div className="relative w-full max-w-8xl md:max-w-5xl mx-auto  top-56 md:top-32 z-[0]">
        <svg
          viewBox="0 0 1383 594"
          className={`w-full h-auto transition-all duration-1000 ${isDaytime ? "opacity-90" : "opacity-80"}`}
        >
          <g className="transition-all duration-1000">
            {/* Main structure */}
            <path
              d="M57.6372 57.687V592.769"
              stroke={isDaytime ? "#F76363" : "#FF8080"}
              strokeWidth="6"
              strokeMiterlimit="10"
            />

            <path
              d="M808.083 2H593.983V376.073H808.083V2Z"
              stroke={isDaytime ? "#F76363" : "#FF8080"}
              strokeWidth="4"
              strokeMiterlimit="10"
              fill={isOpen && !isDaytime ? "rgba(255, 200, 50, 0.05)" : "transparent"}
            />

            <path
              d="M1304.84 145.197H1243.8V407.704H1304.84V145.197Z"
              stroke={isDaytime ? "#F76363" : "#FF8080"}
              strokeWidth="4"
              strokeMiterlimit="10"
            />

            <path
              d="M153.168 145.197H92.1279V407.704H153.168V145.197Z"
              stroke={isDaytime ? "#F76363" : "#FF8080"}
              strokeWidth="4"
              strokeMiterlimit="10"
            />

            <path
              d="M1339.33 53.3306V593.333"
              stroke={isDaytime ? "#F76363" : "#FF8080"}
              strokeWidth="6"
              strokeMiterlimit="10"
            />

            <path
              d="M190.315 78.5181V578.183"
              stroke={isDaytime ? "#F76363" : "#FF8080"}
              strokeWidth="4"
              strokeMiterlimit="10"
            />

            <path
              d="M1206.64 76.3403V584.921"
              stroke={isDaytime ? "#F76363" : "#FF8080"}
              strokeWidth="4"
              strokeMiterlimit="10"
            />

            <path
              d="M2.90527 39.668C4.66661 42.0628 8.27592 44.5008 13.6033 46.8812C66.7321 71.4064 291.692 98.4852 591.192 103.549"
              stroke={isDaytime ? "#F76363" : "#FF8080"}
              strokeWidth="4"
              strokeMiterlimit="10"
            />

            <path
              d="M806.768 103.145C1097.76 96.7973 1312.92 68.1894 1365.73 45.9292C1370.84 43.7795 1374.4 41.6877 1376.43 39.668"
              stroke={isDaytime ? "#F76363" : "#FF8080"}
              strokeWidth="4"
              strokeMiterlimit="10"
            />

            {/* Circular elements - simplified with conditional styling */}
            {[
              "M1153.56 304.281C1166.75 304.281 1177.44 293.598 1177.44 280.418C1177.44 267.24 1166.75 256.557 1153.56 256.557C1140.38 256.557 1129.69 267.24 1129.69 280.418C1129.69 293.598 1140.38 304.281 1153.56 304.281Z",
              "M1153.56 155.787C1166.75 155.787 1177.44 145.104 1177.44 131.926C1177.44 118.748 1166.75 108.064 1153.56 108.064C1140.38 108.064 1129.69 118.748 1129.69 131.926C1129.69 145.104 1140.38 155.787 1153.56 155.787Z",
              "M1153.56 375.893C1166.75 375.893 1177.44 365.21 1177.44 352.032C1177.44 338.854 1166.75 328.171 1153.56 328.171C1140.38 328.171 1129.69 338.854 1129.69 352.032C1129.69 365.21 1140.38 375.893 1153.56 375.893Z",
              "M246.043 304.281C259.23 304.281 269.922 293.598 269.922 280.418C269.922 267.24 259.23 256.557 246.043 256.557C232.854 256.557 222.164 267.24 222.164 280.418C222.164 293.598 232.854 304.281 246.043 304.281Z",
              "M246.043 375.893C259.23 375.893 269.922 365.21 269.922 352.032C269.922 338.854 259.23 328.171 246.043 328.171C232.854 328.171 222.164 338.854 222.164 352.032C222.164 365.21 232.854 375.893 246.043 375.893Z",
              "M246.043 155.787C259.23 155.787 269.922 145.104 269.922 131.926C269.922 118.748 259.23 108.064 246.043 108.064C232.854 108.064 222.164 118.748 222.164 131.926C222.164 145.104 232.854 155.787 246.043 155.787Z",
            ].map((path, index) => (
              <motion.path
                key={index}
                d={path}
                fill={isOpen ? "#FF3A3A" : "#A10606"}
                stroke={isDaytime ? "#F76363" : "#FF8080"}
                animate={isOpen ? { scale: [1, 1.1, 1] } : {}}
                transition={{
                  duration: 2,
                  repeat: isOpen ? Number.POSITIVE_INFINITY : 0,
                  repeatType: "reverse",
                  delay: index * 0.2,
                }}
              />
            ))}

            {/* Oval elements */}
            {[
              "M1176.75 214.276C1179.78 201.451 1171.84 188.599 1159 185.572C1146.16 182.545 1133.3 190.488 1130.27 203.314C1127.24 216.14 1135.19 228.991 1148.03 232.019C1160.86 235.046 1173.72 227.103 1176.75 214.276Z",
              "M271.439 210.975C273.549 197.929 264.674 185.642 251.619 183.534C238.563 181.425 226.268 190.292 224.158 203.339C222.048 216.386 230.921 228.671 243.978 230.78C257.034 232.888 269.328 224.021 271.439 210.975Z",
            ].map((path, index) => (
              <path
                key={index}
                d={path}
                fill={isOpen ? "#FF3A3A" : "#A10606"}
                stroke={isDaytime ? "#F76363" : "#FF8080"}
              />
            ))}

            {/* Triangle elements */}
            <path
              d="M17.0541 46.2319L1 40.9229L3.68531 6.45776L17.0541 14.4069V46.2319Z"
              fill={isOpen ? "#FF3A3A" : "#A10606"}
              stroke={isDaytime ? "#F76363" : "#FF8080"}
            />

            <path
              d="M1365.73 48.5698L1381.77 42.9001L1379.1 6.0979L1365.73 14.5952V48.5698Z"
              fill={isOpen ? "#FF3A3A" : "#A10606"}
              stroke={isDaytime ? "#F76363" : "#FF8080"}
            />

            {/* Light effect overlay when library is open at night - simplified */}
            {isOpen && !isDaytime && (
              <g opacity="0.3">
                <rect x="593.983" y="2" width="214.1" height="374.073" fill="#FFCC00" opacity="0.1" />
                <rect x="1243.8" y="145.197" width="61.04" height="262.507" fill="#FFCC00" opacity="0.1" />
                <rect x="92.1279" y="145.197" width="61.0401" height="262.507" fill="#FFCC00" opacity="0.1" />
              </g>
            )}
          </g>
        </svg>

        {/* Simple light glow when open at night */}
        {isOpen && !isDaytime && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />
          </div>
        )}
      </div>

      {/* Status Card */}
      <motion.div
        className="relative z-[2] bottom-72 md:bottom-0 bg-white/10 backdrop-blur-lg rounded-xl p-8 text-center w-[90%] max-w-md shadow-xl border border-white/20 mb-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold mb-6 text-white">ESTIN Library</h1>

        <div className="flex items-center justify-center gap-3 mb-8">
          <Clock className="h-6 w-6 text-white" />
          <p className="text-xl text-white">{formattedTime}</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="text-lg mb-6 text-white/90">Hours: 7:30 AM - 11:00 PM</div>

          <motion.div
            className={`px-8 py-3 rounded-full text-xl font-medium ${
              isOpen ? "bg-green-500/90 text-white" : "bg-red-500/90 text-white"
            }`}
            animate={{
              boxShadow: isOpen
                ? ["0 0 0px rgba(74, 222, 128, 0)", "0 0 20px rgba(74, 222, 128, 0.5)", "0 0 0px rgba(74, 222, 128, 0)"]
                : [
                    "0 0 0px rgba(248, 113, 113, 0)",
                    "0 0 20px rgba(248, 113, 113, 0.5)",
                    "0 0 0px rgba(248, 113, 113, 0)",
                  ],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
            }}
          >
            {isOpen ? "OPEN NOW" : "CLOSED NOW"}
          </motion.div>
        </div>
      </motion.div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes twinkle {
          0% { opacity: 0.3; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
