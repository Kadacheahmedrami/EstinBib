"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpen,
  LayoutDashboard,
  Library,
  Users,
  FileText,
  BarChart3,
  Menu,
  X,
  BookMarked,
  Lightbulb,
  Globe,

} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export default function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const navItems = [
    {
      name: "Overview",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Books Management",
      href: "/dashboard/books",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      name: "Categories",
      href: "/dashboard/categories",
      icon: <Library className="h-5 w-5" />,
    },
    {
      name: "Borrows & Returns",
      href: "/dashboard/borrows",
      icon: <BookMarked className="h-5 w-5" />,
    },
    {
      name: "Book Requests",
      href: "/dashboard/requests",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: "SNDL Demands",
      href: "/dashboard/sndl",
      icon: <Globe className="h-5 w-5" />,
    },
    {
      name: "Ideas Box",
      href: "/dashboard/ideas",
      icon: <Lightbulb className="h-5 w-5" />,
    },
    {
      name: "Users Management",
      href: "/dashboard/users",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Analytics",
      href: "/dashboard/analytics",
      icon: <BarChart3 className="h-5 w-5" />,
    },
  ]

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" onClick={toggleSidebar} className="rounded-full">
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 border-b dark:border-gray-700">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Admin Panel</span>
            </Link>
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center px-4 py-2 text-sm rounded-md transition-colors",
                      pathname === item.href || pathname.startsWith(`${item.href}/`)
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon}
                    <span className="ml-3">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t dark:border-gray-700">
            <Link
              href="/"
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <span>Back to Website</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  )
}
