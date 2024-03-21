interface IRoleTable {
    id?: number;
    role_name?: string;
    description?: string;
    created_date?: Date;
    last_modified?: Date;
    is_deleted?: boolean;
}

interface IUserTable {
    id?: string;
    role_id?: number;
    aws_user_id?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    created_date?: Date;
    last_modified?: Date;
    is_deleted?: boolean;
    total_clients?: number;
    company_id?: string;
}

interface ICompanyEmployeeConnectionTable {
    id?: number;
    company_id?: string;
    employee_id?: string;
}

interface IClientTable {
    id?: string;
    company_id?: string;
    employee_id?: string;
    employee_name?: string;
    name?: string;
    email?: string;
    created_date?: Date;
    last_modified?: Date;
    is_deleted?: boolean;
    total_accounts?: number;
}

interface IAccountTable {
    id?: string;
    client_id?: string;
    facebook_user_id?: string;
    page_id?: string;
    page_name?: string;
    user_access_token?: string;
    page_access_token?: string;
    created_date?: Date;
    last_modified?: Date;
    is_deleted?: boolean;
    total_posts?: number;
}

interface IPostTable {
    id?: string;
    account_id?: string;
    media?: string[];
    location?: string;
    description?: string;
    tags?: string[];
    post_schedule?: Date;
    created_date?: Date;
    last_modified?: Date;
    is_deleted?: boolean;
}

interface IEventTable {
    id?: string;
    company_id?: string;
    title?: string;
    description?: string;
    location?: string;
    start_date?: Date;
    end_date?: Date;
    created_date?: Date;
    last_modified?: Date;
    is_deleted?: boolean;
}

interface IFeedbackTable {
    id?: string;
    user_id?: string;
    subject?: string;
    description?: string;
    created_date?: Date;
    is_opened?: boolean;
    is_deleted?: boolean;
}
