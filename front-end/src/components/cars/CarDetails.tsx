import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CarCardDetailProps } from "@/types/car";
import Image from "next/image";
import { formatIntToIDR } from "@/utils/currency";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { RadioGroupItem } from "@radix-ui/react-radio-group";
import { Checkbox } from "../ui/checkbox";
import { format } from "date-fns-tz";
import useCreateTransaction from "@/hooks/useCreateTransaction";
import useFetchAvailableDrivers from "@/hooks/useFetchAvailableDrivers";
import { getToken } from "@/utils/tokenUtils";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";

type Driver = {
    id: string;
    name: string;
};

const CarDetailsCard: React.FC<CarCardDetailProps> = ({ image, additional_images, type, transmission, car_brand, car_name, capacity, fuel, color, price, status }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [showDateInput, setShowDateInput] = useState(true);
    const [endDate, setEndDate] = useState("");
    const [useDriver, setUseDriver] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
    const [showDriverOptions, setShowDriverOptions] = useState(false);
    const { onSubmit, loading: transactionLoading, error: transactionError, success } = useCreateTransaction();
    const [showAlert, setShowAlert] = useState(false);
    const [alertType, setAlertType] = useState<"success" | "error" | "info">("success");
    const [alertMessage, setAlertMessage] = useState("");
    const [availableDrivers, setAvailableDrivers] = useState<Driver[]>([]);
    const allImages = [image, ...(additional_images?.map((img) => img.url) || [])].filter(Boolean) as string[];

    const token = getToken();

    // Use the hook to fetch available drivers
    const { drivers, loading, error } = useFetchAvailableDrivers(token as string);

    const handleDriverSelect = (driverName: string | null) => {
        setSelectedDriver(driverName); // Set the selected driver's name or clear it
    };

    // Function to determine badge color based on status
    const getStatusColor = (status: CarCardDetailProps["status"]) => {
        switch (status.toLowerCase()) {
            case "available":
                return "bg-green-100 text-green-800";
            case "reserved":
                return "bg-yellow-100 text-yellow-800";
            case "maintenance":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const handleRentClick = async () => {
        try {
            // Create a request payload
            const requestData: any = {
                car_name: car_name,
                start_date: startDate,
                end_date: endDate,
            };
            // Only include driver_name if it's not null
            if (selectedDriver) {
                requestData.driver_name = selectedDriver;
            }
            await onSubmit(requestData); // Pass the adjusted payload to the API call
            setAlertType("success");
            setAlertMessage("Transaction created successfully!");
            setShowAlert(true);
            setIsModalOpen(false);
        } catch (err: any) {
            setAlertType("error");
            setAlertMessage(err.response?.data?.message || err.message || "Failed to create transaction");
            setShowAlert(true);
        }
    };

    const handleModalOpen = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setStartDate("");
        setEndDate("");
        setUseDriver(false);
        setSelectedDriver(null);
    };

    const handleNextClick = () => {
        // Validate start and end date
        // If valid, proceed to the next step
        setShowDateInput(false);
        setShowDriverOptions(true);
    };

    const handleUseDriverChange = (value: boolean) => {
        setUseDriver(true);
        setSelectedDriver(null);
    };

    // Get the current date
    const currentDate = format(new Date(), "yyyy-MM-dd", { timeZone: "Asia/Jakarta" });
    const currentDateString = currentDate.toString().split("T")[0];

    // Function to calculate the minimum end date
    const getMinEndDate = (startDateString: string): string => {
        const startDate = new Date(startDateString);
        const minEndDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
        return minEndDate.toISOString().split("T")[0];
    };

    return (
        <Card className="w-full bg-white shadow-lg rounded-lg">
            <CardContent className="p-4 md:p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    {/* Left side - Image */}
                    <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] bg-gray-100 rounded-lg overflow-hidden">
                        {allImages.length > 1 ? (
                            // If there's more than one image, render the Carousel
                            <Carousel className="w-full h-full">
                                <CarouselContent className="-ml-0 h-full">
                                    {allImages.map((imgUrl, index) => (
                                        <CarouselItem key={index} className="relative basis-full pl-0 h-[300px] md:h-[400px] lg:h-[500px]">
                                            <Image
                                                src={imgUrl}
                                                alt={`${car_name} image ${index + 1}`}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                priority={index === 0}
                                            />
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                {/* Add navigation buttons inside the container */}
                                <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10" />
                                <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10" />
                            </Carousel>
                        ) : (
                            // Otherwise, render a single static image (or a placeholder)
                            <>
                                {allImages.length === 1 ? (
                                    <Image src={allImages[0]} alt={car_name} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" priority />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full text-gray-400">Car Image</div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Right side - Details */}
                    <div className="space-y-6">
                        <div className="flex gap-3">
                            <Badge variant="outline" className="text-sm md:text-base">
                                {type}
                            </Badge>
                            <Badge variant="outline" className="text-sm md:text-base">
                                {transmission}
                            </Badge>
                        </div>

                        <div className="space-y-2">
                            <p className="text-base text-gray-600">{car_brand}</p>
                            <h2 className="text-3xl md:text-4xl font-bold">{car_name}</h2>
                        </div>

                        <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                            <div className="flex justify-between">
                                <span className="text-base">Seat capacity:</span>
                                <span className="text-base font-medium">{capacity}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-base">Fuel type:</span>
                                <span className="text-base font-medium">{fuel}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-base">Color:</span>
                                <span className="text-base font-medium">{color}</span>
                            </div>
                        </div>

                        <div className="pt-2">
                            <Badge className={`text-base ${getStatusColor(status)}`}>{status}</Badge>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <span className="text-3xl md:text-4xl font-bold">{formatIntToIDR(price)}</span>
                                <span className="text-gray-600 text-lg">/day</span>
                            </div>
                            <Button className="w-full text-lg py-6" disabled={status.toLowerCase() !== "available"} onClick={handleModalOpen}>
                                Rent this car
                            </Button>
                        </div>
                    </div>
                </div>
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl w-full max-w-lg p-8 shadow-lg">
                            <CardHeader className="text-center mb-6">
                                <CardTitle className="text-2xl font-semibold">Rent "{car_name}"</CardTitle>
                            </CardHeader>
                            {showDateInput ? (
                                <>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                                            <Input
                                                type="date"
                                                value={startDate}
                                                onChange={(e) => {
                                                    const newStartDate = e.target.value;
                                                    setStartDate(newStartDate);
                                                    if (endDate && newStartDate > endDate) {
                                                        setEndDate("");
                                                    }
                                                }}
                                                className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                min={currentDateString}
                                            />
                                        </div>
                                        {startDate && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                                                <Input
                                                    type="date"
                                                    value={endDate}
                                                    onChange={(e) => {
                                                        const newEndDate = e.target.value;
                                                        setEndDate(newEndDate);
                                                    }}
                                                    className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min={getMinEndDate(startDate)}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-6 flex flex-col gap-4">
                                        <Button
                                            onClick={handleNextClick}
                                            disabled={!startDate || !endDate}
                                            className={`w-full py-3 text-lg font-semibold ${
                                                startDate && endDate ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                            } rounded-lg transition-all`}
                                        >
                                            Next
                                        </Button>
                                        <Button onClick={handleModalClose} className="w-full py-3 text-lg font-semibold bg-red-600 text-white hover:bg-red-700 rounded-lg transition-all">
                                            Cancel
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="space-y-4">
                                        <div className="font-medium text-center mb-6">Do you want to use a driver?</div>
                                        <RadioGroup
                                            value={useDriver ? "yes" : "no"}
                                            onValueChange={(value) => {
                                                if (value === "no") {
                                                    setUseDriver(false);
                                                    setSelectedDriver(null); // Reset selected driver
                                                } else {
                                                    setUseDriver(true);
                                                }
                                            }}
                                            className="flex justify-center space-x-6 mb-6"
                                        >
                                            <RadioGroupItem
                                                value="yes"
                                                className={`py-2 px-4 rounded-lg border cursor-pointer transition-all ${
                                                    useDriver ? "bg-green-500 text-black hover:bg-green-600" : "bg-white text-black border-gray-300 hover:bg-green-600"
                                                }`}
                                            >
                                                Yes
                                            </RadioGroupItem>
                                            <RadioGroupItem
                                                value="no"
                                                className={`py-2 px-4 rounded-lg border cursor-pointer transition-all ${
                                                    !useDriver ? "bg-green-500 text-black hover:bg-green-600" : "bg-white text-black border-gray-300 hover:bg-green-600"
                                                }`}
                                            >
                                                No
                                            </RadioGroupItem>
                                        </RadioGroup>

                                        {/* Driver Selection Section */}
                                        {useDriver && (
                                            <div className="space-y-4">
                                                <div className="font-medium text-lg">Available Drivers:</div>
                                                {drivers && drivers.length > 0 ? (
                                                    drivers.map((driver) => (
                                                        <div key={driver.id} className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id={driver.id}
                                                                onCheckedChange={(checked) => handleDriverSelect(checked ? driver.name : null)}
                                                                checked={selectedDriver === driver.name}
                                                            />
                                                            <label htmlFor={driver.id} className="text-gray-700">
                                                                {driver.name}
                                                            </label>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p>No drivers available</p>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Conditional Rendering of Rent Button */}
                                    {!useDriver || (useDriver && selectedDriver) ? (
                                        <div className="mt-6 flex flex-col gap-4">
                                            <Button onClick={handleRentClick} className="w-full py-3 text-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-all">
                                                Rent
                                            </Button>
                                        </div>
                                    ) : null}

                                    <div className="mt-6 flex flex-col gap-4">
                                        <Button onClick={handleModalClose} className="w-full py-3 text-lg font-semibold bg-red-600 text-white hover:bg-red-700 rounded-lg transition-all">
                                            Cancel
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default CarDetailsCard;
