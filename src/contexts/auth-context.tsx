import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import User from "../types/user";

type AuthContextProps = {
  user: User | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  signup: (
    name: string,
    email: string,
    password: string
  ) => Promise<{
    success: boolean;
    error?: string;
  }>;
  logout: () => void;
  isLoading: boolean;
};

type AuthProviderProps = {
  children: React.ReactNode;
};

const AuthContext = createContext<AuthContextProps | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const userId = localStorage.getItem("user_id");
        if (!userId) {
          setUser(null);
          setIsLoading(false);
          return;
        }

        const users = localStorage.getItem("users");
        const parsedUsers = users ? JSON.parse(users) : [];
        const currentUser = parsedUsers.find((u: User) => u.id === userId);

        if (currentUser) {
          setUser(currentUser);
        } else {
          localStorage.removeItem("user_id");
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const users = localStorage.getItem("users");
      const parsedUsers = users ? JSON.parse(users) : [];
      const foundUser = parsedUsers.find(
        (user: User) => user.email === email && user.password === btoa(password)
      );

      if (!foundUser) {
        return { success: false, error: "E-mail ou senha inválidos" };
      }

      localStorage.setItem("user_id", foundUser.id);
      setUser(foundUser);
      navigate("/");
      return { success: true };
    } catch (error) {
      console.error("Error during login:", error);
      return { success: false, error: "Erro ao fazer login" };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const users = localStorage.getItem("users");
      const parsedUsers = users ? JSON.parse(users) : [];
      const newUser = {
        id: crypto.randomUUID(),
        name,
        email,
        password: btoa(password),
        createdAt: new Date(),
      };

      if (parsedUsers.some((user: User) => user.email === email)) {
        return { success: false, error: "E-mail já cadastrado" };
      }

      parsedUsers.push(newUser);
      localStorage.setItem("users", JSON.stringify(parsedUsers));
      localStorage.setItem("user_id", newUser.id);
      setUser(newUser);
      navigate("/");
      return { success: true };
    } catch (error) {
      console.error("Error during signup:", error);
      return { success: false, error: "Erro ao fazer cadastro" };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user_id");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
