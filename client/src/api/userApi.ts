import { axiosInstance } from "./api";

export const updateUser = async (
  payload: Partial<{ name: string; email: string }>
): Promise<void> => {
  await axiosInstance.put("/users", payload);
};
