import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import ItemList from './components/ItemList';
import ItemDetail from './components/ItemDetail';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';
import MyOrders from './components/MyOrders';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <main className="container">
          <Routes>
            <Route path="/" element={<ItemList />} />
            <Route path="/item/:id" element={<ItemDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/orders" element={<MyOrders />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
