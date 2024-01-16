import { ApiPropsReturn } from "../../Api/fetch";

export type TStatus = "idle" | "loading" | "error";
export type TError = string | null;
export type TData<T> = T | null;

export interface UseFetchGetReturn<T = object> {
  status: TStatus;
  error: string | null;
  data: T | null;
}

export type THookReturn<T> = {
  callApi: (secondUrl?: string) => Promise<ApiPropsReturn<T> | undefined>;
  data: TData<T>;
  error: TError;
  status: TStatus;
};
