export interface BudgetGroup {
  id: number;
  name: string;
  ownerId: number;
}

export interface Category {
  id: number;
  name: string;
}

export interface BudgetCategoryLink {
  id: number;
  budgetId: number;
  categoryId: number;
  category: Category;
}

export interface Budget {
  id: number;
  userId: number;
  groupId: number | null;
  name: string;
  amountPlanned: number;
  startDate: string;
  endDate: string | null;
  createdAt?: string;
  updatedAt?: string;
  group?: BudgetGroup | null;
}

export interface BudgetDetail extends Budget {
  budgetCategories?: BudgetCategoryLink[];
}

export interface CreateBudgetDto {
  name: string;
  amountPlanned: number;
  startDate: string;
  endDate?: string;
  groupId?: number;
}

export interface UpdateBudgetDto {
  name?: string;
  amountPlanned?: number;
  startDate?: string;
  endDate?: string;
}

export interface AddBudgetCategoriesDto {
  categoryIds: number[];
}

export interface ListBudgetsResponse {
  budgets: Budget[];
}

export interface CreateBudgetResponse {
  budget: Budget;
}

export interface GetBudgetByIdResponse {
  budget: BudgetDetail;
}

export interface UpdateBudgetResponse {
  budget: Budget;
}

export interface AddBudgetCategoriesResponse {
  budget: BudgetDetail;
}

export interface BudgetSummaryBudgetInfo {
  id: number;
  name: string;
  amountPlanned: number;
  startDate: string;
  endDate: string | null;
  group: BudgetGroup | null;
}

export interface BudgetSummaryPeriod {
  from: string;
  to: string;
}

export interface BudgetSummaryTotals {
  planned: number;
  income: number;
  spent: number;
  remaining: number;
  net: number;
}

export interface BudgetSummaryByCategoryItem {
  categoryId: number;
  name: string;
  spent: number;
}

export interface BudgetSummaryResponse {
  budget: BudgetSummaryBudgetInfo;
  period: BudgetSummaryPeriod;
  totals: BudgetSummaryTotals;
  byCategory: BudgetSummaryByCategoryItem[];
  attachedCategories: Category[];
}
