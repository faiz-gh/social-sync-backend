import * as ClientController from '@controllers/client.controller.js';
import { Router } from 'express';

const router = Router();

/**
 * @route POST /client/test
 * @description Test route for client
 */
router.post('/test', ClientController.test);

export default router;