import type React from "react"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import Sidebar from "@/components/dashboard/Sidebar"
import Header from "@/components/dashboard/Header"
import { ThemeProvider } from "@/components/theme-provider"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Fixed width sidebar */}
        <div className="w-64 flex-shrink-0">
          <div className="fixed top-0 left-0 w-64 h-full">
            <Sidebar  />
          </div>
        </div>
        
        {/* Main content area that takes remaining width */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col min-h-screen">
       
            <Header session={session}/>
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
              <div className="container mx-auto px-4 py-8">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}
