"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Session } from "next-auth"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { LogOut, User, ChevronDown } from "lucide-react"

interface ProfileDropdownProps {
  session: Session
}

export default function ProfileDropdown({ session }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const userInitial = session.user?.email?.[0].toUpperCase() || '?'

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900">
          <span className="text-sm font-medium text-blue-600 dark:text-blue-300">
            {userInitial}
          </span>
        </div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {session.user?.email}
        </span>
        <ChevronDown 
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1">
          <Link 
            href="/profile"
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </Link>

          <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />

          <button
            onClick={() => signOut()}
            className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  )
}