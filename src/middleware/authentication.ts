import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import { JWTToken } from '../config/jwtToken';

declare module 'express-serve-static-core' {
    interface Request {
        userId?: number;
        role?: string;
    }
}

interface JwtPayload {
    id: number,
    email: string,
    mobile_no: number,
    role: string,
}

// This is An Middleware function check wether the token valid or not //
export async function ApiHeaderAuthentication(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            status: "failure",
            message: "Unauthorized",
            error: "Provide the token"
        })
    }
    const jwtCustomerToken = JWTToken.validateJWTToken(token);
  
    if (!jwtCustomerToken) {
        return res.status(401).json({
            status: "failure",
            message: "Unauthorized",
            error: "Token expired"
        })
    }
    const { id, role } = jwtCustomerToken as JwtPayload;
    // Check if user exists
    const user = await User.findByPk(id);
    if (!user) {
        return res.status(401).json({
            status: "failure",
            message: "Unauthorized",
            error: "User Not fond"
        })
        // return res.sendStatus(401); // Unauthorized if user not found
    }
    req.userId = id || 0;
    req.role = role || "";
    next();
}

