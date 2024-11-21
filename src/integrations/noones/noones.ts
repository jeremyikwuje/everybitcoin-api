import axios from 'axios';
import NodeCache from 'node-cache';
import Config from '../../config/config';

const myCache = new NodeCache({ stdTTL: 5 * 24 * 60 * 60, checkperiod: 120 });

// Method to get the access token
async function getAccessToken(): Promise<string> {
  const url = 'https://auth.noones.com/oauth2/token'; // replace with your actual auth url
  const data: any = {
    grant_type: 'client_credentials',
    client_id: Config.noones.CLIENT_ID,
    client_secret: Config.noones.CLIENT_SECRET,
  };

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  try {
    const access_token: any = myCache.get('noones_access_token');
    if (!access_token) {
      const response = await axios.post(url, new URLSearchParams(data).toString(), { headers });
      myCache.set('noones_access_token', response.data.access_token);
      return response.data.access_token;
    }

    return access_token;
  } catch (error) {
    console.error(`Error in getAccessToken: ${error}`);
    throw error;
  }
}

// method to make a request to other endpoints
async function makeRequest(endpoint: string, accessToken: string): Promise<any> {
  const url = `https://api.noones.com/noones/v1${endpoint}`; // replace with your actual service url
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  try {
    const response = await axios.post(url, {}, { headers });
    return response.data;
  } catch (error) {
    console.error(`Error in makeRequest: ${error}`);
    throw error;
  }
}

// get naira rate
async function getRates() {
  const accessToken = await getAccessToken();
  const payload = await makeRequest('/currency/rates', accessToken);
  return payload.data;
}

export const NoonesMethods = {
  getRates,
};
