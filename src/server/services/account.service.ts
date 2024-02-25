import { dbPool } from '@database/config.js';
import { ApiError } from '@errors/errorHandler.js';
import { logger } from '@loggers/logger.js';

export async function createAccount({ clientId, accessToken, accountType }: ICreateAccountRequest) {
    try {
        const accountObj: IAccountTable = {
            client_id: clientId,
            access_token: accessToken,
            account_type: accountType,
        }
        const [account] = await dbPool`INSERT INTO accounts ${dbPool(accountObj)} RETURNING *`;
        logger.silly('Account created successfully');

        return {
            message: 'Account created successfully',
            data: account
        }
    } catch (error) {
        logger.error(`Failed to create account, please try again\n Error: ${error}`);
        throw new ApiError(500, 'Failed to create account, please try again');
    }
}

export async function updateAccount({ id, accessToken, accountType }: IUpdateAccountRequest) {
    try {
        const accountObj: IAccountTable = {
            access_token: accessToken,
            account_type: accountType,
        }

        const [account] = await dbPool`UPDATE accounts SET ${dbPool(accountObj)} WHERE id = ${id} AND is_deleted = false RETURNING *`;
        logger.silly('Account updated successfully');

        return {
            message: 'Account updated successfully',
            data: account
        }
    } catch (error) {
        logger.error(`Failed to update account, please try again\n Error: ${error}`);
        throw new ApiError(500, 'Failed to fetch account, please try again');
    }
}

export async function removeAccount({ id }: IDeleteAccountRequest) {
    try {
        const [account] = await dbPool`UPDATE accounts SET is_deleted = true WHERE id = ${id} RETURNING *`;
        logger.silly('Account removed successfully');

        return {
            message: 'Account removed successfully',
            data: account
        }
    } catch (error) {
        logger.error(`Failed to delete accounts, please try again\n Error: ${error}`);
        throw new ApiError(500, 'Failed to delete accounts, please try again');
    }
}

export async function getAccount({ id }: IGetAccountRequest) {
    try {
        const [account] = await dbPool`SELECT * FROM accounts WHERE id = ${id} AND is_deleted = false`;
        logger.silly('Account fetched successfully');

        const [totalPosts] = await dbPool`SELECT COUNT(*) FROM posts WHERE account_id = ${account.id} AND is_deleted = false`;
        logger.silly('Total posts fetched successfully');

        return {
            message: 'Account fetched successfully',
            data: {
                ...account,
                total_posts: totalPosts.count
            }
        }
    } catch (error) {
        logger.error(`Failed to fetch account, please try again\n Error: ${error}`);
        throw new ApiError(500, 'Failed to fetch account, please try again');
    }
}

export async function getAccountByClient({ clientId }: IGetAccountsByClientRequest) {
    try {

        const accounts = await dbPool`
            SELECT
                acc.*,
                COUNT(pst.*) as total_posts
            FROM
                accounts acc
                LEFT JOIN posts pst ON acc.id = pst.account_id AND pst.is_deleted = false
            WHERE
                acc.client_id = ${clientId} 
                AND acc.is_deleted = false
            GROUP BY
                acc.id
        `;
        logger.silly('Accounts fetched successfully');

        return {
            message: 'Accounts fetched successfully',
            data: accounts
        }
    } catch (error) {
        logger.error(`Failed to fetch accounts, please try again\n Error: ${error}`);
        throw new ApiError(500, 'Failed to fetch accounts, please try again');
    }
}