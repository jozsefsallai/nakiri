import axiosService, { APIResponse } from '@/services/axios';

import { IKeywordSearchResult } from '@/db/models/keywords/KeywordSearchResult';

export interface GetKeywordSearchResultsAPIRequest {
  id: string;
  page?: number;
  limit?: number;
};

export interface GetKeywordSearchResultsAPIResponse extends APIResponse {
  keywordSearchResults: IKeywordSearchResult[];
};

export class KeywordSearchResultsAPIService {
  static GET_KEYWORD_SEARCH_RESULTS_API_URL = '/api/monitored-keywords/:id/entries?page=:page&limit=:limit';

  async getKeywordSearchResults(request: GetKeywordSearchResultsAPIRequest): Promise<GetKeywordSearchResultsAPIResponse> {
    const url = this.makeGetKeywordSearchResultsAPIUrl(request.id, request.page, request.limit);
    const response = await axiosService.get<GetKeywordSearchResultsAPIResponse>(url);
    return response.data;
  }

  private makeGetKeywordSearchResultsAPIUrl(id: string, page?: number, limit?: number): string {
    return KeywordSearchResultsAPIService.GET_KEYWORD_SEARCH_RESULTS_API_URL
      .replace(':id', id)
      .replace(':page', (page ?? 1).toString())
      .replace(':limit', (limit ?? 25).toString());
  }
}
