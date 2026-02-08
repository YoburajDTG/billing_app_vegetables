import React, { useRef } from 'react';
import { X, Printer } from 'lucide-react';
import { format } from 'date-fns';
import './InvoicePreview.css';

const InvoicePreview = ({ data, onClose }) => {
    const componentRef = useRef();

    const handlePrint = () => {
        window.print();
    };

    const {
        shopName = "Suji Vegetables",
        customerName,
        billNumber = "DRAFT",
        date = new Date(),
        items = [],
        subtotal = 0,
        taxAmount = 0,
        discountAmount = 0,
        grandTotal = 0,
        billingType,
        mode
    } = data;

    const displayShopName = (shopName && shopName !== "SUJI") ? shopName : "Suji Vegetables";
    const displayType = billingType || mode;

    return (
        <div className="preview-overlay">
            <div className="preview-container">
                <div className="preview-header-actions no-print">
                    <h2>Bill Preview</h2>
                    <div className="actions-right">
                        <button className="btn btn-primary" onClick={handlePrint}>
                            <Printer size={18} /> Print
                        </button>
                        <button className="btn btn-outline" onClick={onClose}>
                            <X size={18} /> Close
                        </button>
                    </div>
                </div>

                <div className="preview-body">
                    <div className="bill-paper" ref={componentRef}>
                        <div className="bill-header">
                            <h1>Suji Vegetables</h1>
                            <p className="address">Pondy - Tindivanam Main Raod, Kiliyanur</p>
                            <p className="phone">Phone: +91 9095938085</p>
                        </div>

                        <div className="bill-meta">
                            <div className="meta-left">
                                <p><strong>Bill To:</strong> {customerName || 'Walking Customer'}</p>
                                <p><strong>Type:</strong> {displayType}</p>
                            </div>
                            <div className="meta-right">
                                <p><strong>Bill No:</strong> {billNumber}</p>
                                <p><strong>Date:</strong> {format(new Date(date), 'dd/MM/yyyy HH:mm')}</p>
                            </div>
                        </div>

                        <table className="bill-table">
                            <thead>
                                <tr>
                                    <th className="item-col">Item</th>
                                    <th className="qty-col">Qty</th>
                                    <th className="price-col">Price</th>
                                    <th className="total-col">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, index) => (
                                    <tr key={index}>
                                        <td>
                                            {item.name || item.vegetableName}
                                            {(item.tamilName || item.tamil_name) && (
                                                <span className="tamil-font"> {item.tamilName || item.tamil_name}</span>
                                            )}
                                        </td>
                                        <td>{item.quantity || item.qty_kg} kg</td>
                                        <td>{(item.price || 0).toFixed(2)}</td>
                                        <td>{(item.total || item.subtotal || 0).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="bill-summary">
                            <div className="summary-row">
                                <span className="label">Subtotal:</span>
                                <span>₹{(subtotal).toFixed(2)}</span>
                            </div>
                            {taxAmount > 0 && (
                                <div className="summary-row">
                                    <span className="label">Tax:</span>
                                    <span>₹{(taxAmount).toFixed(2)}</span>
                                </div>
                            )}
                            {discountAmount > 0 && (
                                <div className="summary-row">
                                    <span className="label">Discount:</span>
                                    <span>- ₹{(discountAmount).toFixed(2)}</span>
                                </div>
                            )}
                            <div className="summary-row grand-total">
                                <span className="label">Grand Total:</span>
                                <span>₹{(grandTotal).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoicePreview;
