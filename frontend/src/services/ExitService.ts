import api from './api';
import { Exit } from '../models/Exit';

class ExitService {
  // Cadastrar uma nova saída
  static async createExit(exit: Exit): Promise<void> {
    try {
      await api.post('/exits', exit);
    } catch (error) {
      console.error('Error creating exit:', error);
      throw new Error('Error creating exit');
    }
  }

  // Listar todas as saídas
  static async getExits(): Promise<Exit[]> {
    try {
      const response = await api.get('/exits');
      return response.data;
    } catch (error) {
      console.error('Error fetching exits:', error);
      throw new Error('Error fetching exits');
    }
  }

  // Obter saída por ID
  static async getExitById(id: number): Promise<Exit> {
    try {
      const response = await api.get(`/exits/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching exit with id ${id}:`, error);
      throw new Error('Error fetching exit');
    }
  }

  // Obter saídas por produto
  static async getExitsByProduct(productId: number): Promise<Exit[]> {
    try {
      const response = await api.get(`/exits?product_id=${productId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching exits for product ${productId}:`, error);
      throw new Error('Error fetching exits');
    }
  }

  // Excluir saída
  static async deleteExit(id: number): Promise<void> {
    try {
      await api.delete(`/exits/${id}`);
    } catch (error) {
      console.error(`Error deleting exit with id ${id}:`, error);
      throw new Error('Error deleting exit');
    }
  }

  // Atualizar uma saída existente
  static async updateExit(id: number, exit: Exit): Promise<void> {
    try {
      await api.put(`/exits/${id}`, exit);
    } catch (error) {
      console.error(`Error updating exit with id ${id}:`, error);
      throw new Error('Error updating exit');
    }
  }
}

export default ExitService;
