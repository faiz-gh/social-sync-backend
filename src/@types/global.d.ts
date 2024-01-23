interface IAWSCognitoError {
    name?: string;
    $fault?: string;
    $metadata?: IAWSCognitoErrorMetaData;
}

interface IAWSCognitoErrorMetaData {
    httpStatusCode?: number;
    requestId?: string;
    attempts?: number;
    totalRetryDelay?: number;
}

interface ISocialMedia {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    whatsapp?: string;
}

interface IGenerateTemplate {
    link?: string;
}

interface IMiddlewareAuthJWT {
    sub?: string;
}
