import { api } from "./api";

export type AttendanceRecord = {
  id: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: string;
  totalMinutes: number | null;
};

export const attendanceApi = api.injectEndpoints({
  endpoints: (build) => ({
    checkIn: build.mutation<AttendanceRecord, void>({
      query: () => ({ url: "/attendance/check-in", method: "POST" }),
    }),
    checkOut: build.mutation<AttendanceRecord, void>({
      query: () => ({ url: "/attendance/check-out", method: "POST" }),
    }),
    listAttendance: build.query<
      AttendanceRecord[],
      { employeeId?: string; dateFrom?: string; dateTo?: string } | void
    >({
      query: (params) => ({
        url: "/attendance",
        params: params ? params : undefined,
      }),
    }),
  }),
});

export const { useCheckInMutation, useCheckOutMutation, useListAttendanceQuery } =
  attendanceApi;

