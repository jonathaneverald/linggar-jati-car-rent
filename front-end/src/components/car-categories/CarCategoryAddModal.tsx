import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import useCreateCategory from "@/hooks/useCreateCategory";

interface AddCarCategoryModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onCreateCarCategory?: () => void;
}
const FormSchema = z.object({
    car_brand: z.string().max(100, { message: " Car brand cannot exceed 100 characters." }),
    type: z.string().max(100, { message: "Type cannot exceed 100 characters." }),
});

type FormData = z.infer<typeof FormSchema>;

const AddCarCategoryModal: React.FC<AddCarCategoryModalProps> = ({ isOpen, onOpenChange, onCreateCarCategory }) => {
    const { onSubmit, loading, error, success } = useCreateCategory();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        clearErrors,
    } = useForm<FormData>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            car_brand: "",
            type: "",
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
                if (onCreateCarCategory) {
                    onCreateCarCategory(); // This will trigger the data refresh
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
                    <DialogTitle className="text-xl font-bold">Add New Car Maintenance</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="px-6 py-4">
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        <div>
                            <Label htmlFor="car-brand" className="block font-medium mb-1">
                                Car Brand
                            </Label>
                            <Input id="car-brand" {...register("car_brand")} className="w-full px-3 py-2 border rounded-lg" />
                            {errors.car_brand && <p className="text-red-500 text-sm mt-1">{errors.car_brand.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="type" className="block font-medium mb-1">
                                Car Type
                            </Label>
                            <Input id="type" {...register("type")} className="w-full px-3 py-2 border rounded-lg" />
                            {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>}
                        </div>
                    </div>
                    <DialogFooter className="mt-6 pt-4 border-t">
                        <div className="flex w-full gap-4">
                            <Button type="submit" className="flex-1">
                                Add Car Category
                            </Button>
                            <Button
                                type="button" // Important! Thiss prevents form submission
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

export default AddCarCategoryModal;
