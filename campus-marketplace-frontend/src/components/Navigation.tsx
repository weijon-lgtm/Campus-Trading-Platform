// Navigation.tsx 完整代码
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <nav className="navigation">
      <Link to="/" className="logo">校园二手市场</Link>
      <div className="nav-links">
        <Link to="/">首页</Link>
        {username ? (
          <>
           
            <Link to="/orders">我的订单</Link>  {/* 在这里添加 */}
            <span className="username">欢迎, {username}</span>
            <button onClick={handleLogout} className="logout-btn">退出</button>
          </>
        ) : (
          <>
            <Link to="/login">登录</Link>
            <Link to="/register">注册</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
