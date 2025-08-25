import React, { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';
import { Order } from '../types';

const MyOrders: React.FC = () => {
  const [buyOrders, setBuyOrders] = useState<Order[]>([]);
  const [sellOrders, setSellOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const [buyRes, sellRes] = await Promise.all([
        orderAPI.getMyOrders(),
        orderAPI.getMySellingOrders()
      ]);
      setBuyOrders(buyRes.data);
      setSellOrders(sellRes.data);
    } catch (error) {
      console.error('加载订单失败:', error);
    }
  };

  const handleAcceptOrder = async (orderId: number) => {
    try {
      await orderAPI.acceptOrder(orderId);
      alert('订单已接受');
      loadOrders();
    } catch (error) {
      alert('操作失败');
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'PENDING': '待确认',
      'ACCEPTED': '已接受',
      'REJECTED': '已拒绝',
      'COMPLETED': '已完成'
    };
    return statusMap[status] || status;
  };

  return (
    <div className="orders-container">
      <h2>我的订单</h2>
      
      <div className="tabs">
        <button 
          className={activeTab === 'buy' ? 'active' : ''}
          onClick={() => setActiveTab('buy')}
        >
          我买到的
        </button>
        <button 
          className={activeTab === 'sell' ? 'active' : ''}
          onClick={() => setActiveTab('sell')}
        >
          我卖出的
        </button>
      </div>

      {activeTab === 'buy' ? (
        <div className="order-list">
          {buyOrders.map(order => (
            <div key={order.id} className="order-card">
              <h3>{order.itemName}</h3>
              <p>价格: ¥{order.price}</p>
              <p>卖家: {order.sellerUsername}</p>
              <p>状态: {getStatusText(order.status)}</p>
              <p>联系方式: {order.buyerContact}</p>
              {order.message && <p>留言: {order.message}</p>}
              <p>时间: {new Date(order.createTime).toLocaleString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="order-list">
          {sellOrders.map(order => (
            <div key={order.id} className="order-card">
              <h3>{order.itemName}</h3>
              <p>价格: ¥{order.price}</p>
              <p>买家: {order.buyerUsername}</p>
              <p>状态: {getStatusText(order.status)}</p>
              <p>买家联系方式: {order.buyerContact}</p>
              {order.message && <p>留言: {order.message}</p>}
              <p>时间: {new Date(order.createTime).toLocaleString()}</p>
              {order.status === 'PENDING' && (
                <button onClick={() => handleAcceptOrder(order.id)}>
                  接受订单
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
