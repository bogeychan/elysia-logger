import { Elysia, t } from "elysia";
import { describe, it, expect } from "bun:test";

import { logger, type InferContext } from "../src";
import { InMemoryDestination, newReq } from "./utils";

describe("Error", () => {
  it("should log during ParseError", async () => {
    const stream = new InMemoryDestination();

    let isParseError = false;

    const app = new Elysia()
      .use(
        logger({
          stream,
          autoLogging: true,
          customProps(ctx) {
            if (ctx.isError && ctx.code === "PARSE") {
              isParseError = true;
            }
            return {};
          },
        })
      )
      .post("/", () => "", {
        body: t.Object({
          test: t.String(),
        }),
      });

    const req = newReq({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "",
    });
    await app.handle(req);

    expect(isParseError).toBeTrue();
    expect(stream.messages.length).toBe(2);
    stream.expectToHaveContextProps(0, req);
    const msg = stream.expectToHaveContextProps(1, req);
    expect(msg).toHaveElysiaLoggerResponseProps();
  });

  it("should log during NotFoundError", async () => {
    const stream = new InMemoryDestination();

    let isNotFoundError = false;

    const app = new Elysia().use(
      logger({
        stream,
        autoLogging: true,
        customProps(ctx) {
          if (ctx.isError && ctx.code === "NOT_FOUND") {
            isNotFoundError = true;
          }
          return {};
        },
      })
    );

    const req = newReq({ path: "/notFound" });
    await app.handle(req);

    expect(isNotFoundError).toBeTrue();
    expect(stream.messages.length).toBe(1); // TODO: should be 2 but onAfterResponse skipped
    stream.expectToHaveContextProps(0, req);
    // const msg = stream.expectToHaveContextProps(1, req);
    // expect(msg).toHaveElysiaLoggerResponseProps();
  });

  it("should log during ValidationError", async () => {
    const stream = new InMemoryDestination();

    let isValidationError = false;

    const app = new Elysia()
      .use(
        logger({
          stream,
          autoLogging: true,
          customProps(ctx) {
            if (ctx.isError && ctx.code === "VALIDATION") {
              isValidationError = true;
            }
            return {};
          },
        })
      )
      .post("/", () => "", {
        body: t.Object({
          test: t.String(),
        }),
      });

    const req = newReq({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    await app.handle(req);

    expect(isValidationError).toBeTrue();
    expect(stream.messages.length).toBe(2);
    stream.expectToHaveContextProps(0, req);
    const msg = stream.expectToHaveContextProps(1, req);
    expect(msg).toHaveElysiaLoggerResponseProps();
  });

  it("should log during CustomError", async () => {
    const stream = new InMemoryDestination();

    let isCustomError = false;

    const app = new Elysia().error("customError", Error);

    app
      .use(
        logger({
          stream,
          autoLogging: true,
          customProps(ctx: InferContext<typeof app>) {
            if (ctx.isError && ctx.code === "customError") {
              isCustomError = true;
            }
            return {};
          },
        })
      )
      .get("/", () => {
        throw new Error("whelp");
      });

    const req = newReq();
    await app.handle(req);

    expect(isCustomError).toBeTrue();
    expect(stream.messages.length).toBe(2);
    stream.expectToHaveContextProps(0, req);
    const msg = stream.expectToHaveContextProps(1, req);
    expect(msg).toHaveElysiaLoggerResponseProps();
  });
});
