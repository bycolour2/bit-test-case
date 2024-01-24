export type Email = string;

export interface UserListResponse {
  data?: User[] | null;
  pages: number;
}
export interface User {
  id: string;
  email: string;
  tg_id?: null;
  name: string;
  password?: null;
  avatar?: null;
  created_at: string;
  role: string;
  subscription: Subscription;
}
export interface Subscription {
  id: string;
  plan_id: string;
  user_id: string;
  tokens: number;
  additional_tokens: number;
  created_at: string;
  plan: Plan;
}
export interface Plan {
  id: string;
  type: string;
  price: number;
  currency: string;
  tokens: number;
}

export interface Transaction {
  id: string;
  provider: string;
  amount: number;
  currency: string;
  meta?: null;
  status: string;
  type: "WRITE_OFF" | "REPLENISH";
  plan_id?: null;
  user_id: string;
  referral_id?: null;
  created_at: string;
  external_id?: null;
}
