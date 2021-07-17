export class APIError extends Error {
  statusCode: number;
  code: string;

  constructor(statusCode: number, code: string) {
    super();

    this.name = 'APIError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

export const errors = {
  CANNOT_MANAGE_GUILD: 'You do not have access to managing this guild.',
  GUILD_ALREADY_ADDED: 'An API key for this guild has already been generated.',
  GUILD_ID_NOT_PROVIDED: 'You have not specified a guild.',

  MISSING_DISCORD_ID: 'You have not provided the ID of the Discord user.',
  FAILED_TO_FETCH_USER_DATA: 'Failed to fetch the user\'s data from the Discord API.',
  MISSING_PERMISSIONS: 'You have not specified the permissions of this user.',
  USER_ALREADY_AUTHORIZED: 'This user is already authorized.',
  FORBIDDEN_PERMISSIONS: 'You have provided invalid permissions.',

  INTERNAL_SERVER_ERROR: 'Internal server error.'
};
