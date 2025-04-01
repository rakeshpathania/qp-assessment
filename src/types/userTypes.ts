export interface RegisterUserRequest {
    name: string;
    email: string;
    password: string;
}

export interface LoginUserRequest {
    email: string;
    password: string;
}

export interface UserResponse {
    user: {
        id: number;
        name: string;
        email: string;
    },
    token: string;
}
export interface UserData {
    name: string;
    email: string;
    password: string;
}
export interface LogoutData {
    token: string;
    userId: number;
}