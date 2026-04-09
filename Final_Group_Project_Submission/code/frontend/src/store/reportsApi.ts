import { api } from "./api";

export type TodayKpis = {
  totalEmployees: number;
  today: { present: number; late: number; halfDay: number; recorded: number };
  pendingLeaves: number;
};

export const reportsApi = api.injectEndpoints({
  endpoints: (build) => ({
    todayKpis: build.query<TodayKpis, void>({
      query: () => "/reports/today",
    }),
  }),
});

export const { useTodayKpisQuery } = reportsApi;

