import { useEffect, useState } from "react";
import { getDashboardMonthly } from "../api/dashboard";

export interface DashboardData {
  period: { from: string; to: string };
  totals: { income: number; expense: number; net: number };
  avgDailyExpense: number;
  topExpenseCategories: Array<{
    categoryId: number;
    name: string;
    total: number;
  }>;
  dailySeries: Array<{ date: string; income: number; expense: number }>;
}

interface UseDashboardReturn {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
}

export const useDashboard = (month?: string): UseDashboardReturn => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError(null);

        // Format current month if not provided (YYYY-MM)
        const targetMonth = month || new Date().toISOString().slice(0, 7);
        const result = await getDashboardMonthly({ month: targetMonth });

        setData(result);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to load dashboard data";
        setError(message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [month]);

  return { data, loading, error };
};
