import * as EventController from '@controllers/event.controller.js';
import { Router } from 'express';

const router = Router();

/**
 * @route POST /event/test
 * @description Test route for event
 */
router.post('/test', EventController.test);

export default router;