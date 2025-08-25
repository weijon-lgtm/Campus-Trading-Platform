import axios from 'axios';
import { 
  Item, 
  Comment, 
  LoginRequest, 
  RegisterRequest, 
  CreateItemRequest, 
  CreateCommentRequest,
  Order,                    // 添加订单类型导入
  CreateOrderRequest        // 添加创建订单请求类型导入
} from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 添加请求拦截器,自动添加用户名到请求头
api.interceptors.request.use((config) => {
  const username = localStorage.getItem('username');
  if (username) {
    config.headers['X-Username'] = username;
  }
  return config;
});

// 添加订单API - 修复：添加返回类型定义
export const orderAPI = {
  create: (data: CreateOrderRequest) => api.post<Order>('/orders', data),
  getMyOrders: () => api.get<Order[]>('/orders/my-orders'),
  getMySellingOrders: () => api.get<Order[]>('/orders/my-selling'),
  acceptOrder: (id: number) => api.put<Order>(`/orders/${id}/accept`),
};

// 修复：为用户API添加返回类型
export const userAPI = {
  register: (data: RegisterRequest) => 
    api.post<{ message: string }>('/users/register', data),
  login: (data: LoginRequest) => 
    api.post<{ message: string; username: string }>('/users/login', data),
};

// 修复：为物品API添加返回类型
export const itemAPI = {
  getAll: () => api.get<Item[]>('/items'),
  getById: (id: number) => api.get<Item>(`/items/${id}`),
  create: (data: CreateItemRequest) => api.post<Item>('/items', data),
  search: (keyword: string) => api.get<Item[]>(`/items/search?keyword=${keyword}`),
  delete: (id: number) => api.delete<{ message: string }>(`/items/${id}`),
};

// 修复：为评论API添加返回类型
export const commentAPI = {
  getByItemId: (itemId: number) => api.get<Comment[]>(`/comments/item/${itemId}`),
  create: (data: CreateCommentRequest) => api.post<Comment>('/comments', data),
};

export default api;