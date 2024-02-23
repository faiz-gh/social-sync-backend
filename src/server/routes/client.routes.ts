import * as ClientController from '@controllers/client.controller.js';
import { Router } from 'express';

const router: Router = Router();

/**
 * @route POST /client
 * @description Route for creating a new client
 */
router.post('/', ClientController.createClient);

/**
 * @route PUT /client
 * @description Route for updating an existing client
 */
router.put('/', ClientController.updateClient);

/**
 * @route DELETE /client
 * @description Route for deleting an existing client
 */
router.delete('/', ClientController.removeClient);

/**
 * @route GET /client/user/:userID
 * @description Route for getting all clients by User ID
 */
router.get('/company/:id', ClientController.getClientByCompany);

/**
 * @route GET /client/user/:userID
 * @description Route for getting all clients by User ID
 */
router.get('/employee/:id', ClientController.getClientByEmployee);

/**
 * @route GET /client/:id
 * @description Route for getting a client by ID
 */
router.get('/:id', ClientController.getClient);

export default router;