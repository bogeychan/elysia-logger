import { Elysia } from "elysia";
import { logger, pino } from "../src";

import { describe, expect, it } from "bun:test";

const newReq = (params?: {
  path?: string;
  headers?: Record<string, string>;
  method?: string;
  body?: string;
}) => new Request(`http://localhost${params?.path ?? "/"}`, params);

class InMemoryDestination implements pino.DestinationStream {
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

  expectToHaveMessage(index: number, req: Request) {
    const msg = this.toJSON(index);
    expect(msg).toBeObject();
    // pino default properties
    expect(msg).toHaveProperty("level");
    expect(msg).toHaveProperty("time");
    expect(msg).toHaveProperty("pid");
    expect(msg).toHaveProperty("hostname");
    // elysia-logger default properties
    expect(msg).toHaveProperty("request");
    expect(msg).toHaveProperty("request.method", req.method);
    expect(msg).toHaveProperty("request.url", req.url);
    expect(msg).toHaveProperty("request.referrer", req.headers.get("Referer"));
    expect(msg).toHaveProperty("responseTime");
  }
}

describe("auto logging", () => {
  it("should by default", async () => {
    const stream = new InMemoryDestination();

    const app = new Elysia().use(logger({ stream })).get("/", () => "");

    const req = newReq();
    await app.handle(req);

    expect(stream.messages.length).toBe(1);
    stream.expectToHaveMessage(0, req);
  });

  it("should if enabled", async () => {
    const stream = new InMemoryDestination();

    const app = new Elysia()
      .use(logger({ stream, autoLogging: true }))
      .get("/", () => "");

    const req = newReq();
    await app.handle(req);

    expect(stream.messages.length).toBe(1);
    stream.expectToHaveMessage(0, req);
  });

  it("should not if disabled", async () => {
    const stream = new InMemoryDestination();

    const app = new Elysia()
      .use(logger({ stream, autoLogging: false }))
      .get("/", () => "");

    const req = newReq();
    await app.handle(req);

    expect(stream.messages.length).toBe(0);
  });

  it("should if enabled by condition", async () => {
    const stream = new InMemoryDestination();

    const app = new Elysia()
      .use(
        logger({
          stream,
          autoLogging: {
            ignore() {
              return false;
            },
          },
        })
      )
      .get("/", () => "");

    const req = newReq();
    await app.handle(req);

    expect(stream.messages.length).toBe(1);
    stream.expectToHaveMessage(0, req);
  });

  it("should not if disabled by condition", async () => {
    const stream = new InMemoryDestination();

    const app = new Elysia()
      .use(
        logger({
          stream,
          autoLogging: {
            ignore() {
              return true;
            },
          },
        })
      )
      .get("/", () => "");

    const req = newReq();
    await app.handle(req);

    expect(stream.messages.length).toBe(0);
  });
});
