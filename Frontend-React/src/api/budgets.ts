import axiosClient from "../config/axios";
import type {
  AddBudgetCategoriesDto,
  AddBudgetCategoriesResponse,
  Budget,
  BudgetDetail,
  BudgetSummaryResponse,
  CreateBudgetDto,
  CreateBudgetResponse,
  GetBudgetByIdResponse,
  ListBudgetsResponse,
  UpdateBudgetDto,
  UpdateBudgetResponse,
} from "../interfaces/dto/budgets";

const normalizeBudget = (budget: Budget): Budget => ({
  ...budget,
  group: budget.group ?? null,
});

const normalizeBudgetDetail = (budget: BudgetDetail): BudgetDetail => ({
  ...normalizeBudget(budget),
  budgetCategories: Array.isArray(budget.budgetCategories)
    ? budget.budgetCategories
    : [],
});

export default function BudgetsRequest() {
  const list = async (): Promise<Budget[]> => {
    const response = await axiosClient.get<ListBudgetsResponse>("budgets");
    const budgets = Array.isArray(response.data?.budgets)
      ? response.data.budgets
      : [];
    return budgets.map(normalizeBudget);
  };

  const create = async (data: CreateBudgetDto): Promise<Budget> => {
    const response = await axiosClient.post<CreateBudgetResponse>(
      "budgets",
      data,
    );
    return normalizeBudget(response.data.budget);
  };

  const getById = async (id: number): Promise<BudgetDetail> => {
    const response = await axiosClient.get<GetBudgetByIdResponse>(
      `budgets/${id}`,
    );
    return normalizeBudgetDetail(response.data.budget);
  };

  const update = async (id: number, data: UpdateBudgetDto): Promise<Budget> => {
    const response = await axiosClient.put<UpdateBudgetResponse>(
      `budgets/${id}`,
      data,
    );
    return normalizeBudget(response.data.budget);
  };

  const remove = async (id: number): Promise<void> => {
    await axiosClient.delete(`budgets/${id}`);
  };

  const addCategories = async (
    id: number,
    data: AddBudgetCategoriesDto,
  ): Promise<BudgetDetail> => {
    const response = await axiosClient.post<AddBudgetCategoriesResponse>(
      `budgets/${id}/categories`,
      data,
    );
    return normalizeBudgetDetail(response.data.budget);
  };

  const removeCategory = async (
    id: number,
    categoryId: number,
  ): Promise<BudgetDetail> => {
    const response = await axiosClient.delete<AddBudgetCategoriesResponse>(
      `budgets/${id}/categories/${categoryId}`,
    );
    return normalizeBudgetDetail(response.data.budget);
  };

  const summary = async (
    id: number,
    query?: { from?: string; to?: string },
  ): Promise<BudgetSummaryResponse> => {
    const response = await axiosClient.get<BudgetSummaryResponse>(
      `budgets/${id}/summary`,
      {
        params: query,
      },
    );
    return response.data;
  };

  return {
    list,
    create,
    getById,
    update,
    remove,
    addCategories,
    removeCategory,
    summary,
  };
}
