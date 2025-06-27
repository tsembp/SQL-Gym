import axios from 'axios';
import type { Challenge, EvalRequest, EvalResponse, TableSchema, Solution } from './api';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const challengeApi = {
  // Get all challenges with optional difficulty filter
  getChallenges: async (difficulty?: string): Promise<Challenge[]> => {
    const params = difficulty ? { difficulty } : {};
    const response = await api.get('/challenges', { params });
    return response.data;
  },

  // Get specific challenge
  getChallenge: async (id: number): Promise<Challenge> => {
    const response = await api.get(`/challenge/${id}`);
    return response.data;
  },

  // Get challenge solution
  getSolution: async (id: number): Promise<Solution> => {
    const response = await api.get(`/challenge/${id}/solution`);
    return response.data;
  },

  // Evaluate user's SQL query
  evaluateQuery: async (request: EvalRequest): Promise<EvalResponse> => {
    const response = await api.post('/evaluate', request);
    return response.data;
  },

  // Get database schema
  getSchema: async (): Promise<TableSchema> => {
    const response = await api.get('/schema');
    return response.data;
  },

  // Get table sample data
  getTableSample: async (tableName: string, limit: number = 5): Promise<{ data: any[] }> => {
    const response = await api.get(`/tables/${tableName}/sample`, { params: { limit } });
    return response.data;
  },
};