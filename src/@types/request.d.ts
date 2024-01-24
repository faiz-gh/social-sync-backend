interface IPaginationRequest {
    search?: string;
    page?: number;
    perPage?: number;
    sortBy?: string;
    sortDirection?: string;
}

// Auth Service
interface IRegisterRequest {
    fullName: string;
    email: string;
    password: string;
    roleID: string;
}

interface ILoginRequest {
    email: string;
    password: string;
}

interface IRefreshTokenRequest {
    awsUserID: string;
    refreshToken: string;
}

interface IForgotPasswordRequest {
    email: string;
}

interface IResetPasswordRequest {
    email: string;
    password: string;
    code: string;
}

interface IResendCodeRequest {
    email: string;
}

interface ILogoutRequest {
    accessToken: string;
}

interface IRemoveUserRequest {
    email: string;
    accessToken: string;
}

// Client Service
interface ICreateClientRequest {
    userID: string;
    name: string;
}

interface IUpdateClientRequest {
    id: string;
    name: string;
}

interface IDeleteClientRequest {
    id: string;
}

interface IGetClientByIDRequest {
    id: string;
}

interface IGetClientsByUserIDRequest extends IPaginationRequest {
    userID: string;
}

// Account Service
interface ICreateAccountRequest {
    clientID: string;
    username: string;
    password: string;
}

interface IUpdateAccountRequest {
    id: string;
    username: string;
    password: string;
    apiKey: string;
}

interface IDeleteAccountRequest {
    id: string;
}

interface IGetAccountByIDRequest {
    id: string;
}

interface IGetAccountsByClientIDRequest extends IPaginationRequest {
    clientID: string;
}

// Post Service
interface ICreatePostRequest {
    media: string;
    location: string;
    description: string;
    accountID: string;
    postSchedule: Date;
}

interface IUpdatePostRequest {
    id: string;
    media: string;
    location: string;
    description: string;
    accountID: string;
    postSchedule: Date;
}

interface IDeletePostRequest {
    id: string;
}

interface IGetPostByIDRequest {
    id: string;
}

interface IGetPostsByAccountIDRequest extends IPaginationRequest {
    accountID: string;
}

// Analytics Service
interface ICreateAnalyticsRequest {
    postID: string;
    data: string;
}

interface IUpdateAnalyticsRequest {
    id: string;
    data: string;
}

interface IDeleteAnalyticsRequest {
    id: string;
}

interface IGetAnalyticsByIDRequest {
    id: string;
}

interface IGetAnalyticsByPostIDRequest extends IPaginationRequest {
    postID: string;
}

// Channel Service
interface ICreateChannelRequest {
    subject: string;
    userID: string;
    members: string;
}

interface IUpdateChannelRequest {
    id: string;
    subject: string;
    userID: string;
    members: string;
}

interface IDeleteChannelRequest {
    id: string;
}

interface IGetChannelByIDRequest {
    id: string;
}

interface IGetChannelsByUserIDRequest extends IPaginationRequest {
    userID: string;
}

// Chat Service
interface ICreateChatRequest {
    message: string;
    userID: string;
}

interface IGetChatByIDRequest {
    id: string;
}

interface IGetChatByChannelIDRequest extends IPaginationRequest {
    channelID: string;
}

// Task Service
interface ICreateTaskRequest {
    title: string;
    description: string;
    userID: string;
    estimatedTime?: Date;
}

interface IUpdateTaskRequest {
    id: string;
    title: string;
    description: string;
    userID: string;
    estimatedTime?: Date;
    isCompleted?: boolean;
}

interface IDeleteTaskRequest {
    id: string;
}

interface IGetTaskByIDRequest {
    id: string;
}

interface IGetTasksByUserIDRequest extends IPaginationRequest {
    userID: string;
}

// Event Service
interface ICreateEventRequest {
    title: string;
    reminder?: Date;
    scheduledAt?: Date;
    userID: string;
}

interface IUpdateEventRequest {
    id: string;
    title: string;
    reminder?: Date;
    scheduledAt?: Date;
    userID: string;
}

interface IDeleteEventRequest {
    id: string;
}

interface IGetEventByIDRequest {
    id: string;
}

interface IGetEventsByUserIDRequest extends IPaginationRequest {
    userID: string;
}

// Feedback Service
interface ICreateFeedbackRequest {
    subject: string;
    description: string;
    userID: string;
}

interface IUpdateFeedbackRequest {
    id: string;
    subject: string;
    description: string;
    userID: string;
    isOpened?: boolean;
}

interface IDeleteFeedbackRequest {
    id: string;
}

interface IGetFeedbackByIDRequest {
    id: string;
}

interface IGetFeedbacksByUserIDRequest extends IPaginationRequest {
    userID: string;
}

// Preference Service
interface ICreatePreferenceRequest {
    userID: string;
    theme: string;
    layout: string;
}

interface IUpdatePreferenceRequest {
    id: string;
    userID: string;
    theme: string;
    layout: string;
}

interface IDeletePreferenceRequest {
    id: string;
}

interface IGetPreferenceByIDRequest {
    id: string;
}
