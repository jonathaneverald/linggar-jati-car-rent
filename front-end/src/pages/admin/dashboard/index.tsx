import React, { useEffect, useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus, ChevronLeft, ChevronRight, Check, XCircle } from "lucide-react";
import { format } from "date-fns";
import useFetchTransactions from "@/hooks/useFetchTransactions";
import { Transaction } from "@/types/transaction";
import { formatIntToIDR } from "@/utils/currency";
import Image from "next/image";
import ImageModal from "@/components/ImageModal";
import axios from "axios";
import { getToken } from "@/utils/tokenUtils";
import GenerateReportModal from "@/components/transactions/GenerateReportModal";

const PAYMENT_STATUSES = ["Pending", "Invalid", "Success"] as const;
const RENTAL_STATUSES = ["Canceled", "In Progress", "Success"] as const;

const AdminPage: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string>("");
    const [selectedRentalStatus, setSelectedRentalStatus] = useState<string>("");
    const [isGenerateReportModalOpen, setIsGenerateReportModalOpen] = useState(false);
    const per_page = 10;
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const toggleGenerateReportModal = () => {
        setIsGenerateReportModalOpen((prev) => !prev);
    };

    const handleGenerateReport = async () => {
        try {
            await mutate(); // Trigger a revalidation of the data
            setIsGenerateReportModalOpen(false);
        } catch (error) {
            console.error("Error refreshing data:", error);
        }
    };

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedPaymentStatus, selectedRentalStatus]);

    // Memoize params to prevent unnecessary re-fetching
    const params = useMemo(
        () => ({
            page: currentPage,
            per_page: Number(per_page),
            ...(selectedPaymentStatus && { payment_status: selectedPaymentStatus }), // Only include if set
            ...(selectedRentalStatus && { rental_status: selectedRentalStatus }), // Only include if set
        }),
        [currentPage, per_page, selectedPaymentStatus, selectedRentalStatus]
    );

    const { transactions, pagination, isLoading, isError, mutate } = useFetchTransactions(params);

    const handleActions = async (transactionId: number, confirm: string): Promise<void> => {
        const token = getToken(); // JWT token stored in localStorage (adjust as needed)

        try {
            // Ensure confirm is either "Valid" or "Invalid"
            if (confirm !== "Valid" && confirm !== "Invalid") {
                console.error("Invalid confirmation status. Use 'Valid' or 'Invalid'.");
                return;
            }

            // API Endpoint URL
            const url = `http://localhost:5000/transactions/payment-proof-validation/${transactionId}`;

            // Request payload
            const payload = {
                rental_status: confirm, // "Valid" or "Invalid"
            };

            // Make the PUT request to the backend
            const response = await axios.put(url, payload, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // JWT token for authentication
                },
            });

            // Handle success response
            console.log("Success:", response.data.message);
            console.log("Updated Transaction Data:", response.data.data);

            await mutate(); // Re-fetch transactions to update the table
            // Optional: Perform actions after success
            alert("Payment proof validation succeeded!");
        } catch (error: any) {
            // Handle errors (e.g., unauthorized access, validation errors, server errors)
            if (error.response) {
                console.error("Error:", error.response.data.message);
                alert(`Error: ${error.response.data.message}`);
            } else {
                console.error("An unexpected error occurred:", error.message);
                alert("An unexpected error occurred. Please try again later.");
            }
        }
    };

    const handleNextPage = () => {
        if (currentPage < pagination.total_pages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const handleClearFilters = () => {
        setSelectedPaymentStatus("");
        setSelectedRentalStatus("");
    };

    if (isError) return <div>Error loading transactions</div>;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight">Transactions</h2>
            </div>

            {/* Filters Section */}
            <div className="flex gap-4 items-center">
                <div className="space-y-1">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Payment Status</label>
                    <Select value={selectedPaymentStatus} onValueChange={(value) => setSelectedPaymentStatus(value === "all" ? "" : value)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="All Payment Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem className="cursor-pointer" value="all">
                                All Payment Status
                            </SelectItem>
                            {PAYMENT_STATUSES.map((status) => (
                                <SelectItem className="cursor-pointer" key={status} value={status}>
                                    {status}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Rental Status</label>
                    <Select value={selectedRentalStatus} onValueChange={(value) => setSelectedRentalStatus(value === "all" ? "" : value)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="All Rental Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem className="cursor-pointer" value="all">
                                All Rental Status
                            </SelectItem>
                            {RENTAL_STATUSES.map((status) => (
                                <SelectItem className="cursor-pointer" key={status} value={status}>
                                    {status}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {(selectedPaymentStatus || selectedRentalStatus) && (
                    <Button variant="outline" onClick={handleClearFilters} className="mt-6">
                        Clear Filters
                    </Button>
                )}

                <div className="space-y-1 mt-6">
                    <Button onClick={toggleGenerateReportModal}>Generate Report</Button>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">No</TableHead>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>Car</TableHead>
                            <TableHead>Car Price</TableHead>
                            <TableHead>Driver</TableHead>
                            <TableHead>Start Date</TableHead>
                            <TableHead>Rent Duration</TableHead>
                            <TableHead>Return Date</TableHead>
                            <TableHead>Late Fee</TableHead>
                            <TableHead>Payment Proof</TableHead>
                            <TableHead>Payment Status</TableHead>
                            <TableHead>Rental Status</TableHead>
                            <TableHead>Total Cost</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={13} className="text-center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : transactions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={13} className="text-center">
                                    No transactions found
                                </TableCell>
                            </TableRow>
                        ) : (
                            transactions.map((transaction: Transaction, index: number) => (
                                <TableRow key={transaction.id}>
                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                    <TableCell className="font-medium">{transaction.id}</TableCell>
                                    <TableCell>{transaction.car_data.car_name}</TableCell>
                                    <TableCell>{formatIntToIDR(transaction.car_data.car_price)}</TableCell>
                                    {transaction.driver_id == null ? <TableCell>-</TableCell> : <TableCell>{transaction.driver_data?.driver_name}</TableCell>}
                                    <TableCell>{format(new Date(transaction.start_date), "yyyy-MM-dd")}</TableCell>
                                    {transaction.rent_duration === 1 ? <TableCell>{transaction.rent_duration} day</TableCell> : <TableCell>{transaction.rent_duration} days</TableCell>}
                                    {transaction.return_date == null ? <TableCell>-</TableCell> : <TableCell>{format(new Date(transaction.return_date), "yyyy-MM-dd")}</TableCell>}
                                    {transaction.late_fee == null ? <TableCell>-</TableCell> : <TableCell>{transaction.late_fee}</TableCell>}
                                    <TableCell>
                                        {transaction.payment_proof === null && <div>-</div>}
                                        {transaction.payment_proof != null && (
                                            <div className="relative h-16 w-16 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setSelectedImage(transaction.payment_proof)}>
                                                <Image
                                                    src={transaction.payment_proof}
                                                    alt={`${transaction.payment_proof} image`}
                                                    fill
                                                    className="object-cover rounded-md"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = "/placeholder-car.png";
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>{transaction.payment_status}</TableCell>
                                    <TableCell>{transaction.rental_status}</TableCell>
                                    <TableCell>{formatIntToIDR(transaction.total_cost)}</TableCell>
                                    {transaction.payment_status === "Pending" ? (
                                        <TableCell>
                                            <div className="flex gap-2">
                                                {/* Green Check Button */}
                                                <Button
                                                    onClick={() => handleActions(transaction.id, "Valid")}
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-green-600 hover:text-white hover:bg-green-600 transition-all duration-200"
                                                >
                                                    <Check className="w-4 h-4" />
                                                </Button>

                                                {/* Red X Button */}
                                                <Button
                                                    onClick={() => handleActions(transaction.id, "Invalid")}
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-600 hover:text-white hover:bg-red-600 transition-all duration-200"
                                                >
                                                    <XCircle className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    ) : (
                                        <TableCell>-</TableCell>
                                    )}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-2">
                <div className="text-sm text-gray-500">
                    Showing {(currentPage - 1) * per_page + 1} to {Math.min(currentPage * per_page, pagination.total_transactions)} of {pagination.total_transactions} transactions
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={currentPage === 1}>
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </Button>
                    <div className="text-sm">
                        Page {currentPage} of {pagination.total_pages}
                    </div>
                    <Button variant="outline" size="sm" onClick={handleNextPage} disabled={currentPage === pagination.total_pages}>
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <ImageModal isOpen={!!selectedImage} onClose={() => setSelectedImage(null)} imageUrl={selectedImage || ""} />
            <GenerateReportModal isOpen={isGenerateReportModalOpen} onOpenChange={setIsGenerateReportModalOpen} onGenerateReport={handleGenerateReport} />
            {/* <UpdateDriverModal isOpen={isUpdateDriverModalOpen} onOpenChange={setIsUpdateDriverModalOpen} driverId={selectedDriver} onUpdateDriver={handleUpdateDriver} /> */}
        </div>
    );
};

export default AdminPage;
