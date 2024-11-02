import 'dotenv/config';
import nodeCron from 'node-cron';
import logger from '../utils/logger';
import Config from '../config/config';
import {
  update_exchange_prices_in_tickers,
} from '../modules/tickers/ticker.service';
import {
  save_prices_from_tickers,
  update_prices_on_tickers,
} from '../modules/prices/price.service';

interface Job {
  cronTime: string;
  fn: Function;
}

export async function runCronJobs(jobs: Job[]) {
  for (const job of jobs) {
    if (!nodeCron.validate(job.cronTime)) {
      throw new Error(
        `Cron time ${job.cronTime} for job ${job.fn.name} is not valid, hence cannot run job`,
      );
    }

    nodeCron.schedule(job.cronTime, async () => {
      try {
        await job.fn();
      } catch (e: any) {
        logger.error(e.message || 'Cronjob request failed');
      }
    });
  }

  return true;
}

async function start() {
  if (!Config.enableCronJobs) {
    logger.info('Cron jobs are disabled');
    return false;
  }

  const jobs = [
    { cronTime: '*/30 * * * * *', fn: () => update_exchange_prices_in_tickers() },
    { cronTime: '*/40 * * * * *', fn: () => save_prices_from_tickers() },
    { cronTime: '*/45 * * * * *', fn: () => update_prices_on_tickers() },
  ];

  await runCronJobs(jobs);
  return true;
}

export const cron = {
  start,
};
