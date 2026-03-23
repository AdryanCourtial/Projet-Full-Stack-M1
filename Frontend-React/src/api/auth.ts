import type { User } from "../interfaces/authentification";
import type { LoginDto, RegisterDto } from "../interfaces/dto/auth";
import axiosClient from "../config/axios";
import axios from "axios";

interface UserInfoResponse {
  user: User;
}

const normalizeUserPayload = (payload: UserInfoResponse | User): User => {
  if ((payload as UserInfoResponse).user) {
    return (payload as UserInfoResponse).user;
  }

  return payload as User;
};

export default function AuthRequest() {
  const login = async (data: LoginDto): Promise<User> => {
    const response = await axiosClient.post("auth/login", data);

    const userInfo = normalizeUserPayload(
      response.data as UserInfoResponse | User,
    );

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

  const getUserInfo = async (): Promise<User | null> => {
    try {
      const response = await axiosClient.get<UserInfoResponse>("user/info");
      return normalizeUserPayload(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        return null;
      }

      throw error;
    }
  };

  return {
    login,
    logout,
    getUserInfo,
    register,
  };
}
