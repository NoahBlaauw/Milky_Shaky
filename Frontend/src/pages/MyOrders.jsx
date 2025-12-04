import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import orderService from '../services/orderService';

function MyOrders() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'paid', 'unpaid'
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await orderService.getMyOrders();
      setOrders(data.orders);
    } catch (err) {
      setError('Failed to load your orders. Please try again.');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter orders based on payment status
  const getFilteredOrders = () => {
    if (filter === 'paid') {
      return orders.filter(order => order.isPaid);
    } else if (filter === 'unpaid') {
      return orders.filter(order => !order.isPaid);
    }
    return orders;
  };

  // Toggle order details expansion
  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Loading state
  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>📦 My Orders</h1>
        <p>Loading your order history...</p>
        <div style={{ marginTop: '20px', fontSize: '40px' }}>⏳</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
        <h1>📦 My Orders</h1>
        <div style={{
          padding: '20px',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '8px',
          color: '#721c24',
          marginTop: '20px'
        }}>
          ❌ {error}
        </div>
        <button 
          onClick={fetchOrders}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  const filteredOrders = getFilteredOrders();

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1>📦 My Orders</h1>
        <p style={{ color: '#666' }}>
          Welcome back, <strong>{user.firstname}</strong>! Here's your order history.
        </p>
      </div>

      {/* Empty State */}
      {orders.length === 0 && (
        <div style={{
          padding: '60px',
          textAlign: 'center',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #ddd'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🛒</div>
          <h2>No Orders Yet</h2>
          <p style={{ color: '#666', marginBottom: '30px' }}>
            You haven't placed any orders yet. Start by ordering your first delicious milkshake!
          </p>
          <button
            onClick={() => navigate('/order')}
            style={{
              padding: '12px 30px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Place Your First Order
          </button>
        </div>
      )}

      {/* Orders List */}
      {orders.length > 0 && (
        <>
          {/* Filter Controls */}
          <div style={{
            marginBottom: '30px',
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #ddd',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '15px'
          }}>
            <div>
              <strong>Total Orders: </strong>
              <span style={{ fontSize: '18px', color: '#007bff' }}>{orders.length}</span>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setFilter('all')}
                style={{
                  padding: '8px 16px',
                  backgroundColor: filter === 'all' ? '#007bff' : '#fff',
                  color: filter === 'all' ? 'white' : '#333',
                  border: '1px solid #007bff',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: filter === 'all' ? 'bold' : 'normal'
                }}
              >
                All ({orders.length})
              </button>
              <button
                onClick={() => setFilter('paid')}
                style={{
                  padding: '8px 16px',
                  backgroundColor: filter === 'paid' ? '#28a745' : '#fff',
                  color: filter === 'paid' ? 'white' : '#333',
                  border: '1px solid #28a745',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: filter === 'paid' ? 'bold' : 'normal'
                }}
              >
                Paid ({orders.filter(o => o.isPaid).length})
              </button>
              <button
                onClick={() => setFilter('unpaid')}
                style={{
                  padding: '8px 16px',
                  backgroundColor: filter === 'unpaid' ? '#ffc107' : '#fff',
                  color: filter === 'unpaid' ? '#333' : '#333',
                  border: '1px solid #ffc107',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: filter === 'unpaid' ? 'bold' : 'normal'
                }}
              >
                Unpaid ({orders.filter(o => !o.isPaid).length})
              </button>
            </div>

            <button
              onClick={() => navigate('/order')}
              style={{
                padding: '8px 20px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              + New Order
            </button>
          </div>

          {/* Filtered Orders Display */}
          {filteredOrders.length === 0 ? (
            <div style={{
              padding: '40px',
              textAlign: 'center',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #ddd'
            }}>
              <p style={{ fontSize: '18px', color: '#666' }}>
                No {filter} orders found.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '20px' }}>
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  style={{
                    padding: '25px',
                    backgroundColor: '#fff',
                    border: '2px solid #ddd',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    transition: 'box-shadow 0.2s',
                    cursor: 'pointer'
                  }}
                  onClick={() => toggleOrderDetails(order.id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                  }}
                >
                  {/* Order Header */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '20px',
                    marginBottom: expandedOrderId === order.id ? '20px' : '0'
                  }}>
                    {/* Order ID */}
                    <div>
                      <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                        Order ID
                      </div>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#007bff' }}>
                        #{order.id}
                      </div>
                    </div>

                    {/* Date */}
                    <div>
                      <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                        Order Date
                      </div>
                      <div style={{ fontSize: '14px' }}>
                        {formatDate(order.createdAt)}
                      </div>
                    </div>

                    {/* Number of Drinks */}
                    <div>
                      <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                        Drinks
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                        🥤 {order.drinks.length} {order.drinks.length === 1 ? 'drink' : 'drinks'}
                      </div>
                    </div>

                    {/* Total Amount */}
                    <div>
                      <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                        Total Amount
                      </div>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#28a745' }}>
                        R{order.totalAmount.toFixed(2)}
                      </div>
                    </div>

                    {/* Payment Status */}
                    <div>
                      <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                        Payment Status
                      </div>
                      <div>
                        <span style={{
                          padding: '5px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          backgroundColor: order.isPaid ? '#d4edda' : '#fff3cd',
                          color: order.isPaid ? '#155724' : '#856404',
                          border: order.isPaid ? '1px solid #c3e6cb' : '1px solid #ffeeba'
                        }}>
                          {order.isPaid ? '✅ Paid' : '⏳ Unpaid'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Expandable Details */}
                  {expandedOrderId === order.id && (
                    <div style={{
                      marginTop: '20px',
                      paddingTop: '20px',
                      borderTop: '2px solid #f0f0f0'
                    }}>
                      {/* Pickup Details */}
                      <div style={{
                        padding: '15px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '4px',
                        marginBottom: '20px'
                      }}>
                        <h4 style={{ marginBottom: '10px' }}>📍 Pickup Details</h4>
                        <div style={{ display: 'grid', gap: '10px' }}>
                          <div>
                            <strong>Location:</strong> {order.pickUpLocation}
                          </div>
                          <div>
                            <strong>Pickup Time:</strong> {formatDate(order.pickUpTime)}
                          </div>
                        </div>
                      </div>

                      {/* Drink Details */}
                      <div>
                        <h4 style={{ marginBottom: '15px' }}>🥤 Drink Details</h4>
                        <div style={{ display: 'grid', gap: '10px' }}>
                          {order.drinks.map((drink, index) => (
                            <div
                              key={drink.id}
                              style={{
                                padding: '15px',
                                backgroundColor: '#e9ecef',
                                borderRadius: '4px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                              }}
                            >
                              <div>
                                <strong>Drink #{index + 1}:</strong>
                                <div style={{ fontSize: '14px', marginTop: '5px', color: '#555' }}>
                                  {drink.flavour.name} • {drink.topping.name} • {drink.consistency.name}
                                </div>
                              </div>
                              <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                                R{drink.price.toFixed(2)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Price Breakdown */}
                      <div style={{
                        marginTop: '20px',
                        padding: '15px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '4px'
                      }}>
                        <h4 style={{ marginBottom: '10px' }}>💰 Price Breakdown</h4>
                        <div style={{ display: 'grid', gap: '8px' }}>
                          {order.discountApplied > 0 && (
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              color: '#28a745'
                            }}>
                              <span>Discount Applied:</span>
                              <strong>-R{order.discountApplied.toFixed(2)}</strong>
                            </div>
                          )}
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>VAT (15%):</span>
                            <strong>R{order.vatAmount.toFixed(2)}</strong>
                          </div>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            paddingTop: '10px',
                            borderTop: '2px solid #ddd',
                            fontSize: '18px'
                          }}>
                            <span><strong>Total:</strong></span>
                            <strong style={{ color: '#007bff' }}>
                              R{order.totalAmount.toFixed(2)}
                            </strong>
                          </div>
                        </div>
                      </div>

                      {/* Collapse Button */}
                      <div style={{ marginTop: '15px', textAlign: 'center' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleOrderDetails(order.id);
                          }}
                          style={{
                            padding: '8px 20px',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}
                        >
                          Collapse Details ▲
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Click to expand hint */}
                  {expandedOrderId !== order.id && (
                    <div style={{
                      marginTop: '15px',
                      textAlign: 'center',
                      fontSize: '12px',
                      color: '#999'
                    }}>
                      Click to view details ▼
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default MyOrders;