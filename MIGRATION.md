# Migration Guide

## v0.0.22 to v0.1.0

### Automatic `onError` logging by `default`

Use:

```ts
import { type InferContext } from "@bogeychan/elysia-logger";

app.use(
  logger({
    customProps(ctx: InferContext<typeof app>) {
      if (ctx.isError) {
        // you can pass additional properties like `ctx.myProperty` too
        // but they might be `undefined` depending on error cause
        return {};
      }

      return {
        myProperty: ctx.myProperty,
      };
    },
  })
);
```

Instead of:

```ts
import { type InferContext } from "@bogeychan/elysia-logger";

app.use(
  logger({
    customProps(ctx: InferContext<typeof app>) {
      return {
        myProperty: ctx.myProperty,
      };
    },
  })
);
```

### `InferContext` now contains either `Context` or `ErrorContext`

**It won't work outside the plugin scope.**

You can find the previous version of `InferContext` [here](https://github.com/bogeychan/elysia-logger/blob/140385a1c2754485fb98edd4fb6ac1fa7ea91884/src/types.ts#L72-L95). Just copy & paste it into your project with a different name :)

## v0.0.11 to v0.0.12

### Automatic `onResponse` logging by `default`

Use:

```ts
import { logger, createPinoLogger } from "@bogeychan/elysia-logger";

app.use(
  logger({
    autoLogging: false,
  })
);

const log = createPinoLogger();

app.use(
  log.into({
    autoLogging: false,
  })
);
```

Instead of:

```ts
import { logger, createPinoLogger } from "@bogeychan/elysia-logger";

app.use(logger());

const log = createPinoLogger();

app.use(log.into());
```

## v0.0.9 to v0.0.10

### Infer the Elysia Context

Use:

```ts
import { type InferContext } from "@bogeychan/elysia-logger";

app.use(
  logger({
    customProps(ctx: InferContext<typeof app>) {
      return {};
    },
  })
);
```

Instead of:

```ts
import {
  type ElysiaContextForInstance,
  type InferElysiaInstance,
} from "@bogeychan/elysia-logger";

app.use(
  logger({
    customProps(
      ctx: ElysiaContextForInstance<InferElysiaInstance<typeof app>>
    ) {
      return {};
    },
  })
);
```

### The `contextKeyName` option is obsolete

You can learn more about this in the [Elysia's 0.7 blog](https://elysiajs.com/blog/elysia-07.html)

Use:

```ts
app
  .use(logger().derive(({ log, ...rest }) => ({ myLogger: log, ...rest })))
  .get("/", (ctx) => {
    ctx.myLogger.info(ctx.request, "Request");
  });
```

Instead of:

```ts
app
  .use(
    logger({
      contextKeyName: "myLogger",
    })
  )
  .get("/", (ctx) => {
    ctx.myLogger.info(ctx.request, "Request");
  });
```
