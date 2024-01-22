import * as ChatController from '@controllers/chat.controller.js';
import { Router } from 'express';

const router = Router();

/**
 * @route POST /chat/test
 * @description Test route for chat
 */
router.post('/test', ChatController.test);

export default router;