interface DefaultServiceResponse {
    message: string;
    data?: unknown;
}

interface DefaultServiceErrorResponse {
    message: string;
    debugInfo: string;
    timestamp: string;
    error?: string;
}

// Auth Service
interface IRegisterResponse {
    message: string;
    data: IUserTable;
}