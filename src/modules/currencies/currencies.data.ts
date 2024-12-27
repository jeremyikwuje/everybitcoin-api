export enum CurrencyE {
  BTC = 'BTC', // Bitcoin
  SAT = 'SAT', // Satoshi
  USDT = 'USDT', // Tether
  USDC = 'USDC', // USD Coin
  USD = 'USD', // US Dollar
  EUR = 'EUR', // Euro
  JPY = 'JPY', // Japanese Yen
  GBP = 'GBP', // British Pound Sterling
  AUD = 'AUD', // Australian Dollar
  CAD = 'CAD', // Canadian Dollar
  CHF = 'CHF', // Swiss Franc
  CNY = 'CNY', // Chinese Yuan Renminbi
  HKD = 'HKD', // Hong Kong Dollar
  NZD = 'NZD', // New Zealand Dollar
  SGD = 'SGD', // Singapore Dollar
  SEK = 'SEK', // Swedish Krona
  NOK = 'NOK', // Norwegian Krone
  KRW = 'KRW', // South Korean Won
  INR = 'INR', // Indian Rupee
  MXN = 'MXN', // Mexican Peso
  RUB = 'RUB', // Russian Ruble
  ZAR = 'ZAR', // South African Rand
  TRY = 'TRY', // Turkish Lira
  BRL = 'BRL', // Brazilian Real
  TWD = 'TWD', // New Taiwan Dollar
  PLN = 'PLN', // Polish Zloty
  THB = 'THB', // Thai Baht
  IDR = 'IDR', // Indonesian Rupiah
  DKK = 'DKK', // Danish Krone
  MYR = 'MYR', // Malaysian Ringgit
  PHP = 'PHP', // Philippine Peso
  AED = 'AED', // UAE Dirham
  SAR = 'SAR', // Saudi Riyal
  ILS = 'ILS', // Israeli New Shekel
  CZK = 'CZK', // Czech Koruna
  HUF = 'HUF', // Hungarian Forint
  CLP = 'CLP', // Chilean Peso
  PKR = 'PKR', // Pakistani Rupee
  NGN = 'NGN', // Nigerian Naira
  BDT = 'BDT', // Bangladeshi Taka
  EGP = 'EGP', // Egyptian Pound
  COP = 'COP', // Colombian Peso
  VND = 'VND', // Vietnamese Dong
  ARS = 'ARS', // Argentine Peso
  KWD = 'KWD', // Kuwaiti Dinar
  QAR = 'QAR', // Qatari Riyal
  OMR = 'OMR', // Omani Rial
  JOD = 'JOD', // Jordanian Dinar
  KES = 'KES', // Kenyan Shilling
  GHS = 'GHS', // Ghanaian Cedi
  TZS = 'TZS', // Tanzanian Shilling
  UGX = 'UGX', // Ugandan Shilling
  LKR = 'LKR', // Sri Lankan Rupee
  MAD = 'MAD', // Moroccan Dirham
  XAF = 'XAF', // Central African CFA Franc
  XOF = 'XOF', // West African CFA Franc
  BHD = 'BHD', // Bahraini Dinar
  UAH = 'UAH', // Ukrainian Hryvnia
}

