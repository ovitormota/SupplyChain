import { Product } from "./Product";

export interface Entry {
    id?: number;
    quantity: number;
    date_time: string;
    location: string;
    product_id: number;
    product?: Product;
  }