import { useEffect, useState } from "react";

interface PaginatedData<T> {
  data: T[];
  totalPages: number;
}

interface UseFetchPaginatedDataResult<T> {
  data: T[];
  totalPages: number;
  loading: boolean;
  currentPage: number;
  handlePageChange: (page: number) => void;
}

export const useFetchData = <
  T extends unknown,
  Q extends Record<string, any> = {},
>(
  fetchFunction: (
    queryData: { page: number; pageSize: number } & Q,
    token?: string
  ) => Promise<PaginatedData<T>>,
  initialPage: number = 1,
  pageSize: number = 5,
  additionalQueryData?: Q,
  token?: string
): UseFetchPaginatedDataResult<T> => {
  const [data, setData] = useState<T[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const queryData = {
          page: currentPage,
          pageSize,
          ...(additionalQueryData || {}),
        } as { page: number; pageSize: number } & Q;

        const response = await fetchFunction(queryData, token);
        setData(response.data);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, pageSize, fetchFunction, token, additionalQueryData]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    data,
    totalPages,
    loading,
    currentPage,
    handlePageChange,
  };
};
