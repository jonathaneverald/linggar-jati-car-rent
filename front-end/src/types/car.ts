export interface CarCardProps {
    type: string;
    car_brand: string;
    car_name: string;
    image: string;
    status: string;
    car_slug: string;
    transmission: string;
    price: number;
}

export interface CarCardDetailProps {
    type: string;
    car_brand: string;
    car_name: string;
    image: string;
    status: string;
    color: string;
    transmission: string;
    price: number;
    fuel: string;
    capacity: number;
}

export interface Car {
    id: string;
    category_id: string;
    name: string;
    car_brand: string;
    capacity: number;
    color: string;
    fuel: string;
    image: string;
    plate_number: string;
    price: number;
    registration_number: number;
    slug: string;
    status: string;
    transmission: string;
    type: string;
}

export interface CarDetailsProps {
    car?: Car;
    error?: string;
}
