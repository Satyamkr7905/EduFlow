import app from './app.js';
import { env } from './config/env.js';
import { checkConnection, closePool } from './config/db.js';

const start = async () => {
  try {
    await checkConnection();
    console.log('[db] Connected to PostgreSQL');
  } catch (err) {
    console.error('[db] Could not connect to PostgreSQL:', err.message);
    console.error('      Check DATABASE_URL / DATABASE_SSL in backend/.env');
    process.exit(1);
  }

  const server = app.listen(env.port, '0.0.0.0', () => {
    console.log(`[api] EduFlow API running on http://localhost:${env.port} (${env.nodeEnv})`);
  });

  const shutdown = (signal) => {
    console.log(`\n[api] ${signal} received – shutting down gracefully`);
    server.close(async () => {
      await closePool();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10_000).unref();
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
};

start();
