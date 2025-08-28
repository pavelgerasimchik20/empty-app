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