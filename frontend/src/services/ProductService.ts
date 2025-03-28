import { Product } from "../models/Product";
import api from "./api";

class ProductService {
  // Cadastrar um novo produto
  static async createProduct(product: Product): Promise<void> {
    try {
      await api.post("/products", product);
    } catch (error) {
      console.error("Error creating product:", error);
      throw new Error("Error creating product");
    }
  }

  // Listar todos os produtos
  static async getProducts(): Promise<Product[]> {
    try {
      const response = await api.get("/products");
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw new Error("Error fetching products");
    }
  }

  // Obter um produto pelo ID
  static async getProductById(id: number): Promise<Product> {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product with id ${id}:`, error);
      throw new Error("Error fetching product");
    }
  }

  // Atualizar produto
  static async updateProduct(id: number, product: Product): Promise<void> {
    try {
      await api.put(`/products/${id}`, product);
    } catch (error) {
      console.error(`Error updating product with id ${id}:`, error);
      throw new Error("Error updating product");
    }
  }

  // Excluir produto
  static async deleteProduct(id: number): Promise<void> {
    try {
      await api.delete(`/products/${id}`);
    } catch (error) {
      console.error(`Error deleting product with id ${id}:`, error);
      throw new Error("Error deleting product");
    }
  }
}

export default ProductService;
