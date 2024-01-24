import { dbPool } from '@database/config.js';
import { ApiError } from '@errors/errorHandler.js';
import { logger } from '@loggers/logger.js';

/*
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
*/

export async function create({ clientID, username, password }: ICreateAccountRequest) {
    try {
        const apiKey = '1234567890';

        const accountObj: IAccountTable = {
            client_id: clientID,
            username: username,
            password: password,
            api_key: apiKey
        }
        const [account] = await dbPool`INSERT INTO accounts ${dbPool(accountObj)} RETURNING *`;
        logger.silly('Account created successfully');

        return {
            message: 'Account created successfully',
            data: account
        }
    } catch (error) {
        logger.error(`Failed to fetch accounts, please try again\n Error: ${error}`);
        throw new ApiError(401, 'Failed to fetch accounts, please try again');
    }
}

export async function update({ id, username, password, apiKey }: IUpdateAccountRequest) {
    try {
        const [account] = await dbPool`UPDATE accounts SET username = ${username}, password = ${password}, api_key = ${apiKey} WHERE id = ${id} AND is_deleted = false RETURNING *`;
        logger.silly('Account updated successfully');

        return {
            message: 'Account updated successfully',
            data: account
        }
    } catch (error) {
        logger.error(`Failed to fetch accounts, please try again\n Error: ${error}`);
        throw new ApiError(401, 'Failed to fetch accounts, please try again');
    }
}

export async function remove({ id }: IDeleteAccountRequest) {
    try {
        const [account] = await dbPool`UPDATE accounts SET is_deleted = true WHERE id = ${id} RETURNING *`;
        logger.silly('Account removed successfully');

        return {
            message: 'Account removed successfully',
            data: account
        }
    } catch (error) {
        logger.error(`Failed to fetch accounts, please try again\n Error: ${error}`);
        throw new ApiError(401, 'Failed to fetch accounts, please try again');
    }
}

export async function getById({ id }: IGetAccountByIDRequest) {
    try {
        const [account] = await dbPool`SELECT * FROM accounts WHERE id = ${id} AND is_deleted = false`;
        logger.silly('Account fetched successfully');

        return {
            message: 'Account fetched successfully',
            data: account
        }
    } catch (error) {
        logger.error(`Failed to fetch accounts, please try again\n Error: ${error}`);
        throw new ApiError(401, 'Failed to fetch accounts, please try again');
    }
}

export async function getByClientId({ clientID, page, perPage, sortBy, sortDirection }: IGetAccountsByClientIDRequest) {
    try {
        let _page = Number(page);
        let _perPage = Number(perPage);
        if (Number.isNaN(_page)) {
            _page = 1;
        }
        if (Number.isNaN(_perPage)) {
            _perPage = 20;
        }
        const offset = (_page - 1) * _perPage;

        const [totalAccounts] = await dbPool`SELECT COUNT(*) FROM accounts WHERE client_id = ${clientID} AND is_deleted = false`;

        if (Number(totalAccounts.count) === 0) {
            logger.error('No accounts found');
            throw new ApiError(404, 'No accounts found');
        }

        const [accounts] = await dbPool`SELECT * FROM accounts WHERE client_id = ${clientID} AND is_deleted = false ORDER BY ${dbPool(sortBy)} ${dbPool(sortDirection)} LIMIT ${_perPage} OFFSET ${offset}`;

        logger.silly('Accounts fetched successfully');

        return {
            message: 'Accounts fetched successfully',
            data: {
                totalItems: Number(totalAccounts.count),
                totalPages: Math.ceil(Number(totalAccounts.count) / _perPage),
                page: _page,
                perPage: _perPage,
                isLastPage: _perPage * _page >= Number(totalAccounts.count),
                items: accounts,
            }
        }
    } catch (error) {
        logger.error(`Failed to fetch accounts, please try again\n Error: ${error}`);
        throw new ApiError(401, 'Failed to fetch accounts, please try again');
    }
}