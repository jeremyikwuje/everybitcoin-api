export const pair_supported_in_exchange = (
  exchange_code: string,
  symbol: string,
) => {
  const exchanges_currency = exchanges_currencies[exchange_code] || null;
  if (!exchanges_currency) {
    throw new Error(`Invalid exchange code: ${exchange_code}`);
  }
  const exchange_ticker_symbols = exchanges_currency.ticker_symbols || [];
  console.log(symbol);
  if (!exchange_ticker_symbols.includes(symbol)) {
    return false;
  }

  return true;
};

export const exchanges_currencies: any = {
  kraken: {
    currencies: ['BTC', 'USDT', 'USD', 'EUR', 'GBP'],
    ticker_symbols: ['BTC-USDT', 'BTC-USD', 'BTC-EUR', 'BTC-GBP'],
  },
  binance: {
    currencies: ['BTC', 'USD', 'USDT', 'USDC'],
    ticker_symbols: ['BTC-USD', 'BTC-USDT', 'BTC-USDC'],
  },
  bybit: {
    currencies: ['BTC', 'USD', 'USDT', 'USDC'],
    ticker_symbols: ['BTC-USD', 'BTC-USDT', 'BTC-USDC'],
  },
  bitget: {
    currencies: ['BTC', 'USD', 'USDT', 'USDC'],
    ticker_symbols: ['BTC-USD', 'BTC-USDT', 'BTC-USDC'],
  },
  bitfinex: {
    currencies: ['BTC', 'USD', 'USDT', 'USDC'],
    ticker_symbols: ['BTC-USD', 'BTC-USDT', 'BTC-USDC'],
  },
  blockchain: {
    currencies: ['BTC', 'USD', 'USDT', 'USDC'],
    ticker_symbols: ['BTC-USD', 'BTC-USDT', 'BTC-USDC'],
  },
  bitstamp: {
    currencies: ['BTC', 'USD', 'USDT', 'USDC'],
    ticker_symbols: ['BTC-USD', 'BTC-USDT', 'BTC-USDC'],
  },
  bithumb: {
    currencies: ['BTC', 'USD', 'USDT', 'USDC'],
    ticker_symbols: ['BTC-USD', 'BTC-USDT', 'BTC-USDC'],
  },
  bitmart: {
    currencies: ['BTC', 'USD', 'USDT', 'USDC'],
    ticker_symbols: ['BTC-USD', 'BTC-USDT', 'BTC-USDC'],
  },
  bitso: {
    currencies: ['BTC', 'USD', 'USDT', 'USDC'],
    ticker_symbols: ['BTC-USD', 'BTC-USDT', 'BTC-USDC'],
  },
  bisq: {
    currencies: ['BTC', 'USD', 'USDT', 'USDC'],
    ticker_symbols: ['BTC-USD', 'BTC-USDT', 'BTC-USDC'],
  },
  coinmarketcap: {
    currencies: ['BTC', 'USD', 'USDT', 'USDC'],
    ticker_symbols: ['BTC-USD', 'BTC-USDT', 'BTC-USDC'],
  },
  coingecko: {
    currencies: ['BTC', 'USD', 'USDT', 'USDC'],
    ticker_symbols: ['BTC-USD', 'BTC-USDT', 'BTC-USDC'],
  },
  coinbase: {
    currencies: ['BTC', 'USD', 'USDT', 'USDC'],
    ticker_symbols: ['BTC-USD', 'BTC-USDT', 'BTC-USDC'],
  },
  coinmama: {
    currencies: ['BTC', 'USD', 'USDT', 'USDC'],
    ticker_symbols: ['BTC-USD', 'BTC-USDT', 'BTC-USDC'],
  },
  coindcx: {
    currencies: ['BTC', 'USD', 'USDT', 'USDC'],
    ticker_symbols: ['BTC-USD', 'BTC-USDT', 'BTC-USDC'],
  },
  etoro: {
    currencies: ['BTC', 'USD', 'USDT', 'USDC'],
    ticker_symbols: ['BTC-USD', 'BTC-USDT', 'BTC-USDC'],
  },
  gemini: {
    currencies: ['BTC', 'USD', 'USDT', 'USDC'],
    ticker_symbols: ['BTC-USD', 'BTC-USDT', 'BTC-USDC'],
  },
  htx_houbi: {
    currencies: ['BTC', 'USD', 'USDT', 'USDC'],
    ticker_symbols: ['BTC-USD', 'BTC-USDT', 'BTC-USDC'],
  },
  kucoin: {
    currencies: ['BTC', 'USD', 'USDT', 'USDC'],
    ticker_symbols: ['BTC-USD', 'BTC-USDT', 'BTC-USDC'],
  },
  luno: {
    currencies: ['BTC', 'USD', 'USDT', 'USDC'],
    ticker_symbols: ['BTC-USD', 'BTC-USDT', 'BTC-USDC'],
  },
  noones: {
    currencies: ['BTC', 'USD', 'USDT', 'USDC'],
    ticker_symbols: ['BTC-USD', 'BTC-USDT', 'BTC-USDC'],
  },
  okx: {
    currencies: ['BTC', 'USD', 'USDT', 'USDC'],
    ticker_symbols: ['BTC-USD', 'BTC-USDT', 'BTC-USDC'],
  },
  robinhood: {
    currencies: ['BTC', 'USD', 'USDT', 'USDC'],
    ticker_symbols: ['BTC-USD', 'BTC-USDT', 'BTC-USDC'],
  },
  uphold: {
    currencies: ['BTC', 'USD', 'USDT', 'USDC'],
    ticker_symbols: ['BTC-USD', 'BTC-USDT', 'BTC-USDC'],
  },
};
