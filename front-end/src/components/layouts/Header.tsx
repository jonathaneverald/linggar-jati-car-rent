import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import ProfileModal from "../profile/ProfileModal";
import useUserProfile from "@/hooks/useAuthenticatedUser";
import useLogout from "@/hooks/useLogout";

const Header = () => {
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const { user, isLoading, fetchUserData } = useUserProfile();
    const [profileUpdated, setProfileUpdated] = useState(false);
    const { handleLogout, loading: isLoggingOut, error: logoutError } = useLogout();
    const toggleProfileModal = () => {
        setIsProfileModalOpen((prev) => !prev);
    };

    const handleProfileUpdate = () => {
        setProfileUpdated((prev) => !prev); // Toggle the state to force re-render
        setIsProfileModalOpen(false); // Close the modal after profile update
    };

    const renderRoleBasedTitleButton = () => {
        // If loading or user is not yet loaded, return null or a placeholder
        if (isLoading || !user) {
            return null;
        }

        // Render dashboard for admin (role 1), transactions for others
        return user.role_id === 1 ? (
            <Link href="/admin/dashboard">
                <div className="text-2xl font-bold text-gray-800">Linggar Jati Car Rent</div>
            </Link>
        ) : (
            <Link href="/cars">
                <div className="text-2xl font-bold text-gray-800">Linggar Jati Car Rent</div>
            </Link>
        );
    };

    // Determine the appropriate button based on user role
    const renderRoleBasedButton = () => {
        // If loading or user is not yet loaded, return null or a placeholder
        if (isLoading || !user) {
            return null;
        }

        // Render dashboard for admin (role 1), transactions for others
        return user.role_id === 1 ? (
            <Button variant="outline" className="flex items-center gap-2" asChild>
                <Link href="/admin/dashboard">
                    <span>Dashboard</span>
                </Link>
            </Button>
        ) : (
            <>
                <Button variant="outline" className="flex items-center gap-2" asChild>
                    <Link href="/terms-conditions">
                        <span>Terms & Conditions</span>
                    </Link>
                </Button>
                <Button variant="outline" className="flex items-center gap-2" asChild>
                    <Link href="/transactions-customer">
                        <span>Transaction</span>
                    </Link>
                </Button>
            </>
        );
    };

    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                {renderRoleBasedTitleButton()}
                <div className="flex gap-4">
                    {renderRoleBasedButton()}
                    <Button variant="outline" className="flex items-center gap-2" onClick={toggleProfileModal}>
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2" onClick={handleLogout}>
                        <span>Logout</span>
                    </Button>
                </div>
            </div>
            {/* Profile Modal */}
            <ProfileModal isOpen={isProfileModalOpen} onOpenChange={setIsProfileModalOpen} user={user} onProfileUpdate={handleProfileUpdate} />
        </header>
    );
};

export default Header;
