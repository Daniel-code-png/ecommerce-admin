import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, ShoppingCart, Users, Package, TrendingUp } from 'lucide-react';
import './Dashboard.css';

// IMPORTANTE: Agregar esta línea
const API_URL = process.env.REACT_APP_API_URL;

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      // CAMBIO: Usar API_URL
      const response = await axios.get(`${API_URL}/api/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Cargando estadísticas...</div>;
  }

  if (!stats) {
    return <div className="loading">No se pudieron cargar las estadísticas</div>;
  }

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe'];

  return (
    <div className="dashboard-content">
      <h1 className="page-title">Dashboard</h1>

      {/* Cards de resumen */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e3f2fd' }}>
            <DollarSign size={24} color="#2196f3" />
          </div>
          <div className="stat-info">
            <p className="stat-label">Ventas Totales</p>
            <h3 className="stat-value">${stats.overview.totalSales.toLocaleString()}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f3e5f5' }}>
            <ShoppingCart size={24} color="#9c27b0" />
          </div>
          <div className="stat-info">
            <p className="stat-label">Pedidos</p>
            <h3 className="stat-value">{stats.overview.totalOrders}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e8f5e9' }}>
            <Users size={24} color="#4caf50" />
          </div>
          <div className="stat-info">
            <p className="stat-label">Usuarios</p>
            <h3 className="stat-value">{stats.overview.totalUsers}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fff3e0' }}>
            <Package size={24} color="#ff9800" />
          </div>
          <div className="stat-info">
            <p className="stat-label">Productos</p>
            <h3 className="stat-value">{stats.overview.totalProducts}</h3>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="charts-grid">
        {/* Ventas por mes */}
        <div className="chart-card">
          <h3 className="chart-title">
            <TrendingUp size={20} />
            Ventas por Mes
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.salesByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Legend />
              <Line type="monotone" dataKey="total" stroke="#667eea" strokeWidth={2} name="Ventas" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Ventas por categoría */}
        <div className="chart-card">
          <h3 className="chart-title">
            <Package size={20} />
            Ventas por Categoría
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.salesByCategory}
                dataKey="total"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry) => entry.category}
              >
                {stats.salesByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Productos más vendidos */}
      <div className="chart-card full-width">
        <h3 className="chart-title">
          <TrendingUp size={20} />
          Productos Más Vendidos
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.topProducts}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sold" fill="#667eea" name="Unidades Vendidas" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pedidos recientes */}
      <div className="recent-orders">
        <h3 className="section-title">Pedidos Recientes</h3>
        <div className="orders-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Total</th>
                <th>Fecha</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order) => (
                <tr key={order._id}>
                  <td>#{order._id.slice(-8)}</td>
                  <td>{order.user.name}</td>
                  <td>${order.totalAmount.toLocaleString()}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge ${order.status}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;