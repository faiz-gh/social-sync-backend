import * as ClientService from '@services/client.service.js';
import { Request, Response, NextFunction } from 'express';
import { RequestValidator } from 'helpers/requestValidator.js';
import Joi from 'joi';

/**
 * @route POST /client
 * @description Route for creating a new client
 */
export async function create(req: Request, res: Response, next: NextFunction) {
    try {
        RequestValidator(req, {
            body: Joi.object({
                userID: Joi.string().required(),
                name: Joi.string().required(),
            }),
        });
        const data = await ClientService.create(
            req.body as ICreateClientRequest
        );
        res.json(data);
    } catch (error) {
        next(error);
    }
}

/**
 * @route PUT /client
 * @description Route for updating an existing client
 */
export async function update(req: Request, res: Response, next: NextFunction) {
    try {
        RequestValidator(req, {
            body: Joi.object({
                id: Joi.string().required(),
                name: Joi.string().required(),
            }),
        });
        const data = await ClientService.update(
            req.body as IUpdateClientRequest
        );
        res.json(data);
    } catch (error) {
        next(error);
    }
}

/**
 * @route DELETE /client
 * @description Route for deleting an existing client
 */
export async function remove(req: Request, res: Response, next: NextFunction) {
    try {
        RequestValidator(req, {
            body: Joi.object({
                id: Joi.string().required(),
            }),
        });
        const data = await ClientService.remove(
            req.body as IDeleteClientRequest
        );
        res.json(data);
    } catch (error) {
        next(error);
    }
}

/**
 * @route GET /user/:userID
 * @description Route for getting all clients
 */
export async function getByUserId(req: Request, res: Response, next: NextFunction) {
    try {
        RequestValidator(req, {
            params: Joi.object({
                userID: Joi.string().required(),
            }),
            query: Joi.object({
                search: Joi.string(),
                page: Joi.number(),
                perPage: Joi.number(),
                sortBy: Joi.string().default('created_date'),
                sortDirection: Joi.string().valid('ASC', 'DESC').default('DESC'),
            }),
        });
        const payload: IGetClientsByUserIDRequest = req.query as unknown as IGetClientsByUserIDRequest;

        payload.userID = req.params.userID;

        const data = await ClientService.getByUserId(
            payload
        );
        res.json(data);
    } catch (error) {
        next(error);
    }
}

/**
 * @route GET /client/:id
 * @description Route for getting an existing client
 */
export async function getById(req: Request, res: Response, next: NextFunction) {
    try {
        RequestValidator(req, {
            params: Joi.object({
                id: Joi.string().required(),
            }),
        });
        const data = await ClientService.getById(
            { id: req.params.id } as IGetClientByIDRequest
        );
        res.json(data);
    } catch (error) {
        next(error);
    }
}