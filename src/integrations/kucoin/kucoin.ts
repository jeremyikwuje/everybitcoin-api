import axios from 'axios';
import logger from '../../logger/logger';

export type TradeType = 'BUY' | 'SELL'; // 1 is BUY and 0 is SELL
export type PayType = '14' | ''; // 14 is bank transfer
export type Crypto = 'USDT' | 'BTC' | 'ETH' | 'DAI' | string;
type Fiat = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD' | 'NGN' | 'KES' | any;

export interface IPSPRequestOption {
  currency: Crypto;
  legal: Fiat;
  side: TradeType;
  status?: string;
  amount?: string;
  payTypeCodes?: string;
  page?: string;
  pageSize?: string;
}

export interface IP2PResponse {
  code: string;
  msg?: string;
  success?: string;
  items: Items[];
}

export interface Items {
  premium: string;
  floatPrice: string;
  currency: Crypto;
  legal: Fiat;
  side: TradeType;
  limitMinQuote: string;
  limitMaxQuote: string;
  currencyQuantity: string;
  currencyBalanceQuantity: string;
}

// interface IAskResponse {
//   currency: Crypto;
//   legal: Fiat;
//   side: TradeType;
//   floatPrice: string;
//   premium: string;
// }

export type Rate = {
  sell: number;
  buy: number
};

const P2P_ENDPOINT = 'https://www.kucoin.com/_api/otc/ad/list';
const P2P_ROW_SIZE = '10';

export default class Kucoin {
  static async requestP2P(reqOption: IPSPRequestOption) {
    const endpoint = `${P2P_ENDPOINT}?status=PUTUP&currency=${reqOption.currency}&legal=${reqOption.legal}&page=${reqOption.page}&pageSize=${reqOption.pageSize}&side=${reqOption.side}&amount=&payTypeCodes=&lang=en_US`;

    const req = await axios.get(endpoint);
    const res = req.data;

    const items = res.items ?? [];

    return items;
  }

  static async getP2PRates(crypto: Crypto, fiat: Fiat) {
    const buyOrders = await Kucoin.requestP2P({
      currency: crypto,
      legal: fiat,
      side: 'SELL',
      page: '1',
      pageSize: P2P_ROW_SIZE,
    });

    const sellOrders = await Kucoin.requestP2P({
      currency: crypto,
      legal: fiat,
      side: 'BUY',
      page: '1',
      pageSize: P2P_ROW_SIZE,
    });

    const rate: Rate = {
      buy: 0,
      sell: 0,
    };

    if (buyOrders === undefined) { rate.buy = 0; } else {
      let sum = 0;
      buyOrders.forEach((order: any) => {
        sum += parseFloat(order.floatPrice);
      });

      rate.buy = sum / (buyOrders.length);
    }

    if (sellOrders === undefined) { rate.sell = 0; } else {
      let sum = 0;
      sellOrders.forEach((order: any) => {
        sum += parseFloat(order.floatPrice);
      });

      rate.sell = sum / sellOrders.length;
    }

    const rateDiff = rate.sell - rate.buy;
    if (rateDiff >= 1) {
      rate.sell = rate.buy - (rate.buy * 0.01);
    }

    return rate;
  }

  static async getSpotRates(crypto: Crypto, fiat: Fiat) {
    try {
      const endpoint = `https://api.kucoin.com/api/v1/prices?base=${fiat}&currencies=${crypto}`;
      const req = await axios.get(endpoint);
      const res = req.data;
      const rate = res.data[crypto];

      return {
        buy: rate,
        sell: rate,
      };
    } catch (error) {
      logger.error(error);

      return {
        buy: 0,
        sell: 0
      };
    }
  }
}
