'use client'

import {ReactNode, useState} from "react";
import Header from "@/component/public/header/header";
import { Sidebar } from "@/component/public/sidebar/sidebar";

export default function Layout({children}: {children: ReactNode}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleMenuClick = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="h-screen flex bg-gray-900">
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header onMenuClick={handleMenuClick} />
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}