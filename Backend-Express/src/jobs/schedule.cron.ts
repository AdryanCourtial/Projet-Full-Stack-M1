import cron from "node-cron";
import { runSchedulesForCurrentMonthService } from "../services/schedule.service";

const MONTHLY_SCHEDULE_CRON = "5 0 1 * *";

const runMonthlySchedules = async () => {
    try {
        const result = await runSchedulesForCurrentMonthService(new Date());
        console.log(
            `[schedule-cron] month=${result.monthStart.toISOString().slice(0, 7)} schedules=${result.totalSchedules} attempted=${result.attempted} created=${result.created}`
        );
    } catch (error) {
        console.error("[schedule-cron] monthly run failed", error);
    }
};

export const startScheduleCronJob = () => {
    cron.schedule(MONTHLY_SCHEDULE_CRON, runMonthlySchedules, { timezone: "UTC" });
    console.log(`[schedule-cron] started with expression \"${MONTHLY_SCHEDULE_CRON}\" in UTC`);

    if (process.env.SCHEDULE_CRON_RUN_ON_STARTUP !== "false") {
        void runMonthlySchedules();
    }
};
