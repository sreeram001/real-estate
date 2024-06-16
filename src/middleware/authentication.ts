import { Request, Response, NextFunction } from "express";
import { JWTToken } from "../config/jwtToken";
import Session from "../models/session";
import UserService from "../services/user.service";

declare module "express-serve-static-core" {
  // eslint-disable-next-line no-shadow
  interface Request {
    userId?: number;
    role?: string;
  }
}

interface JwtPayload {
  id: number;
  email: string;
  mobile_no: number;
  role: string;
}

// This is An Middleware function check wether the token valid or not //
export async function ApiHeaderAuthentication(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      status: 401,
      message: "Unauthorized",
      error: "Provide the token"
    });
  }
  // check if exist session table
  const session = await Session.findOne({ where: { session_token: token } });
  const jwtCustomerToken = JWTToken.validateJWTToken(token);

  if (!session || !jwtCustomerToken) {
    return res.status(401).json({
      status: 401,
      message: "Unauthorized",
      error: "Token expired"
    });
  }

  const { id, role } = jwtCustomerToken as JwtPayload;

  // Check if user exists
  const user = await UserService.userSelect(id);

  if (!user) {
    return res.status(401).json({
      status: 401,
      message: "Unauthorized",
      error: "User Not fond"
    });
    // return res.sendStatus(401); // Unauthorized if user not found
  }
  // eslint-disable-next-line require-atomic-updates
  req.userId = id || 0;
  // eslint-disable-next-line require-atomic-updates
  req.role = role || "";
  next();
}
