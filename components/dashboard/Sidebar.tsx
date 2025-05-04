// components/dashboard/Sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BookOpen,
  LayoutDashboard,
  Library,
  Users,
  FileText,
  BarChart3,
  Globe,
  BookMarked,
  Lightbulb,
  AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'


interface SidebarProps {
  onNavigate?: () => void
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname()

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: <LayoutDashboard className='h-5 w-5' /> },
    { name: 'Books Management', href: '/dashboard/books', icon: <BookOpen className='h-5 w-5' /> },
    { name: 'Categories', href: '/dashboard/categories', icon: <Library className='h-5 w-5' /> },
    { name: 'Borrows & Returns', href: '/dashboard/borrows', icon: <BookMarked className='h-5 w-5' /> },
    { name: 'Book Requests', href: '/dashboard/requests', icon: <FileText className='h-5 w-5' /> },
    { name: 'SNDL Demands', href: '/dashboard/sndl', icon: <Globe className='h-5 w-5' /> },
    { name: 'Ideas Box', href: '/dashboard/ideas', icon: <Lightbulb className='h-5 w-5' /> },
    { name: 'Users Management', href: '/dashboard/users', icon: <Users className='h-5 w-5' /> },
    { name: 'Analytics', href: '/dashboard/analytics', icon: <BarChart3 className='h-5 w-5' /> },
    { name: 'Complaints', href: '/dashboard/complaints', icon: <AlertCircle className='h-5 w-5' /> },

  ]

  return (
    <div className='flex flex-col h-full'>
      <div className='flex items-center justify-center h-16 border-b dark:border-gray-700'>
        <Link href='/dashboard' onClick={onNavigate} className='flex items-center space-x-2'>
          <BookOpen className='h-6 w-6 text-primary' />
          <span className='text-xl font-bold'>Admin Panel</span>
        </Link>
      </div>

      <nav className='flex-1 overflow-y-auto p-4'>
        <ul className='space-y-1'>
          {navItems.map(item => (
            <li key={item.name}>
              <Link
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  'flex items-center px-4 py-2 text-sm rounded-md transition-colors',
                  pathname === item.href || pathname.startsWith(`${item.href}/`)
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                )}
              >
                {item.icon}
                <span className='ml-3'>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className='p-4 border-t dark:border-gray-700'>
        <Link
          href='/'
          onClick={onNavigate}
          className='flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700'
        >
          <span>Back to Website</span>
        </Link>
      </div>
    </div>
  )
}
