import api from './api';
import { Entry } from '../models/Entry';

class EntryService {
  // Cadastra uma nova entrada
  static async createEntry(entry: Entry): Promise<void> {
    try {
      await api.post('/entries', entry);
    } catch (error) {
      console.error('Error creating entry:', error);
      throw new Error('Error creating entry');
    }
  }

  // Listar todas as entradas
  static async getEntries(): Promise<Entry[]> {
    try {
      const response = await api.get('/entries');
      return response.data;
    } catch (error) {
      console.error('Error fetching entries:', error);
      throw new Error('Error fetching entries');
    }
  }

  // Obter entrada por ID
  static async getEntryById(id: number): Promise<Entry> {
    try {
      const response = await api.get(`/entries/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching entry with id ${id}:`, error);
      throw new Error('Error fetching entry');
    }
  }

  // Obter entradas por produto
  static async getEntriesByProduct(productId: number): Promise<Entry[]> {
    try {
      const response = await api.get(`/entries?product_id=${productId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching entries for product ${productId}:`, error);
      throw new Error('Error fetching entries');
    }
  }

  static async updateEntry(id: number, entry: Entry): Promise<void> {
    try {
      await api.put(`/entries/${id}`, entry);
    } catch (error) {
      console.error(`Error updating entry with id ${id}:`, error);
      throw new Error('Error updating entry');
    }
  }

  // Excluir entrada
  static async deleteEntry(id: number): Promise<void> {
    try {
      await api.delete(`/entries/${id}`);
    } catch (error) {
      console.error(`Error deleting entry with id ${id}:`, error);
      throw new Error('Error deleting entry');
    }
  }
}

export default EntryService;
