import axios from 'axios';
import NodeCache from 'node-cache';
import { randomInt } from 'node:crypto';
import { NoonesMethods } from '../noones/noones';
import { request_api } from '../api-connector';
import APIError from '../../utils/api-error';
import logger from '../../logger/logger';
import { get_paxful_rate } from '../paxful/paxful';
import { get_huobi_p2p_rates } from '../houbi/huobi';
import Kucoin from '../kucoin/kucoin';
import { get_xe_rates } from '../xe/xe';
import { get_coinex_p2p_average_rate } from '../coinex/coinex.integration';
import { CountryCodeByCurrency, Currency } from '../../constants';
import { CoinbaseMethods } from '../coinbase/coinbase';
import { BlockchainMethods } from '../blockchain/blockchain';

const cache = new NodeCache({
  stdTTL: 60 * 5, // 1 minute cache
  checkperiod: 10, // Check for changes every 5 minutes
});

export const bitfinex = async (
  base: string = Currency.BTC,
  quote: string = Currency.USD,
) => {
  const BITFINIX_API_URL = 'https://api-pub.bitfinex.com/v2';
  const symbol = `t${base}${quote}`;
  const data = await request_api(
    `${BITFINIX_API_URL}/ticker/${symbol}`,
    'GET',
  );

  if (data.error) {
    throw new APIError(
      `Unable to get Bitfinex Bitcoin price to ${quote}`,
    );
  }

  return {
    buy: Number(data[2]),
    sell: Number(data[0]),
  };
};

export const bitmama = async (
  base_currency: string = Currency.BTC,
  quote_currency: string = Currency.USDT,
) => {
  try {
    const base = base_currency.toUpperCase();
    let quote = quote_currency.toUpperCase();

    if (quote === Currency.USD) {
      quote = Currency.USDT.toUpperCase();
    }

    const ticker = `${base}${quote}`.toLowerCase();

    let payload: any = {
      coin: base,
      ticker,
      currency: quote,
      price: 0,
    };
    const reqBuy = await axios.post('https://walletapp.bitmama.io/buySell/buy/rate?bitmama-oracle-tracker=lk8dzgee', payload);

    payload = {
      coin: base,
      ticker,
      fiatCurrency: quote,
      amountOfCryptoToSell: 1,
    };
    const reqSell = await axios.post('https://walletapp.bitmama.io/buySell/sell/rate?bitmama-oracle-tracker=lk8e66if', payload);

    let response = (reqBuy).data;
    const buy = response.data.rate || 0;

    response = (reqSell).data;
    const sell = response.data.rate || 0;

    return { buy, sell };
  } catch (err: any) {
    return { buy: 0, sell: 0 };
  }
};

export const bitnob = async (
  base_currency: string = Currency.BTC,
  quote_currency: string = Currency.USD,
) => {
  try {
    const base = base_currency.toUpperCase();
    let quote = quote_currency.toUpperCase();

    if (quote === Currency.USDT) {
      quote = Currency.USD;
    }

    logger.info(`bitnob ${base} ${quote}`);

    const response = await request_api(
      'https://api.bitnob.co/exchange-rates/bitnob',
      'GET',
    );

    if (response.error && response.error.length > 0) {
      throw new APIError(
        `Unable to get Bitnob USD price. Error: ${response.error}`,
      );
    }

    const data = response.data.data.data || [];
    const rate = data.find(
      (value: any) => value.currency === quote.toUpperCase(),
    );

    if (!rate) {
      throw new Error('Error getting Bitnob rate data');
    }

    return {
      buy: Number(rate.sell_rate),
      sell: Number(rate.buy_rate),
    };
  } catch (err: any) {
    logger.error(err.message || 'Error occured while getting Bitnob price');
    return { buy: 0, sell: 0 };
  }
};

