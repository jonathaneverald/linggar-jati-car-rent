import React, { useState } from "react";
import { GetServerSideProps } from "next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatIntToIDR } from "@/utils/currency";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import useFetchTransactions from "@/hooks/useTransactionCustomer";
import { mutate } from "swr";
import Image from "next/image";
import { useReturnCar } from "@/hooks/useReturnCar";
import { format } from "date-fns-tz";
import { useUploadPayment } from "@/hooks/useUploadPayment";

const statusColorMap = new Map<string, string>([
    ["in progress", "bg-blue-300 text-blue-800 hover:bg-blue-400 hover:text-blue-900"],
    ["success", "bg-green-300 text-green-800 hover:bg-green-400 hover:text-green-900"],
    ["pending", "bg-yellow-300 text-black hover:bg-yellow-400"],
    ["canceled", "bg-red-300 text-red-800 hover:bg-red-400 hover:text-red-900"],
    ["invalid", "bg-red-300 text-red-800 hover:bg-red-400 hover:text-red-900"],
]);

const getStatusColor = (status: string): string => {
    return statusColorMap.get(status.toLowerCase()) || "bg-gray-300 text-gray-800 hover:bg-gray-400 hover:text-gray-900";
};

const TransactionsPage: React.FC = () => {
    const [page, setPage] = useState(1);
    const { transactions, pagination, isLoading, isError } = useFetchTransactions({ page, per_page: 10 });
    const { returnCar, isReturning, error: returnError } = useReturnCar();
    const { uploadPayment, isUploading, error: uploadError } = useUploadPayment();

    const handleReturnCar = async (transactionId: number) => {
        // Get today's date in YYYY-MM-DD format
        const today = format(new Date(), "yyyy-MM-dd", { timeZone: "Asia/Jakarta" });
        const success = await returnCar(transactionId, today);

        if (success) {
            console.log(`Car returned successfully for transaction ${transactionId}`);
        } else {
            console.error("Failed to return car:", returnError);
        }
    };

    const handleUploadPayment = async (transactionId: number) => {
        // Open file dialog and get the selected file
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*";
        fileInput.onchange = async (event) => {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (file) {
                const success = await uploadPayment(transactionId, file);
                if (success) {
                    console.log("Payment proof uploaded successfully");
                } else {
                    console.error("Failed to upload payment proof:", uploadError);
                }
            }
        };
        fileInput.click();
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    if (isLoading || isReturning) return <div>Loading...</div>;
    if (isError) return <div>Error: {isError.message}</div>;
    if (returnError) return <div>Error returning car: {returnError}</div>;

    return (
        <div className="bg-gray-50 shadow-sm rounded-lg p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-extrabold text-gray-900">Transactions</h1>
                <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600">Total Transactions: {transactions.length}</span>
                </div>
            </div>

            {transactions.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 text-lg">No transactions found.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <Table className="min-w-full divide-y divide-gray-200">
                            <TableHeader className="bg-gray-50">
                                <TableRow className="hover:bg-gray-100 transition-colors">
                                    <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</TableHead>
                                    <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car</TableHead>
                                    <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</TableHead>
                                    <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rental Status</TableHead>
                                    <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</TableHead>
                                    <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost</TableHead>
                                    <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Late Fee</TableHead>
                                    <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</TableHead>
                                    <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</TableHead>
                                    <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return Date</TableHead>
                                    <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="bg-white divide-y divide-gray-200">
                                {transactions.map((transaction) => (
                                    <TableRow key={transaction.id} className="hover:bg-gray-50 transition-colors">
                                        <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.invoice}</TableCell>
                                        <TableCell className="px-4 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{transaction.car_data.car_brand}</div>
                                                    <div className="text-sm text-gray-500">{transaction.car_data.car_name}</div>
                                                    <div className="text-sm text-gray-500">{formatIntToIDR(Number(transaction.car_data.car_price))}/day</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div className="flex items-center">
                                                <div>
                                                    {transaction.driver_data ? (
                                                        <>
                                                            <div className="text-sm font-medium text-gray-900">{transaction.driver_data.driver_name}</div>
                                                            <div className="text-sm text-gray-500">Rp. 100.000/day</div>
                                                        </>
                                                    ) : (
                                                        "None"
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-4 whitespace-nowrap">
                                            <Badge className={`uppercase font-semibold ${getStatusColor(transaction.rental_status.toLowerCase())}`}>{transaction.rental_status}</Badge>
                                        </TableCell>
                                        <TableCell className="px-4 py-4 whitespace-nowrap">
                                            <Badge className={`uppercase font-semibold ${getStatusColor(transaction.payment_status.toLowerCase())}`}>{transaction.payment_status}</Badge>
                                        </TableCell>
                                        <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{formatIntToIDR(Number(transaction.total_cost))}</TableCell>
                                        <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {transaction.late_fee ? formatIntToIDR(Number(transaction.late_fee)) : "None"}
                                        </TableCell>
                                        <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(transaction.start_date).toLocaleDateString()}</TableCell>
                                        <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(transaction.end_date).toLocaleDateString()}</TableCell>
                                        <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {/* {transaction.return_date && transaction.rental_status === "In Progress" ? new Date(transaction.return_date).toLocaleDateString() : "In Progress"} */}
                                            {transaction.return_date != null && new Date(transaction.return_date).toLocaleDateString()}
                                            {transaction.rental_status === "In Progress" && "In Progress"}
                                            {transaction.rental_status === "Pending" && "Pending"}
                                            {transaction.rental_status === "Canceled" && "Canceled"}
                                        </TableCell>
                                        <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {transaction.rental_status === "In Progress" && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="hover:bg-blue-50 hover:border-blue-300 transition-colors"
                                                    onClick={() => handleReturnCar(transaction.id)}
                                                    disabled={isReturning}
                                                >
                                                    Return the car
                                                </Button>
                                            )}
                                            {transaction.payment_status === "Pending" && transaction.payment_proof === null && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="hover:bg-blue-50 hover:border-blue-300 transition-colors"
                                                    onClick={() => handleUploadPayment(transaction.id)}
                                                    disabled={isUploading}
                                                >
                                                    Upload Payment Proof
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600">
                            Page {pagination.current_page} of {pagination.total_pages}
                        </div>
                        <div className="space-x-2">
                            <Button variant="outline" disabled={!pagination.prev_page} onClick={() => handlePageChange(pagination.current_page - 1)} className="hover:bg-gray-100 transition-colors">
                                Previous
                            </Button>
                            <Button variant="outline" disabled={!pagination.next_page} onClick={() => handlePageChange(pagination.current_page + 1)} className="hover:bg-gray-100 transition-colors">
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransactionsPage;
