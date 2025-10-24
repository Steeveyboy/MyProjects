import axios from 'axios';
import { TodoItem } from '../models/TodoItem';

const API_BASE_URL = 'http://localhost:3001/api'; // Adjust this to your backend URL

export const todoService = {
  // Get all todos
  getAllTodos: async (): Promise<TodoItem[]> => {
    try {
      return [];
      // const response = await axios.get(`${API_BASE_URL}/items`);
      // return response.data;
    } catch (error) {
      console.error('Error fetching todos:', error);
      throw error;
    }
  },

  // Add a new todo
  addTodo: async (todo: Omit<TodoItem, 'id'>): Promise<TodoItem> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/items`, todo);
      return response.data;
    } catch (error) {
      console.error('Error adding todo:', error);
      throw error;
    }
  },

  // Update a todo
  updateTodo: async (todo: TodoItem): Promise<TodoItem> => {
    try {
      const response = await axios.put(`${API_BASE_URL}/items/${todo.id}`, todo);
      return response.data;
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  },

  // Delete a todo
  deleteTodo: async (id: string): Promise<void> => {
    try {
      await axios.delete(`${API_BASE_URL}/items/${id}`);
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  },

  // Toggle todo completion status
  toggleTodoCompletion: async (id: string, completed: boolean): Promise<TodoItem> => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/items/${id}`, { completed });
      return response.data;
    } catch (error) {
      console.error('Error toggling todo completion:', error);
      throw error;
    }
  },
};
