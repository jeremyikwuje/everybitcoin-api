export const ticker_symbols = [
  'BTC-USD', // United States
  'BTC-EUR', // European Union
  'BTC-JPY', // Japan
  'BTC-GBP', // United Kingdom
  'BTC-AUD', // Australia
  'BTC-CAD', // Canada
  'BTC-CNY', // China
  'BTC-INR', // India
  'BTC-BRL', // Brazil
  'BTC-ZAR', // South Africa
  'BTC-TRY', // Turkey
  'BTC-CHF', // Switzerland
  'BTC-SEK', // Sweden
  'BTC-NZD', // New Zealand
  'BTC-PLN', // Poland
  'BTC-NGN', // Nigeria
  'BTC-ARS', // Argentina
  'BTC-NOK', // Norway
  'BTC-TWD', // Taiwan
  'BTC-EGP', // Egypt
  'BTC-COP', // Colombia
  'BTC-THB', // Thailand
  'BTC-MYR', // Malaysia
  'BTC-CLP', // Chile
  'BTC-PKR', // Pakistan
  'BTC-RON', // Romania
  'BTC-CZK', // Czech Republic
  'BTC-PHP', // Philippines
  'BTC-VND', // Vietnam
  'BTC-BDT', // Bangladesh
  'BTC-HUF', // Hungary
  'BTC-PER', // Peru
  'BTC-GHS', // Ghana
  'BTC-ILS', // Israel
  'BTC-DKK', // Denmark
  'BTC-KWD', // Kuwait
  'BTC-QAR', // Qatar
  'BTC-OMR', // Oman
  'BTC-BHD', // Bahrain
  'BTC-AED', // United Arab Emirates
  'BTC-SGD', // Singapore
  'BTC-HKD', // Hong Kong
  'BTC-UAH', // Ukraine
  'BTC-KES', // Kenya
  'BTC-UGX', // Uganda
];

export interface tickerExchangeDTO {
  code?: string;
  name?: string;
  price?: number;
  price_sell?: number;
  price_1hr?: number;
  price_change_percent_1hr?: number;
  price_24hr?: number;
  price_change_percent_24hr?: number;
  price_7d?: number;
  price_change_percent_7d?: number;
  price_30d?: number;
  price_change_percent_30d?: number;
  price_change_90d?: number;
  price_change_percent_90d?: number;
  price_change_180d?: number;
  price_change_percent_180d?: number;
  price_change_1yr?: number;
  price_change_percent_1yr?: number;
  updated_at?: Date;
}

export interface tickerDTO {
  symbol?: string;
  is_active?: boolean;
  exchanges?: any;
  price?: number;
  price_change_30min?: number;
  price_change_percent_30min?: number;
  price_1hr?: number;
  price_change_percent_1hr?: number;
  price_24hr?: number;
  price_change_percent_24hr?: number;
  price_7d?: number;
  price_change_percent_7d?: number;
  price_30d?: number;
  price_change_percent_30d?: number;
  price_change_60d?: number;
  price_change_percent_60d?: number;
  price_change_90d?: number;
  price_change_percent_90d?: number;
  price_change_180d?: number;
  price_change_percent_180d?: number;
  price_change_1yr?: number;
  price_change_percent_1yr?: number;
  price_change_2yr?: number;
  price_change_percent_2yr?: number;
  price_change_3yr?: number;
  price_change_percent_3yr?: number;
  price_change_5yr?: number;
  price_change_percent_5yr?: number;
  price_change_10yr?: number;
  price_change_percent_10yr?: number;
}
