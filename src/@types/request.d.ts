export { };

declare global {
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

    interface IVerifyUserRequest {
        email: string;
        code: string;
    }

    interface IResetUserPasswordRequest {
        email: string;
        password: string;
        code: string;
    }

    interface ICompanyRequest {
        name: string;
        email: string;
        mobile_no: string;
        about?: string;
        telephone?: string;
        industry?: string;
        address?: string;
        licence?: string;
        website?: string;
        instagram?: string;
        twitter?: string;
        linkedin?: string;
        whatsapp?: string;
    }

    interface ICompanyFilesRequest {
        logo?: Express.Multer.File[];
        cover?: Express.Multer.File[];
    }

    interface ICompanyGetByParametersRequest {
        userId?: string;
        companyCode?: string;
        email?: string;
    }

    interface IProfileRequest {
        companyId: string;
        name: string;
        email: string;
        mobile_no: string;
        about?: string;
        telephone?: string;
        address?: string;
        job_title?: string;
        website?: string;
        instagram?: string;
        twitter?: string;
        linkedin?: string;
        whatsapp?: string;
        isAdminProfile?: string;
    }

    interface IProfileFilesRequest {
        pic?: Express.Multer.File[];
        cover?: Express.Multer.File[];
    }

    interface IProfileGetByParametersRequest {
        userId?: string;
        email?: string;
    }

    interface IProfileGetByCompanyRequest extends IPaginationRequest {
        companyId: string;
        search?: string;
    }

    interface ILeadRequest {
        leadId?: string;
        name: string;
        email: string;
        phone: string;
        company?: string;
        referenceId: string;
        type: string;
    }

    interface ILeadGetByParametersRequest extends IPaginationRequest {
        profileId?: string;
        companyId?: string;
        company?: string;
        type?: string;
        search?: string;
    }

    interface ILeadGetByCompanyRequest extends IPaginationRequest {
        companyId: string;
        search?: string;
    }

    interface ICardRequest {
        cardId?: string;
        access_mode?: string;
        type: string;
        referenceId: string;
        ownerId: string;
    }

    interface ICardGetByCompanyRequest extends IPaginationRequest {
        companyId: string;
        search?: string;
    }

    interface IEventBadgeRequest {
        profileId: string;
        type: string;
        logo?: boolean;
        name?: boolean;
        job_title?: boolean;
        company?: boolean;
        website?: boolean;
        layout?: 'portrait' | 'landscape' | 'square';
    }
}
