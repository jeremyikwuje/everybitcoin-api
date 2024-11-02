import logger from "../../logger/logger";
import ApiResponse from "../../utils/api-response";
import { get_ticker, get_ticker_average_price, update_ticker, update_ticker_exchange, update_ticker_exchange_props } from "../tickers/ticker.service";
import { CoinbaseMethods } from "../../integrations/coinbase/coinbase";
import { BybitMethods } from "../../integrations/bybit/bybit";
import { BlockchainMethods } from "../../integrations/blockchain/blockchain";
import { ticker_symbols } from "../tickers/ticker.enums";
import { 
    add_new_price,
    get_last_day_price,
    get_last_hour_price,
    get_last_month_price,
    get_last_week_price,
    get_recent_price
} from "../prices/price.service";
import { percentage_difference } from "../../utils/utilities";
import { get_exchange_rate } from "../../integrations/rates/changer.method";
import Time from "../../utils/time";

// export const update_btc_usd_ticker = async (req: any, res: any) => {

//     // get all exchanges of btc-usd
//     const ticker = await get_ticker('BTC-USD');
//     let exchanges = ticker.exchanges;

//     // retrieve new rates from each ticker
//     const exchangeRates = [
//         {
//             exchange: 'binance',
//             price: Binance.getSpotRates('BTCUSDT')
//         },
//         {
//             exchange: 'coinbase',
//             price: CoinbaseMethods.get_prices('BTC-USD')
//         },
//         {
//             exchange: 'bybit',
//             price: BybitMethods.get_price('BTCUSDT')
//         },
//         {
//             exchange: 'blockchain',
//             price: BlockchainMethods.get_btc_price('USD')
//         },
//         {
//             exchange: 'bitfinex',
//             price: bitfinex_get_btc_price('USD')
//         },
//         {
//             exchange: 'okx',
//             price: okx_get_btc_price('USD')
//         }
//     ];
    
//     await Promise.all(exchangeRates.map(async (value) => {
//         try {
//             const rate: any = await value.price;
//             const exchange_code = value.exchange.toLowerCase();

//             let index = exchanges.findIndex((ex: any) => ex.code === exchange_code);
//             if (index !== -1) {
//                 logger.info(
//                     `index: ${index} | exchange: ${exchange_code} | buy: ${rate.buy} | sell: ${rate.sell}`
//                 );

//                 let exchange = exchanges[index];
//                 if (exchange.code) {
//                     exchanges.splice(index, 1);

//                     exchange.price = rate.buy;
//                     exchange.price_sell = rate.sell;
//                     exchanges.push(exchange);
//                 } 
//             }
//         } 
//         catch(e: any) {
//             return;
//         }
        
//     }));

//     await update_ticker('btc-usd', { exchanges });

//     return ApiResponse.success(
//         res,
//         'Successful',
//         { exchanges }
//     );
// }

export const update_exchange_rates_in_tickers = async (
    req: any,
    res: any,
) => {
    // get all exchanges of btc-usd
    const symbols = ['BTC-USD'];
  
    for (let symbol of symbols) {
      const split_symbol = symbol.split('-');
      const base = split_symbol[0];
      const quote = split_symbol[1];
      
      try {
        const ticker = await get_ticker(symbol);
        const { exchanges } = ticker;
  
        let updated_exchanges: any = exchanges;
        const promise = exchanges.map(async (exchange: any) => {
          try {
            const { code:exchange_code } = exchange;
            const {
              buy,
              sell,
            } = await get_exchange_rate(
              exchange_code,
              base,
              quote
            ); // Assuming get_exchange_rates is a function that fetches rates
            
            logger.info(`Updating ${exchange_code} ${symbol} rate: ${buy} buy | ${sell} sell`);
  
            if (buy > 0 || sell > 0) {
              const updated_properties = {
                code: exchange_code,
                price_buy: buy,
                price_sell: sell,
                updated_at: new Date(Time.now()),
              };
  
              updated_exchanges = update_ticker_exchange_props(
                exchanges,
                exchange_code,
                updated_properties,
              );
            }
          } catch (error: any) {
            logger.error(
                error.message ||
                `Unable to get exchange rate: ${exchange.code}`
            );

            return exchange;
          }
        });
  
        await Promise.all(promise);
        await update_ticker(symbol, { exchanges: updated_exchanges });
      } catch (error) {
        logger.error(`Error processing pair code ${symbol}:`, error);
      }
    }
  
    return ApiResponse.success(
      res,
      `Successful`,
      { symbols }
    );
};

export const update_prices = async (req: any, res: any) => {
      // get rates from monierate api
  const symbols = ticker_symbols;
  const prices = await get_ticker_average_price(symbols);
  console.log(prices);

  const rates: any = [];
  await Promise.all(symbols.map(async (symbol) => {
    const price = prices[symbol];

    try {
      // insert new rate to rates collection
      const add_price = await add_new_price({
        ticker: symbol,
        price: price.average,
        market: 'exchanges',
      });

      rates.push(add_price);
    } catch (error: any) {
      logger.info(`Unable to add price for ${symbol} to database: ${error.message}`);
    }
  }));

  return ApiResponse.success(
    res,
    'Successful',
    {
      rates,
    },
  );
}

export const update_tickers = async (req: any, res: any) => {
    const symbols = ticker_symbols;
  
    const rates: any = [];
    await Promise.all(symbols.map(async (symbol) => {
      // get most recent rate
      const price = await get_recent_price(symbol);
      const price_1hr = await get_last_hour_price(symbol);
      const price_24hr = await get_last_day_price(symbol);
      const price_7d = await get_last_week_price(symbol);
      const price_30d = await get_last_month_price(symbol);
  
      const price_change_percent_1hr = percentage_difference(price, price_1hr);
      const price_change_percent_24hr = percentage_difference(price, price_24hr);
      const price_change_percent_7d = percentage_difference(price, price_7d);
      const price_change_percent_30d = percentage_difference(price, price_30d);
  
      try {
        await update_ticker(symbol, {
          price,
          price_1hr,
          price_24hr,
          price_7d,
          price_30d,
  
          price_change_percent_1hr,
          price_change_percent_24hr,
          price_change_percent_7d,
          price_change_percent_30d,
        });
  
        rates.push({
          symbol,
          price,
          price_1hr,
          price_24hr,
          price_7d,
          price_30d,
  
          price_change_percent_1hr,
          price_change_percent_24hr,
          price_change_percent_7d,
          price_change_percent_30d,
        });
      } catch (error: any) {
        logger.error(error.message || `Unable to update ${symbol} ticker`);
      }
    }));
  
    return ApiResponse.success(
      res,
      'Successful',
      {
        rates,
      },
    );
};
  