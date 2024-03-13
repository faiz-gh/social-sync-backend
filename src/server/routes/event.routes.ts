import * as EventController from '@controllers/event.controller.js';
import { Router } from 'express';

const router: Router = Router();

/**
 * @route POST /event
 * @description Route for creating a new event
 */
router.post('/', EventController.createEvent);

/**
 * @route PUT /event
 * @description Route for updating an existing event
 */
router.put('/', EventController.updateEvent);

/**
 * @route DELETE /event
 * @description Route for deleting an existing event
 */
router.delete('/:id', EventController.deleteEvent);

/**
 * @route GET /event/company/:id
 * @description Route for getting all events by company ID
 */
router.get('/company/:id', EventController.getByCompanyId);

/**
 * @route GET /event/:id
 * @description Route for getting event by ID
 */
router.get('/:id', EventController.getEvent);


export default router;