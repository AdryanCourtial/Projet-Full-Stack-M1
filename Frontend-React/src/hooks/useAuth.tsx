import React, { createContext, useContext, useEffect } from "react";
import AuthRequest from "../api/auth";
import type { User } from "../interfaces/authentification";
import type { LoginDto, RegisterDto } from "../interfaces/dto/auth";
import { useNavigate } from "react-router";

interface AuthContextType {
  auth: User | null;
  login: (userInfo: LoginDto) => Promise<boolean>;
  logout: () => void;
  getInformationUser: () => void;
  register: (data: RegisterDto) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    AuthRequest()
      .getUserInfo()
      .then((userInfo) => {
        setAuth(userInfo);
        console.log("useAuthContext - userInfo:", userInfo);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = async (userInfo: LoginDto): Promise<boolean> => {
    setLoading(true);

    try {
      const authenticatedUser = await AuthRequest().login(userInfo);
      setAuth(authenticatedUser);
      navigate("/home", { replace: true });
      return true;
    } catch {
      setAuth(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    AuthRequest()
      .logout()
      .then(() => {
        setAuth(null);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const register = (data: RegisterDto) => {
    AuthRequest()
      .register(data)
      .then(() => {
        setAuth(null);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getInformationUser = () => {
    return AuthRequest()
      .getUserInfo()
      .then((userInfo) => {
        setAuth(userInfo);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <AuthContext.Provider
      value={{ auth, login, logout, getInformationUser, register, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
