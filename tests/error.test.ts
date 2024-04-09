import { Elysia, t } from "elysia";
import { describe, it, expect } from "bun:test";

import { logger } from "../src";
import { InMemoryDestination, newReq } from "./utils";

describe("Error", () => {
  it("should log during ParseError", async () => {
    const stream = new InMemoryDestination();

    const app = new Elysia()
      .use(
        logger({
          stream,
          autoLogging: true,
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

    expect(stream.messages.length).toBe(1);
    const msg = stream.expectToHaveContextProps(0, req);
    expect(msg).toHaveElysiaLoggerResponseProps();
  });
});
