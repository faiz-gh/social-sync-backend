import * as TaskController from '@controllers/task.controller.js';
import { Router } from 'express';

const router = Router();

/**
 * @route POST /task/test
 * @description Test route for task
 */
router.post('/test', TaskController.test);

export default router;