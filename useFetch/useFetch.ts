import { useCallback, useEffect, useState } from "react";
import { Api } from "../../Api/fetch";
import { TCallApi, TData, TError, TStatus, UseFetchGetReturn } from "./types";

/**
 * Custom hook for making API calls.
 *
 * @param url - The URL of the API.
 * @param options - Additional options for the fetch request.
 * @param avoidFirstCall - If true, the first API call will be avoided.
 *
 * @returns A tuple containing a `callApi` function to trigger the API call
 *          and an object `{ data, error, status }` representing the current state of the call.
 */

export const useFetch = <T = object>(
  url: string,
  options?: RequestInit,
  avoidFirstCall: boolean = false
): [TCallApi, UseFetchGetReturn<T>] => {
  // Internal state to control the status of the call, data, and errors.
  const [status, setStatus] = useState<TStatus>("idle");
  const [error, setError] = useState<TError>(null);
  const [data, setData] = useState<TData<T>>(null);

  // Function to make the API call.
  const callApi = useCallback(
    async (secondUrl?: string) => {
      // Initiating loading state and clearing errors.
      setStatus("loading");
      setError(null);

      // Determining the API URL based on parameters.
      const apiUrl = secondUrl ? secondUrl : url;

      // Calling the API using the `Api` function.
      const response = await Api<T>(apiUrl, options);

      // Handling API call errors.
      if (response.error && !response.data) {
        console.error(`Error fetch request - ${apiUrl}`);
        setData(null);
        setError(String(response.error));
        setStatus("error");
        return;
      }

      // Avoiding re-renders if the data is the same.
      if (JSON.stringify(response.data) === JSON.stringify(data)) {
        setStatus("idle");
        return;
      }

      // Updating the data and setting the state to 'idle'.
      setData(response.data);
      setStatus("idle");
    },
    [options, url, data]
  );

  // Effect to make the API call on component mount.
  useEffect(() => {
    !avoidFirstCall && callApi();
  }, [avoidFirstCall, callApi]);

  // Returning the `callApi` function and the current state of the API call.
  return [callApi, { data, error, status }];
};
