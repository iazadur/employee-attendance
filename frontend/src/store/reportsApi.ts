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
    todayKpis: build.query<TodayKpis, { shiftId?: string }>({
      query: (params) => ({ url: "/reports/today", params }),
    }),
    monthly: build.query<
      MonthlyReport,
      { year: number; month: number; employeeId?: string; shiftId?: string }
    >({
      query: (params) => ({ url: "/reports/monthly", params }),
    }),
  }),
});

export const { useTodayKpisQuery, useMonthlyQuery } = reportsApi;

