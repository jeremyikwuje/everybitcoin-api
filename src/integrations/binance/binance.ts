import axios, { AxiosError, AxiosResponse } from 'axios';

export type Crypto = 'USDT' | 'BTC' | 'BNB' | 'BUSD' | 'ETH' | 'DAI' | string;
export type TradeType = 'BUY' | 'SELL';
export type Fiat =
    'USD'
    | 'GHS'
    | 'KES'
    | 'NGN'
    | 'UGX'
    | 'ZAR';

export type CryptoPairs = 'BTCUSDT' | 'ETHUSDT';

export type Rate = {
  sell: number;
  buy: number
};

export interface IPSPRequestOption {
  page: number;
  rows: number;
  asset: Crypto;
  tradeType: TradeType;
  fiat: Fiat;
  transAmount: string;
  payTypes: PayType[]
  filterType: string;
  order: string;
}

export interface IP2PResponse {
  code: string;
  message?: string;
  messageDetail?: string;
  data: IOrder[];
  total: number;
  success: boolean;
}

export interface IOrder {
  adv: IAdvertising;
  advertiser: IAdvertiser;
}

export type Classify = 'mass' | 'profession';

export interface IAdvertising {
  advNo: string;
  classify: Classify;
  tradeType: TradeType;
  asset: Crypto;
  fiatUnit: Fiat;
  price: string;
  initAmount: string;
  surplusAmount: string;
  amountAfterEditing: string;
  maxSingleTransAmount: string;
  minSingleTransAmount: string;
  remarks?: string;
  payTimeLimit?: string;
  tradeMethods?: ITradeMethods[];
  fiatSymbol: string;
  dynamicMaxSingleTransAmount: string;
  minSingleTransQuantity: string;
  maxSingleTransQuantity: string;
  dynamicMaxSingleTransQuantity: string;
}

export type PayType =
  | 'BANK'
  | 'TrueMoney'
  | 'ShopeePay'
  | 'CashDeposit'
  | 'LINEPay'
  | 'Paypal'
  | 'WesternUnion'
  | 'FPS'
  | 'NGNfiatbalance'
  | 'Tinkoff'
  | 'jkopay';

export interface ITradeMethods {
  payId?: string;
  payType: string;
  payAccount?: string;
  payBank?: PayType;
  paySubBank?: string;
  identifier: string;
}

export type UserType = 'user' | 'merchant';

export interface IAdvertiser {
  userNo: string;
  realName?: string;
  nickName: string;
  orderCount?: number;
  monthOrderCount: number;
  monthFinishRate: number;
  email?: string;
  userType?: UserType;
}

interface IAskResponse {
  crypto: Crypto;
  fiat: Fiat;
  tradeType: TradeType;
  transAmount: string;
  payTypes: PayType[];
}

const SPOT_ENDPOINT = 'https://api.binance.com/api/v3';
const P2P_ENDPOINT = 'https://p2p.binance.com';
const P2P_ROW_REQUEST = 5;

export default class Binance {
  static async requestBinanceP2P(
    requestOptions: IPSPRequestOption,
  ): Promise<IP2PResponse> {
    const url = `${P2P_ENDPOINT}/bapi/c2c/v2/friendly/c2c/adv/search`;

    const headers = {
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
    };

    try {
      const response = await axios.post<
      IPSPRequestOption,
      AxiosResponse<IP2PResponse>
      >(url, requestOptions, {
        headers,
      });

      return response.data;
    } catch (error: any) {
      return <IP2PResponse> {};
    }
  }

  static async requestSpot(
    endpoint: string,
    method: string,
  ): Promise<any> {
    const url = `${SPOT_ENDPOINT}${endpoint}`;

    const reqOption = {
      url,
      method,
    };

    try {
      const response = (await axios(reqOption)).data;
      // console.log(response);
      return response || {};
    } catch (err: any) {
      let error: any;

      if (err.response) {
        error = err.response.error || 'An error occured querying the API.';
      } else if (err.request) {
        error = 'An error occurred with the api request.';
      } else {
        error = '';
      }

      console.log(err);

      return { error };
    }
  }

  static async requestP2P(options: IPSPRequestOption): Promise<IP2PResponse | undefined> {
    try {
      const p2pResponse = await Binance.requestBinanceP2P(options);
      return p2pResponse;
    } catch (error: any) {
      if (error && error.response) {
        const axiosError = error as AxiosError<IP2PResponse>;
        return axiosError.response?.data;
      }

      throw error;
    }
  }

  static prepareP2POption(answers: IAskResponse): IPSPRequestOption {
    const options: IPSPRequestOption = {
      page: 1,
      rows: P2P_ROW_REQUEST || 5,
      asset: answers.crypto,
      tradeType: answers.tradeType,
      fiat: answers.fiat,
      transAmount: answers.transAmount,
      payTypes: answers.payTypes,
      filterType: 'all',
      order: '',
    };

    return options;
  }

  static thousandSeparator(number: number, fractionDigits: number = 0): string {
    const defaultLocale = undefined;
    const formatted = number.toLocaleString(defaultLocale, {
      minimumFractionDigits: fractionDigits,
    });
    return formatted;
  }

  static async getSpotRates(pair: CryptoPairs): Promise<Rate> {
    const request = await Binance.requestSpot(
      `/ticker/price?symbol=${pair}`,
      'GET',
    );

    const buy = parseFloat(`${request.price || 0}`);
    const sell = parseFloat(`${request.price || 0}`);

    const rate: Rate = {
      buy,
      sell,
    };

    return rate;
  }

  static async getP2PRates(crypto: Crypto = 'USDT', fiat: Fiat = 'NGN'): Promise<Rate> {
    const requestOptionsBuy = Binance.prepareP2POption({
      tradeType: 'BUY',
      crypto,
      fiat,
      transAmount: '0',
      payTypes: [],
    });
    const requestOptionsSell = Binance.prepareP2POption({
      tradeType: 'SELL',
      crypto,
      fiat,
      transAmount: '0',
      payTypes: ['BANK'],
    });

    const buyResponse = Binance.requestP2P(requestOptionsBuy);
    const sellResponse = Binance.requestP2P(requestOptionsSell);

    const buyOrders = (await buyResponse)?.data;
    const sellOrders = (await sellResponse)?.data;

    // let sorted: IOrder[];

    const rate: Rate = {
      buy: 0,
      sell: 0,
    };

    if (buyOrders === undefined) { rate.buy = 0; } else {
      let sum = 0;
      buyOrders.forEach((order) => {
        sum += parseFloat(order.adv.price);
      });

      rate.buy = sum / (buyOrders.length);
    }

    if (sellOrders === undefined) { rate.sell = 0; } else {
      let sum = 0;
      sellOrders.forEach((order) => {
        sum += parseFloat(order.adv.price);
      });

      rate.sell = sum / sellOrders.length;
    }

    if (rate.sell >= rate.buy) {
      rate.sell = rate.buy;
    }

    return rate;
  }
}
