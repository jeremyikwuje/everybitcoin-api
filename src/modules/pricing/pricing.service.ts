import mongoose from 'mongoose';
import APIError from '../../utils/api-error';
import Pricing from './pricing.model'; // Adjust the import path as necessary
import { IPricing } from './pricing.enums';

// Get all pricing records
export async function get_all_pricing(is_active: boolean = true): Promise<any> {
  try {
    const pricing_records = await Pricing.find({ is_active });
    return pricing_records;
  } catch (error: any) {
    throw new APIError(`Error fetching pricing records: ${error.message}`);
  }
}

// Get a single pricing record by either _id or code
export async function get_pricing(identifier: string) {
  let query = {};

  if (mongoose.Types.ObjectId.isValid(identifier)) {
    query = { _id: identifier };
  } else {
    query = { code: identifier };
  }

  try {
    const pricing_record = await Pricing.findOne(query);
    if (!pricing_record) {
      throw new APIError('Pricing record not found');
    }
    return pricing_record;
  } catch (error: any) {
    throw new APIError(error.message || 'Error fetching pricing record');
  }
}

export async function create_pricing(data: IPricing): Promise<any> {
  try {
    const exising_pricing = await Pricing.findOne({ code: data.code });
    if (exising_pricing) {
      throw new APIError('Pricing record with this code already exists');
    }

    const pricing = new Pricing(data);
    const new_pricing = await pricing.save();
    return new_pricing;
  } catch (error: any) {
    throw new APIError(error.message || 'Error creating pricing record');
  }
}

// Update a pricing record by _id
export async function update_pricing(identifier: string, update_data: any): Promise<any> {
  let query = {};

  if (mongoose.Types.ObjectId.isValid(identifier)) {
    query = { _id: identifier };
  } else {
    query = { code: identifier };
  }

  try {
    const updated_pricing = await Pricing.findOneAndUpdate(
      query,
      update_data,
      {
        new: true,
      },
    );
    if (!updated_pricing) {
      throw new APIError('Pricing record not found');
    }
    return updated_pricing;
  } catch (error: any) {
    throw new APIError(error.message || 'Error updating pricing record');
  }
}

// Delete a pricing record by _id
export async function delete_pricing(identifier: string): Promise<any> {
  const pricing = await get_pricing(identifier);

  try {
    const deleted_pricing = await Pricing.deleteOne({ _id: pricing._id });
    if (!deleted_pricing) {
      throw new APIError('Pricing record not found');
    }

    return true;
  } catch (error: any) {
    throw new APIError(
      `Error deleting pricing record: ${error.message}`,
    );
  }
}
