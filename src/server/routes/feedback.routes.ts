import * as FeedbackController from '@controllers/feedback.controller.js';
import { Router } from 'express';

const router: Router = Router();

/**
 * @route POST /feedback/test
 * @description Test route for feedback
 */
router.post('/test', FeedbackController.test);

export default router;