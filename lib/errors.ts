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

  INTERNAL_SERVER_ERROR: 'Internal server error.'
};
