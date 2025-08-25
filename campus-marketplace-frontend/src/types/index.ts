// src/types/index.ts - 修复后的完整类型定义

export interface User {
  id: number;
  username: string;
  email: string;
}

// 修复：Item接口只定义一次，合并所有字段
export interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
  username: string;  // 如果后端返回的是username字符串就保持这样
  createTime: string;
  status: 'AVAILABLE' | 'SOLD';  // 改为联合类型，更加类型安全
}

export interface Comment {
  id: number;
  content: string;
  username: string;
  createTime: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
}

export interface CreateItemRequest {
  name: string;
  description: string;
  price: number;
}

export interface CreateCommentRequest {
  content: string;
  itemId: number;
}

// 修复：Order接口，使用更精确的类型定义
export interface Order {
  id: number;
  itemId: number;
  itemName: string;
  price: number;
  buyerUsername: string;
  sellerUsername: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';  // 联合类型而不是string
  buyerContact: string;
  message?: string;  // message可能为空，应该是可选的
  createTime: string;
}

export interface CreateOrderRequest {
  itemId: number;
  buyerContact: string;
  message?: string;  // 保持可选
}

// 删除了重复的Item接口定义