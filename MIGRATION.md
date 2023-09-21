# Migration Guide

## v0.0.9 to v0.0.10

### Infer the Elysia Context

Use:

```ts
import { type InferContext } from '@bogeychan/elysia-logger';

app.use(
  logger({
    customProps(ctx: InferContext<typeof app>) {
      return {};
    }
  })
);
```

Instead of:

```ts
import {
  type ElysiaContextForInstance,
  type InferElysiaInstance
} from '@bogeychan/elysia-logger';

app.use(
  logger({
    customProps(
      ctx: ElysiaContextForInstance<InferElysiaInstance<typeof app>>
    ) {
      return {};
    }
  })
);
```

### The `contextKeyName` option is obsolete

You can learn more about this in the [Elysia's 0.7 blog](https://elysiajs.com/blog/elysia-07.html)

Use:

```ts
app
  .use(logger().decorate(({ log, ...rest }) => ({ myLogger: log, ...rest })))
  .get('/', (ctx) => {
    ctx.myLogger.info(ctx.request, 'Request');
  });
```

Instead of:

```ts
app
  .use(
    logger({
      contextKeyName: 'myLogger'
    })
  )
  .get('/', (ctx) => {
    ctx.myLogger.info(ctx.request, 'Request');
  });
```
