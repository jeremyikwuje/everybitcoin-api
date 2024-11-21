import express from 'express';
import { json } from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import router from './routes';
import config from './config/config';
import errorHandler from './middlewares/error-handler.middleware';
import logger from './logger/logger';
import dbConnections from './database';
import { cron } from './crons';

const app = express();

app.use(json());
app.use(cors({ origin: '*' }));
app.use(compression());
app.use(cookieParser());
app.use('/core', router);
app.use(errorHandler);

Object.entries(dbConnections).forEach((dbConnection) => {
  const [name, connection] = dbConnection;
  connection.on('connected', () => {
    logger.info(`Connected to ${name}`);
  });

  cron
    .start()
    .then(() => logger.info(`Cron started successfully as at ${new Date()}`));

  connection.on('error', (err: any) => {
    logger.error(`Error connecting to DB ${name}:`, err);
  });
});

app.listen(config.port, () => {
  logger.info(`Server running on port http://localhost:${config.port}`);
});

// Error-handling middleware
app.use((error: any, req: any, res: any, next: any) => {
  // Handle the error, e.g. by sending a response with an error status code
  res.status(500).send({ error: error.message });

  return next;
});
