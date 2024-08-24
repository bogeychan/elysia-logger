import { Elysia } from "elysia";
import { logger, createPinoLogger } from "../../src";

{
  // autoLogging

  {
    // .into()

    const log = createPinoLogger();

    new Elysia()
      .use(
        log.into({
          autoLogging: process.env.NODE_ENV === "development",
        })
      )
      .get("/", ({ log }) => log.info("yay"));

    new Elysia()
      .use(
        log.into({
          autoLogging: true,
        })
      )
      .get("/", ({ log }) => log.info("yay"));

    new Elysia()
      .use(
        log.into({
          autoLogging: false,
        })
      )
      .get("/", ({ log }) => log.info("yay"));

    new Elysia()
      .use(
        log.into({
          autoLogging: {
            ignore() {
              return true;
            },
          },
        })
      )
      .get("/", ({ log }) => log.info("yay"));
  }

  {
    // logger()

    new Elysia()
      .use(
        logger({
          autoLogging: process.env.NODE_ENV === "development",
        })
      )
      .get("/", ({ log }) => log.info("yay"));

    new Elysia()
      .use(
        logger({
          autoLogging: true,
        })
      )
      .get("/", ({ log }) => log.info("yay"));

    new Elysia()
      .use(
        logger({
          autoLogging: false,
        })
      )
      .get("/", ({ log }) => log.info("yay"));

    new Elysia()
      .use(
        logger({
          autoLogging: {
            ignore() {
              return true;
            },
          },
        })
      )
      .get("/", ({ log }) => log.info("yay"));
  }
}
