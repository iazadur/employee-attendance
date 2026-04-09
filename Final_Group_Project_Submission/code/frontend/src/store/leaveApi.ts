import { api } from "./api";

export type LeaveRequest = {
  id: string;
  employeeId: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: string;
  adminComment: string | null;
  createdAt: string;
};

export type AdminLeaveRequest = LeaveRequest & {
  employee?: {
    user?: { email: string; name: string };
    employeeCode?: string;
  };
};

export const leaveApi = api.injectEndpoints({
  endpoints: (build) => ({
    myLeave: build.query<LeaveRequest[], void>({
      query: () => "/leave/mine",
    }),
    createLeave: build.mutation<
      LeaveRequest,
      { leaveType: string; startDate: string; endDate: string; reason: string }
    >({
      query: (body) => ({ url: "/leave", method: "POST", body }),
    }),
    listAllLeaves: build.query<AdminLeaveRequest[], void>({
      query: () => "/leave",
    }),
    reviewLeave: build.mutation<
      LeaveRequest,
      { id: string; status: "APPROVED" | "REJECTED"; adminComment?: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/leave/${id}/review`,
        method: "PATCH",
        body,
      }),
    }),
  }),
});

export const {
  useMyLeaveQuery,
  useCreateLeaveMutation,
  useListAllLeavesQuery,
  useReviewLeaveMutation,
} = leaveApi;

