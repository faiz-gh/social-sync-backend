import * as ChannelController from '@controllers/channel.controller.js';
import { Router } from 'express';

const router = Router();

/**
 * @route POST /channel/test
 * @description Test Route for channel
 */
router.post('/test', ChannelController.test);

export default router;