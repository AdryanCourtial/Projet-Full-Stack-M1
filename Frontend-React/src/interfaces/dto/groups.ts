export interface GroupMember {
  id?: number;
  groupId: number;
  userId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Group {
  id: number;
  name: string;
  ownerId: number;
  createdAt: string;
  updatedAt: string;
  members?: GroupMember[];
}

export interface CreateGroupDto {
  name: string;
}

export interface AddGroupMemberDto {
  userId: number;
}

export interface ListGroupsResponse {
  groups: Group[];
}

export interface CreateGroupResponse {
  group: Group;
}

export interface GetGroupByIdResponse {
  group: Group;
}
