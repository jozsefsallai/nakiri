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
  USER_IDENTIFICATION_FAILED: 'Failed to identify the user.',

  MISSING_VIDEO_ID: 'You have not provided the ID of the video.',
  INVALID_VIDEO_ID: 'Invalid YouTube video ID. An ID must be 11 characters long and only contain letters, numbers, dashes, and underscores.',
  ID_ALREADY_EXISTS: 'The provided ID already exists in the database.',

  MISSING_CHANNEL_ID: 'You have not provided the ID of the channel.',
  INVALID_CHANNEL_ID: 'Invalid YouTube channel ID. An ID must be 24 characters long, start with "UC", and only contain letters, numbers, dashes, and underscores.',

  MISSING_REGEX_PATTERN: 'You have not provided a regular expression pattern.',
  INVALID_REGEX_PATTERN: 'The provided regex pattern is invalid.',
  PATTERN_ALREADY_EXISTS: 'The provided pattern already exists in the database.',

  ENTRY_NOT_FOUND: 'The requested entry could not be found.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  CANNOT_MANAGE_OWN_BLACKLISTS: 'You cannot manage your own per-guild blacklists.',
  CANNOT_DELETE_ENTRY_FROM_THIS_GUILD: 'You cannot delete entries from this guild.',
  CANNOT_MANAGE_GLOBAL_BLACKLISTS: 'You cannot manage the global blacklist.',

  NOT_AUTHENTICATED: 'You need to be logged in to perform this request.',
  NOT_ANONYMOUS: 'You need to be logged out to perform this request.',
  INSUFFICIENT_PERMISSIONS: 'You do not have the required permissions to perform this action.',
  ACCESS_TO_GUILD_DENIED: 'You do not have access to this guild.',
  INTERNAL_SERVER_ERROR: 'Internal server error.'
};
