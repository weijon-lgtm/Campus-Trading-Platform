import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { itemAPI, commentAPI,orderAPI } from '../services/api';
import { Item, Comment } from '../types';


const ItemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<Item | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [showBuyForm, setShowBuyForm] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [buyForm, setBuyForm] = useState({
    buyerContact: '',
    message: ''
  });
  
  const username = localStorage.getItem('username');

  useEffect(() => {
    if (id) {
      loadItemDetail(parseInt(id));
      loadComments(parseInt(id));
    }
  }, [id]);
  useEffect(() => {
    document.title = `${item?.name || '商品详情'} - 二手商城`;
  }, [item]);

  const loadItemDetail = async (itemId: number) => {
    try {
      const response = await itemAPI.getById(itemId);
      setItem(response.data);
    } catch (error) {
      console.error('加载物品详情失败:', error);
    }
  };

  const loadComments = async (itemId: number) => {
    try {
      const response = await commentAPI.getByItemId(itemId);
      setComments(response.data);
    } catch (error) {
      console.error('加载评论失败:', error);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    try {
      await commentAPI.create({
        content: newComment,
        itemId: parseInt(id),
      });
      setNewComment('');
      loadComments(parseInt(id));
    } catch (error) {
      console.error('添加评论失败:', error);
    }
  };

  const handleDelete = async () => {
    if (!id || !window.confirm('确定要删除这个物品吗？')) return;
    
    try {
      await itemAPI.delete(parseInt(id));
      navigate('/');
    } catch (error) {
      console.error('删除失败:', error);
    }
  };
   const handleBuy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    try {
      await orderAPI.create({
        itemId: parseInt(id),
        buyerContact: buyForm.buyerContact,
        message: buyForm.message
      });
      // 将alert改为：
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000); // 3秒后自动消失
    
    setShowBuyForm(false);
    setBuyForm({ buyerContact: '', message: '' });
  } catch (error: any) {
    alert(error.response?.data || '购买失败'); // 这个也可以后续改为自定义提示
  }
};


  if (!item) {
    return <div>加载中...</div>;
  }

  return (
    <div className="item-detail">
      {/* 👇 添加成功提示框 */}
    {showSuccessMessage && (
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '50%',              // 👈 改为50%
    transform: 'translateX(-50%)',  // 👈 添加这行让它居中
        background: 'linear-gradient(135deg, #48bb78, #38a169)',
        color: 'white',
        padding: '1rem 2rem',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        zIndex: 1001,
        fontSize: '1.1rem',
        fontWeight: '600'
      }}>
       ✅ 购买请求已发送，请等待卖家确认
      </div>
    )}
    
    <h1>{item.name}</h1>
      <div className="item-info">
        <p className="price">价格: ¥{item.price}</p>
        <p className="description">{item.description}</p>
        <p className="meta">
          发布者: {item.username} | 
          发布时间: {new Date(item.createTime).toLocaleDateString()}
        </p>
        {item.status === 'SOLD' && (
          <p className="sold-tag">已售出</p>
        )}
        
        {username && username !== item.username && item.status !== 'SOLD' && (
          <button onClick={() => setShowBuyForm(true)} className="buy-btn">
            购买
          </button>
        )}
        {username === item.username && (
          <button onClick={handleDelete} className="delete-btn">删除物品</button>
        )}
      </div>
      {showBuyForm && (
        <div className="buy-form-modal">
          <div className="buy-form">
            <h3>购买物品</h3>
            <form onSubmit={handleBuy}>
              <input
                type="text"
                placeholder="联系方式（手机/微信）"
                value={buyForm.buyerContact}
                onChange={(e) => setBuyForm({...buyForm, buyerContact: e.target.value})}
                required
              />
              <textarea
                placeholder="留言（可选）"
                value={buyForm.message}
                onChange={(e) => setBuyForm({...buyForm, message: e.target.value})}
              />
              <button type="submit">确认购买</button>
              <button type="button" onClick={() => setShowBuyForm(false)}>取消</button>
            </form>
          </div>
        </div>
      )}

      <div className="comments-section">
        <h2>评论</h2>
        
        {username && (
          <form onSubmit={handleAddComment} className="comment-form">
            <textarea
              placeholder="添加评论..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            />
            <button type="submit">发表评论</button>
          </form>
        )}

        <div className="comments-list">
          {comments.map((comment) => (
            <div key={comment.id} className="comment">
              <div className="comment-header">
                <strong>{comment.username}</strong>
                <span>{new Date(comment.createTime).toLocaleString()}</span>
              </div>
              <p>{comment.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
