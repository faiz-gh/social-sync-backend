import { dbPool } from '@database/config.js';
import { ApiError } from '@errors/errorHandler.js';
import { logger } from '@loggers/logger.js';
import SocialPost from 'social-post-api';

export async function createPost({ accountId, description, location, media, postSchedule, tags }: ICreatePostRequest): Promise<DefaultServiceResponse> {
    try {
        const social = new SocialPost(process.env.AYRSHARE_API_KEY);

        const createdPost = await social.post({
            post: description,
            platforms: ["facebook"],
            mediaUrls: media[0],
        }).catch(() => {
            logger.error(`Failed to create post, please try again`);
            throw new ApiError(500, 'Failed to create post, please try again');
        });


        const postObj: IPostTable = {
            account_id: accountId,
            description: description,
            location: location ?? "default location",
            media: media,
            post_schedule: postSchedule ?? new Date(),
            tags: tags ?? []
        }

        const [post] = await dbPool<IPostTable[]>`INSERT INTO posts ${dbPool(postObj)} RETURNING *`;
        logger.silly('Post created successfully');

        return {
            message: 'Post Created Successfully',
            data: {
                post: post,
                postResponse: createdPost
            }
        }
    } catch (error) {
        logger.error(`Failed to create post, please try again\n Error: ${error}`);
        throw new ApiError(500, 'Failed to create post, please try again');
    }
}

export async function getPost({ id }: IGetPostRequest): Promise<DefaultServiceResponse> {
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

export async function getPostsByAccount({ accountId }: IGetPostsByAccountRequest): Promise<DefaultServiceResponse> {
    try {
        const posts = await dbPool<IPostTable[]>`SELECT * FROM posts WHERE account_id = ${accountId} AND is_deleted = false`;
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

export async function getPostsByClient({ clientId }: IGetPostsByClientRequest): Promise<DefaultServiceResponse> {
    try {
        const posts = await dbPool<IPostTable[]>`SELECT 
                *
            FROM
                posts
            WHERE account_id IN (
                SELECT
                    id
                FROM
                    accounts
                WHERE
                    client_id = ${clientId}
                    AND is_deleted = false
            )
            AND is_deleted = false`;
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