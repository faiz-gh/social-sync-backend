import 'dotenv/config';
import { logger } from '@loggers/logger.js';
import { dbPool } from '@database/config.js';
import { defaultErrorHandler } from '@errors/errorHandler.js'
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import swaggerJSDoc from 'swagger-jsdoc';
import * as swaggerUi from 'swagger-ui-express';
import v8 from 'v8';

import swaggerSpecs from './apiDocs/swagger.js';
import routes from "./routes.js";

const app = express();

app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(express.json({ limit: '20mb' }));
app.enable('trust proxy');
app.use(
    helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
        crossOriginOpenerPolicy: false,
        crossOriginResourcePolicy: false, // cors
        dnsPrefetchControl: false,
        frameguard: false,
        hsts: false,
        ieNoOpen: false,
        noSniff: false,
        originAgentCluster: false,
        permittedCrossDomainPolicies: false,
        referrerPolicy: true,
        xssFilter: false,
    })
);

// app.use(
//     cors({
//         origin: process.env.CORS_ORIGIN?.split(',') || [],
//         maxAge: 86400,
//     })
// );
app.use(cors());

app.get('/api/ping', (_req, res) => {
    logger.info('Ping route tested');
    res.send('pong!');
});

// Swagger API Docs
const swaggerOptions = {
    customCss: '.try-out button {display:none}',
    swaggerOptions: {
        tryItOutEnabled: false,
    },
};
const swaggerDocument = swaggerJSDoc(swaggerSpecs);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

// API route
app.use(routes);

// Catch all routes
app.use('*', (req, res) => {
    logger.info(`Route caught by catch all: ${req.url}`);
    res.status(404).send('<h1>404 Page Not Found</h1>');
});

// -- Error handler middleware --
app.use(defaultErrorHandler);

// Server PORT
const PORT = Number(process.env.API_PORT || 4400);
const HOST = process.env.API_HOST || '0.0.0.0';
const URI = `http://${HOST}:${PORT}`;

const server = app.listen(PORT, () => {
    logger.info(`Server is up and running at ${PORT}`);
    logger.info(`Server started w/ pid ${process.pid}`);
    logger.info(`Listening on ${URI}`);
    logger.info(`Environment: ${process.env.NODE_ENV}`);
    logger.info(`Deployment Environment: ${process.env.DEPLOY_ENV}`);
    logger.info(`CORS: ${process.env.CORS_ORIGIN}`);
    const totalAvailableSize = v8.getHeapStatistics().total_available_size;
    const totalInGB = (totalAvailableSize / 1024 / 1024 / 1024).toFixed(2);
    logger.info(`GB ~${totalInGB}`);
});

process.on('SIGTERM', () => {
    logger.warn('Got SIGTERM. Graceful shutdown initiated', new Date().toISOString());
    server.close(() => {
        logger.warn('Process terminated w/ SIGTERM');
        process.exit(1);
    });
});

process.on('SIGINT', () => {
    logger.warn('Got SIGINT. Graceful shutdown initiated', new Date().toISOString());
    try {
        dbPool.end();
    } catch (error) {
        logger.error(`Unable to close db connection due to: ${JSON.stringify(error)}`);
    }
    server.close(() => {
        logger.warn('Process interrupted w/ SIGINT');
        process.exit(1);
    });
});

process
    .on('unhandledRejection', (err) => {
        console.log(err);
        logger.warn('Unhandled Rejection at:', err);
        process.exit(1);
    })
    .on('uncaughtException', (err) => {
        console.log(err);
        logger.warn('Uncaught Exception thrown:', err.stack || err);
        process.exit(1);
    });

export default server;
