export const isValidYouTubeVideoID = (input: string): boolean => {
  if (input.length !== 11) {
    return false;
  }

  if (/[^A-Za-z0-9_-]/.test(input)) {
    return false;
  }

  return true;
};
