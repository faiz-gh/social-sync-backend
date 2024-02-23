import * as AuthController from '@controllers/auth.controller.js';
import { Router } from 'express';

const router: Router = Router();

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
 * @route POST /auth/verify-otp
 * @description Route for verifying otp
 */
router.post('/verify-otp', AuthController.verifyOtp);

/**
 * @route POST /auth/refresh-token
 * @description Route for refresh token
 */
router.post('/refresh-token', AuthController.refreshToken);

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
