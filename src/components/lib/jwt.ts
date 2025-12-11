import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    // Do not throw at module import time to avoid breaking server builds.
    // Functions below will handle missing secret gracefully and log helpful messages.
    console.warn('Warning: JWT_SECRET is not defined in environment variables. Token operations will be disabled.');
}

export interface TokenPayload {
    userId: number;
    email: string;
    name: string;
}

// Token generate karna
export const generateToken = (payload: TokenPayload): string => {
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined. Cannot generate token.');
    }
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: '7d', // 7 din valid rahega
        algorithm: 'HS256'
    });
};

// Token verify karna
export const verifyToken = (token: string): TokenPayload | null => {
    try {
        if (!JWT_SECRET) {
            console.error('JWT_SECRET is not defined. Cannot verify token.');
            return null;
        }
        const decoded = jwt.verify(token, JWT_SECRET, {
            algorithms: ['HS256']
        });
        return decoded as TokenPayload;
    } catch (error) {
        console.error('Token verification failed:', error);
        return null;
    }
};

// Token decode karna (without verification - risky, careful use)
export const decodeToken = (token: string): TokenPayload | null => {
    try {
        const decoded = jwt.decode(token);
        return decoded as TokenPayload;
    } catch (error) {
        console.error('Token decode failed:', error);
        return null;
    }
};
