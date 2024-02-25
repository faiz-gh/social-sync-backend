import { dbPool } from '@database/config.js';
import { ApiError } from '@errors/errorHandler.js';
import { logger } from '@loggers/logger.js';
import * as AuthService from '@services/auth.service.js';

export async function createEmployee({ companyId, firstName, lastName, email }: ICreateEmployeeRequest): Promise<DefaultServiceResponse> {
    try {
        const registerRequest: IRegisterRequest = {
            firstName,
            lastName,
            email,
            roleId: 3
        }
        const user: IRegisterResponse = await AuthService.register(registerRequest);

        const companyEmployeeObj: ICompanyEmployeeConnectionTable = {
            company_id: companyId,
            employee_id: user.data.id
        }

        await dbPool<ICompanyEmployeeConnectionTable[]>`INSERT INTO company_employee_connection ${dbPool(companyEmployeeObj)} RETURNING *`;
        logger.silly('Employee created successfully');

        return {
            message: 'Employee created successfully',
            data: user.data
        }
    } catch (error) {
        console.log(error);
        logger.error('Failed to create employee, please try again');
        throw new ApiError(500, 'Failed to create employee, please try again');
    }
}

export async function updateEmployee({ id, firstName, lastName, roleId }: IUpdateEmployeeRequest): Promise<DefaultServiceResponse> {
    try {
        const userObj: IUserTable = {
            first_name: firstName,
            last_name: lastName,
            role_id: roleId
        }

        const [employee] = await dbPool<IUserTable[]>`UPDATE users SET ${dbPool(userObj)} WHERE id = ${id} AND role_id = 3 AND is_deleted = false RETURNING *`;
        logger.silly('Employee updated successfully');

        return {
            message: 'Employee updated successfully',
            data: employee
        }
    } catch (error) {
        console.log(error);
        logger.error('Failed to update Employee, please try again');
        throw new ApiError(500, 'Failed to update Employee, please try again');
    }
}

export async function getEmployeesByCompany({ companyId }: IGetEmployeesByCompanyRequest): Promise<DefaultServiceResponse> {
    try {
        const employees = await dbPool<IUserTable[]>`
            SELECT
                usr.*,
                COUNT(clt.*) AS total_clients
            FROM
                users usr
                LEFT JOIN clients clt ON usr.id = clt.employee_id AND clt.is_deleted = false
            WHERE
                usr.id IN (
                    SELECT
                        employee_id
                    FROM
                        company_employee_connection
                    WHERE
                        company_id = ${companyId}
                ) 
                AND usr.role_id = 3
                AND usr.is_deleted = false
            GROUP BY
                usr.id
            `;
        logger.silly('Employees fetched successfully');

        return {
            message: 'Employees fetched successfully',
            data: employees
        }
    } catch (error) {
        console.log(error);
        logger.error('Failed to fetch Employees, please try again');
        throw new ApiError(500, 'Failed to fetch Employees, please try again');
    }
}

export async function getEmployee({ id }: IGetEmployeeRequest): Promise<DefaultServiceResponse> {
    try {
        const [employee] = await dbPool<IUserTable[]>`SELECT * FROM users WHERE id = ${id} AND role_id = 3 AND is_deleted = false`;
        logger.silly('Employee fetched successfully');

        const [totalClients] = await dbPool`SELECT COUNT(*) FROM clients WHERE employee_id = ${employee.id} AND is_deleted = false`;
        logger.silly('Total clients fetched successfully');

        return {
            message: 'Employee fetched successfully',
            data: {
                ...employee,
                total_clients: totalClients.count
            }
        }
    } catch (error) {
        console.log(error);
        logger.error('Failed to fetch Employee, please try again');
        throw new ApiError(500, 'Failed to fetch Employee, please try again');
    }
}