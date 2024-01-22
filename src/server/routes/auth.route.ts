import * as AuthController from '@controllers/auth.controller.js';
import { Router } from 'express';

const router = Router();

/**
 * @route POST /auth/register
 * @description Route for adding new user
 */
router.post('/register', AuthController.register);

/**
 * @route POST /auth/login
 * @description Route for login
 */
router.post('/login', AuthController.login);

/**
 * @route POST /auth/refresh-token
 * @description Route for refresh token
 */
router.post('/refresh-token', AuthController.refreshToken);

/**
 * @route POST /auth/forgot-password
 * @description Route for forgot password
 */
router.post('/forgot-password', AuthController.forgotPassword);

/**
 * @route POST /auth/reset-password
 * @description Route for reset password
 */
router.post('/reset-password', AuthController.resetPassword);

/**
 * @route GET /auth/resend-code
 * @description Route for resending the auth code
 */
router.get('/resend-code', AuthController.resendCode);

/**
 * @route POST /auth/logout
 * @description Route for reset password
 */
router.post('/logout', AuthController.logout);

/**
 * @route DELETE /auth
 * @description Route for deleting user from AWS
 */
router.delete('/', AuthController.remove);

export default router;
