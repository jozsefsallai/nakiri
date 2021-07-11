export class APIError extends Error {
  statusCode: number;
  code: string;

  constructor(statusCode: number, code: string) {
    super();

    this.name = 'APIError';
    this.statusCode = statusCode;
    this.code = code;
  }
}
