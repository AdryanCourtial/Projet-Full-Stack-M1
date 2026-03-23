import type { User } from "../interfaces/authentification";
import type { LoginDto, RegisterDto } from "../interfaces/dto/auth";
import axiosClient from "../config/axios";

export default function AuthRequest() {
  const login = async (data: LoginDto): Promise<User> => {
    const response = await axiosClient.post("auth/login", data);

    const userInfo: User = response.data;

    console.log("AuthRequest - login - userInfo:", userInfo);

    if (!userInfo) {
      throw new Error("Aucune information utilisateur reçue");
    }

    return userInfo;
  };

  const logout = async () => {};

  const register = async (data: RegisterDto) => {
    const response = await axiosClient.post("auth/register", data);
    return response.data;
  };

  const getUserInfo = async (): Promise<User> => {
    return {
      id: 1,
    };
  };

  return {
    login,
    logout,
    getUserInfo,
    register,
  };
}
