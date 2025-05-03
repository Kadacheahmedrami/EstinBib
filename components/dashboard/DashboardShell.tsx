'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import { ThemeProvider } from '@/components/theme-provider'
import { Menu } from 'lucide-react'
import { Session } from "next-auth"
export default function DashboardShell({
  children,
  session,
}: {
  children: React.ReactNode
  session?: Session | null
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hamburger on mobile */}
        <div className="absolute top-4 left-4 md:hidden z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md bg-white dark:bg-gray-800 shadow-md"
          >
            <Menu size={24} />
          </button>
        </div>
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-10"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800
            transform transition-transform duration-200 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            md:translate-x-0 md:static md:block z-20
          `}
        >
          <Sidebar onNavigate={() => setSidebarOpen(false)} />
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col  min-h-screen ">
            <div className=' h-16'>
            <Header session={session} />
            </div>
     
          <main className="w-screen   md:w-full overflow-y-auto p-4 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  )
}
