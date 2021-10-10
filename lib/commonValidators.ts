export const isValidYouTubeVideoID = (input: string): boolean => {
  if (input.length !== 11) {
    return false;
  }

  if (/[^A-Za-z0-9_-]/.test(input)) {
    return false;
  }

  return true;
};

export const isValidYouTubeChannelID = (input: string): boolean => {
  if (input.length !== 24) {
    return false;
  }

  if (!input.startsWith('UC')) {
    return false;
  }

  if (/[^A-Za-z0-9_-]/.test(input)) {
    return false;
  }

  return true;
};

export const isValidRegex = (input: string): boolean => {
  if (input.trim().length === 0) {
    return false;
  }

  try {
    new RegExp(input);
    return true;
  } catch (_) {
    return false;
  }
};

export const isValidUrl = (input: string): boolean => {
  if (input.trim().length === 0) {
    return false;
  }

  try {
    const url = new URL(input);
    return ['http:', 'https:'].includes(url.protocol);
  } catch (_) {
    return false;
  }
};
