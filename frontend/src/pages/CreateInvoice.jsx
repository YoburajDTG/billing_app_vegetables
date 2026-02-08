import React, { useState, useEffect } from 'react';
import {
    Plus,
    Trash2,
    Search,
    Save,
    Printer,
    Calendar,
    X,
    ChevronDown,
    FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { inventoryApi, billingApi } from '../services/api';
import InvoicePreview from '../components/InvoicePreview';
import { searchWithTanglish } from '../utils/tanglishMap';
import './CreateInvoice.css';

const CreateInvoice = () => {
    const [items, setItems] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [billingType, setBillingType] = useState('Retail');
    const [discount, setDiscount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [savedBill, setSavedBill] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const response = await inventoryApi.getInventory();
            setInventory(response.data);
        } catch (error) {
            console.error('Failed to fetch inventory:', error);
        }
    };

    const addItem = (veg) => {
        const existing = items.find(item => item.id === veg.id);
        if (existing) {
            setItems(items.map(item =>
                item.id === veg.id ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price } : item
            ));
        } else {
            setItems([...items, {
                id: veg.id,
                name: veg.name,
                tamilName: veg.tamilName,
                price: billingType === 'Wholesale' ? (veg.wholesalePrice || veg.price) : (veg.retailPrice || veg.price),
                quantity: 1,
                total: billingType === 'Wholesale' ? (veg.wholesalePrice || veg.price) : (veg.retailPrice || veg.price),
                unit: 'kg'
            }]);
        }
        setSearchTerm('');
    };

    const removeItem = (id) => {
        setItems(items.filter(item => item.id !== id));
    };

    const updateQuantity = (id, newQty) => {
        if (newQty < 0.1) return;
        setItems(items.map(item =>
            item.id === id ? { ...item, quantity: newQty, total: newQty * item.price } : item
        ));
    };

    const updateItemTotal = (id, newTotal) => {
        setItems(items.map(item =>
            item.id === id ? {
                ...item,
                total: newTotal,
                price: item.quantity > 0 ? newTotal / item.quantity : 0
            } : item
        ));
    };

    const updatePrice = (id, newPrice) => {
        setItems(items.map(item =>
            item.id === id ? {
                ...item,
                price: newPrice,
                total: newPrice * item.quantity
            } : item
        ));
    };

    const calculateSubtotal = () => items.reduce((sum, item) => sum + item.total, 0);
    const calculateTax = () => calculateSubtotal() * 0; // Assuming 0% tax for now
    const calculateTotal = () => Math.max(0, calculateSubtotal() + calculateTax() - discount);

    const handleCreateBill = async () => {
        if (items.length === 0) return;
        setLoading(true);
        try {
            const billData = {
                customer_name: customerName,
                billing_type: billingType,
                items: items.map(item => ({
                    vegetable_id: item.id,
                    name: item.name,
                    tamilName: item.tamilName,
                    quantity: item.quantity,
                    price: item.price,
                    total: item.total
                })),
                subtotal: calculateSubtotal(),
                tax_amount: calculateTax(),
                discount_amount: discount,
                grand_total: calculateTotal()
            };
            const response = await billingApi.createBill(billData);
            setSavedBill(response.data);
            setSuccess(true);
            setItems([]);
            setCustomerName('');
            setDiscount(0);
        } catch (error) {
            console.error('Failed to create bill:', error);
            alert('Error creating bill');
        } finally {
            setLoading(false);
        }
    };

    // Enhanced filter with Tanglish support
    const PRIORITY_ORDER = ['Green Chili', 'Tomato', 'Onion', 'Potato', 'Green Beans', 'Carrot'];

    const filteredInventory = inventory
        .filter(veg => {
            if (!searchTerm) return true;
            const lowerSearch = searchTerm.toLowerCase();
            const tanglishEquivalent = searchWithTanglish(searchTerm);

            return veg.name.toLowerCase().includes(lowerSearch) ||
                veg.name.toLowerCase().includes(tanglishEquivalent) ||
                (veg.tamilName && veg.tamilName.toLowerCase().includes(lowerSearch));
        })
        .sort((a, b) => {
            const getPriorityIndex = (name) => {
                if (name === 'Green Chili' || name === 'Green Chilly') return 0;
                if (name === 'Tomato') return 1;
                if (name === 'Onion') return 2;
                if (name === 'Potato') return 3;
                if (name === 'Green Beans' || name === 'Beans') return 4;
                if (name === 'Carrot') return 5;
                return -1;
            };

            const indexA = getPriorityIndex(a.name);
            const indexB = getPriorityIndex(b.name);

            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;

            return a.name.localeCompare(b.name);
        });

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.search-box')) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="invoice-page">
            <div className="invoice-left">
                <div className="card customer-card">
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Customer Name</label>
                            <input
                                type="text"
                                placeholder="Enter customer name"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Billing Type</label>
                            <div className="toggle-group">
                                <button
                                    className={billingType === 'Retail' ? 'active' : ''}
                                    onClick={() => setBillingType('Retail')}
                                >Retail</button>
                                <button
                                    className={billingType === 'Wholesale' ? 'active' : ''}
                                    onClick={() => setBillingType('Wholesale')}
                                >Wholesale</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card items-card">
                    <div className="table-header">
                        <h3>Bill Items</h3>
                        <div className="search-box">
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="Select or Search vegetable..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setShowResults(true);
                                }}
                                onFocus={() => setShowResults(true)}
                                onClick={() => setShowResults(true)}
                            />
                            <ChevronDown
                                size={18}
                                className={`dropdown-arrow ${showResults ? 'open' : ''}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowResults(!showResults);
                                }}
                            />
                            {showResults && (
                                <div className="search-results">
                                    {filteredInventory.length > 0 ? (
                                        filteredInventory.map(veg => (
                                            <div key={veg.id} className="search-item" onClick={() => {
                                                addItem(veg);
                                                setShowResults(false);
                                            }}>
                                                <div className="item-img">🥬</div>
                                                <div className="item-details">
                                                    <p>{veg.name} ({veg.tamilName})</p>
                                                    <span>₹{billingType === 'Wholesale' ? (veg.wholesalePrice || veg.price) : (veg.retailPrice || veg.price)}/kg</span>
                                                </div>
                                                <Plus size={18} />
                                            </div>
                                        ))
                                    ) : (
                                        <div className="search-item search-empty">
                                            <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>No vegetables found</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <table className="items-table">
                        <thead>
                            <tr>
                                <th>Vegetable</th>
                                <th>Price/kg</th>
                                <th>Quantity (kg)</th>
                                <th>Total</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item => (
                                <tr key={item.id}>
                                    <td>
                                        <div className="item-name-info">
                                            <div className="name-main">{item.name}</div>
                                            <div className="name-sub">{item.tamilName}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="price-control-wrapper">
                                            <span>₹</span>
                                            <input
                                                type="number"
                                                className="price-manual-input"
                                                value={item.price}
                                                onChange={(e) => updatePrice(item.id, parseFloat(e.target.value) || 0)}
                                                onFocus={(e) => e.target.select()}
                                            />
                                        </div>
                                    </td>
                                    <td>
                                        <div className="qty-control">
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 0.5)}>-</button>
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => updateQuantity(item.id, parseFloat(e.target.value))}
                                                onFocus={(e) => e.target.select()}
                                            />
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 0.5)}>+</button>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="total-control-wrapper">
                                            <span>₹</span>
                                            <input
                                                type="number"
                                                className="total-manual-input"
                                                value={item.total}
                                                onChange={(e) => updateItemTotal(item.id, parseFloat(e.target.value) || 0)}
                                                onFocus={(e) => e.target.select()}
                                            />
                                        </div>
                                    </td>
                                    <td>
                                        <button className="remove-btn" onClick={() => removeItem(item.id)}>
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {items.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="empty-row">No items added. Search and add vegetables.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="invoice-right">
                <div className="card summary-card sticky-summary">
                    <h3>Summary</h3>
                    <div className="summary-details">
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>₹{calculateSubtotal().toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Tax (0%)</span>
                            <span>₹{calculateTax().toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Discount</span>
                            <div className="discount-input-wrapper">
                                <span>- ₹</span>
                                <input
                                    type="number"
                                    min="0"
                                    value={discount}
                                    onChange={(e) => setDiscount(Math.max(0, parseFloat(e.target.value) || 0))}
                                    className="discount-input"
                                />
                            </div>
                        </div>
                        <div className="summary-row total">
                            <span>Total Amount</span>
                            <span>₹{calculateTotal().toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="action-buttons">
                        <button
                            className="btn btn-primary full-width"
                            onClick={handleCreateBill}
                            disabled={loading || items.length === 0}
                        >
                            {loading ? 'Processing...' : 'Complete & Save'}
                            <Save size={18} />
                        </button>
                        <button
                            className="btn btn-outline full-width"
                            onClick={() => setShowPreview(true)}
                            disabled={items.length === 0}
                        >
                            Print Preview
                            <Printer size={18} />
                        </button>

                    </div>
                </div>
            </div>

            {showPreview && (
                <InvoicePreview
                    data={success && savedBill ? savedBill : {
                        customerName,
                        billingType,
                        items,
                        subtotal: calculateSubtotal(),
                        taxAmount: calculateTax(),
                        discountAmount: discount,
                        grandTotal: calculateTotal()
                    }}
                    onClose={() => {
                        setShowPreview(false);
                        if (success) setSuccess(false); // Close both if printing from success
                    }}
                />
            )}

            {success && (
                <div className="modal-overlay">
                    <div className="card modal-content success-modal">
                        <div className="success-lottie">
                            <div className="success-icon">✅</div>
                        </div>
                        <h2>Bill Saved Successfully!</h2>
                        <p>Invoice <strong>{savedBill?.billNumber || savedBill?.bill_number}</strong> has been recorded.</p>

                        <div className="modal-actions-grid">
                            <button className="btn btn-primary" onClick={() => {
                                setShowPreview(true);
                                // Note: we'll show the saved bill in the preview
                            }}>
                                <Printer size={18} /> Print Invoice
                            </button>
                            <button className="btn btn-outline" onClick={() => setSuccess(false)}>
                                <Plus size={18} /> Create New
                            </button>
                            <button
                                className="btn btn-outline"
                                onClick={() => {
                                    setSuccess(false);
                                    navigate('/invoices');
                                }}
                            >
                                <FileText size={18} /> View History
                            </button>
                        </div>
                        <button className="close-modal" onClick={() => setSuccess(false)}><X size={20} /></button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateInvoice;
