import axios from 'axios';
import { Sweet, SearchFilters } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

class SweetService {
  async getAll(filters?: SearchFilters): Promise<Sweet[]> {
    const params = new URLSearchParams();
    if (filters?.name) params.append('name', filters.name);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());

    const response = await axios.get<Sweet[]>(
      `${API_URL}/sweets?${params.toString()}`,
      getAuthHeaders()
    );
    return response.data;
  }

  async create(data: Omit<Sweet, 'id' | 'createdAt' | 'updatedAt'>): Promise<Sweet> {
    const response = await axios.post<Sweet>(`${API_URL}/sweets`, data, getAuthHeaders());
    return response.data;
  }

  async update(id: string, data: Partial<Sweet>): Promise<Sweet> {
    const response = await axios.put<Sweet>(`${API_URL}/sweets/${id}`, data, getAuthHeaders());
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await axios.delete(`${API_URL}/sweets/${id}`, getAuthHeaders());
  }

  async purchase(id: string, quantity: number = 1): Promise<Sweet> {
    const response = await axios.post<Sweet>(
      `${API_URL}/sweets/${id}/purchase`,
      { quantity },
      getAuthHeaders()
    );
    return response.data;
  }

  async restock(id: string, quantity: number): Promise<Sweet> {
    const response = await axios.post<Sweet>(
      `${API_URL}/sweets/${id}/restock`,
      { quantity },
      getAuthHeaders()
    );
    return response.data;
  }
}

export const sweetService = new SweetService();

