'use client'

import LogoImage from '@/public/image/logo.png'
import Image from 'next/image'

import React, { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    FolderKanban,
    CheckSquare,
    Users,
    Settings,
    X
} from 'lucide-react'
import {cn} from "@/lib/utils";

interface SidebarProps {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
}

function Sidebar ({ isOpen, setIsOpen }: SidebarProps) {
    const router = useRouter()
    const pathname = usePathname()

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: FolderKanban, label: 'Projects', path: '/projects' },
        { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
        { icon: Users, label: 'Teams', path: '/teams' },
    ]

    const generalItems = [
        { icon: Settings, label: 'Settings', path: '/settings' },
    ]

    const handleMenuClick = (path: string) => {
        router.push(path)

        if (window.innerWidth < 1024) {
            setIsOpen(false)
        }
    }

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside className={`
                fixed top-0 left-0 h-full bg-gray-800 border-r border-gray-700 text-white z-50
                transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:static lg:z-auto
                w-64
            `}>
                <div className="flex flex-col h-full">
                    <Header>
                        <div className="relative flex items-center justify-center">
                            <Logo />
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute right-0 lg:hidden text-gray-400 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </Header>
                    <Menu>
                        <TeamSelector/>
                    </Menu>
                    <Menu>
                        <p className={'py-1'}>MENU</p>
                        <ul className="space-y-2">
                            {menuItems.map((item) => (
                                <MenuContent 
                                    key={item.label}
                                    item={item}
                                    pathname={pathname}
                                    handleMenuClick={handleMenuClick}
                                />
                            ))}
                        </ul>
                    </Menu>

                    <Menu>
                        <p className={'py-1'}>GENERAL</p>
                        <ul className="space-y-2">
                            {generalItems.map((item) => (
                                <MenuContent
                                    key={item.label}
                                    item={item}
                                    pathname={pathname}
                                    handleMenuClick={handleMenuClick}
                                />
                            ))}
                        </ul>
                    </Menu>

                </div>
            </aside>
        </>
    );
}

function Header ({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            className={cn("p-4", className)}
            {...props}
        />
    )
}

function Logo() {
    return (
        <div className="flex items-center space-x-2">
            <Image 
                src={LogoImage}
                alt="LimBoard Logo" 
                width={32} 
                height={32}
                className="rounded-sm border border-white"
            />
            <h1 className="text-lg font-black">LimBoard</h1>
        </div>
    )
}

function Menu ({className, ...props}: React.ComponentProps<"nav">) {
    return (
        <nav
            className={cn("p-4", className)}
            {...props}
        />
    )
}

interface MenuContentProps {
    item: {
        icon: any;
        label: string;
        path: string;
    };
    pathname: string;
    handleMenuClick: (path: string) => void;
}

function MenuContent({ item, pathname, handleMenuClick }: MenuContentProps) {
    const Icon = item.icon;
    
    return (
        <li key={item.label}>
            <button
                onClick={() => handleMenuClick(item.path)}
                className={cn(
                    "w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 cursor-pointer",
                    pathname === item.path
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                )}
            >
                <Icon size={18} />
                <span>{item.label}</span>
            </button>
        </li>
    );
}

function TeamSelector () {
    return (
        <div className={'bg-[#000000] rounded-sm px-3 py-2 w-full flex items-center justify-center'}>
            ?
        </div>
    )
}

export {
    Sidebar
}