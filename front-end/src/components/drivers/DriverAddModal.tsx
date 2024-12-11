import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import useCreateDriver from "@/hooks/useCreateDriver";

interface AddDriverModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onCreateDriver?: () => void;
}
const FormSchema = z.object({
    name: z.string().max(100, { message: "Name cannot exceed 100 characters." }),
    gender: z.enum(["Male", "Female"], { message: "Gender must be one of 'Male' or 'Female'." }),
    dob: z.string().max(50, { message: "Date of birth cannot exceed 50 characters." }),
    address: z.string().max(200, { message: "Adress cannot exceed 200 characters." }),
    phone_number: z.string().max(20, { message: "Phone number cannot exceed 20 characters." }),
    license_number: z.string().max(20, { message: "License number cannot exceed 20 characters." }),
    status: z.enum(["Available", "Unavailable"], { message: "Status must be one of 'Available' or 'Unavailable'." }),
});

type FormData = z.infer<typeof FormSchema>;

const AddDriverModal: React.FC<AddDriverModalProps> = ({ isOpen, onOpenChange, onCreateDriver }) => {
    const { onSubmit, loading, error, success } = useCreateDriver();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        clearErrors,
    } = useForm<FormData>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            gender: "Male",
            dob: "",
            address: "",
            phone_number: "",
            license_number: "",
            status: "Available",
        },
    });

    // Reset form when dialog is opened/closed
    useEffect(() => {
        if (!isOpen) {
            reset();
            clearErrors();
        }
    }, [isOpen, reset, clearErrors]);

    const handleFormSubmit = async (data: FormData) => {
        try {
            const response: any = await onSubmit(data);
            if (response.status === 201) {
                reset();
                if (onCreateDriver) {
                    onCreateDriver(); // This will trigger the data refresh
                }
            }
        } catch (error) {
            console.error("Registration error:", error);
        }
    };

    const handleClose = (e?: React.MouseEvent) => {
        // If event exists, prevent it from bubbling up
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        reset();
        clearErrors();
        onOpenChange(false);
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) {
                    handleClose();
                }
            }}
        >
            <DialogContent className="bg-white w-full max-w-md rounded-lg shadow-lg my-8">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="text-xl font-bold">Add New Driver</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="px-6 py-4">
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        <div>
                            <Label htmlFor="driver-name" className="block font-medium mb-1">
                                Driver Name
                            </Label>
                            <Input id="driver-name" {...register("name")} className="w-full px-3 py-2 border rounded-lg" />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="gender" className="block font-medium mb-1">
                                Gender
                            </Label>
                            <Select {...register("gender")}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Male">Male</SelectItem>
                                    <SelectItem value="Female">Female</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="dob" className="block font-medium mb-1">
                                Date of Birth
                            </Label>
                            <Input id="dob" type="date" {...register("dob")} className="w-full px-3 py-2 border rounded-lg" />
                            {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="address" className="block font-medium mb-1">
                                Address
                            </Label>
                            <Input id="address" {...register("address")} className="w-full px-3 py-2 border rounded-lg" />
                            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="phone-number" className="block font-medium mb-1">
                                Phone Number
                            </Label>
                            <Input id="phone-number" {...register("phone_number")} className="w-full px-3 py-2 border rounded-lg" />
                            {errors.phone_number && <p className="text-red-500 text-sm mt-1">{errors.phone_number.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="license-number" className="block font-medium mb-1">
                                License Number
                            </Label>
                            <Input id="license-number" {...register("license_number")} className="w-full px-3 py-2 border rounded-lg" />
                            {errors.license_number && <p className="text-red-500 text-sm mt-1">{errors.license_number.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="status" className="block font-medium mb-1">
                                Status
                            </Label>
                            <Select {...register("status")}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Available">Available</SelectItem>
                                    <SelectItem value="Unavailable">Unavailable</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}
                        </div>
                    </div>
                    <DialogFooter className="mt-6 pt-4 border-t">
                        <div className="flex w-full gap-4">
                            <Button type="submit" className="flex-1">
                                Add Driver
                            </Button>
                            <Button
                                type="button" // Important! This prevents form submission
                                onClick={handleClose}
                                variant="outline"
                                className="flex-1"
                            >
                                Close
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddDriverModal;
