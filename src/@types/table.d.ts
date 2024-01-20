interface IRoleTable {
    id?: string;
    roleName: string;
    description: string;
    createdDate?: Date;
    lastModified?: Date;
    isDeleted?: boolean;
}

interface IUserTable {
    id?: string;
    role_id: string;
    aws_user_id: string;
    full_name: string;
    email: string;
    password: string;
    is_email_validated?: boolean;
    is_activated?: boolean;
    created_date?: Date;
    last_modified?: Date;
    is_deleted?: boolean;
}

interface IClientTable {
    id?: string;
    userID: string;
    name: string;
    createdDate?: Date;
    lastModified?: Date;
    isDeleted?: boolean;
}

interface IAccountTable {
    id?: string;
    clientID: string;
    username: string;
    password: string;
    apiKey: string;
    createdDate?: Date;
    lastModified?: Date;
    isDeleted?: boolean;
}

interface IPostTable {
    id?: string;
    media: string;
    location: string;
    description: string;
    accountID: string;
    postSchedule: Date;
    createdDate?: Date;
    lastModified?: Date;
    isDeleted?: boolean;
}

interface IAnalyticsTable {
    id?: string;
    postID: string;
    data: string;
    createdDate?: Date;
}

interface IChannelTable {
    id?: string;
    subject: string;
    userID: string;
    members: string;
    createdDate?: Date;
    lastModified?: Date;
    isDeleted?: boolean;
}

interface IChatTable {
    id?: string;
    message: string;
    userID: string;
    createdDate?: Date;
    isDeleted?: boolean;
}

interface INoteTable {
    id?: string;
    subject: string;
    content: string;
    userID: string;
    createdDate?: Date;
    lastModified?: Date;
    isDeleted?: boolean;
}

interface ITaskTable {
    id: string;
    title: string;
    description: string;
    userID: string;
    createdDate?: Date;
    lastModified?: Date;
    estimatedTime?: Date;
    timeTaken?: Date;
    isCompleted?: boolean;
    isDeleted?: boolean;
}

interface IEventTable {
    id: string;
    title: string;
    reminder?: Date;
    scheduledAt?: Date;
    userID: string;
    createdDate?: Date;
    lastModified?: Date;
    isDeleted?: boolean;
}

interface IFeedbackTable {
    id: string;
    subject: string;
    description: string;
    userID: string;
    createdDate?: Date;
    isOpened?: boolean;
    isDeleted?: boolean;
}

interface IPreferenceTable {
    id: string;
    userID: string;
    theme: string;
    layout: string;
    lastModified?: Date;
}