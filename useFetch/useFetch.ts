import { useCallback, useEffect, useMemo, useState } from "react";
import { Api } from "../../Api/fetch";
import { TData, TError, THookReturn, TStatus } from "./types";

export const useFetch = <T = object>(
  url: string,
  options?: RequestInit,
  avoidFirstCall: boolean = false
): THookReturn<T> => {
  const [status, setStatus] = useState<TStatus>("idle");
  const [error, setError] = useState<TError>(null);
  const [data, setData] = useState<TData<T>>(null);

  const memoData = useMemo(() => data, [data]);

  const callApi = useCallback(
    async (secondUrl?: string) => {
      try {
        setStatus("loading");
        setError(null);

        const apiUrl = secondUrl ? secondUrl : url;

        const response = await Api<T>(apiUrl, options);

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
