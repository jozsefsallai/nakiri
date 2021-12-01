/* eslint-disable @next/next/no-sync-scripts */

import clsx from 'clsx';
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document';

interface FrontendDocumentProps {
  pathname?: string;
}

class NakiriFrontend extends Document<FrontendDocumentProps> {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    const pathname = ctx.asPath;
    return { pathname, ...initialProps };
  }

  render() {
    const isDocsPage = this.props.pathname?.startsWith('/docs');

    return (
      <Html
        lang="en"
        className={clsx({
          'theme-light': !isDocsPage,
          '__nextra-app': isDocsPage,
        })}
      >
        <Head>{!isDocsPage && <script src="/js/theme.js"></script>}</Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default NakiriFrontend;
