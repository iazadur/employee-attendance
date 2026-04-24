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

export type UpdateShiftPayload = Partial<CreateShiftPayload>;

export const shiftsApi = api.injectEndpoints({
  endpoints: (build) => ({
    listShifts: build.query<Shift[], void>({
      query: () => "/shifts",
    }),
    getShift: build.query<Shift, string>({
      query: (id) => `/shifts/${id}`,
    }),
    createShift: build.mutation<Shift, CreateShiftPayload>({
      query: (body) => ({ url: "/shifts", method: "POST", body }),
    }),
    updateShift: build.mutation<Shift, { id: string; data: UpdateShiftPayload }>({
      query: ({ id, data }) => ({ url: `/shifts/${id}`, method: "PATCH", body: data }),
    }),
    deleteShift: build.mutation<{ ok: boolean }, string>({
      query: (id) => ({ url: `/shifts/${id}`, method: "DELETE" }),
    }),
  }),
});

export const {
  useListShiftsQuery,
  useCreateShiftMutation,
  useGetShiftQuery,
  useUpdateShiftMutation,
  useDeleteShiftMutation,
} = shiftsApi;

