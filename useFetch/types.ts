export type TStatus = "idle" | "loading" | "error";
export type TError = string | null;
export type TData<T> = T | null;

export type TCallApi = (secondUrl?: string) => Promise<void>;

export interface UseFetchGetReturn<T = object> {
  status: TStatus;
  error: string | null;
  data: T | null;
}
