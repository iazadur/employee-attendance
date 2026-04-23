import { api } from "./api";

export type AttendanceRecord = {
  id: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: string;
  totalMinutes: number | null;
};

export type TodayAttendanceQuery = {
  date: string; // YYYY-MM-DD format
};

export const attendanceApi = api.injectEndpoints({
  endpoints: (build) => ({
    checkIn: build.mutation<AttendanceRecord, void>({
      query: () => ({ url: "/attendance/check-in", method: "POST" }),
      invalidatesTags: ["Attendance"],
    }),
    checkOut: build.mutation<AttendanceRecord, void>({
      query: () => ({ url: "/attendance/check-out", method: "POST" }),
      invalidatesTags: ["Attendance"],
    }),
    listAttendance: build.query<
      AttendanceRecord[],
      { employeeId?: string; dateFrom?: string; dateTo?: string } | void
    >({
      query: (params) => ({
        url: "/attendance",
        params: params ? params : undefined,
      }),
      providesTags: ["Attendance"],
    }),
    todayAttendance: build.query<AttendanceRecord | null, TodayAttendanceQuery>({
      query: (params) => ({
        url: "/attendance",
        params: {
          dateFrom: params.date,
          dateTo: params.date,
        },
      }),
      // Transform the array result to a single record or null
      transformResponse: (result: AttendanceRecord[]) => {
        return result.length > 0 ? result[0] : null;
      },
      providesTags: ["Attendance"],
    }),
  }),
});

export const {
  useCheckInMutation,
  useCheckOutMutation,
  useListAttendanceQuery,
  useTodayAttendanceQuery,
} = attendanceApi;

