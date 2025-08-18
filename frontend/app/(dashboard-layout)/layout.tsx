'use client'

import {ReactNode, useState} from "react";
import Header from "@/component/public/header";

export default function Layout({children}: {children: ReactNode}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleMenuClick = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="h-screen flex flex-col bg-gray-900">
            <Header onMenuClick={handleMenuClick} />
            <div className="flex-1 flex overflow-hidden">
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}