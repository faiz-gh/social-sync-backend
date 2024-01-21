interface IRoleTable {
    id?: string;
    role_name: string;
    description: string;
    created_date?: Date;
    last_modified?: Date;
    is_deleted?: boolean;
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
    user_id: string;
    name: string;
    created_date?: Date;
    last_modified?: Date;
    is_deleted?: boolean;
}

interface IAccountTable {
    id?: string;
    client_id: string;
    username: string;
    password: string;
    api_key: string;
    created_date?: Date;
    last_modified?: Date;
    is_deleted?: boolean;
}

interface IPostTable {
    id?: string;
    media: string;
    location: string;
    description: string;
    account_id: string;
    post_schedule: Date;
    created_date?: Date;
    last_modified?: Date;
    is_deleted?: boolean;
}

interface IAnalyticsTable {
    id?: string;
    post_id: string;
    data: string;
    created_date?: Date;
}

interface IChannelTable {
    id?: string;
    subject: string;
    user_id: string;
    members: string;
    created_date?: Date;
    last_modified?: Date;
    is_deleted?: boolean;
}

interface IChatTable {
    id?: string;
    message: string;
    user_id: string;
    created_date?: Date;
    is_deleted?: boolean;
}

interface INoteTable {
    id?: string;
    subject: string;
    content: string;
    user_id: string;
    created_date?: Date;
    last_modified?: Date;
    is_deleted?: boolean;
}

interface ITaskTable {
    id: string;
    title: string;
    description: string;
    user_id: string;
    created_date?: Date;
    last_modified?: Date;
    estimated_time?: Date;
    time_taken?: Date;
    is_completed?: boolean;
    is_deleted?: boolean;
}

interface IEventTable {
    id: string;
    title: string;
    reminder?: Date;
    scheduled_at?: Date;
    user_id: string;
    created_date?: Date;
    last_modified?: Date;
    is_deleted?: boolean;
}

interface IFeedbackTable {
    id: string;
    subject: string;
    description: string;
    user_id: string;
    created_date?: Date;
    is_opened?: boolean;
    is_deleted?: boolean;
}

interface IPreferenceTable {
    id: string;
    user_id: string;
    theme: string;
    layout: string;
    last_modified?: Date;
}