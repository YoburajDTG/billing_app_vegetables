import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    IndianRupee,
    PlusCircle,
    Store,
    LogOut,
    Menu,
    X,
    ChevronRight,
    User,
    Users
} from 'lucide-react';
import logo from '../../assets/login_logo.png';
import useAuthStore from '../../store/useAuthStore';
import './Layout.css';

const MainLayout = ({ children }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuthStore();

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
        { name: 'New Invoice', icon: PlusCircle, path: '/invoice/new' },
        { name: 'Invoices History', icon: IndianRupee, path: '/invoices' },
        { name: 'Inventory', icon: Store, path: '/inventory' },
        { name: 'Customers', icon: Users, path: '/customers' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="layout-container">
            {/* Sidebar */}
            <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-header">
                    <div className="logo-container">
                        <div className="logo-icon logo-img-container">
                            <img src={logo} alt="Suji Vegetables" className="sidebar-logo-img" />
                        </div>
                        <span className="logo-text">Suji Vegetables</span>
                    </div>
                    <button className="sidebar-toggle" onClick={() => setSidebarOpen(!isSidebarOpen)}>
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            <item.icon size={22} />
                            {isSidebarOpen && <span>{item.name}</span>}
                            {isSidebarOpen && location.pathname === item.path && (
                                <ChevronRight size={16} className="active-indicator" />
                            )}
                        </Link>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="user-profile">
                        <div className="avatar">
                            <User size={20} />
                        </div>
                        {isSidebarOpen && (
                            <div className="user-info">
                                <p className="username">{user?.username || 'Admin'}</p>
                                <p className="shop-name">{user?.shop_name || 'My Shop'}</p>
                            </div>
                        )}
                    </div>
                    <button className="logout-btn" onClick={handleLogout}>
                        <LogOut size={20} />
                        {isSidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header className="topbar">
                    <div className="page-title">
                        <h2>{menuItems.find(item => item.path === location.pathname)?.name || 'VegBilling'}</h2>
                    </div>
                    <div className="topbar-actions">
                        <button className="notification-btn">
                            <span className="badge"></span>
                        </button>
                    </div>
                </header>

                <section className="page-content">
                    {children}
                </section>
            </main>
        </div>
    );
};

export default MainLayout;
