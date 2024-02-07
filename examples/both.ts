import { Elysia } from 'elysia';
import { logger, fileLogger } from '../src';

// use multiple `log` instances simultaneously
const app = new Elysia()
  .use(
    fileLogger({
      file: './out.log',
      autoLogging: false
    }).derive(({ log, ...rest }) => ({
      fileLogger: log,
      ...rest
    }))
  )
  .use(logger())
  .get('/', (ctx) => {
    ctx.fileLogger.error('file error');
    ctx.log.error('error');
  })
  .listen(8080);

console.log(`Listening on ${app.server!.url}`);
