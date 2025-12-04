import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import orderService from '../services/orderService';
import lookupService from '../services/lookupService';

function Reports() {
  const { user } = useAuth();

  // Active tab
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'trends', 'audit'

  // All Orders Report State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState('');
  const [orderFilters, setOrderFilters] = useState({
    startDate: '',
    endDate: '',
    isPaid: ''
  });

  // Day of Week Report State
  const [dayOfWeekData, setDayOfWeekData] = useState(null);
  const [trendsLoading, setTrendsLoading] = useState(false);
  const [trendsError, setTrendsError] = useState('');

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditError, setAuditError] = useState('');
  const [auditFilters, setAuditFilters] = useState({
    action: '',
    startDate: '',
    endDate: ''
  });

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // ==================== ALL ORDERS REPORT ====================

  const fetchAllOrders = async () => {
    setOrdersLoading(true);
    setOrdersError('');
    try {
      const filters = {};
      if (orderFilters.startDate) filters.startDate = orderFilters.startDate;
      if (orderFilters.endDate) filters.endDate = orderFilters.endDate;
      if (orderFilters.isPaid !== '') filters.isPaid = orderFilters.isPaid === 'true';

      const data = await orderService.getAllOrders(filters);
      setOrders(data.orders);
    } catch (err) {
      setOrdersError('Failed to load orders report. Please try again.');
      console.error('Error fetching orders:', err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleOrderFilterChange = (e) => {
    const { name, value } = e.target;
    setOrderFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateOrderStats = () => {
    if (orders.length === 0) return { totalOrders: 0, totalRevenue: 0, paidOrders: 0, unpaidOrders: 0 };

    return {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
      paidOrders: orders.filter(o => o.isPaid).length,
      unpaidOrders: orders.filter(o => !o.isPaid).length
    };
  };

  // ==================== DAY OF WEEK REPORT ====================

  const fetchDayOfWeekReport = async () => {
    setTrendsLoading(true);
    setTrendsError('');
    try {
      const data = await orderService.getDayOfWeekReport();
      setDayOfWeekData(data.dayOfWeek);
    } catch (err) {
      setTrendsError('Failed to load trend analysis. Please try again.');
      console.error('Error fetching trends:', err);
    } finally {
      setTrendsLoading(false);
    }
  };

  const getBusiestDay = () => {
    if (!dayOfWeekData) return null;
    
    const days = Object.entries(dayOfWeekData);
    if (days.length === 0) return null;

    return days.reduce((max, [day, data]) => 
      data.orders > (max?.data?.orders || 0) ? { day, data } : max
    , null);
  };

  // ==================== AUDIT LOGS REPORT ====================

  const fetchAuditLogs = async () => {
    setAuditLoading(true);
    setAuditError('');
    try {
      const filters = {};
      if (auditFilters.action) filters.action = auditFilters.action;
      if (auditFilters.startDate) filters.startDate = auditFilters.startDate;
      if (auditFilters.endDate) filters.endDate = auditFilters.endDate;

      const data = await lookupService.getAuditLogs(filters);
      setAuditLogs(data.logs);
    } catch (err) {
      setAuditError('Failed to load audit logs. Please try again.');
      console.error('Error fetching audit logs:', err);
    } finally {
      setAuditLoading(false);
    }
  };

  const handleAuditFilterChange = (e) => {
    const { name, value } = e.target;
    setAuditFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ==================== RENDER FUNCTIONS ====================

  const renderOrdersReport = () => {
    const stats = calculateOrderStats();

    return (
      <div>
        <h2 style={{ marginBottom: '20px' }}>📊 All Orders Report</h2>

        {/* Filters */}
        <div style={{
          padding: '25px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #ddd',
          marginBottom: '30px'
        }}>
          <h3 style={{ marginBottom: '20px' }}>Filters</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '20px'
          }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={orderFilters.startDate}
                onChange={handleOrderFilterChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={orderFilters.endDate}
                onChange={handleOrderFilterChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Payment Status
              </label>
              <select
                name="isPaid"
                value={orderFilters.isPaid}
                onChange={handleOrderFilterChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                <option value="">All Orders</option>
                <option value="true">Paid Only</option>
                <option value="false">Unpaid Only</option>
              </select>
            </div>
          </div>

          <button
            onClick={fetchAllOrders}
            disabled={ordersLoading}
            style={{
              padding: '10px 30px',
              backgroundColor: ordersLoading ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: ordersLoading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            {ordersLoading ? 'Loading...' : '🔍 Generate Report'}
          </button>
        </div>

        {/* Error Message */}
        {ordersError && (
          <div style={{
            padding: '15px',
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
            color: '#721c24',
            marginBottom: '20px'
          }}>
            ❌ {ordersError}
          </div>
        )}

        {/* Statistics Cards */}
        {orders.length > 0 && (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              marginBottom: '30px'
            }}>
              <div style={{
                padding: '20px',
                backgroundColor: '#007bff',
                color: 'white',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '14px', marginBottom: '10px' }}>Total Orders</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.totalOrders}</div>
              </div>

              <div style={{
                padding: '20px',
                backgroundColor: '#28a745',
                color: 'white',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '14px', marginBottom: '10px' }}>Total Revenue</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold' }}>R{stats.totalRevenue.toFixed(2)}</div>
              </div>

              <div style={{
                padding: '20px',
                backgroundColor: '#17a2b8',
                color: 'white',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '14px', marginBottom: '10px' }}>Paid Orders</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.paidOrders}</div>
              </div>

              <div style={{
                padding: '20px',
                backgroundColor: '#ffc107',
                color: '#333',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '14px', marginBottom: '10px' }}>Unpaid Orders</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.unpaidOrders}</div>
              </div>
            </div>

            {/* Orders Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                backgroundColor: '#fff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#007bff', color: 'white' }}>
                    <th style={{ padding: '15px', textAlign: 'left' }}>Order ID</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>Customer</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>Date</th>
                    <th style={{ padding: '15px', textAlign: 'center' }}>Drinks</th>
                    <th style={{ padding: '15px', textAlign: 'right' }}>Total</th>
                    <th style={{ padding: '15px', textAlign: 'center' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr
                      key={order.id}
                      style={{
                        borderBottom: '1px solid #ddd',
                        backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff'
                      }}
                    >
                      <td style={{ padding: '15px', fontWeight: 'bold' }}>#{order.id}</td>
                      <td style={{ padding: '15px' }}>
                        {order.user.firstname}
                        <div style={{ fontSize: '12px', color: '#666' }}>{order.user.email}</div>
                      </td>
                      <td style={{ padding: '15px', fontSize: '14px' }}>
                        {formatDate(order.createdAt)}
                      </td>
                      <td style={{ padding: '15px', textAlign: 'center' }}>
                        🥤 {order.drinks.length}
                      </td>
                      <td style={{ padding: '15px', textAlign: 'right', fontWeight: 'bold' }}>
                        R{order.totalAmount.toFixed(2)}
                      </td>
                      <td style={{ padding: '15px', textAlign: 'center' }}>
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* No Results */}
        {!ordersLoading && orders.length === 0 && (
          <div style={{
            padding: '60px',
            textAlign: 'center',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #ddd'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>📭</div>
            <p style={{ fontSize: '18px', color: '#666' }}>
              No orders found. Try adjusting your filters or generate a report.
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderTrendsReport = () => {
    const busiestDay = getBusiestDay();

    return (
      <div>
        <h2 style={{ marginBottom: '20px' }}>📈 Day of Week Trend Analysis</h2>
        <p style={{ color: '#666', marginBottom: '30px' }}>
          Analyze order volumes by day of the week to identify trends and patterns.
        </p>

        <button
          onClick={fetchDayOfWeekReport}
          disabled={trendsLoading}
          style={{
            padding: '12px 30px',
            backgroundColor: trendsLoading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: trendsLoading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            marginBottom: '30px'
          }}
        >
          {trendsLoading ? 'Loading...' : '🔍 Generate Trend Report'}
        </button>

        {/* Error Message */}
        {trendsError && (
          <div style={{
            padding: '15px',
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
            color: '#721c24',
            marginBottom: '20px'
          }}>
            ❌ {trendsError}
          </div>
        )}

        {/* Trend Data */}
        {dayOfWeekData && (
          <>
            {/* Busiest Day Card */}
            {busiestDay && (
              <div style={{
                padding: '25px',
                backgroundColor: '#28a745',
                color: 'white',
                borderRadius: '8px',
                marginBottom: '30px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '16px', marginBottom: '10px' }}>🏆 Busiest Day</div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '10px' }}>
                  {busiestDay.day}
                </div>
                <div style={{ fontSize: '18px' }}>
                  {busiestDay.data.orders} orders • {busiestDay.data.drinks} drinks
                </div>
              </div>
            )}

            {/* Day of Week Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                backgroundColor: '#fff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#007bff', color: 'white' }}>
                    <th style={{ padding: '15px', textAlign: 'left' }}>Day of Week</th>
                    <th style={{ padding: '15px', textAlign: 'center' }}>Total Orders</th>
                    <th style={{ padding: '15px', textAlign: 'center' }}>Total Drinks</th>
                    <th style={{ padding: '15px', textAlign: 'center' }}>Avg Drinks/Order</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(dayOfWeekData).map(([day, data], index) => (
                    <tr
                      key={day}
                      style={{
                        borderBottom: '1px solid #ddd',
                        backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff'
                      }}
                    >
                      <td style={{ padding: '15px', fontWeight: 'bold' }}>
                        {day}
                        {busiestDay?.day === day && (
                          <span style={{
                            marginLeft: '10px',
                            padding: '3px 8px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            borderRadius: '12px',
                            fontSize: '11px'
                          }}>
                            🏆 Busiest
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '15px', textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>
                        {data.orders}
                      </td>
                      <td style={{ padding: '15px', textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>
                        {data.drinks}
                      </td>
                      <td style={{ padding: '15px', textAlign: 'center' }}>
                        {data.orders > 0 ? (data.drinks / data.orders).toFixed(1) : '0.0'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Visual Bar Chart */}
            <div style={{ marginTop: '40px' }}>
              <h3 style={{ marginBottom: '20px' }}>📊 Visual Breakdown</h3>
              <div style={{ display: 'grid', gap: '15px' }}>
                {Object.entries(dayOfWeekData).map(([day, data]) => {
                  const maxOrders = Math.max(...Object.values(dayOfWeekData).map(d => d.orders));
                  const percentage = maxOrders > 0 ? (data.orders / maxOrders) * 100 : 0;

                  return (
                    <div key={day} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={{ width: '120px', fontWeight: 'bold' }}>{day}</div>
                      <div style={{ flex: 1, backgroundColor: '#e9ecef', borderRadius: '4px', height: '40px', position: 'relative' }}>
                        <div style={{
                          width: `${percentage}%`,
                          height: '100%',
                          backgroundColor: busiestDay?.day === day ? '#28a745' : '#007bff',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          paddingRight: '10px',
                          color: 'white',
                          fontWeight: 'bold',
                          transition: 'width 0.3s ease'
                        }}>
                          {data.orders > 0 && `${data.orders} orders`}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* No Data */}
        {!trendsLoading && !dayOfWeekData && (
          <div style={{
            padding: '60px',
            textAlign: 'center',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #ddd'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>📊</div>
            <p style={{ fontSize: '18px', color: '#666' }}>
              Click "Generate Trend Report" to see day-of-week analysis.
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderAuditReport = () => {
    return (
      <div>
        <h2 style={{ marginBottom: '20px' }}>📝 Audit Log - Lookup Change History</h2>
        <p style={{ color: '#666', marginBottom: '30px' }}>
          Track all changes made to flavours, toppings, consistencies, and system configuration.
        </p>

        {/* Filters */}
        <div style={{
          padding: '25px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #ddd',
          marginBottom: '30px'
        }}>
          <h3 style={{ marginBottom: '20px' }}>Filters</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '20px'
          }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Action Type
              </label>
              <select
                name="action"
                value={auditFilters.action}
                onChange={handleAuditFilterChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                <option value="">All Actions</option>
                <option value="UPDATE_FLAVOUR">Update Flavour</option>
                <option value="UPDATE_TOPPING">Update Topping</option>
                <option value="UPDATE_CONSISTENCY">Update Consistency</option>
                <option value="UPDATE_CONFIG">Update Config</option>
                <option value="CREATE_ORDER">Create Order</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={auditFilters.startDate}
                onChange={handleAuditFilterChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={auditFilters.endDate}
                onChange={handleAuditFilterChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>

          <button
            onClick={fetchAuditLogs}
            disabled={auditLoading}
            style={{
              padding: '10px 30px',
              backgroundColor: auditLoading ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: auditLoading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            {auditLoading ? 'Loading...' : '🔍 View Audit Logs'}
          </button>
        </div>

        {/* Error Message */}
        {auditError && (
          <div style={{
            padding: '15px',
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
            color: '#721c24',
            marginBottom: '20px'
          }}>
            ❌ {auditError}
          </div>
        )}

        {/* Audit Logs Table */}
        {auditLogs.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              backgroundColor: '#fff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#007bff', color: 'white' }}>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Date/Time</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>User</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Action</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Field</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Change</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log, index) => (
                  <tr
                    key={log.id}
                    style={{
                      borderBottom: '1px solid #ddd',
                      backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff'
                    }}
                  >
                    <td style={{ padding: '15px', fontSize: '14px' }}>
                      {formatDate(log.timestamp)}
                    </td>
                    <td style={{ padding: '15px' }}>
                      <strong>{log.user.firstname}</strong>
                      <div style={{ fontSize: '12px', color: '#666' }}>{log.user.email}</div>
                    </td>
                    <td style={{ padding: '15px' }}>
                      <span style={{
                        padding: '5px 10px',
                        backgroundColor: '#e9ecef',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {log.action}
                      </span>
                    </td>
                    <td style={{ padding: '15px', fontWeight: 'bold' }}>
                      {log.field || '-'}
                    </td>
                    <td style={{ padding: '15px' }}>
                      {log.oldValue && log.newValue ? (
                        <div>
                          <span style={{ 
                            padding: '3px 8px', 
                            backgroundColor: '#f8d7da', 
                            borderRadius: '4px',
                            textDecoration: 'line-through',
                            marginRight: '10px'
                          }}>
                            {log.oldValue}
                          </span>
                          →
                          <span style={{ 
                            padding: '3px 8px', 
                            backgroundColor: '#d4edda', 
                            borderRadius: '4px',
                            marginLeft: '10px'
                          }}>
                            {log.newValue}
                          </span>
                        </div>
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* No Results */}
        {!auditLoading && auditLogs.length === 0 && (
          <div style={{
            padding: '60px',
            textAlign: 'center',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #ddd'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>📝</div>
            <p style={{ fontSize: '18px', color: '#666' }}>
              No audit logs found. Try adjusting your filters or view all logs.
            </p>
          </div>
        )}
      </div>
    );
  };

  // ==================== MAIN RENDER ====================

  return (
    <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1>📊 Reports & Analytics</h1>
        <p style={{ color: '#666' }}>
          Comprehensive reports and business insights
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '30px',
        borderBottom: '2px solid #ddd',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setActiveTab('orders')}
          style={{
            padding: '12px 24px',
            backgroundColor: activeTab === 'orders' ? '#007bff' : 'transparent',
            color: activeTab === 'orders' ? 'white' : '#333',
            border: 'none',
            borderBottom: activeTab === 'orders' ? '3px solid #007bff' : 'none',
            cursor: 'pointer',
            fontWeight: activeTab === 'orders' ? 'bold' : 'normal',
            fontSize: '16px'
          }}
        >
          📊 All Orders
        </button>
        <button
          onClick={() => setActiveTab('trends')}
          style={{
            padding: '12px 24px',
            backgroundColor: activeTab === 'trends' ? '#007bff' : 'transparent',
            color: activeTab === 'trends' ? 'white' : '#333',
            border: 'none',
            borderBottom: activeTab === 'trends' ? '3px solid #007bff' : 'none',
            cursor: 'pointer',
            fontWeight: activeTab === 'trends' ? 'bold' : 'normal',
            fontSize: '16px'
          }}
        >
          📈 Day of Week Trends
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          style={{
            padding: '12px 24px',
            backgroundColor: activeTab === 'audit' ? '#007bff' : 'transparent',
            color: activeTab === 'audit' ? 'white' : '#333',
            border: 'none',
            borderBottom: activeTab === 'audit' ? '3px solid #007bff' : 'none',
            cursor: 'pointer',
            fontWeight: activeTab === 'audit' ? 'bold' : 'normal',
            fontSize: '16px'
          }}
        >
          📝 Audit Logs
        </button>
      </div>

      {/* Tab Content */}
      <div style={{
        padding: '30px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        border: '1px solid #ddd',
        minHeight: '500px'
      }}>
        {activeTab === 'orders' && renderOrdersReport()}
        {activeTab === 'trends' && renderTrendsReport()}
        {activeTab === 'audit' && renderAuditReport()}
      </div>
    </div>
  );
}

export default Reports;