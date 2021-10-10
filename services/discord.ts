import axios from 'axios';

export interface DiscordGuildData {
  id: string;
  name: string;
  icon: string;

  // we wont ever care about the rest
}

export interface DiscordInviteResponse {
  code: string;
  guild?: DiscordGuildData;
}

export class DiscordAPIService {
  static INVITE_API_URL = 'https://discord.com/api/invites/:invite';

  private apiKey?: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey;
  }

  async getInvite(invite: string): Promise<DiscordInviteResponse | null> {
    const url = this.makeInviteUrl(invite);

    try {
      const response = await axios.get(url);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  private makeInviteUrl(invite: string): string {
    return DiscordAPIService.INVITE_API_URL.replace(':invite', invite);
  }
}
