export { };

declare global {

    interface IUserTable {
        id?: string;
        name?: string;
        email?: string;
        password?: string;
        user_role?: 'user' | 'company';
        is_verified?: boolean;
        created_at?: Date;
        updated_at?: Date;
        aws_user_id?: string;
    }

    interface ICompanyTable {
        id?: string;
        name?: string;
        email?: string;
        mobile_no?: string;
        telephone?: string;
        address?: string;
        about?: string;
        licence?: string;
        company_code?: string;
        industry?: string;
        website?: string;
        logo_url?: string;
        cover_url?: string;
        created_at?: Date;
        updated_at?: Date;
        user_id?: string;
    }

    interface IProfileTable {
        id?: string;
        name?: string;
        email?: string;
        mobile_no?: string;
        telephone?: string;
        address?: string;
        job_title?: string;
        about?: string;
        image_url?: string;
        cover_url?: string;
        created_at?: Date;
        updated_at?: Date;
        user_id?: string;
        username?: string;
        company_id?: string;
    }

    interface ISocialMediaTable {
        id?: string;
        name?: 'linkedin' | 'twitter' | 'whatsapp' | 'instagram';
        url?: string;
        type?: 'profile' | 'company';
        created_at?: Date;
        updated_at?: Date;
        profile_id?: string;
        company_id?: string;
    }

    interface ILeadTable {
        id?: string;
        name?: string;
        email?: string;
        phone?: string;
        company_name?: string;
        type?: 'profile' | 'company';
        created_at?: Date;
        updated_at?: Date;
        company_id?: string;
        profile_id?: string;
    }

    interface ICardTable {
        id?: string;
        access_mode?: 'profile' | 'vcard' | 'lead' | 'whatsapp',
        type?: 'profile' | 'company';
        created_at?: Date,
        updated_at?: Date,
        company_id?: string;
        profile_id?: string;
    }

    interface IEventBadgeTable {
        id?: string;
        logo?: boolean;
        name?: boolean;
        company?: boolean;
        job_title?: boolean;
        website?: boolean;
        layout?: 'portrait' | 'landscape' | 'square';
        type?: 'company' | 'profile';
        profile_id?: string;
        company_id?: string;
        created_at?: Date;
        updated_at?: Date;
    }
}
