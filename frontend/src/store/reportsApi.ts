import { api } from "./api";

export type TodayKpis = {
  totalEmployees: number;
  today: { present: number; late: number; halfDay: number; recorded: number };
  pendingLeaves: number;
};

export type MonthlyReport = {
  employeeId: string;
  year: number;
  month: number;
  summary: Record<string, number>;
};

export const reportsApi = api.injectEndpoints({
  endpoints: (build) => ({
    todayKpis: build.query<TodayKpis, void>({
      query: () => "/reports/today",
    }),
    monthly: build.query<
      MonthlyReport,
      { year: number; month: number; employeeId?: string }
    >({
      query: (params) => ({ url: "/reports/monthly", params }),
    }),
  }),
});

export const { useTodayKpisQuery, useMonthlyQuery } = reportsApi;

