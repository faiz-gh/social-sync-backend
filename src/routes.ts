import { logger } from '@loggers/logger.js';
import authRouter from '@routes/auth.routes';
import employeeRouter from '@routes/employee.routes';
import clientRouter from '@routes/client.routes';
import accountRoute from '@routes/account.routes';
import postRoute from '@routes/post.routes';
import eventRoute from '@routes/event.routes';
import feedbackRoute from '@routes/feedback.routes';
import { NextFunction, Request, Response, Router } from 'express';

const routes: Router = Router({ mergeParams: true });

const getUrlMiddleWare = (req: Request, res: Response, next: NextFunction) => {
    logger.silly(`URL: ${req.method} ${req.originalUrl}`);
    next();
};

routes.use(getUrlMiddleWare);

/**
 * @route /auth
 * @description Route for authentication
 */
routes.use('/auth', authRouter);

/**
 * @route /profile
 * @description Route for profile
 */
routes.use('/employee', employeeRouter);

/**
 * @route /client
 * @description Route for client
 */
routes.use('/client', clientRouter);

/**
 * @route /account
 * @description Route for account
 */
routes.use('/account', accountRoute);

/**
 * @route /post
 * @description Route for post
 */
routes.use('/post', postRoute);

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

export default routes;
