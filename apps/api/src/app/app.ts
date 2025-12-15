import { FastifyInstance } from 'fastify';

import corsPlugin from './plugins/cors';
import securityPlugin from './plugins/security';
import sensiblePlugin from './plugins/sensible';
import trpcPlugin from './plugins/trpc';

import rootRoutes from './routes/root';
import yellowBooksRoute from './routes/yellow-book';
import reviewsRoute from './routes/reviews';
import registrationsRoute from './routes/registrations';
import aiSearchRoutes from './routes/ai-search';

/* eslint-disable-next-line */
export interface AppOptions {}

export async function app(fastify: FastifyInstance, opts: AppOptions) {
  // Place here your custom code!

  // Do not touch the following lines

  // The API build is bundled via Nx/esbuild, so filesystem autoloading of
  // TypeScript modules in production will crash. Register plugins/routes
  // explicitly to keep runtime stable.
  fastify.register(corsPlugin);
  fastify.register(securityPlugin);
  fastify.register(sensiblePlugin);
  fastify.register(trpcPlugin);

  fastify.register(rootRoutes, { ...opts });
  fastify.register(yellowBooksRoute, { ...opts });
  fastify.register(reviewsRoute, { ...opts });
  fastify.register(registrationsRoute, { ...opts });
  fastify.register(aiSearchRoutes, { ...opts });
}