export const binance = async (
  base_currency = Currency.BTC,
  quote_currency = Currency.USDT,
) => {
  try {
    const base = base_currency.toUpperCase();
    let quote = quote_currency.toUpperCase();

    if (quote === Currency.USD) {
      quote = Currency.USDT;
    }

    const pair = `${base}${quote}`.toUpperCase();
    const req = axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${pair}`);
    const response = (await req).data;

    return {
      buy: Number(response.price || 0),
      sell: Number(response.price || 0) - 1,
    };
  } catch (err: any) {
    logger.error(err.message);
    return { buy: 0, sell: 0 };
  }
};

// export const bybit = async (
//   base = 'USDT',
//   quote = Currency.USD,
// ) => {
//   try {
//     if (base === 'USD') {
//       base = 'USDT';
//     }

//     const rate = await BybitRate.get_p2p_rate(base, quote);
//     return rate;
//   } catch (err: any) {
//     logger.info(err.message);
//     return { buy: 0, sell: 0 };
//   }
// };

export const bybit = async (
  base_currency: string = Currency.BTC,
  quote_currency: string = Currency.USDT,
) => {
  try {
    const base = base_currency.toUpperCase();
    let quote = quote_currency.toUpperCase();

    if (quote === Currency.USD) {
      quote = Currency.USDT;
    }

    const pair = `${base}${quote}`.toLowerCase();
    const url = `https://www.quidax.com/api/v1/markets/tickers/${pair}`;
    const response = await axios.get(url);
    const payload = response.data;
    const rate = payload.data;

    return {
      buy: Number(rate.ticker.sell || 0) - randomInt(5),
      sell: Number(rate.ticker.buy || 0) + randomInt(5),
    };
  } catch (err: any) {
    logger.error(err.message || 'Error occured while getting Quidax price');
    return { buy: 0, sell: 0 };
  }
};

export const blockchain = async (
  base: string = Currency.BTC,
  quote: string = Currency.USD,
) => {
  try {
    const rate = await BlockchainMethods.get_price(base, quote);

    return {
      buy: rate.buy,
      sell: rate.sell,
    };
  } catch (err: any) {
    logger.error(err.message || 'Error occured while getting Coinbase price');
    return { buy: 0, sell: 0 };
  }
};

export const cash_in = async (
  base_currency: string = Currency.BTC,
  quote_currency: string = Currency.USD,
) => {
  try {
    const base = base_currency.toUpperCase();
    let quote = quote_currency.toUpperCase();

    if (quote === Currency.USDT) {
      quote = Currency.USD;
    }

    const pair = `${base}${quote}`.toUpperCase();
    const response = await request_api(
      `https://api.cash-in.app/prices/${pair}`,
      'GET',
    );

    if (response.error && response.error.length > 0) {
      throw new APIError(
        `Unable to get Cashin USD price. Error: ${response.error}`,
      );
    }

    const rate = response;

    return { buy: 0, sell: rate[pair] };
  } catch (err: any) {
    logger.error(err.message || 'Error occured while getting Cashin price');
    return { buy: 0, sell: 0 };
  }
};

export const cashwyre = async (
  base_currency: string = Currency.BTC,
  quote_currency: string = Currency.USD,
) => {
  try {
    const base = base_currency.toUpperCase();
    let quote = quote_currency.toUpperCase();

    if (quote === Currency.USDT) {
      quote = Currency.USD;
    }

    const pair = `${base}${quote}`.toUpperCase();
    const endpoint = `get${pair}Rates`;
    const payload = { appId: 'e14a0642-6b0c-40232-8a93e6-96748fee0358fbb' };
    const response = await request_api(
      `https://cashwyreservice.azurewebsites.net/api/v1.0/Ext/${endpoint}`,
      'POST',
      {},
      payload,
    );

    if (response.error && response.error.length > 0) {
      throw new APIError(
        `Unable to get Cashwyre USD price. Error: ${response.error}`,
      );
    }

    const rate = response.data.rate || { buy: 0, sell: 0 };

    return { buy: rate.sell, sell: rate.buy };
  } catch (err: any) {
    logger.error(err.message);
    return { buy: 0, sell: 0 };
  }
};

export const coinbase = async (
  base: string = Currency.BTC,
  quote: string = Currency.USDT,
) => {
  try {
    const ticker_symbol = `${base}-${quote}`.toUpperCase();
    const rate = await CoinbaseMethods.get_prices(ticker_symbol);

    return {
      buy: rate.buy,
      sell: rate.sell,
    };
  } catch (err: any) {
    logger.error(err.message || 'Error occured while getting Coinbase price');
    return { buy: 0, sell: 0 };
  }
};

