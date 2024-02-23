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
                firstName: Joi.string().required(),
                lastName: Joi.string().required(),
                email: Joi.string().email().required(),
                roleId: Joi.number().required(),
            }),
        });
        const data = await AuthService.register(
            req.body as IRegisterRequest
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
                email: Joi.string().required(),
            }),
        });
        const data = await AuthService.login(
            req.body as ILoginRequest
        );
        res.json(data);
    } catch (error) {
        next(error);
    }
}

/**
 * @function verifyOtp
 * @description Controller for POST /auth/verify-otp
 */
export async function verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
        RequestValidator(req, {
            body: Joi.object({
                email: Joi.string().required(),
                code: Joi.string().required(),
                session: Joi.string().required(),
            }),
        });
        const data = await AuthService.verifyOtp(
            req.body as IVerifyOtpRequest
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
                awsUserId: Joi.string().required(),
                refreshToken: Joi.string().required(),
            }),
        });
        const data = await AuthService.refreshToken(
            req.body as IRefreshTokenRequest
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
            req.body as ILogoutRequest
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
            req.body as IRemoveUserRequest
        );
        res.json(data);
    } catch (error) {
        next(error);
    }
}
