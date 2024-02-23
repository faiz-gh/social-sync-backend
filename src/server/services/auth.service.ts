import {
    GlobalSignOutCommand,
    InitiateAuthCommand,
    SignUpCommand,
    AdminDeleteUserCommand,
    RespondToAuthChallengeCommand,
    RespondToAuthChallengeCommandInput,
    SignUpCommandInput,
    InitiateAuthCommandInput,
    GlobalSignOutCommandInput,
    AdminDeleteUserCommandInput,
    SignUpCommandOutput,
} from '@aws-sdk/client-cognito-identity-provider';
import { dbPool } from '@database/config.js';
import { ApiError } from '@errors/errorHandler.js';
import { logger } from '@loggers/logger.js';
import { randomUUID } from 'crypto';
import { generateHashSecret, getCognitoIdentity } from 'helpers/helpers.js';
import md5 from 'md5';

/**
 * @async
 * @function register
 * @description Service for POST /auth/mock-register
 * @param {IRegisterRequest} payload
 * @returns Promise<Object>
 */
export async function mockRegister({ firstName, lastName, email, password, roleId }: IRegisterRequest): Promise<IRegisterResponse> {
    // generate random uuid
    const awsUserId = randomUUID();

    const userObj: IUserTable = {
        first_name: firstName,
        last_name: lastName,
        role_id: roleId,
        email: email,
        password: md5(password),
        aws_user_id: awsUserId,
    }

    const [user] = await dbPool`INSERT INTO users ${dbPool(userObj)} RETURNING *`;
    logger.silly('User created successfully, Email verification code sent to your email');

    return {
        message: 'User created successfully, Email verification code sent to your email',
        data: user,
    };
}

/**
 * @async
 * @function login
 * @description Service for POST /auth/mock-login
 * @param {ILoginRequest} payload
 * @returns Promise<Object>
 */
export async function mockLogin({ email, password }: ILoginRequest): Promise<DefaultServiceResponse> {
    const [user] = await dbPool`SELECT * FROM users WHERE email = ${email} AND password = ${md5(password)}`;

    if (!user) {
        logger.error('Invalid email or password');
        throw new ApiError(401, 'Invalid email or password');
    }

    logger.silly('User logged in successfully');

    return {
        message: 'User logged in successfully',
        data: user
    };
}

/**
 * @async
 * @function register
 * @description Service for POST /auth/register
 * @param {IRegisterRequest} payload
 * @returns Promise<Object>
 */
