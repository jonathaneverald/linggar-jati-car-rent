import { getToken } from "@/utils/tokenUtils";
import axios from "axios";
import { log } from "node:console";
import { useState } from "react";
import { SubmitHandler } from "react-hook-form";

type GenerateReportForm = {
    from_month: string;
    from_year: string;
    to_month: string;
    to_year: string;
};

const useGenerateReport = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const onSubmit: SubmitHandler<GenerateReportForm> = async (data) => {
        // Don't proceed if already loading
        if (loading) return;

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const token = getToken();
            const response = await axios.post("http://localhost:5000/transactions/generate_report", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                responseType: "blob", // Important for handling binary file
            });

            // Create a link and download the file
            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = "transaction_report.xlsx"; // File name
            link.click();
            window.URL.revokeObjectURL(link.href);

            setSuccess(true);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || "Failed to generate report";
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        onSubmit,
        loading,
        error,
        success,
    };
};

export default useGenerateReport;
