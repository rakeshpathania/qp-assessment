export interface RegisterAdminRequest {
    name: string;
    email: string;
    password: string;
}

export interface LoginAdminRequest {
    email: string;
    password: string;
}

export interface AdminResponse {
    admin: {
        id: number;
        name: string;
        email: string;
    },
    token: string;
}
export interface AdminData {
    name: string;
    email: string;
    password: string;
}
export interface LogoutData {
    token: string;
    userId: number;
}