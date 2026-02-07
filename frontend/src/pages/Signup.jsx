import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, UserPlus, Store, Phone } from 'lucide-react';
import { authApi } from '../services/api';
import logo from '../assets/login_logo.png';
import './Auth.css';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        shop_name: '',
        mobile_number: '',
        role: 'admin' // Default role
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await authApi.signup(formData);
            // Redirect to login after successful signup
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.detail || 'Signup failed');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card glass">
                <div className="auth-header">
                    <div className="auth-logo-img">
                        <img src={logo} alt="Suji Vegetables" />
                    </div>
                    <h1>Create Account</h1>
                    <p>Get started with your vegetable shop</p>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Username</label>
                        <div className="input-with-icon">
                            <Mail size={20} />
                            <input
                                type="text"
                                name="username"
                                placeholder="Choose a username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Shop Name</label>
                        <div className="input-with-icon">
                            <Store size={20} />
                            <input
                                type="text"
                                name="shop_name"
                                placeholder="Your Shop Name"
                                value={formData.shop_name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Mobile Number</label>
                        <div className="input-with-icon">
                            <Phone size={20} />
                            <input
                                type="tel"
                                name="mobile_number"
                                placeholder="Mobile Number"
                                value={formData.mobile_number}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <div className="input-with-icon">
                            <Lock size={20} />
                            <input
                                type="password"
                                name="password"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                        <UserPlus size={20} />
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Already have an account? <Link to="/login">Log In</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
