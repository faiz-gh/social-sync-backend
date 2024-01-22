import * as AccountController from '@controllers/account.controller.js';
import { Router } from 'express';

const router = Router();

/**
 * @route POST /account/test
 * @description Test route for account
 */
router.post('/test', AccountController.test);

export default router;