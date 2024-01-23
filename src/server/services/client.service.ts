import { dbPool } from '@database/config.js';
import { ApiError } from '@errors/errorHandler.js';
import { logger } from '@loggers/logger.js';

export async function create({ userID, name }: ICreateClientRequest): Promise<DefaultServiceResponse> {
    try {
        const clientObj: IClientTable = {
            user_id: userID,
            name: name
        }
        const [client] = await dbPool`INSERT INTO clients ${dbPool(clientObj)} RETURNING *`;
        logger.silly('Client created successfully');

        return {
            message: 'Client created successfully',
            data: client
        }
    } catch (error) {
        logger.error(`Failed to fetch clients, please try again\n Error: ${error}`);
        throw new ApiError(401, 'Failed to fetch clients, please try again');
    }
}

export async function update({ id, name }: IUpdateClientRequest): Promise<DefaultServiceResponse> {
    try {
        const [client] = await dbPool`UPDATE clients SET name = ${name} WHERE id = ${id} AND is_deleted = false RETURNING *`;
        logger.silly('Client updated successfully');

        return {
            message: 'Client updated successfully',
            data: client
        }
    } catch (error) {
        logger.error(`Failed to fetch clients, please try again\n Error: ${error}`);
        throw new ApiError(401, 'Failed to fetch clients, please try again');
    }
}

export async function remove({ id }: IDeleteClientRequest): Promise<DefaultServiceResponse> {
    try {
        const [client] = await dbPool`UPDATE clients SET is_deleted = true WHERE id = ${id} RETURNING *`;
        logger.silly('Client removed successfully');

        return {
            message: 'Client removed successfully',
            data: client
        }
    } catch (error) {
        logger.error(`Failed to fetch clients, please try again\n Error: ${error}`);
        throw new ApiError(401, 'Failed to fetch clients, please try again');
    }
}

export async function getById({ id }: IGetClientByIDRequest): Promise<DefaultServiceResponse> {
    try {
        const [client] = await dbPool`SELECT * FROM clients WHERE id = ${id} AND is_deleted = false`;
        logger.silly('Client fetched successfully');

        return {
            message: 'Client fetched successfully',
            data: client
        }
    } catch (error) {
        logger.error(`Failed to fetch clients, please try again\n Error: ${error}`);
        throw new ApiError(401, 'Failed to fetch clients, please try again');
    }
}

export async function getByUserId({ userID, page = 1, perPage = 20, sortBy = 'created_date', sortDirection = 'DESC' }: IGetClientsByUserIDRequest): Promise<DefaultServiceResponse> {
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

        const [totalClients] = await dbPool`SELECT COUNT(*) FROM clients WHERE user_id = ${userID} AND is_deleted = false`;

        if (Number(totalClients.count) === 0) {
            logger.error('No clients found');
            throw new ApiError(404, 'No clients found');
        }

        const [clients] = await dbPool`SELECT * FROM clients WHERE user_id = ${userID} AND is_deleted = false ORDER BY ${dbPool(sortBy)} ${dbPool(sortDirection)} LIMIT ${_perPage} OFFSET ${offset}`;

        logger.silly('Clients fetched successfully');

        return {
            message: 'Clients fetched successfully',
            data: {
                totalItems: Number(totalClients.count),
                totalPages: Math.ceil(Number(totalClients.count) / _perPage),
                page: _page,
                perPage: _perPage,
                isLastPage: _perPage * _page >= Number(totalClients.count),
                items: clients,
            }
        }
    } catch (error) {
        logger.error(`Failed to fetch clients, please try again\n Error: ${error}`);
        throw new ApiError(401, 'Failed to fetch clients, please try again');
    }
}