import axios from "axios";
import logger from "../../logger/logger";
import APIError from "../../utils/api-error";
import { BAD_REQUEST } from "http-status";

const COINBASE_API_URL = 'https://api.coinbase.com/v2/';

type ORDER_TYPE = 'spot' | 'buy' | 'sell';

export const request_coinbase_api = async (
    endpoint: string,
    method: string,
    data: object = {}
) => {

    const url = `${COINBASE_API_URL}${endpoint}`;

    try {
        const response = await axios({
            url,
            method,
            data,
        });

        return response.data;
    } catch (e: any) {

        let error: any = {};

        if (e.response) {
            error = e.response.data.errors;
        }
        else if (e.request) {
            error = {
                message: 'Unable to connect to Coinbase API'
            }
        }

        logger.error(e);

        return error;
    }
}

export const get_price_data = async (
    ticker_symbol: string, 
    order: ORDER_TYPE = 'spot') => {

    const price_data = await request_coinbase_api(
        `prices/${ticker_symbol.toUpperCase()}/${order}`,
        'GET'
    );

    if (price_data.error) {
        throw new APIError(
            price_data.error.message || 'Unable to retrieve price data',
            BAD_REQUEST
        )
    }

    return {
        price: price_data.data.amount,
        base: price_data.data.base,
        currency: price_data.data.currency,
    };
}

export const get_prices = async (ticker_symbol: string) => {

    const prices = await Promise.all([
        get_price_data(ticker_symbol, 'buy'),
        get_price_data(ticker_symbol,'sell'),
    ]);

    return {
        buy: prices[1].price,
        sell: prices[0].price,
    }
}

export const CoinbaseMethods = {
    get_price_data,
    get_prices,
}

