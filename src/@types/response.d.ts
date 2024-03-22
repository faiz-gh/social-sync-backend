import { InitiateAuthCommandOutput } from "@aws-sdk/client-cognito-identity-provider";

declare global {
    interface DefaultServiceResponse {
        message: string;
        debugInfo?: string;
        timestamp?: string;
        error?: string;
        data?: unknown;
    }

    interface DefaultServiceErrorResponse {
        message: string;
        debugInfo: string;
        timestamp: string;
        error?: string;
    }

    // Auth Service
    interface IRegisterResponse extends DefaultServiceResponse {
        data?: IUserTable;
    }

    interface ILoginResponse extends DefaultServiceResponse {
        data?: InitiateAuthCommandOutput;
    }

    interface IVerifyOtpResponse extends DefaultServiceResponse {
        data?: IUserTable & {
            accessToken: string,
            refreshToken: string,
            idToken: string,
        };
    }

    interface IRefreshTokenResponse extends DefaultServiceResponse {
        data?: {
            accessToken: string,
            idToken: string,
        };
    }

    interface ILogoutResponse extends DefaultServiceResponse {
        data?: null;
    }

    interface IRemoveUserResponse extends DefaultServiceResponse {
        data?: null;
    }

    // Employee Service
    interface ICreateEmployeeResponse extends DefaultServiceResponse {
        data?: IUserTable;
    }

    interface IUpdateEmployeeResponse extends DefaultServiceResponse {
        data?: IUserTable;
    }

    interface IGetEmployeeResponse extends DefaultServiceResponse {
        data?: IUserTable;
    }

    interface IGetEmployeesByCompanyResponse extends DefaultServiceResponse {
        data?: IUserTable[];
    }

    // Client Service
    interface ICreateClientResponse extends DefaultServiceResponse {
        data?: IClientTable;
    }

    interface IUpdateClientResponse extends DefaultServiceResponse {
        data?: IClientTable;
    }

    interface IRemoveClientResponse extends DefaultServiceResponse {
        data?: IClientTable;
    }

    interface IGetClientResponse extends DefaultServiceResponse {
        data?: IClientTable;
    }

    interface IGetClientsByCompanyResponse extends DefaultServiceResponse {
        data?: IClientTable[];
    }

    interface IGetClientsByEmployeeResponse extends DefaultServiceResponse {
        data?: IClientTable[];
    }

    // Account Service
    interface ICreateAccountResponse extends DefaultServiceResponse {
        data?: IAccountTable;
    }

    interface IUpdateAccountResponse extends DefaultServiceResponse {
        data?: IAccountTable;
    }

    interface IRemoveAccountResponse extends DefaultServiceResponse {
        data?: IAccountTable;
    }

    interface IGetAccountResponse extends DefaultServiceResponse {
        data?: IAccountTable;
    }

    interface IGetAccountsByClientResponse extends DefaultServiceResponse {
        data?: IAccountTable[];
    }

    // Post Service
    interface ICreatePostResponse extends DefaultServiceResponse {
        data?: {
            post: IPostTable,
            postResponse: unknown
        };
    }

    interface IGetPostResponse extends DefaultServiceResponse {
        data?: IPostTable;
    }

    interface IGetPostsByAccountResponse extends DefaultServiceResponse {
        data?: IPostTable[];
    }

    interface IGetPostsByClientResponse extends DefaultServiceResponse {
        data?: IPostTable[];
    }

    interface IGetPostsByEmployeeResponse extends DefaultServiceResponse {
        data?: IPostTable[];
    }

    interface IGetPostsByCompanyResponse extends DefaultServiceResponse {
        data?: IPostTable[];
    }

    // Event Service
    interface ICreateEventResponse extends DefaultServiceResponse {
        data?: IEventTable;
    }

    interface IUpdateEventResponse extends DefaultServiceResponse {
        data?: IEventTable;
    }

    interface IDeleteEventResponse extends DefaultServiceResponse {
        data?: IEventTable;
    }

    interface IGetEventResponse extends DefaultServiceResponse {
        data?: IEventTable;
    }

    interface IGetEventsByCompanyResponse extends DefaultServiceResponse {
        data?: IEventTable[];
    }

    interface IGetCompanyDashboardAnalyticsResponse extends DefaultServiceResponse {
        data?: {
            total_posts: number;
            total_employees: number;
            total_clients: number;
            total_accounts: number;
        };
    }
}