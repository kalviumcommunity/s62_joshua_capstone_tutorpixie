import { useState, useCallback } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export interface PaginationConfig {
  initialPage?: number;
  initialPageSize?: number;
  queryKey: string;
  fetchFn: (page: number, limit: number, ...args: any[]) => Promise<any>;
  enabled?: boolean;
}

export interface paginationObj {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  } ;

export interface PaginationResult<T> {
  data: T[];
  pagination: paginationObj;
  isLoading: boolean;
  isFetching: boolean;
  error: any;
  currentPage: number;
  pageSize: number;
  goToPage: (page: number) => void;
  changePageSize: (size: number) => void;
  goToNextPage: () => void;
  goToPrevPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
}

export function usePagination<T = any>({
  initialPage = 1,
  initialPageSize = 10,
  queryKey,
  fetchFn,
  enabled = true,
  ...fetchArgs
}: PaginationConfig & { [key: string]: any }): PaginationResult<T> {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const {
    data: response,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: [queryKey, currentPage, pageSize, ...Object.values(fetchArgs)],
    queryFn: () => fetchFn(currentPage, pageSize, ...Object.values(fetchArgs)),
    placeholderData: keepPreviousData,
    enabled,
  });

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && (!response?.pagination || page <= response.pagination.totalPages)) {
      setCurrentPage(page);
    }
  }, [response?.pagination]);

  const changePageSize = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  }, []);

  const goToNextPage = useCallback(() => {
    if (response?.pagination?.hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  }, [response?.pagination?.hasNextPage]);

  const goToPrevPage = useCallback(() => {
    if (response?.pagination?.hasPrevPage) {
      setCurrentPage(prev => prev - 1);
    }
  }, [response?.pagination?.hasPrevPage]);

  const goToFirstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const goToLastPage = useCallback(() => {
    if (response?.pagination?.totalPages) {
      setCurrentPage(response.pagination.totalPages);
    }
  }, [response?.pagination?.totalPages]);

  return {
    data: response?.data || [],
    pagination: response?.pagination,
    isLoading,
    isFetching,
    error,
    currentPage,
    pageSize,
    goToPage,
    changePageSize,
    goToNextPage,
    goToPrevPage,
    goToFirstPage,
    goToLastPage,
  };
}