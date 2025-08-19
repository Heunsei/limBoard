'use client'

import { Bell } from 'lucide-react'

interface NotificationButtonProps {
  count?: number
  onClick?: () => void
  className?: string
}

export const NotificationButton = ({ 
  count = 0, 
  onClick,
  className = ""
}: NotificationButtonProps) => {
  return (
    <button 
      onClick={onClick}
      className={`relative p-2 text-gray-400 hover:text-white transition-colors ${className}`}
    >
      <Bell size={20} />
      {count > 0 && (
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
      )}
    </button>
  )
}