import * as PreferenceService from '@services/preference.service.js';
import { Request, Response, NextFunction } from 'express';
import { RequestValidator } from 'helpers/requestValidator.js';
import Joi from 'joi';

/**
 * @route POST /preference/test
 * @description Route for adding new user
 */
export async function test(req: Request, res: Response, next: NextFunction) {
    try {
        RequestValidator(req, {
            body: Joi.object({
                test: Joi.string().required(),
            }),
        });
        const data = await PreferenceService.test(
            req.body
        );
        res.json(data);
    } catch (error) {
        next(error);
    }
}