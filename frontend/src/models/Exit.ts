import { Product } from "./Product";

export interface Exit {
    id?: number;
    quantity: number;
    date_time: string;
    location: string;
    product_id: number;
    product?: Product;
  }