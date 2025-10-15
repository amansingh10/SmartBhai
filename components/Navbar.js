import Category from "@/components/Category";

export default function Navbar() {
    return (
        <div className="flex p-4 bg-[#ffffff]">
            <Category name="Flight" srcName="flight" navigate="flight"/>
        </div>
    )
}