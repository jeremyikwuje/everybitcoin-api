import mongoose from 'mongoose';
import config, { MongoDBName } from '../config/config';
import logger from '../logger/logger';

type ConnectionMap = {
  [K in MongoDBName]: mongoose.Connection;
};

const dbConnections: ConnectionMap = {} as ConnectionMap;

config.db.forEach((dbConfig) => {
  if (Object.values(MongoDBName).includes(dbConfig.name) && dbConfig.uri) {
    dbConnections[dbConfig.name] = mongoose.createConnection(dbConfig.uri, {
      // ... mongoose connection options
    });
  } else {
    logger.error('Invalid DB config', dbConfig.name);
  }
});

const gracefulShutdown = () => {
  logger.info('Closing DB connections');
  Object.values(dbConnections).forEach((connection) => connection.close());
  process.exit(0);
};

process.on('SIGINT', () => {
  gracefulShutdown();
});

process.on('SIGTERM', () => {
  gracefulShutdown();
});

export default dbConnections;
