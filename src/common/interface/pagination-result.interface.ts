export interface PaginationResult<T> {
  data: T[];
  totalCount: number;
  currentPage: number;
  perPage: number;
  nextPage?: number;
}
