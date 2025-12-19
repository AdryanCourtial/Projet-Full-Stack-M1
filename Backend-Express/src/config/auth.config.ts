const authConfig = {
    secret: process.env.AUTH_SECRET || 'your_jwt_access_token_secret',
    expiresIn: process.env.AUTH_SECRET_EXPIRES_IN || '15m',
    refreshSecret: process.env.AUTH_REFRESH_SECRET || 'your_jwt_refresh_token_secret',
    refreshExpiresIn: process.env.AUTH_REFRESH_SECRET_EXPIRES_IN || '24h',
}

export default authConfig;