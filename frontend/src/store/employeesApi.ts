import { api } from "./api";

export type EmployeeListItem = {
  id: string;
  employeeCode: string;
  department: string;
  designation: string;
  joinDate: string;
  phone: string;
  shiftId: string | null;
  user: { id: string; email: string; name: string; role: string };
  shift?: { id: string; name: string; startTime: string; endTime: string } | null;
};

export type CreateEmployeePayload = {
  email: string;
  name: string;
  password: string;
  department: string;
  designation: string;
  joinDate: string;
  phone: string;
  shiftId?: string;
};

export type UpdateEmployeePayload = {
  department?: string;
  designation?: string;
  joinDate?: string;
  phone?: string;
  shiftId?: string | null;
  profilePhoto?: string | null;
};

export const employeesApi = api.injectEndpoints({
  endpoints: (build) => ({
    listEmployees: build.query<
      { items: EmployeeListItem[]; total: number; skip: number; take: number },
      { q?: string; skip?: number; take?: number }
    >({
      query: (params) => ({
        url: "/employees",
        params,
      }),
    }),
    createEmployee: build.mutation<
      { id: string; email: string; name: string; role: string },
      CreateEmployeePayload
    >({
      query: (body) => ({ url: "/employees", method: "POST", body }),
    }),
    updateEmployee: build.mutation<
      EmployeeListItem,
      { id: string; data: UpdateEmployeePayload }
    >({
      query: ({ id, data }) => ({ url: `/employees/${id}`, method: "PATCH", body: data }),
    }),
  }),
});

export const {
  useListEmployeesQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
} = employeesApi;

