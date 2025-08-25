import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { itemAPI } from '../services/api';
import { Item, CreateItemRequest } from '../types';

const ItemList: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [newItem, setNewItem] = useState<CreateItemRequest>({
    name: '',
    description: '',
    price: 0,
  });

  const username = localStorage.getItem('username');

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const response = await itemAPI.getAll();
      setItems(response.data);
    } catch (error) {
      console.error('加载物品失败:', error);
    }
  };

  const handleSearch = async () => {
    try {
      if (searchKeyword.trim()) {
        const response = await itemAPI.search(searchKeyword);
        setItems(response.data);
      } else {
        loadItems();
      }
    } catch (error) {
      console.error('搜索失败:', error);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await itemAPI.create(newItem);
      setShowAddForm(false);
      setNewItem({ name: '', description: '', price: 0 });
      loadItems();
    } catch (error) {
      console.error('添加物品失败:', error);
    }
  };

  return (
    <div className="item-list-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="搜索物品..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <button onClick={handleSearch}>搜索</button>
      </div>

      {username && (
        <button 
          className="add-item-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          发布物品
        </button>
      )}

      {showAddForm && (
        <form className="add-item-form" onSubmit={handleAddItem}>
          <input
            type="text"
            placeholder="物品名称"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            required
          />
          <textarea
            placeholder="物品描述"
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
          />
          <input
            type="number"
            step="0.01"
            placeholder="价格"
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
            required
          />
          <button type="submit">发布</button>
          <button type="button" onClick={() => setShowAddForm(false)}>取消</button>
        </form>
      )}

      <div className="item-grid">
        {items.map((item) => (
          <div key={item.id} className="item-card">
            <h3>{item.name}</h3>
            <p className="price">¥{item.price}</p>
            <p className="description">{item.description}</p>
            <p className="meta">发布者: {item.username}</p>
            <Link to={`/item/${item.id}`} className="detail-link">查看详情</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemList;
