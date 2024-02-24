import * as PostService from '@services/post.service.js';
import { Request, Response, NextFunction } from 'express';
import { RequestValidator } from 'helpers/requestValidator.js';
import Joi from 'joi';

/**
 * @route POST /post/
 * @description Route for adding new post
 */
export async function createPost(req: Request, res: Response, next: NextFunction) {
    try {
        RequestValidator(req, {
            body: Joi.object({
                accountId: Joi.string().required(),
                media: Joi.array().items(Joi.string()).optional(),
                location: Joi.string().optional(),
                description: Joi.string().required(),
                tags: Joi.array().items(Joi.string()).optional(),
                postSchedule: Joi.date().optional(),
            }),
        });
        const data = await PostService.createPost(
            req.body as ICreatePostRequest
        );
        res.json(data);
    } catch (error) {
        next(error);
    }
}

/**
 * @route GET /post/:id
 * @description Route for getting post by id
 */
export async function getPost(req: Request, res: Response, next: NextFunction) {
    try {
        RequestValidator(req, {
            params: Joi.object({
                id: Joi.string().required(),
            }),
        });
        const data = await PostService.getPost(
            { id: req.params.id } as IGetPostRequest
        );
        res.json(data);
    } catch (error) {
        next(error);
    }
}

/**
 * @route GET /post/account/:id
 * @description Route for getting posts by account id
 */
export async function getPostsByAccount(req: Request, res: Response, next: NextFunction) {
    try {
        RequestValidator(req, {
            params: Joi.object({
                id: Joi.string().required(),
            }),
        });
        const data = await PostService.getPostsByAccount(
            { accountId: req.params.id } as IGetPostsByAccountRequest
        );
        res.json(data);
    } catch (error) {
        next(error);
    }
}

/**
 * @route GET /post/client/:id
 * @description Route for getting posts by client id
 */
export async function getPostsByClient(req: Request, res: Response, next: NextFunction) {
    try {
        RequestValidator(req, {
            params: Joi.object({
                id: Joi.string().required(),
            }),
        });
        const data = await PostService.getPostsByClient(
            { clientId: req.params.id } as IGetPostsByClientRequest
        );
        res.json(data);
    } catch (error) {
        next(error);
    }
}