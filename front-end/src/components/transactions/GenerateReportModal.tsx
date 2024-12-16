import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import useGenerateReport from "@/hooks/useGenerateReport";

interface GenerateReportModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onGenerateReport?: () => void;
}
const FormSchema = z.object({
    from_month: z.enum(["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], { message: "Gender must be one of the months!" }),
    from_year: z.string().max(5, { message: "To year cannot exceed 5 characters." }),
    to_month: z.enum(["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], { message: "Gender must be one of the months!" }),
    to_year: z.string().max(5, { message: "To year cannot exceed 5 characters." }),
});

type FormData = z.infer<typeof FormSchema>;

const GenerateReportModal: React.FC<GenerateReportModalProps> = ({ isOpen, onOpenChange, onGenerateReport }) => {
    const { onSubmit, loading, error, success } = useGenerateReport();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        clearErrors,
        setValue,
    } = useForm<FormData>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            from_month: "January",
            from_year: "",
            to_month: "January",
            to_year: "",
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
                if (onGenerateReport) {
                    onGenerateReport(); // This will trigger the data refresh
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
                    <DialogTitle className="text-xl font-bold">Generate Report</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="px-6 py-4">
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        <div>
                            <Label htmlFor="from_month" className="block font-medium mb-1">
                                From month
                            </Label>
                            <Select onValueChange={(value) => setValue("from_month", value as FormData["from_month"])} defaultValue="January">
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select month" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="January">January</SelectItem>
                                    <SelectItem value="February">February</SelectItem>
                                    <SelectItem value="March">March</SelectItem>
                                    <SelectItem value="April">April</SelectItem>
                                    <SelectItem value="May">May</SelectItem>
                                    <SelectItem value="June">June</SelectItem>
                                    <SelectItem value="July">July</SelectItem>
                                    <SelectItem value="August">Female</SelectItem>
                                    <SelectItem value="September">September</SelectItem>
                                    <SelectItem value="October">October</SelectItem>
                                    <SelectItem value="November">November</SelectItem>
                                    <SelectItem value="December">December</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.from_month && <p className="text-red-500 text-sm mt-1">{errors.from_month.message}</p>}
                        </div>
                        <div>
                            {/* Year Selection */}
                            <Label htmlFor="from_year" className="block font-medium mb-1">
                                From year
                            </Label>
                            <Select onValueChange={(value) => setValue("from_year", value)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select year" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from({ length: 11 }, (_, index) => 2024 + index).map((year) => (
                                        <SelectItem key={year} value={year.toString()}>
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.from_year && <p className="text-red-500 text-sm mt-1">{errors.from_year.message}</p>}
                        </div>

                        <div>
                            <Label htmlFor="to_month" className="block font-medium mb-1">
                                To month
                            </Label>
                            <Select onValueChange={(value) => setValue("to_month", value as FormData["to_month"])} defaultValue="January">
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select month" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="January">January</SelectItem>
                                    <SelectItem value="February">February</SelectItem>
                                    <SelectItem value="March">March</SelectItem>
                                    <SelectItem value="April">April</SelectItem>
                                    <SelectItem value="May">May</SelectItem>
                                    <SelectItem value="June">June</SelectItem>
                                    <SelectItem value="July">July</SelectItem>
                                    <SelectItem value="August">Female</SelectItem>
                                    <SelectItem value="September">September</SelectItem>
                                    <SelectItem value="October">October</SelectItem>
                                    <SelectItem value="November">November</SelectItem>
                                    <SelectItem value="December">December</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.to_month && <p className="text-red-500 text-sm mt-1">{errors.to_month.message}</p>}
                        </div>
                        <div>
                            {/* Year Selection */}
                            <Label htmlFor="to_year" className="block font-medium mb-1">
                                To year
                            </Label>
                            <Select onValueChange={(value) => setValue("to_year", value)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select year" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from({ length: 11 }, (_, index) => 2024 + index).map((year) => (
                                        <SelectItem key={year} value={year.toString()}>
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.to_year && <p className="text-red-500 text-sm mt-1">{errors.to_year.message}</p>}
                        </div>
                    </div>
                    <DialogFooter className="mt-6 pt-4 border-t">
                        <div className="flex w-full gap-4">
                            <Button type="submit" className="flex-1">
                                Generate Report
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

export default GenerateReportModal;
