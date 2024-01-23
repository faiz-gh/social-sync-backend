import * as ClientController from '@controllers/client.controller.js';
import { tokenAuthenticated } from '@middlewares/auth';
import { Router } from 'express';

const router = Router();

/**
 * @route POST /client
 * @description Route for creating a new client
 */
router.post('/', tokenAuthenticated, ClientController.create);

/**
 * @route PUT /client
 * @description Route for updating an existing client
 */
router.put('/', tokenAuthenticated, ClientController.update);

/**
 * @route DELETE /client
 * @description Route for deleting an existing client
 */
router.delete('/', tokenAuthenticated, ClientController.remove);

/**
 * @route GET /client/g/:userID
 * @description Route for getting all clients by User ID
 */
router.get('/g/:userID', tokenAuthenticated, ClientController.getByUserId);

/**
 * @route GET /client/:id
 * @description Route for getting a client by ID
 */
router.get('/:id', tokenAuthenticated, ClientController.getById);

export default router;