export async function register({ firstName, lastName, email, roleId }: IRegisterRequest): Promise<IRegisterResponse> {
    const cognitoIdentity = getCognitoIdentity();

    const password = md5(email);

    const hashSecret = generateHashSecret(email);

    const params: SignUpCommandInput = {
        ClientId: process.env.CLIENT_ID as string,
        Password: password,
        Username: email,
        SecretHash: hashSecret,
    };

    try {
        const result: SignUpCommandOutput = await cognitoIdentity.send(new SignUpCommand(params));

        const userObj: IUserTable = {
            first_name: firstName,
            last_name: lastName,
            role_id: roleId,
            email: email,
            aws_user_id: result.UserSub,
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
        throw new ApiError(500, 'Something went wrong creating new user, Please try again.');
    }
}

/**
 * @async
 * @function login
 * @description Service for POST /auth/login
 * @param {ILoginRequest} payload
 * @returns Promise<Object>
 */
export async function login({ email }: ILoginRequest): Promise<DefaultServiceResponse> {
    const cognitoIdentity = getCognitoIdentity();

    const [user] = await dbPool`SELECT * FROM users WHERE email = ${email}`;

    if (!user) {
        logger.error('No user exists with this email');
        throw new ApiError(404, 'No user exists with this email');
    }

    const hashSecret = generateHashSecret(email);

    const params: InitiateAuthCommandInput = {
        AuthFlow: 'CUSTOM_AUTH',
        ClientId: process.env.CLIENT_ID as string,
        AuthParameters: {
            'USERNAME': email,
            'SECRET_HASH': hashSecret
        }
    }

    try {
        const result = await cognitoIdentity.send(new InitiateAuthCommand(params));
        logger.silly('User logged in successfully');

        return {
            message: 'User logged in successfully',
            data: result
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
        throw new ApiError(500, 'Something went wrong, Please try again.');
    }
}

/**
 * @async
 * @function verifyOtp
 * @description Service for POST /auth/verify-otp
 * @param {IVerifyOtpRequest} payload
 * @returns Promise<Object>
 */
export async function verifyOtp({ email, code, session }: IVerifyOtpRequest): Promise<DefaultServiceResponse> {
    const cognitoIdentity = getCognitoIdentity();

    const hashSecret = generateHashSecret(email);

    const params: RespondToAuthChallengeCommandInput = {
        ClientId: process.env.CLIENT_ID as string,
        ChallengeName: 'CUSTOM_CHALLENGE',
        ChallengeResponses: {
            'USERNAME': email,
            'ANSWER': code,
            'SECRET_HASH': hashSecret
        },
        Session: session,
    }

    try {
        const result = await cognitoIdentity.send(new RespondToAuthChallengeCommand(params));

        const [user] = await dbPool`SELECT * FROM users WHERE email = ${email}`;
        logger.silly('User logged in successfully');

        return {
            message: 'User logged in successfully',
            data: {
                ...user,
                accessToken: result.AuthenticationResult?.AccessToken,
                refreshToken: result.AuthenticationResult?.RefreshToken,
                idToken: result.AuthenticationResult?.IdToken,
            }
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
        throw new ApiError(500, 'Something went wrong, Please try again.');
    }
}

/**
 * @async
 * @function refreshToken
 * @description Service for POST /auth/refresh-token
 * @param {IRefreshTokenRequest} payload
 * @returns Promise<Object>
 */
export async function refreshToken({ awsUserId, refreshToken }: IRefreshTokenRequest): Promise<DefaultServiceResponse> {
    const cognitoIdentity = getCognitoIdentity();

    const hashSecret = generateHashSecret(awsUserId);
    const params: InitiateAuthCommandInput = {
        AuthFlow: 'REFRESH_TOKEN_AUTH',
        ClientId: process.env.CLIENT_ID as string,
        AuthParameters: {
            'REFRESH_TOKEN': refreshToken,
            'SECRET_HASH': hashSecret
        }
    };

    try {
        const result = await cognitoIdentity.send(new InitiateAuthCommand(params));
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
        throw new ApiError(500, 'Something went wrong, Please try again.');
    }
}

/**
 * @async
 * @function logout
 * @description Service for POST /auth/logout
 * @param {ILogoutRequest} payload
 * @returns Promise<Object>
 */
export async function logout({ accessToken }: ILogoutRequest): Promise<DefaultServiceResponse> {
    const cognitoIdentity = getCognitoIdentity();

    const params: GlobalSignOutCommandInput = {
        AccessToken: accessToken,
    }

    try {
        await cognitoIdentity.send(new GlobalSignOutCommand(params));

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
        throw new ApiError(500, 'Something went wrong, Please try again.');
    }
}

/**
 * @async
 * @function remove
 * @description Service for DELETE /auth
 * @param {IRemoveUserRequest} payload
 * @returns Promise<Object>
 */
export async function remove({ email, accessToken }: IRemoveUserRequest): Promise<DefaultServiceResponse> {
    const cognitoIdentity = getCognitoIdentity();

    const [userExists] = await dbPool<IUserTable[]>`SELECT * FROM users WHERE email = ${email}`;
    if (!userExists) {
        logger.error('No user exists with this email');
        throw new ApiError(404, 'No user exists with this email');
    }

    await logout({ accessToken });

    const params: AdminDeleteUserCommandInput = {
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
            throw new ApiError(500, 'Something went wrong, Please try again.');
        }
    } catch (error) {
        const awsError: IAWSCognitoError = error;
        console.log(awsError);
        if (awsError.name === 'NotAuthorizedException') {
            logger.error('Invalid access token. Please log in.');
            throw new ApiError(awsError?.$metadata?.httpStatusCode, 'Invalid access token. Please log in.');
        }
        logger.error('Something went wrong, Please try again.');
        throw new ApiError(500, 'Something went wrong, Please try again.');
    }
}
