import axiosService, { APIResponse } from '@/services/axios';

import { IPhrase } from '@/db/models/blacklists/Phrase';

export interface GetPhrasesAPIRequest {
  group?: string;
  guild?: string;
  page?: number;
  limit?: number;
}

export interface GetPhrasesAPIResponse extends APIResponse {
  phrases: IPhrase[];
}

export interface AddPhraseAPIRequest {
  content: string;
  group?: string;
  guild?: string;
  severity?: number;
}

export interface AddPhraseAPIResponse extends APIResponse {}

export interface DeletePhraseAPIResponse extends APIResponse {}

export class PhrasesAPIService {
  static GET_PHRASES_URL =
    '/api/lists/phrases?compact=false&page=:page&limit=:limit';
  static GET_PHRASES_WITH_GROUP_URL =
    '/api/lists/phrases?compact=false&group=:group&strict=true&page=:page&limit=:limit';
  static GET_PHRASES_WITH_GUILD_URL =
    '/api/lists/phrases?compact=false&group=:group&guild=:guild&strict=true&page=:page&limit=:limit';

  static ADD_PHRASE_URL = '/api/lists/phrases';
  static ADD_PHRASE_WITH_GROUP_URL = '/api/lists/phrases?group=:group';
  static ADD_PHRASE_WITH_GUILD_URL =
    '/api/lists/phrases?group=:group&guild=:guild';

  static DELETE_PHRASE_URL = '/api/lists/phrases/:id';

  public async getPhrases({
    group,
    guild,
    page,
    limit,
  }: GetPhrasesAPIRequest): Promise<GetPhrasesAPIResponse> {
    const url = this.makeGetPhrasesUrl(group, guild, page, limit);
    return axiosService.get(url).then((res) => res.data);
  }

  public async addPhrase({
    content,
    guild,
    group,
    severity,
  }: AddPhraseAPIRequest): Promise<AddPhraseAPIResponse> {
    const url = this.makeAddPhraseUrl(group, guild);
    return axiosService
      .post(url, { content, severity })
      .then((res) => res.data);
  }

  public async deletePhrase(id: string): Promise<DeletePhraseAPIResponse> {
    const url = this.makeDeletePhraseUrl(id);
    return axiosService.delete(url).then((res) => res.data);
  }

  private makeGetPhrasesUrl(
    group?: string,
    guild?: string,
    page?: number,
    limit?: number,
  ): string {
    let url: string;

    if (group) {
      url = guild
        ? PhrasesAPIService.GET_PHRASES_WITH_GUILD_URL.replace(
            ':group',
            group,
          ).replace(':guild', guild)
        : PhrasesAPIService.GET_PHRASES_WITH_GROUP_URL.replace(':group', group);
    } else {
      url = PhrasesAPIService.GET_PHRASES_URL;
    }

    return url
      .replace(':page', (page ?? 1).toString())
      .replace(':limit', (limit ?? 25).toString());
  }

  private makeAddPhraseUrl(group?: string, guild?: string): string {
    if (group) {
      return guild
        ? PhrasesAPIService.ADD_PHRASE_WITH_GUILD_URL.replace(
            ':group',
            group,
          ).replace(':guild', guild)
        : PhrasesAPIService.ADD_PHRASE_WITH_GROUP_URL.replace(':group', group);
    } else {
      return PhrasesAPIService.ADD_PHRASE_URL;
    }
  }

  private makeDeletePhraseUrl(id: string): string {
    return PhrasesAPIService.DELETE_PHRASE_URL.replace(':id', id);
  }
}
