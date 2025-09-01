import Category from "@/components/Category";

export default function Navbar() {
    return (
        <div className="flex p-4 bg-[#F7F1ED]">
            <Category name="Flight" srcName="flight" navigate="flight"/>
        </div>
    )
}