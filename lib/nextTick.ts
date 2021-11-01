const nextTick = async () => {
  return new Promise((resolve) => {
    if (typeof process !== 'undefined') {
      process.nextTick(resolve);
    }

    setTimeout(resolve, 0);
  });
};

export default nextTick;
