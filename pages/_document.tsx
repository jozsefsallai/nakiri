import Document, { Html, Head, Main, NextScript } from 'next/document';

class NakiriFrontend extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en" className="theme-light">
        <Head>
          <script src="/js/theme.js"></script>
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default NakiriFrontend;
