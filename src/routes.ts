import { logger } from '@loggers/logger.js';
import accountRoute from '@routes/account.route';
import authRouter from '@routes/auth.route';
import channelRoute from '@routes/channel.route';
import chatRoute from '@routes/chat.route';
import clientRouter from '@routes/client.route';
import eventRoute from '@routes/event.route';
import feedbackRoute from '@routes/feedback.route';
import postRoute from '@routes/post.route';
import preferenceRoute from '@routes/preference.route';
import profileRoute from '@routes/profile.route';
import taskRoute from '@routes/task.route';
import { NextFunction, Request, Response, Router } from 'express';

const routes = Router({ mergeParams: true });

const getUrlMiddleWare = (req: Request, res: Response, next: NextFunction) => {
    logger.silly(`URL: ${req.method} ${req.originalUrl}`);
    next();
};

routes.use(getUrlMiddleWare);

/**
 * @route /account
 * @description Route for account
 */
routes.use('/account', accountRoute);

/**
 * @route /auth
 * @description Route for authentication
 */
routes.use('/auth', authRouter);

/**
 * @route /channel
 * @description Route for channel
 */
routes.use('/channel', channelRoute);

/**
 * @route /chat
 * @description Route for chat
 */
routes.use('/chat', chatRoute);

/**
 * @route /client
 * @description Route for client
 */
routes.use('/client', clientRouter);

/**
 * @route /event
 * @description Route for event
 */
routes.use('/event', eventRoute);

/**
 * @route /feedback
 * @description Route for feedback
 */
routes.use('/feedback', feedbackRoute);

/**
 * @route /post
 * @description Route for post
 */
routes.use('/post', postRoute);

/**
 * @route /preference
 * @description Route for preference
 */
routes.use('/preference', preferenceRoute);

/**
 * @route /profile
 * @description Route for profile
 */
routes.use('/profile', profileRoute);

/**
 * @route /task
 * @description Route for task
 */
routes.use('/task', taskRoute);

export default routes;
