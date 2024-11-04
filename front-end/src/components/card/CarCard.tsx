import React from "react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { formatIntToIDR } from "@/utils/currency";
import { CarCardProps } from "@/types/car";
import Image from "next/image";
import Link from "next/link";

const CarCard: React.FC<CarCardProps> = ({ car_brand, car_name, image, status, car_slug, transmission, type, price }) => {
    {
        return (
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative">
                    {image ? (
                        <Image priority width={400} height={300} src={image} alt={car_name} className="aspect-[4/3] w-full object-cover" />
                    ) : (
                        <div className="aspect-[4/3] w-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500">No Image Available</span>
                        </div>
                    )}
                    <Badge className="absolute top-3 right-3 bg-yellow-400 hover:bg-yellow-400 text-black capitalize">{transmission}</Badge>
                </div>
                <div className="p-4 space-y-2">
                    <Link href={`/cars/${car_slug}`}>
                        <h3 className="text-lg font-semibold tracking-wide">
                            {car_brand} {car_name}
                        </h3>
                    </Link>
                    <p className="text-sm text-gray-600">{type}</p>
                    <p className="text-sm text-gray-600">{status}</p>
                    <div className="flex flex-col pt-2">
                        <span className="text-primary font-bold text-lg">{formatIntToIDR(price)}</span>
                    </div>
                </div>
            </Card>
        );
    }
};

export default CarCard;
