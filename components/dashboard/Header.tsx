"use client"

import { useState } from "react"
import { Bell, Sun, Moon, User } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { signOut } from "next-auth/react"
import { Session } from "next-auth"




interface HeaderProps {
  session?: Session | null;
}

export default function Header({ session }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "Your book is due tomorrow",
      time: "1 hour ago",
    },
    {
      id: 2,
      message: "New book added to your wishlist category",
      time: "3 hours ago",
    },
  ])

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 h-16 flex items-center justify-end px-4 lg:px-6">
      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notifications.length > 0 && <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between px-4 py-2 border-b">
              <span className="font-medium">Notifications</span>
              <Button variant="ghost" size="sm" onClick={() => setNotifications([])}>
                Clear all
              </Button>
            </div>
            {notifications.length > 0 ? (
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="px-4 py-3 border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">No new notifications</div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={session?.user?.image ?? "/placeholder.svg"} alt={session?.user?.name ?? ""} />
                <AvatarFallback>{getInitials(session?.user?.name ?? "User")}</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline-block">{session?.user?.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut()}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
