import { expect } from "bun:test";
import { pino } from "../src";

declare module "bun:test" {
  interface Matchers<T> {
    toHavePinoProps(this: Matchers<object>): void;
    toHaveElysiaLoggerContextProps(this: Matchers<object>, req: Request): void;
    toHaveElysiaLoggerRequestProps(
      this: Matchers<object>,
      req: Request,
      key?: string
    ): void;
    toHaveElysiaLoggerResponseProps(this: Matchers<object>): void;
  }
}

expect.extend({
  toHavePinoProps(msg) {
    expect(msg).toHaveProperty("level");
    expect(msg).toHaveProperty("time");
    expect(msg).toHaveProperty("pid");
    expect(msg).toHaveProperty("hostname");
    return { pass: true };
  },
  toHaveElysiaLoggerContextProps(msg, req) {
    expect(msg as object).toHaveElysiaLoggerRequestProps(req, "request");
    return { pass: true };
  },
  toHaveElysiaLoggerRequestProps(msg, req, key) {
    const path: string[] = [];

    if (key) {
      path.push(key);
    }

    if (key) {
      expect(msg).toHaveProperty(key);
    }

    expect(msg).toHaveProperty([...path, "method"], req.method);
    expect(msg).toHaveProperty([...path, "url"], req.url);
    expect(msg).toHaveProperty(
      [...path, "referrer"],
      req.headers.get("Referer")
    );
    return { pass: true };
  },
  toHaveElysiaLoggerResponseProps(msg) {
    expect(msg).toHaveProperty("responseTime");
    return { pass: true };
  },
});

export class InMemoryDestination implements pino.DestinationStream {
  messages: string[] = [];

  write(msg: string): void {
    this.messages.push(msg);
  }

  toJSON(index: number) {
    try {
      return JSON.parse(this.messages[index]);
    } catch {
      return null;
    }
  }

  expectToHaveContextProps(index: number, req: Request) {
    const msg = this.toJSON(index);
    expect(msg).toBeObject();
    expect(msg).toHavePinoProps();
    expect(msg).toHaveElysiaLoggerContextProps(req);
    return msg;
  }

  expectToHaveRequestProps(index: number, req: Request) {
    const msg = this.toJSON(index);
    expect(msg).toBeObject();
    expect(msg).toHavePinoProps();
    expect(msg).toHaveElysiaLoggerRequestProps(req);
    return msg;
  }
}

export const newReq = (params?: {
  path?: string;
  headers?: Record<string, string>;
  method?: string;
  body?: string;
}) => new Request(`http://localhost${params?.path ?? "/"}`, params);
