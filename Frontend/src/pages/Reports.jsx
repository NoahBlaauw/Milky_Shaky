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

  // ==================== STYLES ====================

  const style = {
    // Layout
    pageWrapper: {
      minHeight: '100vh',
      padding: '40px 20px',
      background: 'linear-gradient(135deg, #FFE5EC 0%, #FFF0F5 50%, #FFFFFF 100%)',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      color: '#2D2D2D',
    },
    container: {
      maxWidth: '1400px',
      margin: '0 auto',
      backgroundColor: '#FFFFFF',
      borderRadius: '50px',
      padding: '50px',
      boxShadow: '0 10px 30px rgba(255, 105, 180, 0.2)',
    },
    header: {
      marginBottom: '40px',
      borderBottom: '2px solid #FFE5EC',
      paddingBottom: '20px',
      textAlign: 'center',
    },
    title: {
      fontSize: '2.5rem',
      color: '#FF69B4',
      margin: '0 0 10px 0',
      fontWeight: 'bold',
      textShadow: '2px 2px 0px rgba(255,182,217, 0.3)',
    },
    subtitle: {
      color: '#6B6B6B',
      fontSize: '1.1rem',
    },
    // Tabs
    tabsContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '15px',
      marginBottom: '40px',
      flexWrap: 'wrap',
    },
    tabButton: (isActive) => ({
      padding: '12px 30px',
      backgroundColor: isActive ? '#FF69B4' : 'transparent',
      color: isActive ? '#FFFFFF' : '#FF69B4',
      border: isActive ? '2px solid #FF69B4' : '2px solid #FFE5EC',
      borderRadius: '25px',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '1rem',
      transition: 'all 0.3s',
      outline: 'none',
    }),
    // Cards & Filters
    card: {
      backgroundColor: '#FFFFFF',
      borderRadius: '20px',
      border: '2px solid #FFE5EC',
      padding: '30px',
      marginBottom: '30px',
      boxShadow: '0 5px 15px rgba(0,0,0,0.02)',
    },
    filtersGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '20px',
      marginBottom: '20px',
    },
    // Inputs & Buttons
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: '600',
      color: '#2D2D2D',
      fontSize: '0.9rem',
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '2px solid #FFE5EC',
      borderRadius: '12px',
      fontSize: '0.95rem',
      color: '#2D2D2D',
      outline: 'none',
      backgroundColor: '#FAFAFA',
      transition: 'border-color 0.3s',
    },
    primaryButton: {
      padding: '12px 30px',
      backgroundColor: '#FF69B4',
      color: 'white',
      border: 'none',
      borderRadius: '25px',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '0.9rem',
      boxShadow: '0 4px 10px rgba(255, 105, 180, 0.2)',
      transition: 'transform 0.2s',
      width: '100%',
    },
    // Stats Cards
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '20px',
      marginBottom: '30px',
    },
    statCard: (color) => ({
      padding: '25px',
      backgroundColor: '#FFFFFF',
      border: `2px solid ${color}`,
      borderRadius: '20px',
      textAlign: 'center',
      boxShadow: '0 5px 15px rgba(0,0,0,0.03)',
    }),
    statLabel: {
      fontSize: '0.9rem',
      color: '#6B6B6B',
      marginBottom: '10px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    statValue: (color) => ({
      fontSize: '2rem',
      fontWeight: 'bold',
      color: color,
    }),
    // Tables
    tableWrapper: {
      borderRadius: '20px',
      border: '2px solid #FFE5EC',
      overflow: 'hidden',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      backgroundColor: '#FFFFFF',
    },
    th: {
      padding: '18px 20px',
      textAlign: 'left',
      backgroundColor: '#FFF0F5', // Light pink
      color: '#FF69B4',
      fontWeight: 'bold',
      fontSize: '0.9rem',
      textTransform: 'uppercase',
      borderBottom: '2px solid #FFE5EC',
    },
    td: {
      padding: '18px 20px',
      color: '#2D2D2D',
      borderBottom: '1px solid #FFE5EC',
      fontSize: '0.95rem',
    },
    // Status Pills
    pill: (bg, color) => ({
      padding: '6px 14px',
      borderRadius: '20px',
      fontSize: '0.8rem',
      fontWeight: 'bold',
      backgroundColor: bg,
      color: color,
      display: 'inline-block',
    }),
    // Empty State
    emptyState: {
      padding: '60px',
      textAlign: 'center',
      backgroundColor: '#FFF0F5',
      borderRadius: '20px',
      border: '2px dashed #FFB6D9',
      color: '#6B6B6B',
    },
  };

  // ==================== RENDER FUNCTIONS ====================

  const renderOrdersReport = () => {
    const stats = calculateOrderStats();

    return (
      <div>
        <div style={{ marginBottom: '25px', borderLeft: '5px solid #FF69B4', paddingLeft: '15px' }}>
          <h2 style={{ fontSize: '1.5rem', margin: 0, color: '#2D2D2D' }}>All Orders Report</h2>
        </div>

        {/* Filters */}
        <div style={style.card}>
          <h3 style={{ ...style.label, fontSize: '1.1rem', marginBottom: '20px' }}>Filter Options</h3>
          <div style={style.filtersGrid}>
            <div>
              <label style={style.label}>Start Date</label>
              <input
                type="date"
                name="startDate"
                value={orderFilters.startDate}
                onChange={handleOrderFilterChange}
                style={style.input}
                onFocus={(e) => e.target.style.borderColor = '#FF69B4'}
                onBlur={(e) => e.target.style.borderColor = '#FFE5EC'}
              />
            </div>
            <div>
              <label style={style.label}>End Date</label>
              <input
                type="date"
                name="endDate"
                value={orderFilters.endDate}
                onChange={handleOrderFilterChange}
                style={style.input}
                onFocus={(e) => e.target.style.borderColor = '#FF69B4'}
                onBlur={(e) => e.target.style.borderColor = '#FFE5EC'}
              />
            </div>
            <div>
              <label style={style.label}>Payment Status</label>
              <select
                name="isPaid"
                value={orderFilters.isPaid}
                onChange={handleOrderFilterChange}
                style={style.input}
                onFocus={(e) => e.target.style.borderColor = '#FF69B4'}
                onBlur={(e) => e.target.style.borderColor = '#FFE5EC'}
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
            style={{ ...style.primaryButton, opacity: ordersLoading ? 0.7 : 1 }}
          >
            {ordersLoading ? 'Loading...' : 'Generate Report'}
          </button>
        </div>

        {ordersError && (
          <div style={{ ...style.pill('#FFF0F0', '#D32F2F'), display: 'block', textAlign: 'center', marginBottom: '20px', padding: '15px' }}>
            {ordersError}
          </div>
        )}

        {/* Statistics Cards */}
        {orders.length > 0 && (
          <>
            <div style={style.statsGrid}>
              <div style={style.statCard('#FF69B4')}>
                <div style={style.statLabel}>Total Orders</div>
                <div style={style.statValue('#FF69B4')}>{stats.totalOrders}</div>
              </div>
              <div style={style.statCard('#10B981')}> {/* Green for money */}
                <div style={style.statLabel}>Total Revenue</div>
                <div style={style.statValue('#10B981')}>R{stats.totalRevenue.toFixed(2)}</div>
              </div>
              <div style={style.statCard('#3B82F6')}> {/* Blue */}
                <div style={style.statLabel}>Paid Orders</div>
                <div style={style.statValue('#3B82F6')}>{stats.paidOrders}</div>
              </div>
              <div style={style.statCard('#F59E0B')}> {/* Amber */}
                <div style={style.statLabel}>Unpaid Orders</div>
                <div style={style.statValue('#F59E0B')}>{stats.unpaidOrders}</div>
              </div>
            </div>

            {/* Orders Table */}
            <div style={style.tableWrapper}>
              <div style={{ overflowX: 'auto' }}>
                <table style={style.table}>
                  <thead>
                    <tr>
                      <th style={style.th}>Order ID</th>
                      <th style={style.th}>Customer</th>
                      <th style={style.th}>Date</th>
                      <th style={{ ...style.th, textAlign: 'center' }}>Drinks</th>
                      <th style={{ ...style.th, textAlign: 'right' }}>Total</th>
                      <th style={{ ...style.th, textAlign: 'center' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td style={{ ...style.td, fontWeight: 'bold', color: '#FF69B4' }}>#{order.id}</td>
                        <td style={style.td}>
                          <div style={{ fontWeight: '600' }}>{order.user.firstname}</div>
                          <div style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>{order.user.email}</div>
                        </td>
                        <td style={style.td}>{formatDate(order.createdAt)}</td>
                        <td style={{ ...style.td, textAlign: 'center' }}>
                           {order.drinks.length}
                        </td>
                        <td style={{ ...style.td, textAlign: 'right', fontWeight: 'bold' }}>
                          R{order.totalAmount.toFixed(2)}
                        </td>
                        <td style={{ ...style.td, textAlign: 'center' }}>
                          <span style={order.isPaid 
                            ? style.pill('#D1FAE5', '#065F46') 
                            : style.pill('#FEF3C7', '#92400E')
                          }>
                            {order.isPaid ? 'Paid' : 'Unpaid'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {!ordersLoading && orders.length === 0 && (
          <div style={style.emptyState}>
            <p style={{ fontSize: '1.2rem', margin: 0 }}>No orders found. Adjust filters to generate a report.</p>
          </div>
        )}
      </div>
    );
  };

  const renderTrendsReport = () => {
    const busiestDay = getBusiestDay();

    return (
      <div>
        <div style={{ marginBottom: '25px', borderLeft: '5px solid #FF69B4', paddingLeft: '15px' }}>
          <h2 style={{ fontSize: '1.5rem', margin: 0, color: '#2D2D2D' }}>Day of Week Trends</h2>
          <p style={{ color: '#666', marginTop: '5px' }}>Analyze order volumes to find patterns.</p>
        </div>

        <button
          onClick={fetchDayOfWeekReport}
          disabled={trendsLoading}
          style={{ ...style.primaryButton, width: 'auto', marginBottom: '30px' }}
        >
          {trendsLoading ? 'Loading...' : 'Generate Trend Report'}
        </button>

        {trendsError && (
          <div style={{ ...style.pill('#FFF0F0', '#D32F2F'), display: 'block', textAlign: 'center', marginBottom: '20px', padding: '15px' }}>
            {trendsError}
          </div>
        )}

        {dayOfWeekData && (
          <>
            {busiestDay && (
              <div style={{ ...style.card, background: 'linear-gradient(135deg, #FF69B4 0%, #E91E63 100%)', border: 'none', color: 'white', textAlign: 'center' }}>
                <div style={{ fontSize: '1rem', opacity: 0.9, marginBottom: '10px' }}>Busiest Day</div>
                <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '5px' }}>{busiestDay.day}</div>
                <div style={{ fontSize: '1.2rem', opacity: 0.9 }}>
                  {busiestDay.data.orders} orders • {busiestDay.data.drinks} drinks
                </div>
              </div>
            )}

            <div style={style.tableWrapper}>
                <div style={{ overflowX: 'auto' }}>
                <table style={style.table}>
                  <thead>
                    <tr>
                      <th style={style.th}>Day of Week</th>
                      <th style={{ ...style.th, textAlign: 'center' }}>Total Orders</th>
                      <th style={{ ...style.th, textAlign: 'center' }}>Total Drinks</th>
                      <th style={{ ...style.th, textAlign: 'center' }}>Avg Drinks/Order</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(dayOfWeekData).map(([day, data]) => (
                      <tr key={day}>
                        <td style={{ ...style.td, fontWeight: 'bold' }}>
                          {day}
                          {busiestDay?.day === day && (
                            <span style={{ marginLeft: '10px', ...style.pill('#D1FAE5', '#065F46') }}>
                              Busiest
                            </span>
                          )}
                        </td>
                        <td style={{ ...style.td, textAlign: 'center', fontWeight: 'bold', color: '#FF69B4' }}>
                          {data.orders}
                        </td>
                        <td style={{ ...style.td, textAlign: 'center' }}>
                          {data.drinks}
                        </td>
                        <td style={{ ...style.td, textAlign: 'center', color: '#6B6B6B' }}>
                          {data.orders > 0 ? (data.drinks / data.orders).toFixed(1) : '0.0'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ marginTop: '40px' }}>
              <h3 style={{ ...style.label, fontSize: '1.2rem', marginBottom: '20px' }}>Visual Breakdown</h3>
              <div style={{ display: 'grid', gap: '15px' }}>
                {Object.entries(dayOfWeekData).map(([day, data]) => {
                  const maxOrders = Math.max(...Object.values(dayOfWeekData).map(d => d.orders));
                  const percentage = maxOrders > 0 ? (data.orders / maxOrders) * 100 : 0;

                  return (
                    <div key={day} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={{ width: '100px', fontWeight: '600', color: '#2D2D2D' }}>{day}</div>
                      <div style={{ flex: 1, backgroundColor: '#FFF0F5', borderRadius: '15px', height: '35px', overflow: 'hidden' }}>
                        <div style={{
                          width: `${percentage}%`,
                          height: '100%',
                          backgroundColor: busiestDay?.day === day ? '#E91E63' : '#FF69B4',
                          borderRadius: '15px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          paddingRight: '15px',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '0.85rem',
                          transition: 'width 0.5s ease'
                        }}>
                          {data.orders > 0 && `${data.orders}`}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {!trendsLoading && !dayOfWeekData && (
          <div style={style.emptyState}>
             <p style={{ fontSize: '1.2rem', margin: 0 }}>Click "Generate Trend Report" to see data.</p>
          </div>
        )}
      </div>
    );
  };

  const renderAuditReport = () => {
    return (
      <div>
        <div style={{ marginBottom: '25px', borderLeft: '5px solid #FF69B4', paddingLeft: '15px' }}>
          <h2 style={{ fontSize: '1.5rem', margin: 0, color: '#2D2D2D' }}>Audit Logs</h2>
          <p style={{ color: '#666', marginTop: '5px' }}>Track changes to menu and configuration.</p>
        </div>

        {/* Filters */}
        <div style={style.card}>
          <h3 style={{ ...style.label, fontSize: '1.1rem', marginBottom: '20px' }}>Filter Logs</h3>
          <div style={style.filtersGrid}>
            <div>
              <label style={style.label}>Action Type</label>
              <select
                name="action"
                value={auditFilters.action}
                onChange={handleAuditFilterChange}
                style={style.input}
                onFocus={(e) => e.target.style.borderColor = '#FF69B4'}
                onBlur={(e) => e.target.style.borderColor = '#FFE5EC'}
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
              <label style={style.label}>Start Date</label>
              <input
                type="date"
                name="startDate"
                value={auditFilters.startDate}
                onChange={handleAuditFilterChange}
                style={style.input}
                onFocus={(e) => e.target.style.borderColor = '#FF69B4'}
                onBlur={(e) => e.target.style.borderColor = '#FFE5EC'}
              />
            </div>
            <div>
              <label style={style.label}>End Date</label>
              <input
                type="date"
                name="endDate"
                value={auditFilters.endDate}
                onChange={handleAuditFilterChange}
                style={style.input}
                onFocus={(e) => e.target.style.borderColor = '#FF69B4'}
                onBlur={(e) => e.target.style.borderColor = '#FFE5EC'}
              />
            </div>
          </div>
          <button
            onClick={fetchAuditLogs}
            disabled={auditLoading}
            style={{ ...style.primaryButton, opacity: auditLoading ? 0.7 : 1 }}
          >
            {auditLoading ? 'Loading...' : 'View Logs'}
          </button>
        </div>

        {auditError && (
          <div style={{ ...style.pill('#FFF0F0', '#D32F2F'), display: 'block', textAlign: 'center', marginBottom: '20px', padding: '15px' }}>
            {auditError}
          </div>
        )}

        {auditLogs.length > 0 && (
          <div style={style.tableWrapper}>
             <div style={{ overflowX: 'auto' }}>
            <table style={style.table}>
              <thead>
                <tr>
                  <th style={style.th}>Date/Time</th>
                  <th style={style.th}>User</th>
                  <th style={style.th}>Action</th>
                  <th style={style.th}>Field</th>
                  <th style={style.th}>Change</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id}>
                    <td style={style.td}>{formatDate(log.timestamp)}</td>
                    <td style={style.td}>
                      <div style={{ fontWeight: '600' }}>{log.user.firstname}</div>
                      <div style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>{log.user.email}</div>
                    </td>
                    <td style={style.td}>
                      <span style={style.pill('#F3F4F6', '#374151')}>
                        {log.action}
                      </span>
                    </td>
                    <td style={{ ...style.td, fontWeight: 'bold', color: '#FF69B4' }}>
                      {log.field || '-'}
                    </td>
                    <td style={style.td}>
                      {log.oldValue && log.newValue ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ ...style.pill('#FEF2F2', '#991B1B'), textDecoration: 'line-through', opacity: 0.7 }}>
                            {log.oldValue}
                          </span>
                          <span style={{ color: '#6B6B6B' }}>to</span>
                          <span style={style.pill('#ECFDF5', '#065F46')}>
                            {log.newValue}
                          </span>
                        </div>
                      ) : (
                        <span style={{ color: '#9CA3AF' }}>-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
        )}

        {!auditLoading && auditLogs.length === 0 && (
          <div style={style.emptyState}>
             <p style={{ fontSize: '1.2rem', margin: 0 }}>No audit logs found.</p>
          </div>
        )}
      </div>
    );
  };

  // ==================== MAIN RENDER ====================

  return (
    <div style={style.pageWrapper}>
      <div style={style.container}>
        
        {/* Header */}
        <div style={style.header}>
          <h1 style={style.title}>Reports & Analytics</h1>
          <p style={style.subtitle}>
            Business insights and system logs.
          </p>
        </div>

        {/* Tabs */}
        <div style={style.tabsContainer}>
          <button
            onClick={() => setActiveTab('orders')}
            style={style.tabButton(activeTab === 'orders')}
          >
            All Orders
          </button>
          <button
            onClick={() => setActiveTab('trends')}
            style={style.tabButton(activeTab === 'trends')}
          >
            Day of Week Trends
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            style={style.tabButton(activeTab === 'audit')}
          >
            Audit Logs
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'orders' && renderOrdersReport()}
          {activeTab === 'trends' && renderTrendsReport()}
          {activeTab === 'audit' && renderAuditReport()}
        </div>
      </div>
    </div>
  );
}

export default Reports;