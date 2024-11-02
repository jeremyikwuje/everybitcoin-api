import { pair_supported_in_exchange } from '../exchange.currencies';
import { bitfinex, blockchain, kraken, kucoin, PriceMethods, yellowcard } from './price.methods';

// Mapping of exchanges to their respective methods and supported currencies
const exchanges_methods: any = {
  bitfinex: { method: PriceMethods.bitfinex },
  bitmama: { method: PriceMethods.bitmama },
  blockchain: { method: PriceMethods.blockchain },
  bybit: { method: PriceMethods.bybit },
  binance: { method: PriceMethods.binance },
  bitnob: { method: PriceMethods.bitnob },
  cash_in: { method: PriceMethods.cash_in },
  cashwyre: { method: PriceMethods.cashwyre },
  coinbase: { method: PriceMethods.coinbase },
  coinprofile: { method: PriceMethods.coinprofile },
  coinex: { method: PriceMethods.coinex },
  coindcx: { method: PriceMethods.coindcx },
  htx_huobi: { method: PriceMethods.htx_huobi },
  jackocoins: { method: PriceMethods.jackocoins },
  kucoin: { method: PriceMethods.kucoin },
  kraken: { method: PriceMethods.kraken },
  luno: { method: PriceMethods.luno },
  noones: { method: PriceMethods.noones },
  okx: { method: PriceMethods.okx },
  palremit: { method: PriceMethods.palremit },
  paxful: { method: PriceMethods.noones },
  remitano: { method: PriceMethods.remitano },
  yellowcard: { method: PriceMethods.yellowcard },
};

// Function to get the price for a given exchange and currency
export const get_exchange_rate = (exchange_code: any, base: string, qoute: string) => {
  const symbol = `${base}-${qoute}`.toUpperCase();
  const exchange = exchanges_methods[exchange_code];
  if (!exchange) {
    throw new Error(`Exchange ${exchange_code} not found`);
  }

  const { method } = exchange;
  if (!pair_supported_in_exchange(exchange_code, symbol)) {
    throw new Error(`The symbol ${symbol} not supported by ${exchange_code}`);
  }

  // Call the method for the given exchange and currency
  return method(base, qoute);
};
