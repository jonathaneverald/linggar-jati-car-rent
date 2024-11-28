import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, Car, UserCog, Wrench, FolderTree } from "lucide-react";
import Link from "next/link";

const AdminSidebar = () => {
    const pathname = usePathname();

    const navItems = [
        {
            title: "Dashboard",
            href: "/admin/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "Users",
            href: "/admin/dashboard/users",
            icon: Users,
        },
        {
            title: "Cars",
            href: "/admin/dashboard/cars",
            icon: Car,
        },
        {
            title: "Drivers",
            href: "/admin/dashboard/drivers",
            icon: UserCog,
        },
        {
            title: "Car Maintenances",
            href: "/admin/dashboard/car-maintenances",
            icon: Wrench,
        },
        {
            title: "Car Categories",
            href: "/admin/dashboard/car-categories",
            icon: FolderTree,
        },
    ];

    return (
        <div className="w-64 bg-white border-r border-gray-200 shadow-sm">
            <div className="px-3 py-4">
                <nav className="space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                pathname === item.href ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            <item.icon className="h-5 w-5 flex-shrink-0" />
                            {item.title}
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    );
};

export default AdminSidebar;
