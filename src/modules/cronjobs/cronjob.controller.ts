import ApiResponse from '../../utils/api-response';
import {
  save_prices_from_tickers,
  update_prices_on_tickers,
} from '../prices/price.service';
import {
  update_exchange_prices_in_tickers,
} from '../tickers/ticker.service';

export const update_exchange_rates_in_tickers = async (
  req: any,
  res: any,
) => {
  // get all exchanges of btc-usd
  const exchanges = await update_exchange_prices_in_tickers();

  return ApiResponse.success(
    res,
    'Successful',
    exchanges,
  );
};

export const save_prices = async (req: any, res: any) => {
  // get rates from monierate api
  const prices = await save_prices_from_tickers();

  return ApiResponse.success(
    res,
    'Successful',
    prices,
  );
};

export const update_tickers = async (req: any, res: any) => {
  const prices = await update_prices_on_tickers();

  return ApiResponse.success(
    res,
    'Successful',
    {
      prices,
    },
  );
};
