// Auth Service
interface IRegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    roleId: number;
}

interface ILoginRequest {
    email: string;
}

interface IVerifyOtpRequest {
    email: string;
    code: string;
    session: string;
}

interface IRefreshTokenRequest {
    awsUserId: string;
    refreshToken: string;
}

interface ILogoutRequest {
    accessToken: string;
}

interface IRemoveUserRequest {
    email: string;
    accessToken: string;
}

// Employee Service
interface ICreateEmployeeRequest {
    companyId: string;
    firstName: string;
    lastName: string;
    email: string;
}

interface IUpdateEmployeeRequest {
    id: string;
    firstName: string;
    lastName: string;
    roleId: number;
}

interface IGetEmployeesByCompanyRequest {
    companyId: string;
}

interface IGetEmployeeRequest {
    id: string;
}

// Client Service
interface ICreateClientRequest {
    companyId: string;
    employeeId: string;
    name: string;
    email: string;
}

interface IUpdateClientRequest {
    id: string;
    employeeId: string;
    name: string;
    email: string;
}

interface IDeleteClientRequest {
    id: string;
}

interface IGetClientRequest {
    id: string;
}

interface IGetClientsByCompanyRequest {
    companyId: string;
}

interface IGetClientsByEmployeeRequest {
    employeeId: string;
}

// Account Service
interface ICreateAccountRequest {
    clientId: string;
    accessToken: string;
    facebookUserId: string;
    pageId: string;
    pageName: string;
}

interface IUpdateAccountRequest {
    id: string;
    accountType: string;
    accessToken: string;
}

interface IDeleteAccountRequest {
    id: string;
}

interface IGetAccountRequest {
    id: string;
}

interface IGetAccountsByClientRequest {
    clientId: string;
}

// Post Service
interface ICreatePostRequest {
    accountId: string;
    media?: string[];
    location?: string;
    description: string;
    tags?: string[];
    postSchedule?: Date;
}

interface IUpdatePostRequest {
    id: string;
    media: string[];
    location: string;
    description: string;
    tags: string[];
    postSchedule: Date;
}

interface IDeletePostRequest {
    id: string;
}

interface IGetPostRequest {
    id: string;
}

interface IGetPostsByAccountRequest {
    accountId: string;
}

interface IGetPostsByClientRequest {
    clientId: string;
}

interface IGetPostsByEmployeeRequest {
    employeeId: string;
}

interface IGetPostsByCompanyRequest {
    companyId: string;
}

// Event Service
interface ICreateEventRequest {
    companyId: string;
    title: string;
    description: string;
    location: string;
    startDate: Date;
    endDate: Date;
}

interface IUpdateEventRequest {
    id: string;
    title: string;
    description: string;
    location: string;
    startDate: Date;
    endDate: Date;
}

interface IDeleteEventRequest {
    id: string;
}

interface IGetEventRequest {
    id: string;
}

interface IGetEventsByCompanyRequest {
    companyId: string;
}

// Feedback Service
interface ICreateFeedbackRequest {
    userId: string;
    subject: string;
    description: string;
}

interface IUpdateFeedbackRequest {
    id: string;
    subject: string;
    description: string;
    isOpened?: boolean;
}

interface IDeleteFeedbackRequest {
    id: string;
}

interface IGetFeedbackRequest {
    id: string;
}

interface IGetFeedbacksByUserRequest {
    userId: string;
}

// Analytics Service
interface IGetCompanyDashboardAnalyticsRequest {
    companyId: string;
}
