export interface AuthUser{
    token: string;
    user: {
        email: string;
        id: string;
        username: string;
    };
}