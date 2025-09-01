import Image from "next/image"
export default function Header(){
    return(
        <div className="text-2xl flex gap-3.5 items-center p-4 bg-[#F7F1ED]">
            <div>
                <Image src="/icons/menu.svg" width={25} height={25} alt="menu"/>
            </div>
            <div>Smartbhai</div>
        </div>
    )
}