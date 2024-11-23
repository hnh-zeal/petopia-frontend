import { useEffect, useState } from "react";

interface UseFetchDetails<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export const useFetchDetails = <T extends unknown>(
  fetchFunction: (id: string | number, token?: string) => Promise<T>,
  id: string | number,
  token?: string
): UseFetchDetails<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchFunction(id, token);
        setData(response);
      } catch (error) {
        setError("Failed to fetch data");
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, fetchFunction, token]);

  return {
    data,
    loading,
    error,
  };
};
