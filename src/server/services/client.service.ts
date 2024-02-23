import { dbPool } from '@database/config.js';
import { ApiError } from '@errors/errorHandler.js';
import { logger } from '@loggers/logger.js';

export async function createClient({ companyId, employeeId, name, email }: ICreateClientRequest): Promise<DefaultServiceResponse> {
    try {
        const clientObj: IClientTable = {
            company_id: companyId,
            employee_id: employeeId,
            name: name,
            email: email,
        }
        const [client] = await dbPool<IClientTable[]>`INSERT INTO clients ${dbPool(clientObj)} RETURNING *`;
        logger.silly('Client created successfully');

        return {
            message: 'Client created successfully',
            data: client
        }
    } catch (error) {
        logger.error(`Failed to fetch clients, please try again\n Error: ${error}`);
        throw new ApiError(500, 'Failed to fetch clients, please try again');
    }
}

export async function updateClient({ id, employeeId, name, email }: IUpdateClientRequest): Promise<DefaultServiceResponse> {
    try {
        const clientObj: IClientTable = {
            employee_id: employeeId,
            name: name,
            email: email,
        }
        const [client] = await dbPool<IClientTable[]>`UPDATE clients SET ${dbPool(clientObj)} WHERE id = ${id} AND is_deleted = false RETURNING *`;
        logger.silly('Client updated successfully');

        return {
            message: 'Client updated successfully',
            data: client
        }
    } catch (error) {
        logger.error(`Failed to update client, please try again\n Error: ${error}`);
        throw new ApiError(500, 'Failed to update client, please try again');
    }
}

export async function removeClient({ id }: IDeleteClientRequest): Promise<DefaultServiceResponse> {
    try {
        const [client] = await dbPool<IClientTable[]>`UPDATE clients SET is_deleted = true WHERE id = ${id} RETURNING *`;
        logger.silly('Client removed successfully');

        return {
            message: 'Client removed successfully',
            data: client
        }
    } catch (error) {
        logger.error(`Failed to fetch clients, please try again\n Error: ${error}`);
        throw new ApiError(500, 'Failed to fetch clients, please try again');
    }
}

export async function getClientByCompany({ companyId }: IGetClientsByCompanyRequest): Promise<DefaultServiceResponse> {
    try {
        const [clients] = await dbPool<IClientTable[]>`SELECT * FROM clients WHERE company_id = ${companyId} AND is_deleted = false`;

        logger.silly('Clients fetched successfully');

        return {
            message: 'Clients fetched successfully',
            data: clients
        }
    } catch (error) {
        logger.error(`Failed to fetch clients, please try again\n Error: ${error}`);
        throw new ApiError(500, 'Failed to fetch clients, please try again');
    }
}

export async function getClientByEmployee({ employeeId }: IGetClientsByEmployeeRequest): Promise<DefaultServiceResponse> {
    try {
        const [clients] = await dbPool<IClientTable[]>`SELECT * FROM clients WHERE employee_id = ${employeeId} AND is_deleted = false`;

        logger.silly('Clients fetched successfully');

        return {
            message: 'Clients fetched successfully',
            data: clients
        }
    } catch (error) {
        logger.error(`Failed to fetch clients, please try again\n Error: ${error}`);
        throw new ApiError(500, 'Failed to fetch clients, please try again');
    }
}

export async function getClient({ id }: IGetClientRequest): Promise<DefaultServiceResponse> {
    try {
        const [client] = await dbPool<IClientTable[]>`SELECT * FROM clients WHERE id = ${id} AND is_deleted = false`;
        logger.silly('Client fetched successfully');

        return {
            message: 'Client fetched successfully',
            data: client
        }
    } catch (error) {
        logger.error(`Failed to fetch clients, please try again\n Error: ${error}`);
        throw new ApiError(500, 'Failed to fetch clients, please try again');
    }
}