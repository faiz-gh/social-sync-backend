import * as AnalyticsController from '@controllers/analytics.controller.js';
import { Router } from 'express';

const router: Router = Router();

/**
 * @route GET /analytics/company/:id
 * @description Route for fetching dashboard analytics for company
 */
router.get('/company/:id', AnalyticsController.getCompanyDashboardAnalytics);

export default router;