export interface GroupExpenseUser {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
  email: string;
}

export interface GroupExpenseShare {
  id: number;
  groupExpenseId: number;
  userId: number;
  amountOwed: number;
  user: GroupExpenseUser;
}

export interface GroupExpense {
  id: number;
  groupId: number;
  paidByUserId: number;
  amount: number;
  description?: string | null;
  date: string;
  paidBy: GroupExpenseUser;
  shares: GroupExpenseShare[];
}

export interface CreateGroupExpenseDto {
  amount: number;
  description?: string;
  date?: string;
  paidByUserId?: number;
  participants?: number[];
}

export interface CreateGroupExpenseResponse {
  expense: GroupExpense;
}

export interface ListGroupExpensesResponse {
  expenses: GroupExpense[];
}

export interface GroupBalanceItem {
  userId: number;
  name: string;
  paid: number;
  owed: number;
  balance: number;
}

export interface GroupBalancesResponse {
  group: {
    id: number;
    name: string;
  };
  balances: GroupBalanceItem[];
}

export interface GroupSettlementItem {
  fromUserId: number;
  fromName: string;
  toUserId: number;
  toName: string;
  amount: number;
}

export interface GroupSettlementsResponse extends GroupBalancesResponse {
  settlements: GroupSettlementItem[];
}
