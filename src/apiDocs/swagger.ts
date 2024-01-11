const swaggerDefinition = {
    openapi: '3.0.3',
    info: {
        title: 'SocialSync API Docs - OpenAPI 3.0',
        version: '1.0.0',
        description: 'Welcome to SocialSync API documentation',
        contact: {
            name: 'SocialSync Support',
            email: 'support@socialsync.com',
            url: 'https://socialsync.com',
        },
        license: {
            name: 'Apache 2.0',
            url: 'https://www.apache.org/licenses/LICENSE-2.0.html',
        },
    },
    tags: [
        {
            name: 'Health',
            description: 'Health check endpoints',
        },
        {
            name: 'Authentication',
            description: 'Authentication related endpoints',
        },
        {
            name: 'Companies',
            description: 'Companies related endpoints',
        },
        {
            name: 'Profiles',
            description: 'Profiles related endpoints',
        },
        {
            name: 'Leads',
            description: 'Lead related endpoints',
        },
        {
            name: 'Cards',
            description: 'Card related endpoints',
        },
    ],
    // servers: [
    //     {
    //         url: 'https://devapp.nebe.one/api',
    //         description: 'Development Server',
    //     },
    //     {
    //         url: 'http://localhost:4400/api',
    //         description: 'Local Server',
    //     },
    //     {
    //         url: 'https://app.nebe.one/api',
    //         description: 'Production Server',
    //     },
    // ],
};

const swaggerSpecs = {
    swaggerDefinition,
    apis: ['./src/apiDocs/swagger.yaml']
};

export default swaggerSpecs;
