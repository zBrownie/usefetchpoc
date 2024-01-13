export const API_URL = "https://pokeapi.co/api/v2";

export const STATUS_SUCCESS = [200, 202];

interface ApiPropsReturn<T = object> {
  data: T | null;
  error: Error | string | unknown | null;
}

export const Api = async <T>(
  url: string,
  customOptions?: RequestInit
): Promise<ApiPropsReturn<T>> => {
  try {
    const options: RequestInit = {
      headers: await generateHeaders(),
      method: "GET",
      mode: "cors",
      ...customOptions,
    };

    const fetchResponse = await fetch(API_URL.concat(url), options);

    if (!STATUS_SUCCESS.includes(fetchResponse.status)) {
      throw new Error(fetchResponse.statusText);
    }

    return {
      data: await fetchResponse.json(),
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error,
    };
  }
};

const generateHeaders = async (): Promise<Headers> => {
  const headers = new Headers();

  headers.set("Content-Type", "application/json");
  headers.set("Accept", "application/json");

  return Promise.resolve(headers);
};
