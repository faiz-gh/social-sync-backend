import * as PostController from '@controllers/post.controller.js';
import { Router } from 'express';

const router = Router();

/**
 * @route POST /post/test
 * @description Test route for post
 */
router.post('/test', PostController.test);

export default router;