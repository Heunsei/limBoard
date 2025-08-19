'use client'

import { Menu } from 'lucide-react'

interface MobileMenuButtonProps {
  onClick: () => void
  className?: string
}

export const MobileMenuButton = ({ onClick, className = "" }: MobileMenuButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`lg:hidden text-gray-400 hover:text-white transition-colors ${className}`}
    >
      <Menu size={24} />
    </button>
  )
}