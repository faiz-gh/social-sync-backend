import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';

const REGION = process.env.POOL_REGION;
const USER_POOL_ID = process.env.POOL_ID;

export const tokenAuthenticated = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const Authorization = req.headers.authorization;
    if (!Authorization) {
        return res.status(401).send('Unauthorized');
    }
    const [, token] = Authorization.split(' ');
    if (!token) {
        return res.status(401).send('Unauthorized');
    }

    setupPEMS()
        .then((pems) => {
            const decodedToken = jwt.decode(token, { complete: true });
            const kid = decodedToken.header.kid;
            const pem = pems[kid];

            if (!pem) {
                return res.status(401).json({ message: 'Invalid JWT token' });
            }

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-expect-error
            jwt.verify(token, pem, function (err: jwt.VerifyErrors | null, decoded: JwtPayload | undefined) {
                if (err) {
                    return res.status(401).json({ message: 'Invalid JWT token' });
                } else {
                    if (decoded) {
                        (req as Request & { userId: string }).userId = decoded.sub;
                        next();
                    } else {
                        return res.status(401).json({ message: 'Invalid JWT token' });
                    }
                }
            });
        })
        .catch((error) => {
            console.error(error);
            res.status(401).send('Invalid JWT token');
        });
};

export async function setupPEMS(): Promise<Record<string, string>> {
    const pems: Record<string, string> = {};
    const cognitoURL = `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}/.well-known/jwks.json`;

    try {
        const response = await fetch(cognitoURL);
        if (response.status !== 200) {
            throw new Error('Request Not Successful');
        }
        const data = await response.json();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const { keys } = data;
        for (let i = 0; i < keys.length; i++) {
            const key_id = keys[i].kid;
            const modulus = keys[i].n;
            const exponent = keys[i].e;
            const key_type = keys[i].kty;
            const jwk = { kty: key_type, n: modulus, e: exponent };
            const pem = jwkToPem(jwk);
            pems[key_id] = pem;
        }
        return pems;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
