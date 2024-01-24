import * as AccountController from '@controllers/account.controller.js';
import { tokenAuthenticated } from '@middlewares/auth';
import { Router } from 'express';

const router = Router();

/**
 * @route POST /account
 * @description Route for creating a new account
 */
router.post('/', tokenAuthenticated, AccountController.create);

/**
 * @route PUT /account
 * @description Route for updating an existing account
 */
router.put('/', tokenAuthenticated, AccountController.update);

/**
 * @route DELETE /account
 * @description Route for deleting an existing account
 */
router.delete('/', tokenAuthenticated, AccountController.remove);

/**
 * @route GET /account/client/:clientID
 * @description Route for getting all accounts by Client ID
 */
router.get('/client/:clientID', tokenAuthenticated, AccountController.getByClientId);

/**
 * @route GET /account/:id
 * @description Route for getting an account by ID
 */
router.get('/:id', tokenAuthenticated, AccountController.getById);

export default router;