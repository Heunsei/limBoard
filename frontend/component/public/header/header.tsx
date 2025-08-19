'use client'

import { UserType } from "@/type/user.type";
import { SearchInput } from './search-input'
import { ProfileDropdown } from './profile-dropdown'
import { MobileMenuButton } from './mobile-menu-button'
import { NotificationButton } from './notification-button'

import { useState } from 'react'
import { UserCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from "@/context/auth.context"

interface HeaderProps {
    onMenuClick: () => void
}

const Header = ({ onMenuClick }: HeaderProps) => {
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

    if (!user) {
        return (
            <header className="bg-gray-900 border-b border-gray-800">
                <div className="px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <MobileMenuButton onClick={onMenuClick} />
                            <SearchInput disabled />
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
                        <MobileMenuButton onClick={onMenuClick} />
                        <SearchInput />
                    </div>

                    <div className="flex items-center space-x-4">
                        <NotificationButton count={notificationCount} />
                        <ProfileDropdown 
                            user={user}
                            onLogout={handleLogout} 
                            isLoading={isLoading} 
                        />
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header