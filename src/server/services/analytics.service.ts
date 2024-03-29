import { dbPool } from '@database/config.js';
import { ApiError } from '@errors/errorHandler.js';
import { logger } from '@loggers/logger.js';

export async function getCompanyDashboardAnalytics({ companyId }: IGetCompanyDashboardAnalyticsRequest): Promise<IGetCompanyDashboardAnalyticsResponse> {
    try {
        const employees = await dbPool<IUserTable[]>`
            SELECT
                usr.id
            FROM
                users usr
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
        const totalEmployees = employees.length || 0;

        const clients = await dbPool<IClientTable[]>`SELECT id FROM clients WHERE company_id = ${companyId} AND is_deleted = false`;
        const totalClients = clients.length || 0;

        const accounts = await dbPool<IAccountTable[]>`
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
            `;
        const totalAccounts = accounts.length || 0;

        const posts = await dbPool<IPostTable[]>`
            SELECT
                id
            FROM
                posts
            WHERE
                account_id IN (
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
                AND is_deleted = false
            `;
        const totalPosts = posts.length || 0;

        return {
            message: 'Account fetched successfully',
            data: {
                total_employees: totalEmployees,
                total_clients: totalClients,
                total_accounts: totalAccounts,
                total_posts: totalPosts,
            }
        }
    } catch (error) {
        logger.error(`Failed to fetch analytics, ${error}`);
        throw new ApiError(500, 'Failed to fetch analytics, please try again');
    }
}