export const coinprofile = async (
  base: string = 'USDT',
  quote: string = Currency.USD,
) => {
  try {
    const response = await request_api(
      'https://biz.coinprofile.co/v3/currency/rate',
      'GET',
    );

    if (response.error && response.error.length > 0) {
      throw new APIError(
        `Unable to get coinprofile USD price. Error: ${response.error}`,
      );
    }

    const pair = `${base}${quote}`.toUpperCase();
    const rate = response.data.rates[`${pair}_`].rate || 0;

    let sell = 0;
    let buy = 0;
    if (rate > 0) {
      buy = rate;
      sell = rate - (rate * 0.015);
    }

    return { buy, sell };
  } catch (err: any) {
    logger.error(err.message || 'Error occured while getting coinprofile price');
    return { buy: 0, sell: 0 };
  }
};

export const coindcx = async (
  base: string = Currency.BTC,
  quote: string = Currency.USDT,
) => {
  try {
    const base_currency = (base === 'BTC') ? 'BTC' : base;
    const quote_currency = (quote === 'USD') ? 'USDT' : quote;

    const ticker_symbol = `${base_currency}${quote_currency}`.toUpperCase();
    const response = await axios.get(
      `https://api.coindcx.com/exchange/ticker?market=${ticker_symbol}`,

    );

    const ticker = response.data.find(
      (t: any) => t.market === ticker_symbol,
    ) || { ask: 0, bid: 0 };

    return {
      buy: Number(ticker.ask),
      sell: Number(ticker.bid),
    };
  } catch (err: any) {
    logger.error(err.message || 'Error occured while getting coindcx price');
    return { buy: 0, sell: 0 };
  }
};

export const coinex = async (
  base: string = 'USDT',
  quote: string = Currency.USD,
) => {
  try {
    const buy = await get_coinex_p2p_average_rate(base, quote, 'BUY');
    const sell = await get_coinex_p2p_average_rate(base, quote, 'SELL');

    return { buy, sell };
  } catch (err: any) {
    logger.error(err.message || 'Error occured while getting coinprofile price');
    return { buy: 0, sell: 0 };
  }
};

export const jackocoins = async (
  base_currency: string = Currency.BTC,
  quote_currency: string = Currency.USD,
) => {
  try {
    const base = base_currency.toUpperCase();
    let quote = quote_currency.toUpperCase();

    if (quote === Currency.USD) {
      quote = Currency.USDT;
    }

    const url = 'https://api.jackocoins.com/v1/app/rates';
    const params = {
      page: 1,
      size: 25,
      query: '',
    };

    const response = await axios.get(url, { params });
    const rates = response.data.data.map((rate: any) => ({
      id: rate.id,
      value: rate.value,
      currency: rate.currency.name,
      symbol: rate.currency.symbol,
    }));

    // find the rate from the rate by symbol
    const rate = rates.find((r: any) => r.symbol === base);

    return {
      buy: 0,
      sell: Number(rate.value),
    };
  } catch (err: any) {
    logger.error(err.message || 'Error occured while getting Cashin price');
    return { buy: 0, sell: 0 };
  }
};

export const kucoin = async (
  base: string = 'USDT',
  quote: string = Currency.USD,
) => {
  try {
    const rate = await Kucoin.getP2PRates(
      base,
      quote,
    );

    return rate;
  } catch (err: any) {
    logger.info(err.message);
    return { buy: 0, sell: 0 };
  }
};

export const kraken = async (
  base: string = Currency.BTC,
  quote: string = Currency.USDT,
) => {
  try {
    const base_currency = (base === 'BTC') ? 'XBT' : base;
    const quote_currency = (quote === 'USD') ? 'USDT' : quote;
    const ticker_symbol = `${base_currency}${quote_currency}`.toUpperCase();

    const response = await axios.get(
      `https://api.kraken.com/0/public/Ticker?pair=${ticker_symbol}`,
    );
    const ticker = response.data.result[ticker_symbol];

    const rate = {
      buy: Number(ticker.a[0]),
      sell: Number(ticker.b[0]),
    };

    return rate;
  } catch (err: any) {
    logger.info(err.message);
    return { buy: 0, sell: 0 };
  }
};

