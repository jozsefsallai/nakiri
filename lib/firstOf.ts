const firstOf = (input?: string | string[]): string | undefined => {
  if (typeof input === 'undefined') {
    return undefined;
  }

  if (typeof input === 'string') {
    return input;
  }

  if (input.length === 0) {
    return undefined;
  }

  return input[0];
};

export default firstOf;
