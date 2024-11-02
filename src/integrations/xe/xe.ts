import axios from 'axios';
import NodeCache from 'node-cache';
import logger from '../../logger/logger';

const cache = new NodeCache({
  stdTTL: 60 * 5, // 1 minute cache
});

export const get_xe_rate = async (quote: string = 'NGN', base: string = 'USD') => {
  const url = 'https://www.xe.com/api/protected/midmarket-converter/';
  const basic = `Basic ${Buffer.from('lodestar:pugsnax').toString('base64')}`;
  const headers = {
    Authorization: basic,
  };

  try {
    const key = `xe_rate_${base}_${quote}`;

    if (!cache.get(key)) {
      const response = await axios.get(url, { headers });
      const { data } = response;
      const { rates } = data;
      const qoute_usd_rate = Number(rates[quote.toUpperCase()]);
      if (base === 'USD') {
        cache.set(key, qoute_usd_rate);
        return qoute_usd_rate;
      }

      const base_usd_rate = Number(rates[base.toUpperCase()]);
      const rate = Number((qoute_usd_rate / base_usd_rate).toFixed(2));
      cache.set(key, rate);

      return rate;
    }

    logger.info(`Using cached XE rate for ${quote}`);
    return Number(cache.get(key));
  } catch (error) {
    logger.error(`Error in XE rate: ${error}`);
    return 0;
  }
};

export const get_xe_rates = async (base: string = 'USD') => {
  const url = 'https://www.xe.com/api/protected/midmarket-converter/';
  const basic = `Basic ${Buffer.from('lodestar:pugsnax').toString('base64')}`;
  const headers = {
    Authorization: basic,
  };

  try {
    const key = `xe_rate_${base}_rates`;

    if (!cache.get(key)) {
      const response = await axios.get(url, { headers });
      const { data } = response;
      const { rates } = data;
      cache.set(key, rates);

      return rates;
    }

    logger.info(`Using cached XE rates`);
    return Number(cache.get(key));
  } catch (error) {
    logger.error(`Error in XE rates: ${error}`);
    return 0;
  }
};
