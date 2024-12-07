import { useEffect, useState } from "react";

interface UseFetchDataResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export const useFetchList = <T extends unknown>(
  fetchFunction: (token?: string) => Promise<T>,
  token?: string
): UseFetchDataResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchFunction(token);
        setData(response);
      } catch (error: any) {
        console.error("Failed to fetch data", error);
        setError(error.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchFunction, token]);

  return {
    data,
    loading,
    error,
  };
};
