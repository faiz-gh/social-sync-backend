import {
    ConfirmForgotPasswordCommand,
    ForgotPasswordCommand,
    GlobalSignOutCommand,
    InitiateAuthCommand,
    SignUpCommand,
    AdminDeleteUserCommand,
    ResendConfirmationCodeCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { dbPool } from '@database/config.js';
import { ApiError } from '@errors/errorHandler.js';
import { logger } from '@loggers/logger.js';
import { generateHashSecret, getCognitoIdentity } from 'helpers/helpers.js';
import md5 from 'md5';

/**
 * @async
 * @function register
 * @description Service for POST /auth/register
 * @param {Object} data
 * @returns Promise<Object>
 */
export async function register({ fullName, email, password, userRole }: ICreateUserRequest): Promise<DefaultServiceResponse> {
    const cognitoIdentity = getCognitoIdentity();

    const userAttr = [];
    userAttr.push({ Name: 'name', Value: fullName });
    const hashSecret = generateHashSecret(email);

    const params = {
        ClientId: process.env.CLIENT_ID as string,
        Password: password,
        Username: email,
        SecretHash: hashSecret,
        UserAttributes: userAttr,
    };

    try {
        const result = await cognitoIdentity.send(new SignUpCommand(params));

        const userObj: IUserTable = {
            fullName: fullName,
            password: md5(password),
            roleID: userRole as 'user' | 'company',
            email: email,
            awsUserID: result.UserSub,
        }

        const [user] = await dbPool`INSERT INTO users ${dbPool(userObj)} RETURNING *`;
        logger.silly('User created successfully, Email verification code sent to your email');
        return {
            message: 'User created successfully, Email verification code sent to your email',
            data: user,
        };
    } catch (error) {
        const awsError: IAWSCognitoError = error;
        console.log(awsError);
        if (awsError?.name === 'UsernameExistsException') {
            logger.error('User with this email already exists');
            throw new ApiError(awsError?.$metadata?.httpStatusCode, 'User with this email already exists');
        }
        if (awsError?.name === 'InvalidPasswordException') {
            logger.error('Password should be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character');
            throw new ApiError(awsError?.$metadata?.httpStatusCode, 'Password should be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character');
        }
        if (awsError?.name === 'CodeDeliveryFailureException') {
            logger.error('Error sending verification code, Please try again.');
            throw new ApiError(awsError?.$metadata?.httpStatusCode, 'Error sending verification code, Please try again.');
        }
        if (awsError?.name === 'TooManyRequestsException') {
            logger.error('Too many requests, Please try again later.');
            throw new ApiError(awsError?.$metadata?.httpStatusCode, 'Too many requests, Please try again later.');
        }
        logger.error('Something went wrong creating new user, Please try again.');
        throw new ApiError(403, 'Something went wrong creating new user, Please try again.');
    }
}

/**
 * @async
 * @function login
 * @description Service for POST /auth/login
 * @param {Object} data
 * @returns Promise<Object>
 */
export async function login({ email, password }: IUserLoginRequest): Promise<DefaultServiceResponse> {
    const cognitoIdentity = getCognitoIdentity();

    const [user] = await dbPool`SELECT * FROM users WHERE email = ${email} AND password = ${md5(password)}`;

    if (!user) {
        logger.error('Invalid email or password');
        throw new ApiError(403, 'Invalid email or password');
    }

    const hashSecret = generateHashSecret(email);

    const params = {
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: process.env.CLIENT_ID as string,
        AuthParameters: {
            'USERNAME': email,
            'PASSWORD': password,
            'SECRET_HASH': hashSecret
        }
    }

    try {
        const result = await cognitoIdentity.send(new InitiateAuthCommand(params as never));
        logger.silly('User logged in successfully');
        return {
            message: 'User logged in successfully',
            data: {
                ...user,
                accessToken: result.AuthenticationResult?.AccessToken,
                refreshToken: result.AuthenticationResult?.RefreshToken,
                idToken: result.AuthenticationResult?.IdToken,
            },
        };
    } catch (error) {
        const awsError: IAWSCognitoError = error;
        console.log(awsError);
        if (awsError?.name === 'UserNotConfirmedException') {
            logger.error('User is not confirmed, Please confirm your email');
            throw new ApiError(awsError?.$metadata?.httpStatusCode, 'User is not confirmed, Please confirm your email');
        }
        if (awsError?.name === 'NotAuthorizedException') {
            logger.error('Invalid email or password');
            throw new ApiError(awsError?.$metadata?.httpStatusCode, 'Invalid email or password');
        }
        if (awsError?.name === 'UserNotFoundException') {
            logger.error('User with this email does not exist');
            throw new ApiError(awsError?.$metadata?.httpStatusCode, 'User with this email does not exist');
        }
        if (awsError?.name === 'TooManyRequestsException') {
            logger.error('Too many requests, Please try again later.');
            throw new ApiError(awsError?.$metadata?.httpStatusCode, 'Too many requests, Please try again later.');
        }
        logger.error('Something went wrong, Please try again.');
        throw new ApiError(403, 'Something went wrong, Please try again.');
    }
}

/**
 * @async
 * @function refreshToken
 * @description Service for POST /auth/refresh-token
 * @param {string} awsUserID
 * @param {string} refreshToken
 * @returns Promise<Object>
 */
export async function refreshToken(awsUserID: string, refreshToken: string): Promise<DefaultServiceResponse> {
    const cognitoIdentity = getCognitoIdentity();

    const hashSecret = generateHashSecret(awsUserID);
    const params = {
        AuthFlow: 'REFRESH_TOKEN_AUTH',
        ClientId: process.env.CLIENT_ID as string,
        AuthParameters: {
            'REFRESH_TOKEN': refreshToken,
            'SECRET_HASH': hashSecret
        }
    };

    try {
        const result = await cognitoIdentity.send(new InitiateAuthCommand(params as never));
        logger.silly('Token refreshed successfully');

        return {
            message: 'Token refreshed successfully',
            data: {
                accessToken: result.AuthenticationResult?.AccessToken,
                idToken: result.AuthenticationResult?.IdToken,
            },
        };
    } catch (error) {
        const awsError: IAWSCognitoError = error;
        console.log(awsError);
        if (awsError.name === 'NotAuthorizedException') {
            logger.error('Invalid refresh token. Please log in again.');
            throw new ApiError(awsError?.$metadata?.httpStatusCode, 'Invalid refresh token. Please log in again.');
        }
        if (awsError?.name === 'TooManyRequestsException') {
            logger.error('Too many requests, Please try again later.');
            throw new ApiError(awsError?.$metadata?.httpStatusCode, 'Too many requests, Please try again later.');
        }
        logger.error('Something went wrong, Please try again.');
        throw new ApiError(403, 'Something went wrong, Please try again.');
    }
}

/**
 * @async
 * @function forgotPassword
 * @description Service for POST /auth/forgot-password
 * @param {string} email
 * @returns Promise<Object>
 */
export async function forgotPassword(email: string): Promise<DefaultServiceResponse> {
    const cognitoIdentity = getCognitoIdentity();

    const [userExists] = await dbPool`SELECT * FROM users WHERE email = ${email}`;

    if (!userExists) {
        logger.error('No user exists with this email');
        throw new ApiError(403, 'No user exists with this email');
    }

    const hashSecret = generateHashSecret(email);

    const params = {
        ClientId: process.env.CLIENT_ID as string,
        Username: email,
        SecretHash: hashSecret,
    }

    try {
        await cognitoIdentity.send(new ForgotPasswordCommand(params as never));
        logger.silly('Password reset instructions sent successfully');
        return {
            message: 'Password reset instructions sent successfully',
            data: null,
        };
    } catch (error) {
        const awsError: IAWSCognitoError = error;
        console.log(awsError);
        if (awsError?.name === 'UserNotFoundException') {
            logger.error('User with this email does not exist');
            throw new ApiError(awsError?.$metadata?.httpStatusCode, 'User with this email does not exist');
        }
        if (awsError?.name === 'TooManyRequestsException') {
            logger.error('Too many requests, Please try again later.');
            throw new ApiError(awsError?.$metadata?.httpStatusCode, 'Too many requests, Please try again later.');
        }
        logger.error('Something went wrong, Please try again.');
        throw new ApiError(403, 'Something went wrong, Please try again.');
    }
}

/**
 * @async
 * @function resetPassword
 * @description Service for POST /auth/reset-password
 * @param {Object} data
 * @returns Promise<Object>
 */
export async function resetPassword({ email, password, code }: IResetUserPasswordRequest): Promise<DefaultServiceResponse> {
    const cognitoIdentity = getCognitoIdentity();

    const [userExists] = await dbPool`SELECT * FROM users WHERE email = ${email}`;

    if (!userExists) {
        logger.error('No user exists with this email');
        throw new ApiError(403, 'No user exists with this email');
    }

    const hashSecret = generateHashSecret(email);

    const params = {
        ClientId: process.env.CLIENT_ID as string,
        Username: email,
        Password: password,
        ConfirmationCode: code,
        SecretHash: hashSecret,
    }

    try {
        await cognitoIdentity.send(new ConfirmForgotPasswordCommand(params as never));

        const [user] = await dbPool<IUserTable[]>`UPDATE users SET password = ${md5(password)} WHERE email = ${email} RETURNING *`;

        logger.silly('Password reset successful. You can now log in with your new password.');
        return {
            message: 'Password reset successful. You can now log in with your new password.',
            data: user,
        };
    } catch (error) {
        const awsError: IAWSCognitoError = error;
        console.log(awsError);
        if (awsError?.name === 'CodeMismatchException') {
            logger.error('Invalid OTP, Please try again!');
            throw new ApiError(awsError?.$metadata?.httpStatusCode, 'Invalid OTP, Please try again!');
        }
        if (awsError?.name === 'ExpiredCodeException') {
            logger.error('OTP expired, Please try again!');
            throw new ApiError(awsError?.$metadata?.httpStatusCode, 'OTP expired, Please try again!');
        }
        if (awsError?.name === 'TooManyFailedAttemptsException') {
            logger.error('Too many failed attempts, Please try again later.');
            throw new ApiError(awsError?.$metadata?.httpStatusCode, 'Too many failed attempts, Please try again later.');
        }
        if (awsError?.name === 'TooManyRequestsException') {
            logger.error('Too many requests, Please try again later.');
            throw new ApiError(awsError?.$metadata?.httpStatusCode, 'Too many requests, Please try again later.');
        }
        if (awsError?.name === 'UserNotFoundException') {
            logger.error('User with this email does not exist');
            throw new ApiError(awsError?.$metadata?.httpStatusCode, 'User with this email does not exist');
        }
        logger.error('Something went wrong, Please try again.');
        throw new ApiError(403, 'Something went wrong, Please try again.');
    }
}

/**
 * @async
 * @function resendCode
 * @description Service for GET /auth/resend-code
 * @param {string} email
 * @returns Promise<Object>
 */
export async function resendCode(email: string): Promise<DefaultServiceResponse> {
    const cognitoIdentity = getCognitoIdentity();

    const [userExists] = await dbPool`SELECT * FROM users WHERE email = ${email}`;

    if (!userExists) {
        logger.error('No user exists with this email');
        throw new ApiError(403, 'No user exists with this email');
    }

    const hashSecret = generateHashSecret(email);

    const params = {
        ClientId: process.env.CLIENT_ID as string,
        Username: email,
        SecretHash: hashSecret,
    }

    try {
        await cognitoIdentity.send(new ResendConfirmationCodeCommand(params as never));
        logger.silly('Verification code sent successfully');
        return {
            message: 'Verification code sent successfully',
            data: null,
        };
    } catch (error) {
        const awsError: IAWSCognitoError = error;
        console.log(awsError);
        if (awsError?.name === 'UserNotFoundException') {
            logger.error('User with this email does not exist');
            throw new ApiError(awsError?.$metadata?.httpStatusCode, 'User with this email does not exist');
        }
        if (awsError?.name === 'TooManyRequestsException') {
            logger.error('Too many requests, Please try again later.');
            throw new ApiError(awsError?.$metadata?.httpStatusCode, 'Too many requests, Please try again later.');
        }
        logger.error('Something went wrong, Please try again.');
        throw new ApiError(403, 'Something went wrong, Please try again.');
    }
}

/**
 * @async
 * @function logout
 * @description Service for POST /auth/logout
 * @param {string} accessToken
 * @returns Promise<Object>
 */
export async function logout(accessToken: string): Promise<DefaultServiceResponse> {
    const cognitoIdentity = getCognitoIdentity();

    const params = {
        ClientId: process.env.CLIENT_ID as string,
        AccessToken: accessToken,
    }

    try {
        await cognitoIdentity.send(new GlobalSignOutCommand(params as never));

        logger.silly('User logged out successfully');
        return {
            message: 'User logged out successfully',
            data: null,
        };
    } catch (error) {
        const awsError: IAWSCognitoError = error;
        console.log(awsError);
        if (awsError.name === 'NotAuthorizedException') {
            logger.error('Invalid access token. Please log in.');
            throw new ApiError(awsError?.$metadata?.httpStatusCode, 'Invalid access token. Please log in.');
        }
        logger.error('Something went wrong, Please try again.');
        throw new ApiError(403, 'Something went wrong, Please try again.');
    }
}

/**
 * @async
 * @function remove
 * @description Service for DELETE /auth
 * @param {string} email
 * @param {string} accessToken
 * @returns Promise<Object>
 */
export async function remove(email: string, accessToken: string): Promise<DefaultServiceResponse> {
    const cognitoIdentity = getCognitoIdentity();

    const [userExists] = await dbPool<IUserTable[]>`SELECT * FROM users WHERE email = ${email}`;
    if (!userExists) {
        logger.error('No user exists with this email');
        throw new ApiError(403, 'No user exists with this email');
    }

    await logout(accessToken);

    const params = {
        ClientId: process.env.CLIENT_ID as string,
        UserPoolId: process.env.POOL_ID as string,
        Username: userExists.email,
    }

    try {
        const result = await cognitoIdentity.send(new AdminDeleteUserCommand(params as never));

        if (result.$metadata?.httpStatusCode === 200) {
            await dbPool`DELETE FROM users WHERE email = ${email}`;

            logger.silly('User deleted successfully');
            return {
                message: 'User deleted successfully',
                data: null,
            };
        } else {
            logger.error('Something went wrong, Please try again.');
            throw new ApiError(403, 'Something went wrong, Please try again.');
        }
    } catch (error) {
        const awsError: IAWSCognitoError = error;
        console.log(awsError);
        if (awsError.name === 'NotAuthorizedException') {
            logger.error('Invalid access token. Please log in.');
            throw new ApiError(awsError?.$metadata?.httpStatusCode, 'Invalid access token. Please log in.');
        }
        logger.error('Something went wrong, Please try again.');
        throw new ApiError(403, 'Something went wrong, Please try again.');
    }
}
