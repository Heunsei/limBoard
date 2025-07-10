import Image from "next/image";
import LogoImage from '@/public/image/logo.png'
function Logo() {
    return (
        <div className="flex items-center gap-3">
            <Image width={40} height={40} src={LogoImage} alt='logo Image' className="border-white border-2 rounded-lg"/>
            <span className="text-white text-xl font-semibold">Lim Board</span>
        </div>
    )
}
export {Logo}