import Axios from 'axios';
import Config from '../../config/config';
import { AxiosInterceptors } from '../../utils/axios-interceptor';
import APIError from '../../utils/api-error';
import logger from '../../utils/logger';
import { cent_to_dollar } from '../../utils/utilities';
import { PaymentChannelResponse, RequestState } from '../../constants';

const axios = Axios.create({
  baseURL: Config.flutterwave.base_url,
  headers: {
    Authorization: `Bearer ${Config.flutterwave.secret_key}`,
  },
});

axios.interceptors.response.use(...AxiosInterceptors);

interface IPayment {
  email: string,
  reference: string;
  amount: number;
  callback_url: string;
  currency: string;
  plan?: string;
  channels?: any;
  invoice_limit?: number;
  metadata?: any;
}

export class Paystack {
  static create_payment = async (data: IPayment) => {
    try {
      console.log(data);
      const response = await axios.post('/transaction/initialize', data);
      return response.data.data;
    } catch (error: any) {
      logger.error(error.message || 'Error creating payment');
      throw new APIError(
        'Error creating payment',
        error.statusCode || 500,
        error.error || 'Error creating payment',
      );
    }
  };

  static get_payment = async (ref: string) => {
    try {
      const endpoint = `/transaction/verify/${ref}`;
      const response = await axios.get(endpoint);
      return response.data.data;
    } catch (error: any) {
      logger.error(error.message || 'Error creating payment');
      throw new APIError(
        'Error getting payment with reference',
        error.statusCode || 500,
      );
    }
  };

  static verify_payment = async (
    reference: string,
  ): Promise<PaymentChannelResponse> => {
    try {
      let status = RequestState.Pending;
      const payment = await this.get_payment(reference);
      if (payment.status) {
        if (
          payment.status === RequestState.Successful
        ) {
          status = RequestState.Successful;
        } else if (['failed', 'error'].includes(payment.status)) {
          status = RequestState.Failed;
        }
      }
      const amount = cent_to_dollar(payment.amount || 0);
      const channel_reference = payment.id || reference;

      return {
        status,
        amount,
        channel_reference,
        channel_response: payment,
      };
    } catch (error: any) {
      throw new APIError(
        error.message || 'Error verifying payment',
        error.statusCode || 500,
      );
    }
  };
}
