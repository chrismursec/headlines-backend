export interface IApiRequestParams {
  country?: string | null;
  category?: string | null;
  sources?: string | null;
  q?: string | null;
  pageSize?: number | null;
  page?: number | null;
  apiKey: string | null;
}
