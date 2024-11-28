export interface LoginResponse {
    data: {
        access_token: string;
        user: {
            email: string;
            role_id: number;
        };
    };
    message: string;
}
