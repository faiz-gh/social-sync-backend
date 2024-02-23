import * as EventService from '@services/event.service.js';
import { Request, Response, NextFunction } from 'express';
import { RequestValidator } from 'helpers/requestValidator.js';
import Joi from 'joi';

/**
 * @route POST /event
 * @description Route for adding new event
 */
export async function createEvent(req: Request, res: Response, next: NextFunction) {
    try {
        RequestValidator(req, {
            body: Joi.object({
                companyId: Joi.string().required(),
                title: Joi.string().required(),
                description: Joi.string().optional(),
                location: Joi.string().optional(),
                startDate: Joi.date().required(),
                endDate: Joi.date().required(),
            }),
        });
        const data = await EventService.createEvent(
            req.body as ICreateEventRequest
        );
        res.json(data);
    } catch (error) {
        next(error);
    }
}

/**
 * @route PUT /event
 * @description Route for updating event
 */
export async function updateEvent(req: Request, res: Response, next: NextFunction) {
    try {
        RequestValidator(req, {
            query: Joi.object({
                id: Joi.string().required(),
                title: Joi.string().optional(),
                description: Joi.string().optional(),
                location: Joi.string().optional(),
                startDate: Joi.date().optional(),
                endDate: Joi.date().optional(),
            }),
        });
        const data = await EventService.updateEvent(
            req.query as unknown as IUpdateEventRequest
        );
        res.json(data);
    } catch (error) {
        next(error);
    }
}

/**
 * @route DELETE /event/:id
 * @description Route for deleting event
 */
export async function deleteEvent(req: Request, res: Response, next: NextFunction) {
    try {
        RequestValidator(req, {
            params: Joi.object({
                id: Joi.string().required(),
            }),
        });
        const data = await EventService.deleteEvent(
            { id: req.params.id } as IDeleteEventRequest
        );
        res.json(data);
    } catch (error) {
        next(error);
    }
}

/**
 * @route GET /event/:id
 * @description Route for getting event
 */
export async function getEvent(req: Request, res: Response, next: NextFunction) {
    try {
        RequestValidator(req, {
            params: Joi.object({
                id: Joi.string().required(),
            }),
        });
        const data = await EventService.getEvent(
            { id: req.params.id } as IGetEventRequest
        );
        res.json(data);
    } catch (error) {
        next(error);
    }
}

/**
 * @route GET /event/company/:id
 * @description Route for getting all events
 */
export async function getByCompanyId(req: Request, res: Response, next: NextFunction) {
    try {
        RequestValidator(req, {
            params: Joi.object({
                id: Joi.string().required(),
            }),
        });

        const data = await EventService.getEventsByCompany(
            { companyId: req.params.id } as IGetEventsByCompanyRequest
        );
        res.json(data);
    } catch (error) {
        next(error);
    }
}