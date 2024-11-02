import axios from 'axios';
import logger from '../../logger/logger';

type CoinId = 1 | 2;
type Currency = 15 | 16;
type TradeType = 'buy' | 'sell';

const HuobiCoinCodes: any = {
  BTC: 1,
  USDT: 2,
};

const HuobiCurrencyCodes: any = {
  NGN: 15,
};

const get_huobi_p2p_orders = async (coinId: CoinId, tradeType: TradeType, currency: Currency) => {
  const url = 'https://www.htx.com/-/x/otc/v1/data/trade-market';
  const params = {
    coinId,
    currency,
    tradeType,
    currPage: 1,
    payMethod: 0,
    acceptOrder: -1,
    country: '',
    blockType: 'general',
    online: 1,
    range: 0,
    amount: '',
    isThumbsUp: false,
    isMerchant: false,
    isTraded: false,
    onlyTradable: false,
    isFollowed: false,
    makerCompleteRate: 0,
  };
  const headers = {
    Portal: 'web',
  };

  try {
    const response = await axios.get(url, { params, headers });
    return response.data.data;
  } catch (error) {
    console.error('Error getting Huobi P2P exchange rate', error);
  }
};

export const get_huobi_p2p_rates = async (coin: string = 'USDT', fiat: string = 'NGN') => {
  if (!HuobiCoinCodes[coin]) {
    return { buy: 0, sell: 0 };
  }

  if (!HuobiCurrencyCodes[fiat]) {
    return { buy: 0, sell: 0 };
  }

  const coinCode = HuobiCoinCodes[coin];
  const fiatCode = HuobiCurrencyCodes[fiat];

  const getBuyOrders = await get_huobi_p2p_orders(coinCode, 'sell', fiatCode);
  const getSellOrders = await get_huobi_p2p_orders(coinCode, 'buy', fiatCode);

  // get the average price of all the buy orders
  const buyPrices = getBuyOrders.map((order: any) => order.price);
  const averageBuyPrice = buyPrices.reduce(
    (a: any, b: any) => Number(a) + Number(b),
  ) / buyPrices.length;

  const sellPrices = getSellOrders.map((order: any) => order.price);
  const averageSellPrice = sellPrices.reduce(
    (a: any, b: any) => Number(a) + Number(b),
  ) / sellPrices.length;

  return { buy: averageBuyPrice, sell: averageSellPrice };
};
