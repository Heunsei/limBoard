'use client'

import { Search } from 'lucide-react'

interface SearchInputProps {
  placeholder?: string
  disabled?: boolean
  className?: string
}

export const SearchInput = ({ 
  placeholder = "프로젝트 및 업무 검색", 
  disabled = false,
  className = "w-64 sm:w-96"
}: SearchInputProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      <input
        type="text"
        placeholder={placeholder}
        disabled={disabled}
        className={`pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 ${className}`}
      />
    </div>
  )
}