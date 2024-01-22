import * as PreferenceController from '@controllers/preference.controller.js';
import { Router } from 'express';

const router = Router();

/**
 * @route POST /preference/test
 * @description Test route for preference
 */
router.post('/test', PreferenceController.test);

export default router;