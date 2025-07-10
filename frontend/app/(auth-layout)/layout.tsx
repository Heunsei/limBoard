import {ReactNode} from "react";
import {Logo} from "@/component/public/logo";
export default function Layout({children}: {children: ReactNode}) {
    return (
        <div className='flex h-full'>
            <main className="w-full p-5 md:w-1/3 bg-[#0D0D0E] ">
                <Logo/>
                {children}
            </main>
            <div className="hidden md:w-2/3 md:visible bg-black">
            </div>
        </div>
    )
}