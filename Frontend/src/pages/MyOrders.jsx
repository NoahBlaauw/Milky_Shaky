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

  // Home Page Color Variables
  const PRIMARY_PINK = '#FF1493'; // Deep Pink / Fuchsia
  const LIGHT_PINK = '#FF69B4'; // Hot Pink
  const EXTRA_LIGHT_PINK = '#FFB6C1'; // Light Pink
  const BACKGROUND_GRADIENT = 'linear-gradient(135deg, #FFE5EC 0%, #FFC2D4 50%, #FFB3C6 100%)';

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      // NOTE: Assuming orderService.getMyOrders returns { orders: [] }
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

  // Shared container styles based on Home component
  const pageContainerStyle = {
    minHeight: 'calc(100vh - 140px)', // To match Home, assuming 140px header/footer
    background: BACKGROUND_GRADIENT,
    padding: '80px 40px',
    position: 'relative',
    overflow: 'hidden'
  };

  const mainContentWrapperStyle = {
    maxWidth: '1200px', // Slightly wider than home for table/list content
    margin: '0 auto',
    position: 'relative',
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparent white card background
    borderRadius: '24px',
    boxShadow: `0 20px 60px rgba(255, 105, 180, 0.15), 0 0 1px rgba(255, 105, 180, 0.1)`,
    border: '1px solid rgba(255, 182, 217, 0.3)',
    backdropFilter: 'blur(10px)',
    padding: '40px'
  };

  // Loading state
  if (loading) {
    return (
      <div style={pageContainerStyle}>
        <div style={mainContentWrapperStyle}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ color: PRIMARY_PINK }}>My Orders</h1>
            <p>Loading your order history...</p>
            <div style={{ marginTop: '20px', fontSize: '40px' }}></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={pageContainerStyle}>
        <div style={mainContentWrapperStyle}>
          <h1 style={{ color: PRIMARY_PINK }}>My Orders</h1>
          <div style={{
            padding: '20px',
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            borderRadius: '8px',
            color: '#721c24',
            marginTop: '20px'
          }}>
            {error}
          </div>
          <button
            onClick={fetchOrders}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: PRIMARY_PINK,
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const filteredOrders = getFilteredOrders();

  return (
    <div style={pageContainerStyle}>
      {/* Decorative background elements and animations (copied from Home) */}
      <div style={{
        position: 'absolute',
        top: '5%',
        left: '-5%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(255, 105, 180, 0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '-10%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(255, 182, 193, 0.2) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(80px)'
      }} />
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(100px)',
        animation: 'pulse 8s infinite ease-in-out'
      }} />
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '10%',
        width: '60px',
        height: '60px',
        background: 'linear-gradient(135deg, rgba(255, 105, 180, 0.2) 0%, rgba(255, 20, 147, 0.1) 100%)',
        borderRadius: '50% 50% 50% 0',
        transform: 'rotate(-45deg)',
        animation: 'float 6s infinite ease-in-out'
      }} />
      <div style={{
        position: 'absolute',
        top: '70%',
        right: '15%',
        width: '45px',
        height: '45px',
        background: 'linear-gradient(135deg, rgba(255, 182, 193, 0.25) 0%, rgba(255, 105, 180, 0.15) 100%)',
        borderRadius: '50% 50% 50% 0',
        transform: 'rotate(135deg)',
        animation: 'float 8s infinite ease-in-out 2s'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '25%',
        left: '20%',
        width: '35px',
        height: '35px',
        background: 'linear-gradient(135deg, rgba(255, 20, 147, 0.2) 0%, rgba(255, 105, 180, 0.1) 100%)',
        borderRadius: '50% 50% 50% 0',
        transform: 'rotate(45deg)',
        animation: 'float 7s infinite ease-in-out 1s'
      }} />
      
      <div style={mainContentWrapperStyle}>
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{
            fontSize: '48px',
            marginBottom: '10px',
            background: `linear-gradient(135deg, ${PRIMARY_PINK} 0%, ${LIGHT_PINK} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: '800',
            letterSpacing: '-0.5px'
          }}>
            My Orders
          </h1>
          <p style={{ color: '#4A4A4A' }}>
            Welcome back, <strong style={{ color: PRIMARY_PINK }}>{user.firstname}</strong>! Here's your order history.
          </p>
        </div>

        {/* Empty State */}
        {orders.length === 0 && (
          <div style={{
            padding: '60px',
            textAlign: 'center',
            backgroundColor: 'rgba(255, 228, 233, 0.5)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 182, 217, 0.3)',
            boxShadow: '0 4px 12px rgba(255, 105, 180, 0.05)'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}></div>
            <h2 style={{ color: PRIMARY_PINK }}>No Orders Yet</h2>
            <p style={{ color: '#666', marginBottom: '30px' }}>
              You haven't placed any orders yet. Start by ordering your first delicious milkshake!
            </p>
            <button
              onClick={() => navigate('/order')}
              style={{
                padding: '12px 30px',
                background: `linear-gradient(135deg, ${PRIMARY_PINK} 0%, ${LIGHT_PINK} 100%)`,
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                cursor: 'pointer',
                fontWeight: '600',
                boxShadow: `0 8px 24px rgba(255, 20, 147, 0.3)`,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 12px 32px rgba(255, 20, 147, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 24px rgba(255, 20, 147, 0.3)';
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
              backgroundColor: 'rgba(255, 228, 233, 0.5)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 182, 217, 0.3)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '15px'
            }}>
              <div>
                <strong style={{ color: PRIMARY_PINK }}>Total Orders: </strong>
                <span style={{ fontSize: '18px', color: LIGHT_PINK }}>{orders.length}</span>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setFilter('all')}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: filter === 'all' ? PRIMARY_PINK : 'white',
                    color: filter === 'all' ? 'white' : PRIMARY_PINK,
                    border: `1px solid ${PRIMARY_PINK}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.2s'
                  }}
                >
                  All ({orders.length})
                </button>
                <button
                  onClick={() => setFilter('paid')}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: filter === 'paid' ? '#38b000' : 'white', // Green for Paid
                    color: filter === 'paid' ? 'white' : '#38b000',
                    border: '1px solid #38b000',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.2s'
                  }}
                >
                  Paid ({orders.filter(o => o.isPaid).length})
                </button>
                <button
                  onClick={() => setFilter('unpaid')}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: filter === 'unpaid' ? '#ffc107' : 'white', // Amber for Unpaid
                    color: filter === 'unpaid' ? '#333' : '#ffc107',
                    border: '1px solid #ffc107',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.2s'
                  }}
                >
                  Unpaid ({orders.filter(o => !o.isPaid).length})
                </button>
              </div>

              <button
                onClick={() => navigate('/order')}
                style={{
                  padding: '8px 20px',
                  backgroundColor: LIGHT_PINK,
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  boxShadow: `0 4px 10px rgba(255, 105, 180, 0.2)`
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
                backgroundColor: 'rgba(255, 228, 233, 0.3)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 182, 217, 0.3)'
              }}>
                <p style={{ fontSize: '18px', color: PRIMARY_PINK }}>
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
                      backgroundColor: 'white',
                      border: `2px solid ${EXTRA_LIGHT_PINK}`,
                      borderRadius: '16px',
                      boxShadow: '0 4px 12px rgba(255, 105, 180, 0.1)',
                      transition: 'all 0.3s',
                      cursor: 'pointer',
                      position: 'relative',
                    }}
                    onClick={() => toggleOrderDetails(order.id)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(255, 105, 180, 0.2)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 105, 180, 0.1)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {/* Order Header */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                      gap: '20px',
                      marginBottom: expandedOrderId === order.id ? '20px' : '0',
                    }}>
                      {/* Order ID */}
                      <div>
                        <div style={{ fontSize: '12px', color: PRIMARY_PINK, marginBottom: '5px', fontWeight: 'bold' }}>
                          Order ID
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: PRIMARY_PINK }}>
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
                          {order.drinks.length} {order.drinks.length === 1 ? 'drink' : 'drinks'}
                        </div>
                      </div>

                      {/* Total Amount */}
                      <div>
                        <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                          Total Amount
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#38b000' }}>
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
                            borderRadius: '16px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            backgroundColor: order.isPaid ? '#d4edda' : '#fff3cd',
                            color: order.isPaid ? '#155724' : '#856404',
                            border: order.isPaid ? '1px solid #c3e6cb' : '1px solid #ffeeba'
                          }}>
                            {order.isPaid ? 'Paid' : 'Unpaid'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Expandable Details */}
                    {expandedOrderId === order.id && (
                      <div style={{
                        marginTop: '20px',
                        paddingTop: '20px',
                        borderTop: `2px solid ${EXTRA_LIGHT_PINK}`
                      }}>
                        {/* Pickup Details */}
                        <div style={{
                          padding: '15px',
                          backgroundColor: 'rgba(255, 240, 245, 0.8)', // Light themed background
                          borderRadius: '8px',
                          marginBottom: '20px',
                          border: `1px solid ${EXTRA_LIGHT_PINK}`
                        }}>
                          <h4 style={{ marginBottom: '10px', color: PRIMARY_PINK }}>Pickup Details</h4>
                          <div style={{ display: 'grid', gap: '10px' }}>
                            <div>
                              <strong style={{ color: '#4A4A4A' }}>Location:</strong> {order.pickUpLocation}
                            </div>
                            <div>
                              <strong style={{ color: '#4A4A4A' }}>Pickup Time:</strong> {formatDate(order.pickUpTime)}
                            </div>
                          </div>
                        </div>

                        {/* Drink Details */}
                        <div>
                          <h4 style={{ marginBottom: '15px', color: PRIMARY_PINK }}>Drink Details</h4>
                          <div style={{ display: 'grid', gap: '10px' }}>
                            {order.drinks.map((drink, index) => (
                              <div
                                key={drink.id}
                                style={{
                                  padding: '15px',
                                  backgroundColor: 'rgba(255, 245, 250, 0.8)', // Very light themed background
                                  borderRadius: '8px',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  borderLeft: `5px solid ${LIGHT_PINK}`
                                }}
                              >
                                <div>
                                  <strong style={{ color: PRIMARY_PINK }}>Drink #{index + 1}:</strong>
                                  <div style={{ fontSize: '14px', marginTop: '5px', color: '#555' }}>
                                    {drink.flavour.name} • {drink.topping.name} • {drink.consistency.name}
                                  </div>
                                </div>
                                <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#38b000' }}>
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
                          backgroundColor: 'rgba(255, 240, 245, 0.8)',
                          borderRadius: '8px',
                          border: `1px solid ${EXTRA_LIGHT_PINK}`
                        }}>
                          <h4 style={{ marginBottom: '10px', color: PRIMARY_PINK }}>Price Breakdown</h4>
                          <div style={{ display: 'grid', gap: '8px' }}>
                            {order.discountApplied > 0 && (
                              <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                color: '#38b000'
                              }}>
                                <span>Discount Applied:</span>
                                <strong>-R{order.discountApplied.toFixed(2)}</strong>
                              </div>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666' }}>
                              <span>VAT (15%):</span>
                              <strong>R{order.vatAmount.toFixed(2)}</strong>
                            </div>
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              paddingTop: '10px',
                              borderTop: `2px solid ${EXTRA_LIGHT_PINK}`,
                              fontSize: '18px'
                            }}>
                              <span><strong>Total:</strong></span>
                              <strong style={{ color: PRIMARY_PINK }}>
                                R{order.totalAmount.toFixed(2)}
                              </strong>
                            </div>
                          </div>
                        </div>

                        {/* Collapse Button */}
                        <div style={{ marginTop: '20px', textAlign: 'center' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleOrderDetails(order.id);
                            }}
                            style={{
                              padding: '8px 20px',
                              backgroundColor: LIGHT_PINK,
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              fontWeight: '600'
                            }}
                          >
                            Collapse Details
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
                        color: LIGHT_PINK
                      }}>
                        Click to view details
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* CSS Animations (copied from Home) */}
      <style>
        {`
          @keyframes float {
            0%, 100% { 
              transform: translateY(0px) rotate(-45deg); 
            }
            50% { 
              transform: translateY(-25px) rotate(-45deg); 
            }
          }

          @keyframes pulse {
            0%, 100% { 
              opacity: 0.3;
              transform: translate(-50%, -50%) scale(1);
            }
            50% { 
              opacity: 0.5;
              transform: translate(-50%, -50%) scale(1.1);
            }
          }
        `}
      </style>
    </div>
  );
}

export default MyOrders;