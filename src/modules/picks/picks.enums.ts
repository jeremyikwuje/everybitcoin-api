export interface IPick {
  _id: string;
  link: string;
  title: string;
  description: string;
  featured_image: string;
  type: PickType;
  status: PickStatus;
  visibility: PickVisibility;
  content_type: PickContentType;
  tags: string[];
  source: string;
  source_name: string;
  is_published: boolean;
  published_by: string;
  likes: number;
  dislikes: number;
  clicks: number;
  replies: number;
  reports: number;
  created_at: Date;
  updated_at: Date;
}

export interface IPickUpdate {
  link?: string;
  title?: string;
  description?: string;
  featured_image?: string;
  type?: PickType;
  status?: PickStatus;
  visibility?: PickVisibility;
  content_type?: PickContentType;
  tags?: string[];
  source?: string;
  source_name?: string;
  is_published?: boolean;
  picked_by?: string;
  likes?: number;
  liked_by?: string[];
  dislikes?: number;
  disliked_by?: string[];
  clicks?: number;
  replies?: number;
  reports?: number;
  approval_status?: PickStatus;
}

export interface IPickCreate {
  link: string,
  title: string;
  description: string;
  featured_image: string;
  type: PickType;
  approval_status: PickStatus;
  visibility: PickVisibility;
  content_type: PickContentType;
  tags: string[];
  source: string;
  source_name: string;
  picked_by: string;
  is_published?: boolean;
}

export interface IReply {
  _id: string;
  pick: string;
  body: string;
  author: string;
  likes: number;
  dislikes: number;
  is_flagged: boolean;
  parent: any;
  created_at: Date;
  updated_at: Date;
}

export interface IReplyCreate {
  pick: string;
  body: string;
  author: string;
}

export interface IReplyUpdate {
  body?: string;
  likes?: number;
  liked_by?: string[];
  dislikes?: number;
  disliked_by?: string[];
  is_flagged?: boolean;
}

export enum PickType {
  Pick = 'pick',
  Special = 'special',
  Sponsored = 'sponsored',
}

export enum PickStatus {
  Pending = 'pending',
  Accepted = 'accepted',
  Rejected = 'rejected',
  Dropped = 'dropped',
}

export enum PickVisibility {
  Public = 'public',
  Private = 'private',
  Unlisted = 'unlisted',
}

export enum PickSortType {
  Latest = 'latest',
  Popular = 'popular',
  Trending = 'trending',
}

export enum PickContentType {
  Article = 'article',
  Video = 'video',
  Podcast = 'podcast',
  Audio = 'audio',
  Photo = 'photo',
  Event = 'event',
  Tool = 'tool',
  Product = 'product',
  Service = 'service',
  Other = 'other',
  Bot = 'bot',
  Ai = 'ai',
  AiModel = 'ai_model',
  AiAgent = 'ai_agent',
  Chatbot = 'chatbot',
  Software = 'software',
  Hardware = 'hardware',
  Chart = 'chart',
  Graph = 'graph',
  Infographic = 'infographic',
  Report = 'report',
  Whitepaper = 'whitepaper',
  Book = 'book',
  Course = 'course',
  Tutorial = 'tutorial',
  File = 'file',
  Document = 'document',
  Spreadsheet = 'spreadsheet',
  Presentation = 'presentation',
  Slide = 'slide',
  Deck = 'deck',
  Template = 'template',
  Blueprint = 'blueprint',
  Design = 'design',
  Illustration = 'illustration',
  Drawing = 'drawing',
  Painting = 'painting',
  Sculpture = 'sculpture',
  Art = 'art',
  Music = 'music',
  Song = 'song',
  Album = 'album',
  Playlist = 'playlist',
  Tweet = 'tweet',
  Post = 'post',
  Pdf = 'pdf',
}

export enum PickTags {
  Custody = 'custody',
  Wallet = 'wallet',
  Exchange = 'exchange',
  Trading = 'trading',
  Investment = 'investment',
  Event = 'event',
  Market = 'market',
  Regulation = 'regulation',
  Technology = 'technology',
  OpenSource = 'open_source',
  Privacy = 'privacy',
  Security = 'security',
  Compliance = 'compliance',
  Bip = 'bip',
  Funding = 'funding',
  Hack = 'hack',
  Bank = 'bank',
  Payment = 'payment',
  Lightning = 'lightning',
  Bitcoin = 'bitcoin',
  Utxo = 'utxo',
  Nostr = 'nostr',
  Startup = 'startup',
  Satoshi = 'satoshi',
  Grant = 'grant',
  Hrf = 'hrf',
  Research = 'research',
}
