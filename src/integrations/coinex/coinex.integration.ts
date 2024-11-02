import { request_api } from '../api-connector';

export const get_coinex_p2p_average_rate = async (
  base: string = 'USDT',
  quote: string = 'NGN',
  side: string = 'BUY',
) => {
  let base_currency = base;
  const quote_currency = quote;
  let sort = 'DESC';

  if (base_currency === 'USD') {
    base_currency = 'USDT';
  }
  if (side === 'BUY') {
    sort = 'ASC';
  }

  const url = 'https://www.coinex.com/res/p2p/advertising';
  const payload = JSON.stringify({
    adv_type: side,
    base: base_currency.toUpperCase(),
    quote: quote_currency.toUpperCase(),
    amount: 0,
    pay_channel_ids: [],
    sort_by: 'PRICE',
    sort_type: sort,
    user_preferences: [],
    page: 1,
    limit: 45,
  });

  // Add your request logic here, for example using axios
  const response = await request_api(url, 'POST', {
    'Content-Type': 'application/json',
  }, payload);

  if (response.error) {
    return 0;
  }

  const items = response.data.items || [];
  // Filter out merchants with completion rate less than 0.8
  const filtered_items = items.filter(
    (item: any) => item.merchant.completion_rate >= 0.8,
  );

  const prices = filtered_items.map((item: any) => Number(item.price));

  // Calculate the start and end indices for the middle range
  const startIndex = Math.floor(prices.length / 4);
  const endIndex = Math.ceil(prices.length * (3 / 4));

  // Filter the items to include only those within the calculated range
  const middleRangeItems = filtered_items.slice(startIndex, endIndex);

  // Extract prices from the middle range items
  let middleRangePrices = middleRangeItems.map((item: any) => Number(item.price));

  // Limit the middleRangePrices to only 5 prices
  middleRangePrices = middleRangePrices.slice(0, 5);

  const total_prices = middleRangePrices.reduce((sum: number, price: number) => sum + price, 0);
  const average_price = total_prices / middleRangePrices.length;

  return average_price;
};
