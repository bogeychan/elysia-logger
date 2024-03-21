import { Elysia } from "elysia";
import { $ } from "bun";
import { describe, it, expect, beforeEach, afterEach } from "bun:test";

import { fileLogger } from "../src";
import { InMemoryDestination, newReq } from "./utils";

const LOG_FILE = "./out.log";

async function rmLogFile() {
  await $`rm ${LOG_FILE}`.quiet();
}

beforeEach(rmLogFile);
afterEach(rmLogFile);

describe("file logger", () => {
  it("should log to file with autoLogging enabled", async () => {
    const app = new Elysia()
      .use(fileLogger({ file: LOG_FILE, autoLogging: true }))
      .get("/", () => "");

    const req = newReq();
    await app.handle(req);

    await Bun.sleep(1_000); // wait for file to be written

    const stream = new InMemoryDestination();
    stream.messages = (await Bun.file(LOG_FILE).text())
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line); // remove empty-new line..

    expect(stream.messages.length).toBe(1);
    const msg = stream.expectToHaveContextProps(0, req);
    expect(msg).toHaveElysiaLoggerResponseProps();
  });
});
