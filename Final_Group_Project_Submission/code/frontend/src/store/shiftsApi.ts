import { api } from "./api";

export type Shift = {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  workingDays: string;
  graceMinutes: number;
  description: string | null;
};

export type CreateShiftPayload = {
  name: string;
  startTime: string;
  endTime: string;
  workingDays: string;
  graceMinutes?: number;
  description?: string;
};

export const shiftsApi = api.injectEndpoints({
  endpoints: (build) => ({
    listShifts: build.query<Shift[], void>({
      query: () => "/shifts",
    }),
    createShift: build.mutation<Shift, CreateShiftPayload>({
      query: (body) => ({ url: "/shifts", method: "POST", body }),
    }),
  }),
});

export const { useListShiftsQuery, useCreateShiftMutation } = shiftsApi;

