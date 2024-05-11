import { forEach } from "lodash";
import Binance from "../../integrations/binance/binance";
import logger from "../../logger/logger";
import ApiResponse from "../../utils/api-response";
import { get_ticker, update_ticker } from "../tickers/ticker.service";
import { CoinbaseMethods } from "../../integrations/coinbase/coinbase";
import { BybitMethods } from "../../integrations/bybit/bybit";
import { BlockchainMethods } from "../../integrations/blockchain/blockchain";
import { bitfinex_get_btc_price } from "../../integrations/api-connector";

export const update_btc_usd_ticker = async (req: any, res: any) => {

    // get all exchanges of btc-usd
    const ticker = await get_ticker('btc-usd');
    let exchanges = ticker.exchanges;

    // retrieve new rates from each ticker
    const exchangeRates = [
        {
            exchange: 'binance',
            price: Binance.getSpotRates('BTCUSDT')
        },
        {
            exchange: 'coinbase',
            price: CoinbaseMethods.get_prices('BTC-USD')
        },
        {
            exchange: 'bybit',
            price: BybitMethods.get_price('BTCUSDT')
        },
        {
            exchange: 'blockchain',
            price: BlockchainMethods.get_btc_price('USD')
        },
        {
            exchange: 'bitfinex',
            price: bitfinex_get_btc_price('USD')
        }
    ];
    
    await Promise.all(exchangeRates.map(async (value) => {
        try {
            const rate: any = await value.price;
            const exchange_code = value.exchange.toLowerCase();

            let index = exchanges.findIndex((ex: any) => ex.code === exchange_code);
            if (index !== -1) {
                logger.info(
                    `index: ${index} | exchange: ${exchange_code} | buy: ${rate.buy} | sell: ${rate.sell}`
                );

                let exchange = exchanges[index];
                if (exchange.code) {
                    exchanges.splice(index, 1);

                    exchange.price = rate.buy;
                    exchange.price_sell = rate.sell;
                    exchanges.push(exchange);
                } 
            }
        } 
        catch(e: any) {
            return;
        }
        
    }));

    await update_ticker('btc-usd', { exchanges });

    return ApiResponse.success(
        res,
        'Successful',
        { exchanges }
    );
}