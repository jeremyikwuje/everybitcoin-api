import axios from "axios";
import logger from "../logger/logger";
import APIError from "../utils/api-error";

const BITFINIX_API_URL = 'https://api-pub.bitfinex.com/v2';


export const request_api = async (
    url: string,
    method: string,
    data: object = {}
) => {

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
            error = e.response.data;
        }
        else if (e.request) {
            error = {
                message: 'Unable to connect to API'
            }
        }

        logger.error(e);

        return { error };
    }
}

export const bitfinex_get_btc_price = async (currency: string) => {

    const symbol = `tBTC${currency}`
    const data = await request_api(
        `${BITFINIX_API_URL}//ticker/${symbol}`,
        'GET'
    );

    if (data.error) {
        throw new APIError(
            `Unable to get Bitcoin price to ${currency}`
        )
    }

    return {
        buy: Number(data[2]),
        sell: Number(data[0]),
    }
}