import { dbPool } from '@database/config.js';
import { ApiError } from '@errors/errorHandler.js';
import { logger } from '@loggers/logger.js';

export async function createPost({ accountId, description, location, image_url, postSchedule, tags }: ICreatePostRequest): Promise<ICreatePostResponse> {
    try {
        const [account] = await dbPool<IAccountTable[]>`SELECT * FROM accounts WHERE id = ${accountId} AND is_deleted = false`;

        const createPostPayload = {
            access_token: account.page_access_token,
            message: description,
            url: image_url,
            published: false,
            scheduled_publish_time: Math.floor(new Date(postSchedule).getTime() / 1000),
        }

        const response = await fetch(`https://graph.facebook.com/v19.0/${account.page_id}/photos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(createPostPayload)
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const responseData: any = await response.json();

        const page_post_id = responseData.post_id;

        const postObj: IPostTable = {
            account_id: accountId,
            page_post_id: page_post_id || null,
            description: description,
            location: location,
            image_url: image_url,
            post_schedule: postSchedule,
            tags: tags
        }

        const [post] = await dbPool<IPostTable[]>`INSERT INTO posts ${dbPool(postObj)} RETURNING *`;
        logger.silly('Post created successfully');

        return {
            message: 'Post Created Successfully',
            data: {
                ...post,
                account_name: account.page_name
            }
        }
    } catch (error) {
        logger.error(`Failed to create post, please try again\n Error: ${error}`);
        throw new ApiError(500, 'Failed to create post, please try again');
    }
}

export async function getPost({ id }: IGetPostRequest): Promise<IGetPostResponse> {
    try {
        const [post] = await dbPool<IPostTable[]>`SELECT * FROM posts WHERE id = ${id} AND is_deleted = false`;
        logger.silly('Post retrieved successfully');

        return {
            message: 'Post retrieved successfully',
            data: post
        }
    } catch (error) {
        logger.error(`Failed to retrieve post, please try again\n Error: ${error}`);
        throw new ApiError(500, 'Failed to retrieve post, please try again');
    }
}

export async function getPostsByAccount({ accountId }: IGetPostsByAccountRequest): Promise<IGetPostsByAccountResponse> {
    try {
        const posts = await dbPool<IPostTable[]>`
            SELECT
                pst.*,
                acc.page_name as "account_name"
            FROM
                posts pst
                LEFT JOIN accounts acc ON pst.account_id = acc.id AND acc.is_deleted = false
            WHERE
                pst.account_id = ${accountId} 
                AND pst.is_deleted = false
        `;
        logger.silly('Posts retrieveduser.data successfully');

        return {
            message: 'Posts retrieved successfully',
            data: posts
        }
    } catch (error) {
        logger.error(`Failed to retrieve posts, please try again\n Error: ${error}`);
        throw new ApiError(500, 'Failed to retrieve posts, please try again');
    }
}

export async function getPostsByClient({ clientId }: IGetPostsByClientRequest): Promise<IGetPostsByClientResponse> {
    try {
        const posts = await dbPool<IPostTable[]>`SELECT 
                pst.*,
                acc.page_name as "account_name"
            FROM
                posts pst
                LEFT JOIN accounts acc ON pst.account_id = acc.id AND acc.is_deleted = false
            WHERE pst.account_id IN (
                SELECT
                    id
                FROM
                    accounts
                WHERE
                    client_id = ${clientId}
                    AND is_deleted = false
            )
            AND pst.is_deleted = false`;
        logger.silly('Posts retrieved successfully');

        return {
            message: 'Posts retrieved successfully',
            data: posts
        }
    } catch (error) {
        logger.error(`Failed to retrieve posts, please try again\n Error: ${error}`);
        throw new ApiError(500, 'Failed to retrieve posts, please try again');
    }
}

export async function getPostsByEmployee({ employeeId }: IGetPostsByEmployeeRequest): Promise<IGetPostsByEmployeeResponse> {
    try {
        const posts = await dbPool<IPostTable[]>`SELECT
                pst.*,
                acc.page_name as "account_name"
            FROM
                posts pst
                LEFT JOIN accounts acc ON pst.account_id = acc.id AND acc.is_deleted = false
            WHERE
                pst.account_id IN (
                    SELECT
                        id
                    FROM
                        accounts
                    WHERE
                        client_id IN (
                            SELECT
                                id
                            FROM
                                clients
                            WHERE
                                employee_id = ${employeeId} 
                                AND is_deleted = false
                            )
                        AND is_deleted = false
                    ) 
                AND pst.is_deleted = false
            `;
        logger.silly('Posts retrieved successfully');

        return {
            message: 'Posts retrieved successfully',
            data: posts
        }
    } catch (error) {
        logger.error(`Failed to retrieve posts, please try again\n Error: ${error}`);
        throw new ApiError(500, 'Failed to retrieve posts, please try again');
    }
}

export async function getPostsByCompany({ companyId }: IGetPostsByCompanyRequest): Promise<IGetPostsByCompanyResponse> {
    try {
        const posts = await dbPool<IPostTable[]>`SELECT
                pst.*,
                acc.page_name as "account_name"
            FROM
                posts pst
                LEFT JOIN accounts acc ON pst.account_id = acc.id AND acc.is_deleted = false
            WHERE
                pst.account_id IN (
                    SELECT
                        id
                    FROM
                        accounts
                    WHERE
                        client_id IN (
                            SELECT
                                id
                            FROM
                                clients
                            WHERE
                                company_id = ${companyId} 
                                AND is_deleted = false
                            )
                        AND is_deleted = false
                    ) 
                AND pst.is_deleted = false
            `;
        logger.silly('Posts retrieved successfully');

        return {
            message: 'Posts retrieved successfully',
            data: posts
        }
    } catch (error) {
        logger.error(`Failed to retrieve posts, please try again\n Error: ${error}`);
        throw new ApiError(500, 'Failed to retrieve posts, please try again');
    }
}