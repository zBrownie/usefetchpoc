import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Api } from "../Api/fetch";
import { TData, TError, THookReturn, TStatus } from "./types";

export const useFetch = <T = object>(
  url: string,
  options?: RequestInit,
  avoidFirstCall: boolean = false
): THookReturn<T> => {
  const [status, setStatus] = useState<TStatus>("idle");
  const [error, setError] = useState<TError>(null);
  const [data, setData] = useState<TData<T>>(null);

  const apiUrl = useRef<string>(url);

  const memoData = useMemo(() => data, [data]);

  const callApi = useCallback(
    async (secondUrl?: string) => {
      try {
        setStatus("loading");
        setError(null);

        apiUrl.current = secondUrl ? secondUrl : url;

        const response = await Api<T>(apiUrl.current, options);

        if (response.error && !response.data) {
          throw new Error(String(response.error));
        }

        setData(response.data);
        setStatus("idle");
        return response;
      } catch (error) {
        setData(null);
        setError(String(error));
        setStatus("error");
        return {
          data: null,
          error: error,
        };
      }
    },
    [options, url]
  );

  useEffect(() => {
    !avoidFirstCall && callApi();
  }, [avoidFirstCall, callApi]);

  return { data: memoData, error, status, callApi };
};
