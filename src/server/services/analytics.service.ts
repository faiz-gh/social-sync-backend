import { dbPool } from '@database/config.js';
import { ApiError } from '@errors/errorHandler.js';
import { logger } from '@loggers/logger.js';

export async function getCompanyDashboardAnalytics({ companyId }: IGetCompanyDashboardAnalyticsRequest): Promise<IGetCompanyDashboardAnalyticsResponse> {
    try {
        const employees = await dbPool`SELECT id FROM users WHERE company_id = ${companyId}`;
        const totalEmployees = employees.length || 0;

        const clients = await dbPool`SELECT id FROM clients WHERE company_id = ${companyId}`;
        const totalClients = clients.length || 0;

        const clientId = clients.map((client: IClientTable) => client.id);

        const accounts = await dbPool`SELECT id FROM accounts WHERE client_id IN (${clientId})`;
        const totalAccounts = accounts.length || 0;

        const accountsId = accounts.map((account: IAccountTable) => account.id);

        const posts = await dbPool`SELECT id FROM posts WHERE account_id IN (${accountsId})`;
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