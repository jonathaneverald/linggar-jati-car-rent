import React, { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { User } from "@/types/user";
import useSWR from "swr";
import { useForm } from "react-hook-form";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";

interface ProfileModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    user: User | null;
    onProfileUpdate?: () => void;
}

interface FormData {
    name: string;
    phone: string;
    address: string;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onOpenChange, user, onProfileUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const { updateProfile, isUpdating, error } = useUpdateProfile();
    const { mutate } = useSWR<User>("http://127.0.0.1:5000/profile", {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        defaultValues: {
            name: user?.name || "",
            phone: user?.phone_number || "",
            address: user?.address || "",
        },
    });

    const onSubmit = async (formData: FormData) => {
        try {
            await updateProfile(formData.name, formData.address, formData.phone);
            setIsEditing(false);
        } catch (e) {
            console.error(e);
        }
    };

    const handleClose = () => {
        setIsEditing(false);
        onOpenChange(false);
    };

    const handleEditClick = () => {
        setIsEditing(true);
        reset({
            name: user?.name || "",
            phone: user?.phone_number || "",
            address: user?.address || "",
        });
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        reset({
            name: user?.name || "",
            phone: user?.phone_number || "",
            address: user?.address || "",
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold">Profile</DialogTitle>
                </DialogHeader>
                <div className="mt-4 space-y-2 text-gray-800">
                    {isEditing ? (
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block font-semibold">Name</label>
                                    <input {...register("name")} className="w-full px-3 py-2 border rounded-lg" />
                                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                                </div>
                                <div>
                                    <label className="block font-semibold">Address</label>
                                    <input {...register("address")} className="w-full px-3 py-2 border rounded-lg" />
                                    {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
                                </div>
                                <div>
                                    <label className="block font-semibold">Phone Number</label>
                                    <input {...register("phone")} className="w-full px-3 py-2 border rounded-lg" />
                                    {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                                </div>
                            </div>
                            <DialogFooter className="mt-6">
                                <Button type="submit" variant="outline" className="w-full" disabled={isUpdating}>
                                    {isUpdating ? "Updating..." : "Save Changes"}
                                </Button>
                                <Button onClick={handleCancelClick} variant="outline" className="w-full">
                                    Cancel
                                </Button>
                            </DialogFooter>
                            {error && <p className="text-red-500 text-center mt-2">{error}</p>}
                        </form>
                    ) : (
                        <>
                            <p>
                                <strong>Name:</strong> {user?.name || "Not set"}
                            </p>
                            <p>
                                <strong>Address:</strong> {user?.address || "Not set"}
                            </p>
                            <p>
                                <strong>Phone Number:</strong> {user?.phone_number || "Not set"}
                            </p>
                            <DialogFooter className="mt-6">
                                <Button onClick={handleEditClick} variant="outline" className="w-full">
                                    Edit Profile
                                </Button>
                                <Button onClick={handleClose} variant="outline" className="w-full">
                                    Close
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ProfileModal;