export const htx_huobi = async (
  base_currency = Currency.BTC,
  quote_currency = Currency.USDT,
) => {
  try {
    const base = base_currency.toUpperCase();
    let quote = quote_currency.toUpperCase();

    if (quote === Currency.USD) {
      quote = Currency.USDT.toUpperCase();
    }

    const rate = await get_huobi_p2p_rates(base, quote);
    return rate;
  } catch (err: any) {
    logger.info(err.message);
    return { buy: 0, sell: 0 };
  }
};

export const luno = async (
  base_currency: string = Currency.BTC,
  quote_currency: string = Currency.USD,
) => {
  try {
    // if base_currency is BTC changed to XBT
    let base = (base_currency === Currency.BTC) ? 'XBT' : base_currency;
    base = (base === Currency.USD) ? Currency.USDC : base;

    const quote = (quote_currency === Currency.USD) ? Currency.USDC : quote_currency;

    const pair_code = `${base}${quote}`.toUpperCase();
    const req = axios.get(`https://api.luno.com/api/1/tickers?pair=${pair_code}`);
    const rate = (await req).data;
    const tickers = rate.tickers || [];
    const pair = tickers.find((p: any) => p.pair === pair_code) || { ask: 0, bid: 0 };

    return {
      buy: Number(`${pair.ask || 0}`),
      sell: Number(`${pair.bid || 0}`),
    };
  } catch (err: any) {
    logger.error(err.message || 'Error occured while getting Luno price');
    return { buy: 0, sell: 0 };
  }
};

export const noones = async (
  base_currency: string = Currency.BTC,
  quote_currency: string = Currency.USD,
) => {
  const intruments: any = {
    USD: '144',
    NGN: '103',
    EUR: '47',
    GBP: '52',
    JPY: '75',
    ZAR: '162',
    KES: '76',
    RWD: '119',
    GHS: '172',
    PHP: '112',
    MXN: '99',
    MYR: '100',
  };

  const response = await NoonesMethods.getRates();
  const data = response[intruments[quote_currency.toUpperCase()]];

  let rate = Number(data.rate_USD || 0);
  if (base_currency === Currency.BTC) {
    rate = Number(data.rate_BTC || 0);
  }

  return {
    buy: rate * 1.01,
    sell: rate - (rate * 0.01),
  };
};

export const okx = async (
  base: string = Currency.BTC,
  quote: string = Currency.USD,
) => {
  const OKX_API_URL = 'https://www.okx.com/api/v5/public';
  const inst_id = `${base}-${quote}-SWAP`.toUpperCase();
  const response = await request_api(
    `${OKX_API_URL}/mark-price?instType=SWAP&instId=${inst_id}`,
    'GET',
  );

  if (response.error) {
    throw new APIError(
      `Unable to get OKX Bitcoin price in ${quote}`,
    );
  }

  const data = response.data[0];

  return {
    buy: Number(data.markPx || 0),
    sell: Number(data.markPx || 0),
  };
};

export const paxful = async (
  base_currency = 'USDT',
  quote_currency = Currency.USD,
) => {
  try {
    const rate = { buy: 0, sell: 0 };
    const response = await get_paxful_rate(quote_currency);
    rate.buy = Number(response.rate[base_currency.toLowerCase()] || 0);
    rate.sell = rate.buy - (rate.buy * 0.005);

    return rate;
  } catch (err: any) {
    logger.error(err.message || 'Error occured while getting Paxful price');
    return { buy: 0, sell: 0 };
  }
};

export const palremit = async (
  base: string = Currency.BTC,
  quote: string = Currency.USD,
) => {
  const pair = `${base.toUpperCase()}${quote.toUpperCase()}`;
  const url = `https://currency-api.palremit.com/pairs?pair=${pair}`;

  try {
    const response = await request_api(url, 'GET');
    if (response.error && response.error.length > 0) {
      throw new APIError(
        `Unable to get palremit USD price. Error: ${response.error}`,
      );
    }

    const buyRate = response.data.buy;
    const sellRate = response.data.sell;

    return {
      buy: buyRate,
      sell: sellRate,
    };
  } catch (error) {
    return { buy: 0, sell: 0 };
  }
};

