import * as AuthService from '@services/auth.service.js';
import { Request, Response, NextFunction } from 'express';
import { RequestValidator } from 'helpers/requestValidator.js';
import Joi from 'joi';

/**
 * @function register
 * @description Controller for POST /auth/register
 */
export async function register(req: Request, res: Response, next: NextFunction) {
    try {
        RequestValidator(req, {
            body: Joi.object({
                fullName: Joi.string().required(),
                email: Joi.string().email().required(),
                password: Joi.string().required(),
                roleID: Joi.required()
            }),
        });
        const data = await AuthService.register(
            req.body as unknown as ICreateUserRequest
        );
        res.json(data);
    } catch (error) {
        next(error);
    }
}

/**
 * @function login
 * @description Controller for POST /auth/login
 */
export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        RequestValidator(req, {
            body: Joi.object({
                email: Joi.string().email().required(),
                password: Joi.string().required(),
            }),
        });
        const data = await AuthService.login(
            req.body as unknown as IUserLoginRequest
        );
        res.json(data);
    } catch (error) {
        next(error);
    }
}

/**
 * @function refreshToken
 * @description Controller for POST /auth/refresh-token
 */
export async function refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
        RequestValidator(req, {
            body: Joi.object({
                awsUserID: Joi.string().required(),
                refreshToken: Joi.string().required(),
            }),
        });
        const data = await AuthService.refreshToken(
            req.body.awsUserID as string,
            req.body.refreshToken as string
        );
        res.json(data);
    } catch (error) {
        next(error);
    }
}

/**
 * @function forgotPassword
 * @description Controller for POST /auth/forgot-password
 */
export async function forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
        RequestValidator(req, {
            body: Joi.object({
                email: Joi.string().email().required(),
            }),
        });
        const data = await AuthService.forgotPassword(
            req.body.email as string
        );
        res.json(data);
    } catch (error) {
        next(error);
    }
}

/**
 * @function resetPassword
 * @description Controller for POST /auth/reset-password
 */
export async function resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
        RequestValidator(req, {
            body: Joi.object({
                email: Joi.string().email().required(),
                password: Joi.string().required(),
                code: Joi.string().required(),
            }),
        });
        const data = await AuthService.resetPassword(
            req.body as IResetUserPasswordRequest
        );
        res.json(data);
    } catch (error) {
        next(error);
    }
}

/**
 * @function resendCode
 * @description Controller for GET /auth/resend-code
 */
export async function resendCode(req: Request, res: Response, next: NextFunction) {
    try {
        RequestValidator(req, {
            query: Joi.object({
                email: Joi.string().email().required(),
            }),
        });
        const data = await AuthService.resendCode(
            req.query.email as string
        );
        res.json(data);
    } catch (error) {
        next(error);
    }
}

/**
 * @function logout
 * @description Controller for POST /auth/logout
 */
export async function logout(req: Request, res: Response, next: NextFunction) {
    try {
        RequestValidator(req, {
            body: Joi.object({
                accessToken: Joi.string().required(),
            }),
        });
        const data = await AuthService.logout(
            req.body.accessToken as string
        );
        res.json(data);
    } catch (error) {
        next(error);
    }
}

/**
 * @function remove
 * @description Controller for DELETE /auth
 */
export async function remove(req: Request, res: Response, next: NextFunction) {
    try {
        RequestValidator(req, {
            body: Joi.object({
                email: Joi.string().email().required(),
                accessToken: Joi.string().required(),
            }),
        });
        const data = await AuthService.remove(
            req.body.email as string,
            req.body.accessToken as string
        );
        res.json(data);
    } catch (error) {
        next(error);
    }
}
