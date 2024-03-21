import { Elysia } from "elysia";
import { describe, expect, it } from "bun:test";

import { logger } from "../src";
import { InMemoryDestination, newReq } from "./utils";

describe("auto logging", () => {
  it("should by default", async () => {
    const stream = new InMemoryDestination();

    const app = new Elysia().use(logger({ stream })).get("/", () => "");

    const req = newReq();
    await app.handle(req);

    expect(stream.messages.length).toBe(1);
    const msg = stream.expectToHaveContextProps(0, req);
    expect(msg).toHaveElysiaLoggerResponseProps();
  });

  it("should if enabled", async () => {
    const stream = new InMemoryDestination();

    const app = new Elysia()
      .use(logger({ stream, autoLogging: true }))
      .get("/", () => "");

    const req = newReq();
    await app.handle(req);

    expect(stream.messages.length).toBe(1);
    const msg = stream.expectToHaveContextProps(0, req);
    expect(msg).toHaveElysiaLoggerResponseProps();
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
    const msg = stream.expectToHaveContextProps(0, req);
    expect(msg).toHaveElysiaLoggerResponseProps();
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
