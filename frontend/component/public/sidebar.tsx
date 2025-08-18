import React, { useState } from 'react';
import {
    LayoutDashboard,
    FolderKanban,
    CheckSquare,
    Users,
    Settings,
    Bell,
    Menu,
    X,
    Search,
    ChevronDown
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
    const [activeMenu, setActiveMenu] = useState('Dashboard');

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: FolderKanban, label: 'Project', path: '/project' },
        { icon: CheckSquare, label: 'Task', path: '/task' },
        { icon: Users, label: 'My Team', path: '/team' },
    ];

    const generalItems = [
        { icon: Settings, label: 'Setting', path: '/settings' },
        { icon: Bell, label: 'Notification', path: '/notifications' },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed top-0 left-0 h-full bg-gray-900 text-white z-50
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
        w-64
      `}>
                <div className="flex flex-col h-full">
                    {/* Logo Section */}
                    <div className="p-6 border-b border-gray-800">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">L</span>
                                </div>
                                <span className="text-xl font-semibold">LimBoard</span>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="lg:hidden text-gray-400 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* User Profile Section */}
                    <div className="p-4 border-b border-gray-800">
                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-800">
                            <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">사용자 이름</p>
                                <p className="text-xs text-gray-400">user@example.com</p>
                            </div>
                            <ChevronDown size={16} className="text-gray-400" />
                        </div>
                    </div>

                    {/* Menu Section */}
                    <nav className="flex-1 p-4 overflow-y-auto">
                        <div className="mb-6">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
                                MENU
                            </p>
                            <ul className="space-y-1">
                                {menuItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <li key={item.label}>
                                            <button
                                                onClick={() => setActiveMenu(item.label)}
                                                className={`
                          w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg
                          transition-all duration-200
                          ${activeMenu === item.label
                                                    ? 'bg-blue-600 text-white'
                                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'}
                        `}
                                            >
                                                <Icon size={20} />
                                                <span className="font-medium">{item.label}</span>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
                                GENERAL
                            </p>
                            <ul className="space-y-1">
                                {generalItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <li key={item.label}>
                                            <button
                                                onClick={() => setActiveMenu(item.label)}
                                                className={`
                          w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg
                          transition-all duration-200
                          ${activeMenu === item.label
                                                    ? 'bg-blue-600 text-white'
                                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'}
                        `}
                                            >
                                                <Icon size={20} />
                                                <span className="font-medium">{item.label}</span>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </nav>
                </div>
            </aside>
        </>
    );
};

export {
    Sidebar
}