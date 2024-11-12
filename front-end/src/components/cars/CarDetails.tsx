import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CarCardDetailProps } from "@/types/car";
import Image from "next/image";
import { formatIntToIDR } from "@/utils/currency";

const CarDetailsCard: React.FC<CarCardDetailProps> = ({ image, type, transmission, car_brand, car_name, capacity, fuel, color, price, status }) => {
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

    return (
        <Card className="w-full bg-white shadow-lg rounded-lg">
            <CardContent className="p-4 md:p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    {/* Left side - Image */}
                    <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] bg-gray-100 rounded-lg overflow-hidden">
                        {image ? (
                            <Image src={image} alt={car_name} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" priority />
                        ) : (
                            <div className="flex items-center justify-center w-full h-full text-gray-400">Car Image</div>
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
                            <Button className="w-full text-lg py-6" disabled={status.toLowerCase() !== "available"}>
                                Rent this car
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default CarDetailsCard;
