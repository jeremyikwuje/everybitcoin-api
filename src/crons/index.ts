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
import { set_next_milestone } from '../modules/milestones/milestone.service';
import { add_quote_bulk, update_currency_prices_from_external_api } from '../modules/prices/services/currency.price.service';
import { add_currency_bulk } from '../modules/currencies/currency.service';

interface Job {
  cronTime: string;
  fn: Function;
}

export async function runCronJobs(jobs: Job[]) {
  jobs.forEach((job: any) => {
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
  });

  return true;
}

async function start() {
  if (!Config.enableCronJobs) {
    logger.info('Cron jobs are disabled');
    return false;
  }

  const jobs = [
    { cronTime: '0 */1 * * * *', fn: () => update_currency_prices_from_external_api() },
    // { cronTime: '*/20 * * * * *', fn: () => add_currency_bulk() },
    // { cronTime: '0 */10 * * * *', fn: () => update_exchange_prices_in_tickers() },
    // { cronTime: '0 */11 * * * *', fn: () => save_prices_from_tickers() },
    // { cronTime: '0 */12 * * * *', fn: () => update_prices_on_tickers() },
    // { cronTime: '0 */13 * * * *', fn: () => set_next_milestone() },
  ];
  await runCronJobs(jobs);
  return true;
}

export const cron = {
  start,
};
