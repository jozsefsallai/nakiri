import { IncomingMessage, ServerResponse } from 'http';
import { UrlWithParsedQuery } from 'url';
import { Express } from 'express';

export default function routes (app: Express,
  nextHandler: (req: IncomingMessage, res: ServerResponse, parsedUrl?: UrlWithParsedQuery) => Promise<any>
) {
  app.all('*', (req, res) => {
    return nextHandler(req, res);
  });
};
