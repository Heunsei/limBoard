'use client'

import {ReactNode} from "react";
import {Logo} from "@/component/public/logo";
import {usePathname} from "next/navigation";
export default function Layout({children}: {children: ReactNode}) {
    const currentPath = usePathname();

    function getHeaderString() {
        switch (currentPath) {
            case "/signin":
                return "돌아온 것을 환영해요!";
            case "/signup":
                return  "계정 만들기";
        }
    }

    return (
        <div className='flex h-full'>
            <main className="w-full p-10 md:w-2/5 bg-[#0D0D0E] ">
                <div className='fixed top-5 left-5 md:absolute md:top-3 md:left-3 flex justify-center md:justify-start w-full md:w-auto'>
                    <Logo/>
                </div>
                <div className="pt-20 md:pt-15">
                    <header className="text-center font-bold text-xl">{getHeaderString()}</header>
                </div>
                <div className="pt-16 md:pt-12">
                    {children}
                </div>
            </main>
            <div className="hidden md:w-2/3 md:visible bg-black">
            </div>
        </div>
    )
}