import axios from "axios";
import logger from "../logger/logger";

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
            error = e.response.data.errors;
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