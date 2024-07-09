import { Elysia } from "elysia";
import { expectType } from "tsd";
import { type InferContext, logger } from "../../src";

{
  // infer derive

  {
    // scoped

    const app = new Elysia().derive({ as: "scoped" }, () => ({
      foo: "bar",
    }));

    app.use(
      logger({
        customProps(ctx: InferContext<typeof app>) {
          if (!ctx.isError) {
            expectType<"bar" | undefined>(ctx.foo);
          }
          return {};
        },
      })
    );
  }

  {
    // local

    const app = new Elysia().derive({ as: "local" }, () => ({
      foo: "bar",
    }));

    app.use(
      logger({
        customProps(ctx: InferContext<typeof app>) {
          if (!ctx.isError) {
            expectType<"bar" | undefined>(ctx.foo);
          }
          return {};
        },
      })
    );
  }

  {
    // global

    const app = new Elysia().derive({ as: "global" }, () => ({
      foo: "bar",
    }));

    app.use(
      logger({
        customProps(ctx: InferContext<typeof app>) {
          if (!ctx.isError) {
            expectType<"bar" | undefined>(ctx.foo);
          }
          return {};
        },
      })
    );
  }
}

{
  // infer decorate

  const app = new Elysia().decorate("myProperty", 42);

  app.use(
    logger({
      customProps(ctx: InferContext<typeof app>) {
        if (!ctx.isError) {
          expectType<42 | undefined>(ctx.myProperty);
        }
        return {};
      },
    })
  );
}

{
  // infer store

  const app = new Elysia().state("myState", 42);

  app.use(
    logger({
      customProps(ctx: InferContext<typeof app>) {
        if (!ctx.isError) {
          expectType<number | undefined>(ctx.store.myState);
        }
        return {};
      },
    })
  );
}

{
  // infer custom error

  const app = new Elysia().error("myError", Error);

  app.use(
    logger({
      customProps(ctx: InferContext<typeof app>) {
        if (ctx.isError) {
          expectType<
            | "UNKNOWN"
            | "VALIDATION"
            | "NOT_FOUND"
            | "PARSE"
            | "INTERNAL_SERVER_ERROR"
            | "INVALID_COOKIE_SIGNATURE"
            | "myError"
            | undefined
          >(ctx.code);
        }
        return {};
      },
    })
  );
}
