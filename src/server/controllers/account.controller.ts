import * as AccountService from '@services/account.service.js';
import { Request, Response, NextFunction } from 'express';
import { RequestValidator } from 'helpers/requestValidator.js';
import Joi from 'joi';

/**
 * @route POST /account
 * @description Route for creating a new account
 */
export async function createAccount(req: Request, res: Response, next: NextFunction) {
    try {
        RequestValidator(req, {
            body: Joi.object({
                clientId: Joi.string().required(),
                accountType: Joi.string().required(),
                accessToken: Joi.string().required(),
            }),
        });
        const data = await AccountService.createAccount(
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
export async function updateAccount(req: Request, res: Response, next: NextFunction) {
    try {
        RequestValidator(req, {
            query: Joi.object({
                id: Joi.string().required(),
                accountType: Joi.string().optional(),
                accessToken: Joi.string().optional(),
            }),
        });
        const data = await AccountService.updateAccount(
            req.query as unknown as IUpdateAccountRequest
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
export async function removeAccount(req: Request, res: Response, next: NextFunction) {
    try {
        RequestValidator(req, {
            params: Joi.object({
                id: Joi.string().required(),
            }),
        });
        const data = await AccountService.removeAccount(
            { id: req.params.id } as IDeleteAccountRequest
        );
        res.json(data);
    } catch (error) {
        next(error);
    }
}

/**
 * @route GET /account/client/:id
 * @description Route for fetching all accounts by client ID
 */
export async function getAccountByClient(req: Request, res: Response, next: NextFunction) {
    try {
        RequestValidator(req, {
            params: Joi.object({
                id: Joi.string().required(),
            })
        });

        const data = await AccountService.getAccountByClient(
            { clientId: req.params.id } as IGetAccountsByClientRequest
        );
        res.json(data);
    } catch (error) {
        next(error);
    }
}

/**
 * @route GET /account/:id
 * @description Route for fetching an existing account
 */
export async function getAccount(req: Request, res: Response, next: NextFunction) {
    try {
        RequestValidator(req, {
            params: Joi.object({
                id: Joi.string().required(),
            }),
        });
        const data = await AccountService.getAccount(
            { id: req.params.id } as IGetAccountRequest
        );
        res.json(data);
    } catch (error) {
        next(error);
    }
}

