import { Elysia, t } from "elysia";
import { describe, it, expect } from "bun:test";

import { logger } from "../src";
import { InMemoryDestination, newReq } from "./utils";

describe("custom props", () => {
  it("should log request props", async () => {
    const stream = new InMemoryDestination();

    const app = new Elysia()
      .use(logger({ stream, autoLogging: false }))
      .get("/", (ctx) => {
        ctx.log.info(ctx.request);
        return "";
      });

    const req = newReq();
    await app.handle(req);

    expect(stream.messages.length).toBe(1);
    stream.expectToHaveRequestProps(0, req);
  });

  it("should log context props", async () => {
    const stream = new InMemoryDestination();

    const app = new Elysia()
      .use(logger({ stream, autoLogging: false }))
      .get("/", (ctx) => {
        ctx.log.info(ctx);
        return "";
      });

    const req = newReq();
    await app.handle(req);

    expect(stream.messages.length).toBe(1);
    stream.expectToHaveContextProps(0, req);
  });

  it("should log custom and context props", async () => {
    const stream = new InMemoryDestination();

    const app = new Elysia()
      .use(
        logger({
          stream,
          autoLogging: false,
          customProps() {
            return {
              yay: 42,
            };
          },
        })
      )
      .get("/", (ctx) => {
        ctx.log.info(ctx);
        return "";
      });

    const req = newReq();
    await app.handle(req);

    expect(stream.messages.length).toBe(1);
    const msg = stream.expectToHaveContextProps(0, req);
    expect(msg).toHaveProperty("yay", 42);
  });

  it("should log custom and request props", async () => {
    const stream = new InMemoryDestination();

    const app = new Elysia()
      .use(
        logger({
          stream,
          autoLogging: false,
          customProps() {
            return {
              yay: 42,
            };
          },
        })
      )
      .get("/", (ctx) => {
        ctx.log.info(ctx.request);
        return "";
      });

    const req = newReq();
    await app.handle(req);

    expect(stream.messages.length).toBe(1);
    const msg = stream.expectToHaveRequestProps(0, req);
    expect(msg).toHaveProperty("yay", 42);
  });

  it("should log custom props with autoLogging enabled", async () => {
    const stream = new InMemoryDestination();

    const app = new Elysia()
      .use(
        logger({
          stream,
          autoLogging: true,
          customProps() {
            return {
              yay: 42,
            };
          },
        })
      )
      .get("/", () => "");

    const req = newReq();
    await app.handle(req);

    expect(stream.messages.length).toBe(1);
    const msg = stream.expectToHaveContextProps(0, req);
    expect(msg).toHaveProperty("yay", 42);
  });
});