export const CurrenciesE = [
  {
    denomination: {
      divisor: 2, code: 'SAT', name: 'Satoshis', symbol: '₿', plural: 'Satoshis', description: 'Satoshis are the smallest unit of Bitcoin',
    },
    decimals: 2,
    code: 'btc',
    symbol: '₿',
    name: 'Bitcoin',
    description: 'Bitcoin is a decentralized digital currency, without a central bank or single administrator, that can be sent from user to user on the peer-to-peer bitcoin network without the need for intermediaries.',
    icon_code: 'bt',
    is_active: true,
  },
  {
    decimals: 0,
    code: 'sat',
    symbol: 'SAT',
    name: 'Satoshi',
    description: 'Bitcoin is a decentralized digital currency, without a central bank or single administrator, that can be sent from user to user on the peer-to-peer bitcoin network without the need for intermediaries.',
    icon_code: 'sat.png',
    is_active: true,
  },
  {
    denomination: { divisor: 2 },
    decimals: 2,
    code: 'usdt',
    symbol: '₮',
    name: 'Tether',
    description: 'Tether is a stablecoin that aims to keep cryptocurrency valuations stable. It is used by investors who want to avoid the volatility of other cryptocurrencies while keeping value within the crypto market.',
    icon_code: 'us',
    is_active: true,
  },
  {
    denomination: { divisor: 2 },
    decimals: 2,
    code: 'usdc',
    symbol: 'USDC',
    name: 'USD Coin',
    description: 'USD Coin (USDC) is a type of cryptocurrency that is referred to as a stablecoin. You can always redeem 1 USD Coin for US$1.00, giving it a stable price.',
    icon_code: 'us',
    is_active: true,

  },
  {
    denomination: { divisor: 2 },
    decimals: 2,
    code: 'usd',
    symbol: '$',
    name: 'United States Dollar',
    description: "United States Dollars is the official currency of the United States, commonly abbreviated as USD. It's the primary form of currency used for transactions within the United States and is also widely accepted in international trade and finance.",
    icon_code: 'us',
    is_active: true,

  },
  {
    denomination: { divisor: 2 },
    decimals: 2,
    code: 'eur',
    symbol: '€',
    name: 'Euro',
    description: 'The Euro is the official currency of the Eurozone, which consists of 19 of the 27 member states of the European Union. It is the second most traded currency in the world.',
    icon_code: 'eu',
    is_active: true,

  },
  {
    denomination: { divisor: 2 },
    decimals: 2,
    code: 'jpy',
    symbol: '¥',
    name: 'Japanese Yen',
    description: 'The Japanese Yen is the official currency of Japan. It is the third most traded currency in the foreign exchange market after the United States Dollar and the Euro.',
    icon_code: 'jp',
    is_active: true,

  },
  {
    denomination: { divisor: 2 },
    decimals: 2,
    code: 'gbp',
    symbol: '£',
    name: 'British Pound Sterling',
    description: 'The British Pound Sterling is the official currency of the United Kingdom. It is the fourth most traded currency in the foreign exchange market.',
    icon_code: 'gb',
    is_active: true,

  },
  {
    denomination: { divisor: 2 },
    decimals: 2,
    code: 'aud',
    symbol: 'A$',
    name: 'Australian Dollar',
    description: 'The Australian Dollar is the official currency of Australia. It is the fifth most traded currency in the world foreign exchange markets.',
    icon_code: 'au',
    is_active: true,

  },
  {
    denomination: { divisor: 2 },
    decimals: 2,
    code: 'cad',
    symbol: 'C$',
    name: 'Canadian Dollar',
    description: 'The Canadian Dollar is the official currency of Canada. It is the fifth most held reserve currency in the world, behind the US Dollar, the Euro, the Yen, and the Pound Sterling.',
    icon_code: 'ca',
    is_active: true,

  },
  {
    denomination: { divisor: 2 },
    decimals: 2,
    code: 'chf',
    symbol: 'CHF',
    name: 'Swiss Franc',
    description: 'The Swiss Franc is the official currency of Switzerland and Liechtenstein. It is considered a safe-haven currency due to the stability of the Swiss government and financial system.',
    icon_code: 'ch',
    is_active: true,

  },
  {
    denomination: { divisor: 2 },
    decimals: 2,
    code: 'cny',
    symbol: '¥',
    name: 'Chinese Yuan Renminbi',
    description: "The Chinese Yuan Renminbi is the official currency of the People's Republic of China. It is the eighth most traded currency in the world.",
    icon_code: 'cn',
    is_active: true,

  },
  {
    denomination: { divisor: 2 },
    decimals: 2,
    code: 'hkd',
    symbol: 'HK$',
    name: 'Hong Kong Dollar',
    description: 'The Hong Kong Dollar is the official currency of Hong Kong. It is the thirteenth most traded currency in the world.',
    icon_code: 'hk',
    is_active: true,

  },
  {
    denomination: { divisor: 2 },
    decimals: 2,
    code: 'nzd',
    symbol: 'NZ$',
    name: 'New Zealand Dollar',
    description: 'The New Zealand Dollar is the official currency of New Zealand. It is the tenth most traded currency in the world.',
    icon_code: 'nz',
    is_active: true,

  },
  {
    denomination: { divisor: 2 },
    decimals: 2,
    code: 'sgd',
    symbol: 'S$',
    name: 'Singapore Dollar',
    description: 'The Singapore Dollar is the official currency of Singapore. It is the thirteenth most traded currency in the world.',
    icon_code: 'sg',
    is_active: true,

  },
  {
    denomination: { divisor: 2 },
    decimals: 2,
    code: 'sek',
    symbol: 'kr',
    name: 'Swedish Krona',
    description: 'The Swedish Krona is the official currency of Sweden. It is the eleventh most traded currency in the world.',
    icon_code: 'se',
    is_active: true,

  },
  {
    denomination: { divisor: 2 },
    decimals: 2,
    code: 'nok',
    symbol: 'kr',
    name: 'Norwegian Krone',
    description: 'The Norwegian Krone is the official currency of Norway. It is the fourteenth most traded currency in the world.',
    icon_code: 'no',
    is_active: true,

  },
  {
    denomination: { divisor: 2 },
    decimals: 2,
    code: 'krw',
    symbol: '₩',
    name: 'South Korean Won',
    description: 'The South Korean Won is the official currency of South Korea. It is the twelfth most traded currency in the world.',
    icon_code: 'kr',
    is_active: true,

  },
  {
    denomination: { divisor: 2 },
    decimals: 2,
    code: 'inr',
    symbol: '₹',
    name: 'Indian Rupee',
    description: 'The Indian Rupee is the official currency of India. It is the twentieth most traded currency in the world.',
    icon_code: 'in',
    is_active: true,

  },
  {
    denomination: { divisor: 2 },
    decimals: 2,
    code: 'mxn',
    symbol: '$',
    name: 'Mexican Peso',
    description: 'The Mexican Peso is the official currency of Mexico. It is the fifteenth most traded currency in the world.',
    icon_code: 'mx',
    is_active: true,

  },
  {
    denomination: { divisor: 2 },
    decimals: 2,
    code: 'rub',
    symbol: '₽',
    name: 'Russian Ruble',
    description: 'The Russian Ruble is the official currency of Russia. It is the seventeenth most traded currency in the world.',
    icon_code: 'ru',
    is_active: true,

  },
  {
    denomination: { divisor: 2 },
    decimals: 2,
    code: 'zar',
    symbol: 'R',
    name: 'South African Rand',
    description: 'The South African Rand is the official currency of South Africa. It is the eighteenth most traded currency in the world.',
    icon_code: 'za',
    is_active: true,

  },
  {
    denomination: { divisor: 2 },
    decimals: 2,
    code: 'try',
    symbol: '₺',
    name: 'Turkish Lira',
    description: 'The Turkish Lira is the official currency of Turkey. It is the nineteenth most traded currency in the world.',
    icon_code: 'tr',
    is_active: true,

  },
  {
    denomination: { divisor: 2 },
    decimals: 2,
    code: 'brl',
    symbol: 'R$',
    name: 'Brazilian Real',
    description: 'The Brazilian Real is the official currency of Brazil. It is the twenty-first most traded currency in the world.',
    icon_code: 'br',
    is_active: true,

  },
  {
    denomination: { divisor: 2 },
    decimals: 2,
    code: 'twd',
    symbol: 'NT$',
    name: 'New Taiwan Dollar',
    description: 'The New Taiwan Dollar is the official currency of Taiwan. It is the twenty-second most traded currency in the world.',
    icon_code: 'tw',
    is_active: true,

  },
  {
    denomination: { divisor: 2 },
    decimals: 2,
    code: 'pln',
    symbol: 'zł',
    name: 'Polish Zloty',
    description: 'The Polish Zloty is the official currency of Poland. It is the twenty-third most traded currency in the world.',
    icon_code: 'pl',
    is_active: true,

  },
  {
    denomination: { divisor: 2 },
    decimals: 2,
    code: 'thb',
    symbol: '฿',
    name: 'Thai Baht',
    description: 'The Thai Baht is the official currency of Thailand. It is the twenty-fourth most traded currency in the world.',
    icon_code: 'th',
    is_active: true,

  },
  {
    denomination: { divisor: 2 },
    decimals: 2,
    code: 'idr',
    symbol: 'Rp',
    name: 'Indonesian Rupiah',
    description: 'The Indonesian Rupiah is the official currency of Indonesia. It is the twenty-fifth most traded currency in the world.',
    icon_code: 'id',
    is_active: true,

  },
  {
    denomination: { divisor: 2 },
    decimals: 2,
    code: 'dkk',
    symbol: 'kr',
    name: 'Danish Krone',
    description: 'The Danish Krone is the official currency of Denmark. It is the twenty-sixth most traded currency in the world.',
    icon_code: 'dk',
    is_active: true,

  },
  {
    denomination: { divisor: 2 },
    decimals: 2,
    code: 'myr',
    symbol: 'RM',
    name: 'Malaysian Ringgit',
    description: 'The Malaysian Ringgit is the official currency of Malaysia. It is the twenty-seventh most traded currency in the world.',
    icon_code: 'my',
    is_active: true,

  },
  {
    denomination: { divisor: 2 },
    decimals: 2,
    code: 'php',
    symbol: '₱',
    name: 'Philippine Peso',
    description: 'The Philippine Peso is the official currency of the Philippines. It is the twenty-eighth most traded currency in the world.',
    icon_code: 'ph',
    is_active: true,

  },
  {
    denomination: { divisor: 2 },
    decimals: 2,
    code: 'aed',
    symbol: 'د.إ',
    name: 'UAE Dirham',
    description: 'The UAE Dirham is the official currency of the United Arab Emirates. It is the twenty-ninth most traded currency in the world.',
    icon_code: 'ae',
    is_active: true,

  },
  {
    denomination: { divisor: 2 },
    decimals: 2,
    code: 'sar',
    symbol: '﷼',
    name: 'Saudi Riyal',
    description: 'The Saudi Riyal is the official currency of Saudi Arabia. It is the thirtieth most traded currency in the world.',
    icon_code: 'sa',
    is_active: true,

  },
  {
    denomination: { divisor: 2 },
    decimals: 2,
    code: 'ils',
    symbol: '₪',
    name: 'Israeli New Shekel',
    description: 'The Israeli New Shekel is the official currency of Israel. It is the thirty-first most traded currency in the world.',
    icon_code: 'il',
    is_active: true,

  },
  {
    denomination: { divisor: 2 },
    decimals: 2,
    code: 'czk',
    symbol: 'Kč',
    name: 'Czech Koruna',
    description: 'The Czech Koruna is the official currency of the Czech Republic. It is the thirty-second most traded currency in the world.',
    icon_code: 'cz',
    is_active: true,

  },
  {
    denomination: { divisor: 2 },
    decimals: 2,
    code: 'huf',
    symbol: 'Ft',
    name: 'Hungarian Forint',
    description: 'The Hungarian Forint is the official currency of Hungary. It is the thirty-third most traded currency in the world.',
    icon_code: 'hu',
    is_active: true,

  },
  {
    denomination: { divisor: 2 },
    decimals: 2,
    code: 'clp',
    symbol: '$',
    name: 'Chilean Peso',
    description: 'The Chilean Peso is the official currency of Chile. It is the thirty-fourth most traded currency in the world.',
    icon_code: 'cl',
    is_active: true,

  },
  {
    denomination: { divisor: 2 },
    decimals: 2,
    code: 'pkr',
    symbol: '₨',
    name: 'Pakistani Rupee',
    description: 'The Pakistani Rupee is the official currency of Pakistan. It is the thirty-fifth most traded currency in the world.',
    icon_code: 'pk',
    is_active: true,

  },
  {
    denomination: { divisor: 2 },
    decimals: 2,
    code: 'ngn',
    symbol: '₦',
    name: 'Nigerian Naira',
    description: 'The Nigerian Naira is the official currency of Nigeria. It is the thirty-sixth most traded currency in the world.',
    icon_code: 'ng',
    is_active: true,

  },
  {
    denomination: { divisor: 2 },
    decimals: 2,
    code: 'bdt',
    symbol: '৳',
    name: 'Bangladeshi Taka',
    description: 'The Bangladeshi Taka is the official currency of Bangladesh. It is the thirty-seventh most traded currency in the world.',
    icon_code: 'bd',
    is_active: true,

  },
  {
    denomination: { divisor: 2 },
    decimals: 2,
    code: 'egp',
    symbol: '£',
    name: 'Egyptian Pound',
    description: 'The Egyptian Pound is the official currency of Egypt. It is the thirty-eighth most traded currency in the world.',
    icon_code: 'eg',
    is_active: true,

  },
  {
    denomination: { divisor: 2 },
    decimals: 2,
    code: 'cop',
    symbol: '$',
    name: 'Colombian Peso',
    description: 'The Colombian Peso is the official currency of Colombia. It is the thirty-ninth most traded currency in the world.',
    icon_code: 'co',
    is_active: true,

  },
  {
    denomination: { divisor: 2 },
    decimals: 2,
    code: 'vnd',
    symbol: '₫',
    name: 'Vietnamese Dong',
    description: 'The Vietnamese Dong is the official currency of Vietnam. It is the fortieth most traded currency in the world.',
    icon_code: 'vn',
    is_active: true,

  },
  {
    denomination: { divisor: 2 },
    decimals: 2,
    code: 'ars',
    symbol: '$',
    name: 'Argentine Peso',
    description: 'The Argentine Peso is the official currency of Argentina. It is the forty-first most traded currency in the world.',
    icon_code: 'ar',
    is_active: true,

  },
  {
    denomination: { divisor: 2 },
    decimals: 2,
    code: 'kwd',
    symbol: 'د.ك',
    name: 'Kuwaiti Dinar',
    description: 'The Kuwaiti Dinar is the official currency of Kuwait. It is the highest-valued currency unit in the world.',
    icon_code: 'kw',
    is_active: true,

  },
  {
    denomination: { divisor: 2 },
    decimals: 2,
    code: 'QAR',
    symbol: 'ر.ق',
    name: 'Qatari Riyal',
    description: 'The Qatari Riyal is the official currency of Qatar. It is the forty-second most traded currency in the world.',
    icon_code: 'qa',
    is_active: true,
  },
  {
    denomination: { divisor: 2 },
    decimals: 2,
    code: 'OMR',
    symbol: 'ر.ع.',
    name: 'Omani Rial',
    description: 'The Omani Rial is the official currency of Oman.',
    icon_code: 'om',
    is_active: true,
  },
  {
    denomination: { divisor: 2 },
    decimals: 2,
    code: 'JOD',
    symbol: 'د.ا',
    name: 'Jordanian Dinar',
    description: 'The Jordanian Dinar is the official currency of Jordan.',
    icon_code: 'jo',
    is_active: true,
  },
  {
    denomination: { divisor: 2 },
    decimals: 2,
    code: 'KES',
    symbol: 'KSh',
    name: 'Kenyan Shilling',
    description: 'The Kenyan Shilling is the official currency of Kenya.',
    icon_code: 'ke',
    is_active: true,
  },
  {
    denomination: { divisor: 2 },
    decimals: 2,
    code: 'GHS',
    symbol: '₵',
    name: 'Ghanaian Cedi',
    description: 'The Ghanaian Cedi is the official currency of Ghana.',
    icon_code: 'gh',
    is_active: true,
  },
  {
    denomination: { divisor: 2 },
    decimals: 2,
    code: 'TZS',
    symbol: 'TSh',
    name: 'Tanzanian Shilling',
    description: 'The Tanzanian Shilling is the official currency of Tanzania.',
    icon_code: 'tz',
    is_active: true,
  },
  {
    denomination: { divisor: 2 },
    decimals: 2,
    code: 'UGX',
    symbol: 'USh',
    name: 'Ugandan Shilling',
    description: 'The Ugandan Shilling is the official currency of Uganda.',
    icon_code: 'ug',
    is_active: true,
  },
  {
    denomination: { divisor: 2 },
    decimals: 2,
    code: 'LKR',
    symbol: 'Rs',
    name: 'Sri Lankan Rupee',
    description: 'The Sri Lankan Rupee is the official currency of Sri Lanka.',
    icon_code: 'lk',
    is_active: true,
  },
  {
    denomination: { divisor: 2 },
    decimals: 2,
    code: 'MAD',
    symbol: 'د.م.',
    name: 'Moroccan Dirham',
    description: 'The Moroccan Dirham is the official currency of Morocco.',
    icon_code: 'ma',
    is_active: true,
  },
  {
    denomination: { divisor: 2 },
    decimals: 2,
    code: 'XAF',
    symbol: 'FCFA',
    name: 'Central African CFA Franc',
    description: 'The Central African CFA Franc is the official currency of several Central African countries.',
    icon_code: 'cf',
    is_active: true,
  },
  {
    denomination: { divisor: 2 },
    decimals: 2,
    code: 'XOF',
    symbol: 'CFA',
    name: 'West African CFA Franc',
    description: 'The West African CFA Franc is the official currency of several West African countries.',
    icon_code: 'wf',
    is_active: true,
  },
  {
    denomination: { divisor: 2 },
    decimals: 2,
    code: 'BHD',
    symbol: '.د.ب',
    name: 'Bahraini Dinar',
    description: 'The Bahraini Dinar is the official currency of Bahrain.',
    icon_code: 'bh',
    is_active: true,
  },
  {
    denomination: { divisor: 2 },
    decimals: 2,
    code: 'UAH',
    symbol: '₴',
    name: 'Ukrainian Hryvnia',
    description: 'The Ukrainian Hryvnia is the official currency of Ukraine.',
    icon_code: 'ua',
    is_active: true,
  },
];
