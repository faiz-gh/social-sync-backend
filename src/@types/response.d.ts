export { };

declare global {

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

    interface IPagination {
        total: number;
        currentPage: number;
        totalPages: number;
        hasMore: boolean;
        results: T[];
    }

    interface ICompanyResponse extends ICompanyTable {
        socialMedia?: ISocialMediaTable[];
    }

    interface IProfileResponse extends IProfileTable {
        socialMedia?: ISocialMediaTable[];
    }
}
