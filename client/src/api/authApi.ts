import { axiosInstance } from "./api";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export const login = async (payload: LoginPayload): Promise<void> => {
  await axiosInstance.post<AuthResponse>("/auth/login", payload);
};

export const register = async (payload: RegisterPayload): Promise<void> => {
  await axiosInstance.post("/auth/register", payload);
};

type User = {
  id: number;
  email: string;
  name?: string | null;
  // add other fields your backend returns
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await axiosInstance.get("/users/me");
  return response.data;
};
