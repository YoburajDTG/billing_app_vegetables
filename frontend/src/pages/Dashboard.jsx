import React, { useEffect, useState } from 'react';
import {
    TrendingUp,
    IndianRupee,
    ShoppingCart,
    Package,
    ArrowUpRight,
    ArrowDownRight,
    AlertTriangle,
    ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { billingApi } from '../services/api';
import BannerCarousel from '../components/BannerCarousel';
import './Dashboard.css';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color }) => (
    <div className="card stat-card">
        <div className="stat-header">
            <div className={`stat-icon ${color}`}>
                <Icon size={24} />
            </div>
            {trend && (
                <div className={`stat-trend ${trend}`}>
                    {trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    <span>{trendValue}%</span>
                </div>
            )}
        </div>
        <div className="stat-body">
            <h3>{value}</h3>
            <p>{title}</p>
        </div>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        todayRetailTotal: 0,
        todayWholesaleTotal: 0,
        totalBillsToday: 0,
        topSellingItems: [],
        weeklyRevenue: [],
        lowStockCount: 0,
        lowStockItems: []
    });
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await billingApi.getDashboardStats();
                setStats(response.data);
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="loading">Loading dashboard...</div>;

    return (
        <div className="dashboard-container">
            {stats.lowStockCount > 0 && (
                <div className="alert-banner warning dashboard-alert" onClick={() => navigate('/inventory')}>
                    <div className="alert-content">
                        <AlertTriangle size={24} />
                        <div>
                            <h4>Low Stock Alert</h4>
                            <p>{stats.lowStockCount} items are below 5kg: {stats.lowStockItems.join(', ')}</p>
                        </div>
                    </div>
                    <ArrowRight size={20} />
                </div>
            )}

            <BannerCarousel />

            <div className="stats-grid">
                <StatCard
                    title="Daily Revenue"
                    value={`₹${stats.todayRetailTotal + stats.todayWholesaleTotal}`}
                    icon={TrendingUp}
                    trend="up"
                    trendValue="12"
                    color="green"
                />
                <StatCard
                    title="Retail Sales"
                    value={`₹${stats.todayRetailTotal}`}
                    icon={ShoppingCart}
                    trend="up"
                    trendValue="8"
                    color="blue"
                />
                <StatCard
                    title="Wholesale Sales"
                    value={`₹${stats.todayWholesaleTotal}`}
                    icon={Package}
                    trend="down"
                    trendValue="3"
                    color="orange"
                />
                <StatCard
                    title="Total Bills"
                    value={stats.totalBillsToday}
                    icon={IndianRupee}
                    color="purple"
                />
            </div>

            <div className="dashboard-grid">
                <div className="card main-chart-card">
                    <div className="card-header">
                        <h3>Sales Overview</h3>
                        <select className="date-select">
                            <option>Today</option>
                            <option>Last 7 Days</option>
                            <option>This Month</option>
                        </select>
                    </div>
                    <div className="chart-placeholder">
                        <div className="bar-chart">
                            {(() => {
                                const maxRevenue = Math.max(...stats.weeklyRevenue, 1);
                                return stats.weeklyRevenue.map((rev, i) => {
                                    const height = (rev / maxRevenue) * 100;
                                    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
                                    // Get day name for index (i) relative to today
                                    const date = new Date();
                                    date.setDate(date.getDate() - (6 - i));
                                    const dayName = days[date.getDay()];

                                    return (
                                        <div key={i} className="bar-wrapper" title={`₹${rev.toFixed(2)}`}>
                                            <div
                                                className="bar"
                                                style={{ height: `${Math.max(height, 5)}%` }}
                                            ></div>
                                            <span>{dayName}</span>
                                        </div>
                                    );
                                });
                            })()}
                        </div>
                    </div>
                </div>

                <div className="card top-items-card">
                    <div className="card-header">
                        <h3>Top Selling (Today)</h3>
                    </div>
                    <div className="top-items-list">
                        {stats.topSellingItems.length > 0 ? (
                            stats.topSellingItems.map((item, index) => (
                                <div key={index} className="top-item">
                                    <div className="item-rank">{index + 1}</div>
                                    <div className="item-info">
                                        <p className="item-name">{item}</p>
                                        <p className="item-category">Vegetable</p>
                                    </div>
                                    <div className="item-performance">
                                        <TrendingUp size={16} className="text-green" />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="empty-msg">No sales today yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
