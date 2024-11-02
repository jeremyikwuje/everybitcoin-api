import { generateFromEmail } from 'unique-username-generator';
import Waitlist from './waitlist.model';
import logger from '../../logger/logger';

export const add_user_to_waitlist = async (
  email: string,
  ip: string,
  country: string,
  device: string,
) => {
  try {
    // Function to generate a unique referral code
    const generate_unique_referal_code = async (
      email_value: string,
    ): Promise<string> => {
      const referral_code = generateFromEmail(email_value);
      const existing_user = await Waitlist.findOne({ referral_code });
      if (existing_user) {
        return generate_unique_referal_code(email);
      }
      return referral_code;
    };

    // Generate unique referral code
    const referral_code = await generate_unique_referal_code(email);

    // Create a new waitlist entry
    const waitlistEntry = new Waitlist({
      email,
      ip,
      country,
      device,
      referral_code,
    });

    await waitlistEntry.save();

    return waitlistEntry;
  } catch (error: any) {
    logger.error(error);
    throw new Error('Unable to add user to waitlist');
  }
};
