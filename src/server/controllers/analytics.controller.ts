import * as AnalyticsService from '@services/analytics.service.js';
import { Request, Response, NextFunction } from 'express';
import { RequestValidator } from 'helpers/requestValidator.js';
import Joi from 'joi';

/**
 * @route GET /analytics/company/:id
 * @description Route for fetching dashboard analytics
 */
export async function getCompanyDashboardAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
        RequestValidator(req, {
            params: Joi.object({
                id: Joi.string().required(),
            }),
        });
        const data = await AnalyticsService.getCompanyDashboardAnalytics(
            { companyId: req.params.id } as IGetCompanyDashboardAnalyticsRequest
        );
        res.json(data);
    } catch (error) {
        next(error);
    }
}

