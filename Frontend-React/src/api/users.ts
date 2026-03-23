import axiosClient from "../config/axios";
import type { ListUsersResponse, UserListItem } from "../interfaces/dto/users";

export default function UsersRequest() {
  const listAll = async (): Promise<UserListItem[]> => {
    const response = await axiosClient.get<ListUsersResponse>("user/all");
    return Array.isArray(response.data?.users) ? response.data.users : [];
  };

  return {
    listAll,
  };
}
