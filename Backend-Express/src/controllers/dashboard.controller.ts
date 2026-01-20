import { Request, Response } from "express";
import { DashboardMonthlyQueryDto } from "../dto/dashboard.dto";
import { getMonthlyDashboardService } from "../services/dashboard.service";

class DashboardController {
  static monthly = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId as number;

      const dto = (req as any).validated_query as DashboardMonthlyQueryDto;

      const data = await getMonthlyDashboardService(userId, dto);
      return res.status(200).json(data);
    } catch (err: any) {
      const status = err?.statusCode ?? 500;
      if (status !== 500) return res.status(status).json({ error: err.message });
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };
}

export default DashboardController;
