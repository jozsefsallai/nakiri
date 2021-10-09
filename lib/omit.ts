// also serves as a clone class instance function if you don't provide any keys
// to omit lol
const recurse = <T extends any, K extends keyof T>(
  src: T,
  ...keys: K[]
): Omit<T, K> => {
  if (typeof src !== 'object' || src === null) {
    return src;
  }

  const dest = Object.assign(Object.create(Object.getPrototypeOf(src)), src);

  for (const key of keys) {
    delete dest[key];
  }

  for (const key of Object.getOwnPropertyNames(src)) {
    if (Array.isArray(dest[key])) {
      dest[key] = dest[key].slice(0).map((item) => recurse(item));
      continue;
    }

    if (dest[key] instanceof Date) {
      dest[key] = new Date(dest[key].getTime());
      continue;
    }

    if (typeof dest[key] === 'object' && dest[key] !== null) {
      dest[key] = recurse(dest[key]);
    }
  }

  return dest;
};

const omit = <T extends any, K extends keyof T>(
  src: T,
  ...keys: K[]
): Omit<T, K> => recurse(src, ...keys);

export default omit;
