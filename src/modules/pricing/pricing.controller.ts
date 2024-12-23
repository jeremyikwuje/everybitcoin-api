import ApiResponse from "../../utils/api-response";
import { create_pricing, delete_pricing, get_all_pricing, get_pricing, update_pricing } from "./pricing.service";

export default class PricingController {

  static get_pricing = async (req: any, res: any) => {
    try {
      const pricing = await get_pricing(req.query.id);
      return ApiResponse.success(
        res,
        `Pricing record fetched successfully`,
        pricing
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCode || 500,
        error.message
      );
    }
  }

  static get_all_pricing = async (req: any, res: any) => {
    try {
      const is_active = req.query.is_active === 'true';
      const pricing = await get_all_pricing(is_active);
      return ApiResponse.success(
        res,
        `Pricing records fetched successfully`,
        pricing
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCode || 500,
        error.message
      );
    }
  }

  static create_pricing = async (req: any, res: any) => {
    try {
      const {
        name,
        code,
        price,
        billing_cycle,
        requests_limit_per_month,
        requests_limit_per_minute,
        is_active,
        // Add any other required fields here
      } = req.body;


      const created_pricing = await create_pricing({
        name,
        code,
        price,
        billing_cycle,
        requests_limit_per_month,
        requests_limit_per_minute,
        is_active
      });
      return ApiResponse.success(
        res,
        `Pricing record created successfully`,
        created_pricing
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCode || 500,
        error.message
      );
    }
  };

  static update_pricing = async (req: any, res: any) => {
    try {
      const id = req.query.id;
      const {
        ...data
      } = req.body;
      const updated_pricing = await update_pricing(
        id,
        data
      );
      return ApiResponse.success(
        res,
        `Pricing record updated successfully`,
        updated_pricing
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCode || 500,
        error.message
      );
    }
  };

  static delete_pricing = async (req: any, res: any) => {
    try {
      const identifier = req.query.identifier;
      await delete_pricing(identifier);
      return ApiResponse.success(
        res,
        `Pricing record deleted successfully`,
        {}
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.statusCode || 500,
        error.message
      );
    }
  };
}