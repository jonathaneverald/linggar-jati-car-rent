import { User } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

const Header = () => {
    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <div className="text-2xl font-bold text-gray-800">Linggar Jati Car Rent</div>
                <div className="flex gap-4">
                    <Button variant="outline" className="flex items-center gap-2" asChild>
                        <Link href="/transactions">
                            <span>Transaction</span>
                        </Link>
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2" asChild>
                        <Link href="/profile">
                            <User className="w-4 h-4" />
                            <span>Profile</span>
                        </Link>
                    </Button>
                </div>
            </div>
        </header>
    );
};

export default Header;
