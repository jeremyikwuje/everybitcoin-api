export enum FundingType {
  VentureCapital = 'venture-capital',
  PrivateEquity = 'private-equity',
  PublicEquity = 'public-equity',
  Crowdfunding = 'crowdfunding',
  AngelInvestment = 'angel-investment',
  Grant = 'grant',
  StockOption = 'stock-option',
  ConvertibleBond = 'convertible-bond',
  Equity = 'equity',
  Debt = 'debt-financing',
  Mixed = 'mixed',
  Ipo = 'ipo',
  Ico = 'ico',
  Other = 'other',
}

export enum RepaymentPeriod {
  Annually = 'annually',
  Quarterly = 'quarterly',
  Monthly = 'monthly',
}

export enum FundingRound {
  First = 'first_round',
  Preseed = 'Pre-seed',
  Seed = 'seed',
  SeriesA = 'Series-A',
  SeriesB = 'Series-B',
  SeriesC = 'Series-C',
  SeriesD = 'Series-D',
  SeriesE = 'Series-E',
  SeriesF = 'Series-F',
  SeriesG = 'Series-G',
  SeriesH = 'Series-H',
  SeriesI = 'Series-I',
  SeriesJ = 'Series-J',
  SeriesK = 'Series-K',
  SeriesL = 'Series-L',
  SeriesM = 'Series-M',
  SeriesN = 'Series-N',
  SeriesO = 'Series-O',
  Ipo = 'IPO',
}

export interface IFundingRound {
  _id?: string;
  changer?: string;
  round?: string;
  return_rate?: number;
  repayment_period?: string;
  amount?: {
    value: number;
    unit: string;
  };
  message?: string;
  special_message?: string;
  types?: IType[];
  data_sources?: IDataSource[],
  investors?: RoundInvestors[];
}

export interface IFundingType {
  title?: string;
  about?: string;
  name?: string;
  is_repayable?: boolean;
}

export interface IType {
  funding_type: string;
}

export interface RoundInvestors {
  investor: string;
  amount: number
  lead?: boolean;
  comment?: string;
}

export interface IDataSource {
  source: string;
}
