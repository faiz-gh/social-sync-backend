import { dbPool } from '@database/config.js';
import { ApiError } from '@errors/errorHandler.js';
import { logger } from '@loggers/logger.js';

export async function createClient({ companyId, employeeId, name, email }: ICreateClientRequest): Promise<ICreateClientResponse> {
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

export async function updateClient({ id, employeeId, name, email }: IUpdateClientRequest): Promise<IUpdateClientResponse> {
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

export async function removeClient({ id }: IDeleteClientRequest): Promise<IRemoveClientResponse> {
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

export async function getClientByCompany({ companyId }: IGetClientsByCompanyRequest): Promise<IGetClientsByCompanyResponse> {
    try {
        const clients = await dbPool<IClientTable[]>`
            SELECT 
                clt.*,
                COUNT(acc.*) as total_accounts,
                emp.first_name || ' ' || emp.last_name as employee_name
            FROM
                clients clt
                LEFT JOIN accounts acc ON clt.id = acc.client_id AND acc.is_deleted = false
                LEFT JOIN users emp ON clt.employee_id = emp.id AND emp.role_id = 3 AND emp.is_deleted = false
            WHERE
                clt.company_id = ${companyId} 
                AND clt.is_deleted = false
            GROUP BY 
                clt.id,
                emp.first_name,
                emp.last_name
        `;
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

export async function getClientByEmployee({ employeeId }: IGetClientsByEmployeeRequest): Promise<IGetClientsByEmployeeResponse> {
    try {
        const clients = await dbPool<IClientTable[]>`
            SELECT
                clt.*,
                COUNT(acc.*) as total_accounts,
                emp.first_name || ' ' || emp.last_name as employee_name
            FROM
                clients clt
                LEFT JOIN accounts acc ON clt.id = acc.client_id AND acc.is_deleted = false
                LEFT JOIN users emp ON clt.employee_id = emp.id AND emp.role_id = 3 AND emp.is_deleted = false
            WHERE
                clt.employee_id = ${employeeId} 
                AND clt.is_deleted = false
            GROUP BY 
                clt.id,
                emp.first_name,
                emp.last_name
        `;
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

export async function getClient({ id }: IGetClientRequest): Promise<IGetClientResponse> {
    try {
        const [client] = await dbPool<IClientTable[]>`SELECT * FROM clients WHERE id = ${id} AND is_deleted = false`;
        logger.silly('Client fetched successfully');

        const [totalAccounts] = await dbPool`SELECT COUNT(*) FROM accounts WHERE client_id = ${client.id} AND is_deleted = false`
        logger.silly('Total accounts fetched successfully');

        return {
            message: 'Client fetched successfully',
            data: {
                ...client,
                total_accounts: totalAccounts.count
            }
        }
    } catch (error) {
        logger.error(`Failed to fetch clients, please try again\n Error: ${error}`);
        throw new ApiError(500, 'Failed to fetch clients, please try again');
    }
}