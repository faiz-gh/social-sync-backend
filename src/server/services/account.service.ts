import { dbPool } from '@database/config.js';
import { ApiError } from '@errors/errorHandler.js';
import { logger } from '@loggers/logger.js';

export async function createAccount({ clientId, accessToken, pageId, pageName, facebookUserId }: ICreateAccountRequest): Promise<ICreateAccountResponse> {
    try {
        const APP_ID = process.env.FACEBOOK_APP_ID;
        const APP_SECRET = process.env.FACEBOOK_APP_SECRET;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userResponse: any = await fetch(`https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${APP_ID}&client_secret=${APP_SECRET}&fb_exchange_token=${accessToken}`);

        const userTokenResponse = await userResponse.json();

        const userAccessToken = userTokenResponse.access_token;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pageResponse: any = await fetch(`https://graph.facebook.com/v19.0/${facebookUserId}/accounts?access_token=${userAccessToken}`);

        const pageTokenResponse = await pageResponse.json();

        const pageAccessToken = pageTokenResponse.data.find((page: { id: string; }) => page.id === pageId).access_token;

        const accountObj: IAccountTable = {
            client_id: clientId,
            page_id: pageId,
            page_name: pageName,
            user_access_token: userAccessToken,
            page_access_token: pageAccessToken,
        }
        const [account] = await dbPool`INSERT INTO accounts ${dbPool(accountObj)} RETURNING *`;
        logger.silly('Account created successfully');

        return {
            message: 'Account connected successfully',
            data: account
        }
    } catch (error) {
        logger.error(`Failed to connect account, please try again\n Error: ${error}`);
        throw new ApiError(500, 'Failed to connect account, please try again');
    }
}

// export async function updateAccount({ id, accessToken, accountType }: IUpdateAccountRequest): Promise<IUpdateAccountResponse> {
//     try {
//         const accountObj: IAccountTable = {
//             access_token: accessToken,
//             account_type: accountType,
//         }

//         const [account] = await dbPool`UPDATE accounts SET ${dbPool(accountObj)} WHERE id = ${id} AND is_deleted = false RETURNING *`;
//         logger.silly('Account updated successfully');

//         return {
//             message: 'Account updated successfully',
//             data: account
//         }
//     } catch (error) {
//         logger.error(`Failed to update account, please try again\n Error: ${error}`);
//         throw new ApiError(500, 'Failed to fetch account, please try again');
//     }
// }

export async function removeAccount({ id }: IDeleteAccountRequest): Promise<IRemoveAccountResponse> {
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

export async function getAccount({ id }: IGetAccountRequest): Promise<IGetAccountResponse> {
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

export async function getAccountByClient({ clientId }: IGetAccountsByClientRequest): Promise<IGetAccountsByClientResponse> {
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