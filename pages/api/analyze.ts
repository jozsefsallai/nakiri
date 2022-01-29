import bar from 'next-bar';

export default bar({
  post: (_, res) => {
    return res.status(410).json({
      ok: false,
      error:
        'The analysis endpoint is no longer supported. Please use the Nakiri Gateway instead.',
    });
  },
});
