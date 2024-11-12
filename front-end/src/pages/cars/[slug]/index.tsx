import React from "react";
import { GetServerSideProps } from "next";
import useFetchCarDetails from "@/hooks/useFetchCarDetails";
import CarDetailsCard from "@/components/cars/CarDetails";
import { CarDetailsProps } from "@/types/car";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export const getServerSideProps: GetServerSideProps<CarDetailsProps> = async (context) => {
    const slug = context.query.slug as string;
    const authToken = context.req.cookies.jwtToken;

    try {
        const car = await useFetchCarDetails(slug, authToken as string);
        return { props: { car: car.data } };
    } catch (error) {
        return { props: { error: (error as Error).message } };
    }
};

const CarDetails: React.FC<CarDetailsProps> = ({ car, error }) => {
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-4">
                <div className="max-w-3xl mx-auto pt-8">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                </div>
            </div>
        );
    }

    if (!car) {
        return (
            <div className="min-h-screen bg-gray-50 p-4">
                <div className="max-w-3xl mx-auto pt-8">
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Not Found</AlertTitle>
                        <AlertDescription>The requested car could not be found.</AlertDescription>
                    </Alert>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 p-4 md:p-6 lg:p-8">
            <div className="container mx-auto">
                <CarDetailsCard
                    image={car.image}
                    type={car.type}
                    transmission={car.transmission}
                    car_brand={car.car_brand}
                    car_name={car.name}
                    capacity={car.capacity}
                    fuel={car.fuel}
                    color={car.color}
                    price={car.price}
                    status={car.status}
                />
            </div>
        </div>
    );
};

export default CarDetails;
