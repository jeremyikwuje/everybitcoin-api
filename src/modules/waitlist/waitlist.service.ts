import { NOT_FOUND } from 'http-status';
import APIError from '../../utils/api-error';
import Waitlist from './waitlist.model';

import { generateFromEmail } from 'unique-username-generator';

export const addUserToWaitlist = async (
  email: string,
  ip: string,
  country:string,
  device:string,
) => {
  try {

    // generate unique username
    let referralCode = generateFromEmail(email);

    while(true) {
      // if username does not exist
      const existingUser = await Waitlist.findOne({ referralCode });
      if (!existingUser) {
        break;
      }

      referralCode = generateFromEmail(email);
    }

    // Create a new waitlist entry
    const waitlistEntry = new Waitlist({
      email,
      ip,
      country,
      device,
      referralCode
    });

    // Save the waitlist entry to the database
    await waitlistEntry.save();

    return waitlistEntry;
  } catch (error: any) {
    throw new APIError(error.message);
  }
};
