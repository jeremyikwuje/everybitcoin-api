import axios from 'axios';
import logger from '../../logger/logger';

export async function get_paxful_rate(currency: string = 'NGN') {
  const url = 'https://api.scrapingant.com/v2/general';
  const params = {
    url: `https://paxful.com/rest/v2/currencies/${currency}?transformResponse=camelCase`,
    'x-api-key': 'e1441ba1050741a194cb344ff0f47ce9',
    browser: false,
  };

  try {
    const response = await axios.get(url, { params });
    if (!response.data) {
      return null;
    }

    const payload = response.data;
    return payload.data;
  } catch (error) {
    logger.error(`Error in getPaxfulRate: ${error}`);
    return null;
  }
}
