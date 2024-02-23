import * as AccountController from '@controllers/account.controller.js';
import { tokenAuthenticated } from '@middlewares/auth';
import { Router } from 'express';

const router: Router = Router();

/**
 * @route POST /account
 * @description Route for creating a new account
 */
router.post('/', tokenAuthenticated, AccountController.createAccount);

/**
 * @route PUT /account
 * @description Route for updating an existing account
 */
router.put('/', tokenAuthenticated, AccountController.updateAccount);

/**
 * @route DELETE /account
 * @description Route for deleting an existing account
 */
router.delete('/', tokenAuthenticated, AccountController.removeAccount);

/**
 * @route GET /account/client/:clientID
 * @description Route for getting all accounts by Client ID
 */
router.get('/client/:id', tokenAuthenticated, AccountController.getAccountByClient);

/**
 * @route GET /account/:id
 * @description Route for getting an account by ID
 */
router.get('/:id', tokenAuthenticated, AccountController.getAccount);

export default router;