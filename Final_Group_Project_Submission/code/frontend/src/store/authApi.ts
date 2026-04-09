import { api } from "./api";

export type AuthedUser = {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "MANAGER" | "EMPLOYEE";
};

export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<
      { user: AuthedUser },
      { email: string; password: string }
    >({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Me"],
    }),
    logout: build.mutation<{ ok: boolean }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Me"],
    }),
    me: build.query<{ user: AuthedUser }, void>({
      query: () => "/auth/me",
      providesTags: ["Me"],
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useMeQuery } = authApi;

