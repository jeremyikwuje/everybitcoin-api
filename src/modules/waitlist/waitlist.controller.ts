import APIError from '../../utils/api-error';
import ApiResponse from '../../utils/api-response';
import Waitlist from './waitlist.model';
import { addUserToWaitlist } from './waitlist.service';

export const add = async (req: any, res: any) => {
  try {
    const {
      email,
      ip,
      country,
      device,
    } = req.body;

    // Check if the user already exists in the waitlist
    const existingUser = await Waitlist.findOne({ email });
    if (existingUser) {
      return ApiResponse.success(
        res,
        `You're already on the waitlist`,
        { existingUser }
      );
    }

    const result = await addUserToWaitlist(
      email,
      ip,
      country,
      device,
    );

    return ApiResponse.success(
      res,
      'User added to waitlist successfully',
      result,
    );
  } catch (error: any) {
    throw new APIError(error.message);
  }
};

export const getAllMembers = async (req: any, res: any) => {
  try {
    const members = await Waitlist.find().sort('createdAt');
    // get the total number of people in the queue
    const count = await Waitlist.countDocuments();

    return ApiResponse.success(
      res,
      'Retrieved waitlist',
      { count, members }
    );
  } catch (error) {
    return ApiResponse.error(res, 500, 'Error retrieving waitlist');
  }
};
