export type Order = {
  id: string;
  user_id: string;
  product: string;
  amount: number;
  status: string;
  created_at: string;
};

/** Product key stored on paid orders for The Weight Of Things. */
export const WAY_OF_KINGS_PRODUCT = "the_way_of_kings";
