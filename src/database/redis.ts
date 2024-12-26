import Redis from 'ioredis';
import Config from '../config/config';
import logger from '../logger/logger';

// import Config from '../config/config';
export const redis_instance = () => {
  logger.info('Connecting to Redis');
  return new Redis({
    host: 'redis-19409.c321.us-east-1-2.ec2.redns.redis-cloud.com',
    port: Number(Config.redis.port),
    username: Config.redis.username,
    password: Config.redis.password,
  });
};