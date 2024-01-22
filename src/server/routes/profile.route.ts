import * as ProfileController from '@controllers/profile.controller.js';
import { Router } from 'express';

const router = Router();

/**
 * @route POST /profile/test
 * @description Test route for profile
 */
router.post('/test', ProfileController.test);

export default router;