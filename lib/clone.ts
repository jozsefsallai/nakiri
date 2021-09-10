const recurse = (src: any) => {
  if (src === null || typeof src !== 'object') {
    return src;
  }

  if (Array.isArray(src)) {
    return src.map(recurse);
  }

  const dest = {};

  for (const key in src) {
    if (src.hasOwnProperty(key)) {
      dest[key] = recurse(src[key]);
    }
  }

  return dest;
};

const clone = <T = any>(src: T) => recurse(src);
export default clone;
