export interface UserListItem {
  id: number;
  email?: string | null;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
}

export interface ListUsersResponse {
  users: UserListItem[];
}
