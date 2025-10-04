export interface Card {
  user_id: number;
  fio: string;
  phone: string | null;
  email: string;
  gender: string | null;
  bonus: string | null;
  city: string | null;
}

export interface CardsResponse {
  meta: {
    size: number;
    limit: number;
    offset: number;
  };
  passes: Card[];
}

export interface CreateCardRequest {
  template: string;
  first_name: string;
  last_name: string;
  pat_name?: string;
  phone: string;
  email: string;
  birthday?: string;
  gender?: string;
  barcode?: string;
  discount?: string;
  bonus?: number;
  loyalty_level?: string;
}

export interface PushMessage {
  user_id: string;
  date_start: string;
  push_message: string;
}
