import * as AccountService from '@services/account.service.js';
import { Request, Response, NextFunction } from 'express';
import { RequestValidator } from 'helpers/requestValidator.js';
import Joi from 'joi';

/**
 * @route POST /account
 * @description Route for creating a new account
 */
export async function create(req: Request, res: Response, next: NextFunction) {
    try {
        RequestValidator(req, {
            body: Joi.object({
                clientID: Joi.string().required(),
                username: Joi.string().required(),
                password: Joi.string().required(),
            }),
        });
        const data = await AccountService.create(
            req.body as ICreateAccountRequest
        );
        res.json(data);
    } catch (error) {
        next(error);
    }
}

/**
 * @route PUT /account
 * @description Route for updating an existing account
 */
export async function update(req: Request, res: Response, next: NextFunction) {
    try {
        RequestValidator(req, {
            body: Joi.object({
                id: Joi.string().required(),
                username: Joi.string().required(),
                password: Joi.string().required(),
                apiKey: Joi.string().required(),
            }),
        });
        const data = await AccountService.update(
            req.body as IUpdateAccountRequest
        );
        res.json(data);
    } catch (error) {
        next(error);
    }
}

/**
 * @route DELETE /account
 * @description Route for deleting an existing account
 */
export async function remove(req: Request, res: Response, next: NextFunction) {
    try {
        RequestValidator(req, {
            body: Joi.object({
                id: Joi.string().required(),
            }),
        });
        const data = await AccountService.remove(
            req.body as IDeleteAccountRequest
        );
        res.json(data);
    } catch (error) {
        next(error);
    }
}

/**
 * @route GET /account/client/:clientID
 * @description Route for fetching all accounts by client ID
 */
export async function getByClientId(req: Request, res: Response, next: NextFunction) {
    try {
        RequestValidator(req, {
            params: Joi.object({
                clientID: Joi.string().required(),
            }),
            query: Joi.object({
                search: Joi.string(),
                page: Joi.number(),
                perPage: Joi.number(),
                sortBy: Joi.string().default('created_date'),
                sortDirection: Joi.string().valid('ASC', 'DESC').default('DESC'),
            }),
        });

        const payload: IGetAccountsByClientIDRequest = req.query as unknown as IGetAccountsByClientIDRequest;
        payload.clientID = req.params.clientID;

        const data = await AccountService.getByClientId(payload);
        res.json(data);
    } catch (error) {
        next(error);
    }
}

/**
 * @route GET /account/:id
 * @description Route for fetching an existing account
 */
export async function getById(req: Request, res: Response, next: NextFunction) {
    try {
        RequestValidator(req, {
            params: Joi.object({
                id: Joi.string().required(),
            }),
        });
        const data = await AccountService.getById({ id: req.params.id } as IGetAccountByIDRequest);
        res.json(data);
    } catch (error) {
        next(error);
    }
}

