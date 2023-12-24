import { LoggerOptions, stdSerializers } from 'pino';

export const serializers: LoggerOptions['serializers'] = {
  request: serializeRequest,
  err: stdSerializers.err
};

export function serializeRequest(request: Request) {
  return {
    method: request.method,
    url: request.url,
    referrer: request.headers.get('Referer')
  };
}

