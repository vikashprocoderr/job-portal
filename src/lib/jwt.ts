import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}

export interface TokenPayload {
    userId: number;
    email: string;
    name: string;
}

// Token generate karna
export const generateToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: '7d', // 7 din valid rahega
        algorithm: 'HS256'
    });
};

// Token verify karna
export const verifyToken = (token: string): TokenPayload | null => {
    try {
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
