import { Outlet } from "react-router-dom";
import Sidebar from "../Components/Sidebar";

export default function AdminLayout() {
    return (
        <div className="flex w-[100%] h-full overflow-hidden bg-[#F8F9FA] ">
            <Sidebar />
            <div className="ml-[230px] w-full">
                
                <Outlet />
            </div>
        </div>
    )
}