import * as ClientService from '@services/client.service.js';
import { Request, Response, NextFunction } from 'express';
import { RequestValidator } from 'helpers/requestValidator.js';
import Joi from 'joi';

/**
 * @route POST /client
 * @description Route for creating a new client
 */
export async function createClient(req: Request, res: Response, next: NextFunction) {
    try {
        RequestValidator(req, {
            body: Joi.object({
                companyId: Joi.string().required(),
                employeeId: Joi.string().required(),
                name: Joi.string().required(),
                email: Joi.string().email().required(),
            }),
        });
        const data = await ClientService.createClient(
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
export async function updateClient(req: Request, res: Response, next: NextFunction) {
    try {
        RequestValidator(req, {
            query: Joi.object({
                id: Joi.string().required(),
                employeeId: Joi.string().optional(),
                name: Joi.string().optional(),
                email: Joi.string().email().optional(),
            }),
        });
        const data = await ClientService.updateClient(
            req.query as unknown as IUpdateClientRequest
        );
        res.json(data);
    } catch (error) {
        next(error);
    }
}

/**
 * @route DELETE /client/:id
 * @description Route for deleting an existing client
 */
export async function removeClient(req: Request, res: Response, next: NextFunction) {
    try {
        RequestValidator(req, {
            params: Joi.object({
                id: Joi.string().required(),
            }),
        });
        const data = await ClientService.removeClient(
            { id: req.params.id } as IDeleteClientRequest
        );
        res.json(data);
    } catch (error) {
        next(error);
    }
}

/**
 * @route GET /client/company/:id
 * @description Route for getting all clients
 */
export async function getClientByCompany(req: Request, res: Response, next: NextFunction) {
    try {
        RequestValidator(req, {
            params: Joi.object({
                id: Joi.string().required(),
            }),
        });

        const data = await ClientService.getClientByCompany(
            { companyId: req.params.id } as IGetClientsByCompanyRequest
        );
        res.json(data);
    } catch (error) {
        next(error);
    }
}

/**
 * @route GET /client/employee/:id
 * @description Route for getting all clients
 */
export async function getClientByEmployee(req: Request, res: Response, next: NextFunction) {
    try {
        RequestValidator(req, {
            params: Joi.object({
                id: Joi.string().required(),
            }),
        });

        const data = await ClientService.getClientByEmployee(
            { employeeId: req.params.id } as IGetClientsByEmployeeRequest
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
export async function getClient(req: Request, res: Response, next: NextFunction) {
    try {
        RequestValidator(req, {
            params: Joi.object({
                id: Joi.string().required(),
            }),
        });
        const data = await ClientService.getClient(
            { id: req.params.id } as IGetClientRequest
        );
        res.json(data);
    } catch (error) {
        next(error);
    }
}
