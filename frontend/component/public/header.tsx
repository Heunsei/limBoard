'use client'

import { useState } from 'react'
import { Menu, Search, Bell, UserCircle, LogOut, ChevronDown } from 'lucide-react'
import { UserType } from "@/type/user.type";
import { useRouter } from 'next/navigation'
import { useAuth } from "@/context/auth.context"

interface HeaderProps {
    onMenuClick: () => void
}

const Header = ({ onMenuClick }: HeaderProps) => {
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
    const [notificationCount] = useState(3)
    const router = useRouter()
    const { user, logout, isLoading } = useAuth()

    const handleLogout = async () => {
        try {
            await logout()
            router.push('/signin')
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    // Loading state when user data is not available
    if (!user) {
        return (
            <header className="bg-gray-900 border-b border-gray-800">
                <div className="px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={onMenuClick}
                                className="lg:hidden text-gray-400 hover:text-white transition-colors"
                            >
                                <Menu size={24} />
                            </button>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="프로젝트 및 업무 검색"
                                    className="pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg w-64 sm:w-96 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center animate-pulse">
                                <UserCircle size={20} className="text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        )
    }

    return (
        <header className="bg-gray-900 border-b border-gray-800">
            <div className="px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={onMenuClick}
                            className="lg:hidden text-gray-400 hover:text-white transition-colors"
                        >
                            <Menu size={24} />
                        </button>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="프로젝트 및 업무 검색"
                                className="pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg w-64 sm:w-96 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Notification Button */}
                        <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                            <Bell size={20} />
                            {notificationCount > 0 && (
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            )}
                        </button>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                                className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                            >
                                {/* Profile Image - commented out for later implementation */}
                                {/*{user.profileImage ? (*/}
                                {/*    <img*/}
                                {/*        src={user.profileImage}*/}
                                {/*        alt={user.nickname}*/}
                                {/*        className="w-8 h-8 rounded-full object-cover"*/}
                                {/*    />*/}
                                {/*) : (*/}
                                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                                        <UserCircle size={20} className="text-gray-400" />
                                    </div>
                                {/*)}*/}
                                <span className="text-white text-sm hidden sm:block">{user.nickname}</span>
                                <ChevronDown size={16} className="text-gray-400 hidden sm:block" />
                            </button>

                            {/* Profile Dropdown Menu */}
                            {profileDropdownOpen && (
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
                                            onClick={() => {
                                                setProfileDropdownOpen(false)
                                                router.push('/profile')
                                            }}
                                            className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors"
                                        >
                                            프로필 설정
                                        </button>
                                        <button
                                            onClick={() => {
                                                setProfileDropdownOpen(false)
                                                router.push('/settings')
                                            }}
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
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header