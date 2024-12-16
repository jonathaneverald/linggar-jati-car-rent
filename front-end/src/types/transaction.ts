export interface Car {
    car_brand: string;
    car_image: string;
    car_name: string;
    car_price: number;
    car_slug: string;
    car_type: string;
}

export interface Driver {
    driver_name: string;
    driver_phone_number: string;
}

export interface Transaction {
    id: number;
    user_id: number;
    car_id: number;
    driver_id: number | null; // nullable, if not using driver
    car_data: Car;
    driver_data: Driver | null;
    invoice: string;
    start_date: string;
    end_date: string;
    return_date: string | null;
    rental_status: string;
    payment_status: string;
    payment_proof: string;
    late_fee: number;
    rent_duration: number;
    total_cost: number;
}
