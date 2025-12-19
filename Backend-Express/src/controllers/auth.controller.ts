import { Request, Response } from "express";
import Send from "../utils/response.utils";
import { getUserById, registerUser, saveRefreshToken, validateUserCredentials } from "../services/auth.service";
import { generateAccessToken, generateRefreshToken } from "../services/token.service";

class AuthController {
    static login = async (req: Request, res: Response) => {
        const { email, password } = req.body;

        try {
            const user = await validateUserCredentials(email, password);

            if (!user) {
                return Send.error(res, null, "Invalid credentials");
            }

            const accessToken = generateAccessToken(user.id);
            const refreshToken = generateRefreshToken(user.id);

            await saveRefreshToken(user.id, refreshToken);

            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 15 * 60 * 1000,
                sameSite: "strict",
            });

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 24 * 60 * 60 * 1000,
                sameSite: "strict",
            });    

            console.log("")
            
            return Send.success(res, {
                id: user.id,
                username: user.username,
                email: user.email,
            });

        } catch (error) {
            console.error("Login Failed:", error);
            return Send.error(res, null, "Login failed.");
        }
    };

    static register = async (req: Request, res: Response) => {
        const { username, firstName, lastName, email, password, password_confirmation } = req.body;

        try {
            const user = await registerUser(username, firstName, lastName, email, password);

            return Send.success(res, {
                id: user.id,
                username: user.username,
                email: user.email,
            }, "User successfully registered.");

        } catch (error: any) {
            if (error.message === "EMAIL_ALREADY_EXISTS") {
                return Send.error(res, null, "Email is already in use.");
            }

            console.error("Registration failed:", error);
            return Send.error(res, null, "Registration failed.");
        }
    };

    static logout = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user?.userId;

            if (userId) {
                await saveRefreshToken(userId, null);
            }

            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");

            return Send.success(res, null, "Logged out successfully.");

        } catch (error) {
            console.error("Logout failed:", error);
            return Send.error(res, null, "Logout failed.");
        }
    };

    static refreshToken = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).userId; 
            const clientRefreshToken = req.cookies.refreshToken;

            if (!userId || !clientRefreshToken) {
                return Send.unauthorized(res, "Refresh token missing");
            }

            const user = await getUserById(userId);
            if (!user || !user.refreshToken) {
                return Send.unauthorized(res, "Refresh token not found");
            }

            if (user.refreshToken !== clientRefreshToken) {
                return Send.unauthorized(res, "Invalid refresh token");
            }

            const newAccessToken = generateAccessToken(user.id);

            res.cookie("accessToken", newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 15 * 60 * 1000,
                sameSite: "strict",
            });

            return Send.success(res, { message: "Access token refreshed successfully" });

        } catch (error) {
            console.error("Refresh Token failed:", error);
            return Send.error(res, null, "Failed to refresh token");
        }
    };

}

export default AuthController;
