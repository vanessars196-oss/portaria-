const app = require('./app');
const env = require('./config/env');
const db = require('./config/database');

async function bootstrap() {
  await db.query('SELECT 1');
  app.listen(env.port, () => {
    console.log(`API rodando na porta ${env.port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Falha ao iniciar a API:', error);
  process.exit(1);
});
