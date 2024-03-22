import * as PostController from '@controllers/post.controller.js';
import { Router } from 'express';

const router: Router = Router();

/**
 * @route POST /post/
 * @description Route for adding new post
 */
router.post('/', PostController.createPost);

/**
 * @route GET /post/account/:id
 * @description Route for getting posts by account id
 */
router.get('/account/:id', PostController.getPostsByAccount);

/**
 * @route GET /post/client/:id
 * @description Route for getting posts by client id
 */
router.get('/client/:id', PostController.getPostsByClient);

/**
 * @route GET /post/employee/:id
 * @description Route for getting posts by employee id
 */
router.get('/employee/:id', PostController.getPostsByEmployee);

/**
 * @route GET /post/company/:id
 * @description Route for getting posts by company id
 */
router.get('/company/:id', PostController.getPostsByCompany);

/**
 * @route GET /post/:id
 * @description Route for getting post by id
 */
router.get('/:id', PostController.getPost);

export default router;