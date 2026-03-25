import axiosClient from "../config/axios";
import type {
  CreateGroupExpenseDto,
  CreateGroupExpenseResponse,
  GroupBalancesResponse,
  GroupSettlementsResponse,
  ListGroupExpensesResponse,
} from "../interfaces/dto/group-expenses";
import type {
  AddGroupMemberDto,
  CreateGroupDto,
  CreateGroupResponse,
  GetGroupByIdResponse,
  Group,
  ListGroupsResponse,
} from "../interfaces/dto/groups";

const normalizeGroup = (group: Group): Group => ({
  ...group,
  members: Array.isArray(group.members) ? group.members : [],
});

export default function GroupsRequest() {
  const list = async (): Promise<Group[]> => {
    const response = await axiosClient.get<ListGroupsResponse>("groups");
    const groups = Array.isArray(response.data?.groups)
      ? response.data.groups
      : [];
    return groups.map(normalizeGroup);
  };

  const create = async (data: CreateGroupDto): Promise<Group> => {
    const response = await axiosClient.post<CreateGroupResponse>(
      "groups",
      data,
    );
    return normalizeGroup(response.data.group);
  };

  const getById = async (groupId: number): Promise<Group> => {
    const response = await axiosClient.get<GetGroupByIdResponse>(
      `groups/${groupId}`,
    );
    return normalizeGroup(response.data.group);
  };

  const addMember = async (
    groupId: number,
    data: AddGroupMemberDto,
  ): Promise<void> => {
    await axiosClient.post(`groups/${groupId}/members`, data);
  };

  const removeMember = async (
    groupId: number,
    userId: number,
  ): Promise<void> => {
    await axiosClient.delete(`groups/${groupId}/members/${userId}`);
  };

  const createExpense = async (
    groupId: number,
    data: CreateGroupExpenseDto,
  ) => {
    const response = await axiosClient.post<CreateGroupExpenseResponse>(
      `groups/${groupId}/expenses`,
      data,
    );
    return response.data.expense;
  };

  const listExpenses = async (groupId: number) => {
    const response = await axiosClient.get<ListGroupExpensesResponse>(
      `groups/${groupId}/expenses`,
    );
    return Array.isArray(response.data?.expenses) ? response.data.expenses : [];
  };

  const getBalances = async (groupId: number) => {
    const response = await axiosClient.get<GroupBalancesResponse>(
      `groups/${groupId}/balances`,
    );
    return response.data;
  };

  const getSettlements = async (groupId: number) => {
    const response = await axiosClient.get<GroupSettlementsResponse>(
      `groups/${groupId}/settlements`,
    );
    return response.data;
  };

  return {
    list,
    create,
    getById,
    addMember,
    removeMember,
    createExpense,
    listExpenses,
    getBalances,
    getSettlements,
  };
}
