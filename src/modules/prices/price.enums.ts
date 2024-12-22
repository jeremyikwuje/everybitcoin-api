export enum PriceMarket {
  Mid = 'mid',
  Exchange = 'exchange',
  Parallel = 'parallel',
}

export interface INewCurrencyPrice {
  base: string;
  quotes?: {
    [key: string]: number;
  };
}

export interface IUpdateCurrencyPrices {
  base?: string;
  quotes?: {
    [key: string]: number;
  };
  updated_at?: Date;
}
