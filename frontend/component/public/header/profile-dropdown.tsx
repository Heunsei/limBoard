'use client'

import { useState } from 'react'
import { UserCircle, ChevronDown, LogOut } from 'lucide-react'
import { UserType } from "@/type/user.type"
import { useRouter } from 'next/navigation'

interface ProfileDropdownProps {
  user: UserType
  onLogout: () => Promise<void>
  isLoading?: boolean
  className?: string
}

export const ProfileDropdown = ({ 
  user, 
  onLogout, 
  isLoading = false,
  className = ""
}: ProfileDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleProfileClick = () => {
    setIsOpen(false)
    router.push('/profile')
  }

  const handleSettingsClick = () => {
    setIsOpen(false)
    router.push('/settings')
  }

  const handleLogout = async () => {
    setIsOpen(false)
    await onLogout()
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
      >
        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
          <UserCircle size={20} className="text-gray-400" />
        </div>
        <span className="text-white text-sm hidden sm:block">{user.nickname}</span>
        <ChevronDown size={16} className="text-gray-400 hidden sm:block" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50">
          <div className="p-4 border-b border-gray-700">
            <p className="text-sm font-medium text-white">{user.nickname}</p>
            <p className="text-xs text-gray-400">{user.email}</p>
            {user.description && (
              <p className="text-xs text-gray-500 mt-1">{user.description}</p>
            )}
            <div className="mt-2 text-xs text-gray-500">
              <p>가입일: {new Date(user.createdAt).toLocaleDateString('ko-KR')}</p>
              <p>팀 참여: {user.teamMember?.length || 0}개</p>
              <p>프로젝트 참여: {user.projectMember?.length || 0}개</p>
              <p>담당 업무: {user.tasks?.length || 0}개</p>
            </div>
          </div>
          <div className="p-2">
            <button
              onClick={handleProfileClick}
              className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors"
            >
              프로필 설정
            </button>
            <button
              onClick={handleSettingsClick}
              className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors"
            >
              환경 설정
            </button>
            <hr className="my-2 border-gray-700" />
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-gray-700 rounded-md transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogOut size={16} />
              <span>{isLoading ? '로그아웃 중...' : '로그아웃'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}