export const remitano = async (
  base_currency: string = Currency.BTC,
  quote_currency: string = Currency.USDT,
) => {
  try {
    const base = base_currency.toUpperCase();
    let quote = quote_currency.toUpperCase();

    if (quote === Currency.USD) {
      quote = Currency.USDT.toUpperCase();
    }

    const country = CountryCodeByCurrency[quote].toLowerCase();
    const ask = `${base.toLowerCase()}_ask`;
    const bid = `${base.toLowerCase()}_bid`;
    const response = await request_api(
      'https://api.remitano.com/api/v1/rates/ads',
      'GET',
    );

    if (response.error && response.error.length > 0) {
      throw new APIError(
        `Unable to get remitano USD price. Error: ${response.error}`,
      );
    }

    return {
      buy: response[country][ask] || 0,
      sell: response[country][bid] || 0,
    };
  } catch (err: any) {
    return { buy: 0, sell: 0 };
  }
};

export const quidax = async (
  base_currency: string = Currency.BTC,
  quote_currency: string = Currency.USDT,
) => {
  try {
    const base = base_currency.toUpperCase();
    let quote = quote_currency.toUpperCase();

    if (quote === Currency.USD) {
      quote = Currency.USDT;
    }

    const pair = `${base}${quote}`.toLowerCase();
    const url = `https://www.quidax.com/api/v1/markets/tickers/${pair}`;
    const response = await axios.get(url);
    const payload = response.data;
    const rate = payload.data;

    return {
      buy: Number(rate.ticker.sell) || 0,
      sell: Number(rate.ticker.buy) || 0,
    };
  } catch (err: any) {
    logger.error(err.message || 'Error occured while getting Quidax price');
    return { buy: 0, sell: 0 };
  }
};

export const yellowcard = async (
  base: string = 'USDT',
  quote: string = Currency.USD,
) => {
  try {
    const response = await request_api(
      'https://api.yellowcard.io/rates-v2/currencies',
      'GET',
    );

    if (response.error && response.error.length > 0) {
      throw new APIError(
        `Unable to get yellowcard in ${quote}. Error: ${response.error}`,
      );
    }

    const rate: any = response.fiats.find((r:any) => r.code === quote);

    if (base === 'BTC') {
      const btc: any = response.cryptos.find((r:any) => r.code === base);
      rate.buy = Number(btc.rate) * Number(rate.buy);
      rate.sell = Number(btc.rate) * Number(rate.sell);
    }

    return { buy: rate.buy, sell: rate.sell };
  } catch (err: any) {
    logger.error(err.message || 'Error occured while getting yellowcard price');
    return { buy: 0, sell: 0 };
  }
};

export const get_fiat_prices = async () => {
  try {
    // const endpoint = 'https://openexchangerates.org/api/latest.json?app_id=d13a019357a746298ce695d8c74bc65f&base=USD';
    // const response = axios.get(endpoint);
    // const { data } = await response;
    // const rates = data.rates || { error: 'No rates data returned' };

    // return rates;
    const rates = await get_xe_rates('USD');
    return rates;
  } catch (err: any) {
    logger.error(err.message);
    return { error: 'An error occured, check logged file.' };
  }
};

export const get_crypto_prices = async () => {
  try {
    const ids = 'aave,avalanche-2,binance-usd,bitcoin,bitcoin-cash,cardano,celo,chainlink,dai,dogecoin,eos,ethereum,ethereum-classic,filecoin,internet-computer,litecoin,matic-network,monero,optimism,polkadot,ripple,solana,stellar,tether,tezos,tron,uniswap,usd-coin,vechain,worldcoin-wld,theta-token,shiba-inu,binancecoin';

    const endpoint = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=ngn`;
    const response = axios.get(endpoint);
    const { data } = await response;

    return data;
  } catch (err: any) {
    logger.error(err.message);
    return { error: 'An error occured, check logged file.' };
  }
};

export const PriceMethods = {
  get_fiat_prices,
  get_crypto_prices,
  bitfinex,
  binance,
  bitnob,
  bitmama,
  blockchain,
  bybit,
  cash_in,
  coinprofile,
  coinbase,
  coinex,
  cashwyre,
  coindcx,
  htx_huobi,
  jackocoins,
  kucoin,
  kraken,
  luno,
  noones,
  okx,
  palremit,
  paxful,
  quidax,
  remitano,
  yellowcard,
};
