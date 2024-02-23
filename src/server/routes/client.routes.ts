import * as ClientController from '@controllers/client.controller.js';
import { tokenAuthenticated } from '@middlewares/auth';
import { Router } from 'express';

const router: Router = Router();

/**
 * @route POST /client
 * @description Route for creating a new client
 */
router.post('/', tokenAuthenticated, ClientController.createClient);

/**
 * @route PUT /client
 * @description Route for updating an existing client
 */
router.put('/', tokenAuthenticated, ClientController.updateClient);

/**
 * @route DELETE /client
 * @description Route for deleting an existing client
 */
router.delete('/', tokenAuthenticated, ClientController.removeClient);

/**
 * @route GET /client/user/:userID
 * @description Route for getting all clients by User ID
 */
router.get('/company/:id', tokenAuthenticated, ClientController.getClientByCompany);

/**
 * @route GET /client/user/:userID
 * @description Route for getting all clients by User ID
 */
router.get('/employee/:id', tokenAuthenticated, ClientController.getClientByEmployee);

/**
 * @route GET /client/:id
 * @description Route for getting a client by ID
 */
router.get('/:id', tokenAuthenticated, ClientController.getClient);

export default router;