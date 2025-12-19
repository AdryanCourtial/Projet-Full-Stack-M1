import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import Send from "../utils/response.utils";
import authConfig from "../config/auth.config";

declare global {
    namespace Express {
        interface Request {
            userId?: number;
        }
    }
}

interface DecodedToken extends JwtPayload {
    userId: number;
}

class AuthMiddleware {
  /**
   * Vérifie un token JWT avec le secret donné
   */
  private static verifyToken(token: string, secret: string): DecodedToken | null {
        try {
            return jwt.verify(token, secret) as DecodedToken;
        } catch (error) {
            console.error("JWT verification failed:", error);
            return null;
        }
  }

  /**
   * Middleware pour authentifier via access token
   */
    static authenticateUser = (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies.accessToken;
        
        console.log("Authenticating with access token:", token);

        if (!token) return Send.unauthorized(res);

        const decoded = this.verifyToken(token, authConfig.secret);

        if (!decoded) return Send.unauthorized(res);

        req.userId = decoded.userId;
        next();
  };

  /**
   * Middleware pour vérifier le refresh token avant renouvellement
   */
  static refreshTokenValidation = (req: Request, res: Response, next: NextFunction) => {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken)
        return Send.unauthorized(res, "No refresh token provided");

        const decoded = this.verifyToken(refreshToken, authConfig.refreshSecret);

        if (!decoded)
        return Send.unauthorized(res, "Invalid or expired refresh token");

        req.userId = decoded.userId;
        next();
    };
}

export default AuthMiddleware;
