import Stripe from 'stripe';
import Config from '../../config/config';
import logger from '../../logger/logger';
import APIError from '../../utils/api-error';
import { cent_to_dollar } from '../../utils/utilities';
import { PaymentChannelResponse, RequestState } from '../../constants';

const stripe = new Stripe(Config.stripe.secret_key);

interface IPayment {
  title: string;
  description: string;
  amount: number;
  currency: string;
  client_reference: string;
  success_url: string;
  cancel_url: string;
}

const create_payment = async (data: IPayment) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: data.currency,
            product_data: {
              name: data.title,
              description: data.description,
            },
            unit_amount: data.amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      client_reference_id: data.client_reference,
      success_url: data.success_url,
      cancel_url: data.cancel_url,
    });

    return session;
  } catch (error: any) {
    logger.error(error.message || 'Error creating payment');

    throw new APIError(
      'Error creating payment',
      error.statusCode || 500,
      error.error || 'Error creating payment',
    );
  }
};

const get_payment = async (ref: string) => {
  try {
    const payment = await stripe.checkout.sessions.retrieve(ref);
    return payment;
  } catch (error: any) {
    logger.error(error.message || 'Error getting payment');
    throw new APIError(
      'Error getting payment with reference',
      error.statusCode || 500,
    );
  }
};

const verify_payment = async (
  reference: string,
): Promise<PaymentChannelResponse> => {
  try {
    let status = RequestState.Pending;

    const payment = await get_payment(reference);
    const amount = cent_to_dollar(payment.amount_total || 0);
    const channel_reference = payment.id;

    if (
      payment.payment_status === 'paid'
      && payment.status === 'complete'
    ) {
      status = RequestState.Successful;
    } else if (
      payment.status === 'expired'
      && payment.payment_status === 'unpaid'
    ) {
      status = RequestState.Failed;
    }

    return {
      status,
      amount,
      channel_reference,
      channel_response: payment,
    };
  } catch (error: any) {
    logger.error(error.message || 'Error verifying payment');
    throw new APIError(
      'Error verifying payment',
      error.statusCode || 500,
      error.error || 'Error verifying payment',
    );
  }
};

export const StripeMethods = {
  create_payment,
  get_payment,
  verify_payment,
};
