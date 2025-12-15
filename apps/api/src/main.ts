import Fastify from 'fastify';
import { app } from './app/app';
// Load dotenv only in development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv/config');
}

const host = process.env.HOST ?? '0.0.0.0';
const port = process.env.PORT ? Number(process.env.PORT) : 3001;

// Instantiate Fastify with some config
const server = Fastify({
  logger: true,
});

server.get('/health', async () => ({ status: 'ok' }));

// Register your application as a normal plugin.
server.register(app);

// Start listening.
server.listen({ port, host }, (err) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  } else {
    console.log(`[ ready ] http://${host}:${port}`);
  }
});