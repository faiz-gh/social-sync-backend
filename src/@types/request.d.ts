interface IPaginationRequest {
    page?: number;
    perPage?: number;
    sortBy?: string;
    sortDirection?: string;
}

interface ICreateUserRequest {
    fullName: string;
    email: string;
    password: string;
    roleID: string;
}

interface IUserLoginRequest {
    email: string;
    password: string;
}

interface IResetUserPasswordRequest {
    email: string;
    password: string;
    code: string;
}
