import axios from "../config/axios";
import type { DashboardData } from "../hooks/useDashboard";

interface DashboardQueryParams {
  month?: string;
  from?: string;
  to?: string;
}

export const getDashboardMonthly = async (
  params: DashboardQueryParams,
): Promise<DashboardData> => {
  const response = await axios.get("/dashboard/monthly", { params });
  return response.data;
};
