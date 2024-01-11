import 'dotenv/config';
import crypto from 'crypto';
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';

export function generateHashSecret(username: string): string {
    const concatenatedUserId = `${username}${process.env.CLIENT_ID}`;
    const hashSecret: string = crypto
        .createHmac('SHA256', process.env.CLIENT_SECRET as string)
        .update(concatenatedUserId)
        .digest('base64');

    return hashSecret;
}

export function getCognitoIdentity(): CognitoIdentityProvider {
    const cognitoIdentity = new CognitoIdentityProvider({
        region: process.env.POOL_REGION,
    });

    return cognitoIdentity;
}

export function getUsernamePostfix(length: number): string {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}
