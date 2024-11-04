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
