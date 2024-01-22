import { dbPool } from '@database/config.js';
import { ApiError } from '@errors/errorHandler.js';
import { logger } from '@loggers/logger.js';

export async function test({ test }: {test: string}): Promise<DefaultServiceResponse> {
    try {
        const [user] = await dbPool`SELECT * FROM users WHERE email = ${test}`;
        logger.silly('This is silly');
        return {
            message: 'This is a test',
            data: user
        }
    } catch (error) {
        throw new ApiError(403, 'this is a test error');
    }
}