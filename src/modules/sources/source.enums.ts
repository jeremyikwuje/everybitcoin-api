export interface ISource {
  name: string;
  title?: string;
  bio?: string;
  url?: string;
  icon?: string;
  is_verified?: boolean;
  is_active?: boolean;
  is_primary?: boolean;
  trust_score: number;
}
