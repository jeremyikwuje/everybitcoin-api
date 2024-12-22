import mongoose from 'mongoose';
import { IFundingRound, IFundingType } from './funding.enums';
import FundingRounds from './models/funding.round.model';
import FundingTypes from './models/funding.type.model';

export const get_funding_round = async (round_id: string) => {
  if (!mongoose.Types.ObjectId.isValid(round_id)) {
    throw new Error('Invalid funding round id');
  }

  const funding_round = await FundingRounds.findById(round_id);
  if (!funding_round) {
    throw new Error('No funding record found');
  }

  return funding_round;
};

export const get_funding_rounds = async (
  match: object,
  limit: number,
  skip: number,
) => {
  try {
    const funding_rounds = await
    FundingRounds.find(match)
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    return funding_rounds;
  } catch (e: any) {
    throw new Error(e.message || 'Unable to get funding rounds');
  }
};

export const create_funding_round = async (entry: IFundingRound) => {
  try {
    const funding_round = await FundingRounds.create(entry);
    if (!funding_round) {
      throw new Error('Unable to create funding round');
    }

    return funding_round;
  } catch (e: any) {
    throw new Error(e.message || 'Unable to create funding round');
  }
};

export const update_funding_round = async (
  round_id: string,
  entry: IFundingRound,
) => {
  try {
    await get_funding_round(round_id);

    const funding_round = await FundingRounds.findByIdAndUpdate(
      round_id,
      entry,
      {
        new: true,
      },
    );

    if (!funding_round) {
      throw new Error('Unable to update funding round');
    }

    return funding_round;
  } catch (e: any) {
    throw new Error(e.message || 'Unable to update funding round');
  }
};

export const delete_funding_round = async (round_id: string) => {
  try {
    await get_funding_round(round_id);

    const delete_round = await FundingRounds.deleteOne({ _id: round_id });
    if (!delete_round) {
      throw new Error('Unable to delete funding round');
    }

    return delete_round;
  } catch (e: any) {
    throw new Error(e.message || 'Unable to delete funding round');
  }
};

export const remove_investor_from_funding_round = async (
  round_id: string,
  investor_id: string,
) => {
  try {
    const funding_round = await FundingRounds.findByIdAndUpdate(
      round_id,
      {
        $pull: {
          investors: investor_id,
        },
      },
    );

    if (!funding_round) {
      throw new Error('Unable to remove investor from funding round');
    }

    return funding_round;
  } catch (e: any) {
    throw new Error(e.message || 'Unable to remove investor from funding round');
  }
};

export const remove_funding_type_from_funding_round = async (
  round_id: string,
  type_id: string,
) => {
  try {
    const funding_round = await FundingRounds.findByIdAndUpdate(
      round_id,
      {
        $pull: {
          types: type_id,
        },
      },
    );

    if (!funding_round) {
      throw new Error('Unable to remove funding type from funding round');
    }

    return funding_round;
  } catch (e: any) {
    throw new Error(e.message || 'Unable to remove equity type from funding round');
  }
};

export const remove_data_source_from_funding_round = async (
  round_id: string,
  source_id: string,
) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(round_id)) {
      throw new Error('Invalid funding round id');
    }

    if (!mongoose.Types.ObjectId.isValid(source_id)) {
      throw new Error('Invalid funding source id');
    }

    const funding_round = await FundingRounds.findByIdAndUpdate(
      round_id,
      {
        $pull: {
          data_sources: source_id,
        },
      },
    );

    if (!funding_round) {
      throw new Error('Unable to remove data source from funding round');
    }

    return funding_round;
  } catch (e: any) {
    throw new Error(e.message || 'Unable to remove data source from funding round');
  }
};

export const create_funding_type = async (entry: IFundingType) => {
  try {
    const funding_type = await FundingTypes.create(entry);
    if (!funding_type) {
      throw new Error('Unable to create funding type');
    }

    return funding_type;
  } catch (e: any) {
    throw new Error(e.message || 'Unable to create funding type');
  }
};

export const get_funding_types = async () => {
  try {
    const funding_types = await FundingTypes.find({});
    return funding_types;
  } catch (e: any) {
    throw new Error(e.message || 'Unable to get funding types');
  }
};

export const get_funding_type = async (type_id: string) => {
  if (!mongoose.Types.ObjectId.isValid(type_id)) {
    throw new Error('Invalid funding round id');
  }

  const funding_type = await FundingTypes.findById(type_id);
  if (!funding_type) {
    throw new Error('No funding type record found');
  }

  return funding_type;
};

export const update_funding_type = async (
  type_id: string,
  entry: IFundingType,
) => {
  try {
    await get_funding_type(type_id);

    const funding_type = await FundingTypes.findByIdAndUpdate(
      type_id,
      entry,
      {
        new: true,
      },
    );

    if (!funding_type) {
      throw new Error('Unable to update funding type');
    }

    return funding_type;
  } catch (e: any) {
    throw new Error(e.message || 'Unable to update funding type');
  }
};
