import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import lookupService from '../services/lookupService';

/**
 * ## Lookup Management Component (Milkshake Theme)
 * * Styled with soft pinks, rounded corners, and clean typography.
 * No animations, no emojis.
 */
function LookupManagement() {
  const { user } = useAuth();

  // --- State Hooks (Logic Unchanged) ---

  const [lookups, setLookups] = useState({
    flavours: [],
    toppings: [],
    consistencies: [],
    config: null,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('flavours'); 

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [modalType, setModalType] = useState('flavours'); 
  const [currentItem, setCurrentItem] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    fee: '',
  });

  const [configData, setConfigData] = useState({
    maxDrinks: '',
    vatPercentage: '',
    discountTier1Orders: '',
    discountTier1MinDrinks: '',
    discountTier2Orders: '',
    discountTier2MinDrinks: '',
    discountTier3Orders: '',
    discountTier3MinDrinks: '',
    maxDiscountAmount: '',
  });

  // --- Effect Hooks ---

  useEffect(() => {
    fetchLookups();
  }, []);

  useEffect(() => {
    if (lookups.config) {
      setConfigData({
        maxDrinks: String(lookups.config.maxDrinks || ''),
        vatPercentage: String(lookups.config.vatPercentage || ''),
        discountTier1Orders: String(lookups.config.discountTier1Orders || ''),
        discountTier1MinDrinks: String(lookups.config.discountTier1MinDrinks || ''),
        discountTier2Orders: String(lookups.config.discountTier2Orders || ''),
        discountTier2MinDrinks: String(lookups.config.discountTier2MinDrinks || ''),
        discountTier3Orders: String(lookups.config.discountTier3Orders || ''),
        discountTier3MinDrinks: String(lookups.config.discountTier3MinDrinks || ''),
        maxDiscountAmount: String(lookups.config.maxDiscountAmount || ''),
      });
    }
  }, [lookups.config]);

  // --- Data Fetching and Utility Functions ---

  const fetchLookups = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await lookupService.getAllLookups();
      setLookups(data);
    } catch (err) {
      setError('Failed to load lookup data. Please refresh the page.');
      console.error('Error fetching lookups:', err);
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleCreate = (type) => {
    setModalMode('create');
    setModalType(type);
    setCurrentItem(null);
    setFormData({ name: '', fee: '' });
    setShowModal(true);
  };

  const handleEdit = (type, item) => {
    setModalMode('edit');
    setModalType(type);
    setCurrentItem(item);
    setFormData({ name: item.name, fee: String(item.fee) });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ name: '', fee: '' });
    setCurrentItem(null);
    setError('');
  };

  // --- Form Handlers ---

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleConfigChange = (e) => {
    const { name, value } = e.target;
    setConfigData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const name = formData.name.trim();
    const feeValue = parseFloat(formData.fee);

    if (!name) {
      setError('Name is required');
      return;
    }
    if (isNaN(feeValue) || feeValue < 0) {
      setError('Fee must be a non-negative number');
      return;
    }

    try {
      const data = {
        name: name,
        fee: feeValue,
      };

      if (modalMode === 'create') {
        await lookupService.createLookup(modalType, data);
        showSuccess(`${modalType.slice(0, -1)} created successfully!`);
      } else {
        await lookupService.updateLookup(modalType, currentItem.id, data);
        showSuccess(`${modalType.slice(0, -1)} updated successfully!`);
      }

      await fetchLookups();
      closeModal();
    } catch (err) {
      setError(err.error || 'Operation failed. Please try again.');
      console.error('Error submitting form:', err);
    }
  };

  const handleDelete = async (type, id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    setError('');
    try {
      await lookupService.deleteLookup(type, id);
      showSuccess(`${type.slice(0, -1)} deleted successfully!`);
      await fetchLookups();
    } catch (err) {
      setError(err.error || 'Failed to delete item. Please try again.');
      console.error('Error deleting item:', err);
    }
  };

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    setError('');

    const numericFields = Object.keys(configData);
    for (let field of numericFields) {
      const value = configData[field];
      const parsedValue = parseFloat(value);
      if (!value || isNaN(parsedValue) || parsedValue < 0) {
        setError(`All fields must be valid, non-negative numbers.`);
        return;
      }
    }

    try {
      const data = {
        maxDrinks: parseInt(configData.maxDrinks, 10),
        vatPercentage: parseFloat(configData.vatPercentage),
        discountTier1Orders: parseInt(configData.discountTier1Orders, 10),
        discountTier1MinDrinks: parseInt(configData.discountTier1MinDrinks, 10),
        discountTier2Orders: parseInt(configData.discountTier2Orders, 10),
        discountTier2MinDrinks: parseInt(configData.discountTier2MinDrinks, 10),
        discountTier3Orders: parseInt(configData.discountTier3Orders, 10),
        discountTier3MinDrinks: parseInt(configData.discountTier3MinDrinks, 10),
        maxDiscountAmount: parseFloat(configData.maxDiscountAmount),
      };

      await lookupService.updateConfig(data);
      showSuccess('Configuration updated successfully!');
      await fetchLookups();
    } catch (err) {
      setError(err.error || 'Failed to update configuration. Please try again.');
      console.error('Error updating config:', err);
    }
  };

  // --- Styles ---

  const style = {
    // Main Background (Gradient from Login)
    pageWrapper: {
      minHeight: '100vh',
      padding: '40px 20px',
      background: 'linear-gradient(135deg, #FFE5EC 0%, #FFF0F5 50%, #FFFFFF 100%)',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      color: '#2D2D2D',
    },
    // The "Cup" Container
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      backgroundColor: '#FFFFFF',
      borderRadius: '50px', // Matches the cup border radius
      padding: '50px',
      boxShadow: '0 10px 30px rgba(255, 105, 180, 0.2)', // Pink glow
      position: 'relative',
    },
    header: {
      marginBottom: '40px',
      borderBottom: '2px solid #FFE5EC',
      paddingBottom: '20px',
      textAlign: 'center',
    },
    title: {
      fontSize: '2.5rem',
      color: '#FF69B4', // Hot Pink
      margin: '0 0 10px 0',
      fontWeight: 'bold',
      textShadow: '2px 2px 0px rgba(255,182,217, 0.3)',
    },
    subtitle: {
      color: '#6B6B6B',
      fontSize: '1.1rem',
    },
    // Messages
    messageBox: (isError) => ({
      padding: '15px 25px',
      backgroundColor: isError ? '#FFF0F0' : '#FFF0F5',
      border: `2px solid ${isError ? '#D32F2F' : '#FF69B4'}`,
      borderRadius: '25px',
      color: isError ? '#D32F2F' : '#FF69B4',
      marginBottom: '30px',
      fontWeight: '600',
      textAlign: 'center',
    }),
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
      borderRadius: '25px', // Pill shape
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '1rem',
      transition: 'all 0.3s',
      outline: 'none',
      boxShadow: isActive ? '0 5px 15px rgba(255, 105, 180, 0.3)' : 'none',
    }),
    // Tables
    tableWrapper: {
      backgroundColor: '#FFFFFF',
      borderRadius: '20px',
      border: '2px solid #FFE5EC',
      overflow: 'hidden',
    },
    tableHeaderRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 30px',
      backgroundColor: '#FFF0F5', // Very light pink
      borderBottom: '2px solid #FFE5EC',
    },
    sectionTitle: {
      fontSize: '1.5rem',
      color: '#2D2D2D',
      fontWeight: 'bold',
      margin: 0,
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      padding: '18px 25px',
      textAlign: 'left',
      fontSize: '0.9rem',
      fontWeight: '700',
      color: '#FF69B4',
      textTransform: 'uppercase',
      borderBottom: '2px solid #FFE5EC',
    },
    td: {
      padding: '18px 25px',
      fontSize: '0.95rem',
      color: '#2D2D2D',
      borderBottom: '1px solid #FFE5EC',
    },
    // Buttons
    primaryButton: {
      padding: '12px 25px',
      backgroundColor: '#FF69B4',
      color: 'white',
      border: 'none',
      borderRadius: '25px',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '0.9rem',
      boxShadow: '0 4px 10px rgba(255, 105, 180, 0.2)',
      transition: 'transform 0.2s',
    },
    secondaryButton: { // Used for Edit
      padding: '8px 20px',
      backgroundColor: '#FFF0F5', // Light pink background
      color: '#FF69B4',
      border: '1px solid #FF69B4',
      borderRadius: '20px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '0.85rem',
      marginRight: '10px',
    },
    deleteButton: {
      padding: '8px 20px',
      backgroundColor: '#FFFFFF',
      color: '#D32F2F', // Red for danger
      border: '1px solid #FFCDD2',
      borderRadius: '20px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '0.85rem',
    },
    // Forms (Inputs)
    formGroup: {
      marginBottom: '20px',
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: '600',
      color: '#2D2D2D',
      fontSize: '0.95rem',
    },
    input: {
      width: '100%',
      padding: '12px 15px',
      border: '2px solid #FFE5EC',
      borderRadius: '12px',
      fontSize: '1rem',
      color: '#2D2D2D',
      outline: 'none',
      transition: 'border-color 0.3s',
      backgroundColor: '#FAFAFA',
    },
    // Configuration Sections
    configGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '30px',
    },
    configCard: {
      padding: '25px',
      backgroundColor: '#FFFFFF',
      border: '2px solid #FFE5EC',
      borderRadius: '20px',
      boxShadow: '0 5px 15px rgba(0,0,0,0.02)',
    },
    configTitle: {
      color: '#FF69B4',
      marginBottom: '20px',
      fontSize: '1.2rem',
      fontWeight: 'bold',
      borderBottom: '1px dashed #FFB6D9',
      paddingBottom: '10px',
    },
    // Modal
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    modalContent: {
      backgroundColor: '#FFFFFF',
      padding: '40px',
      borderRadius: '40px',
      width: '90%',
      maxWidth: '500px',
      boxShadow: '0 20px 50px rgba(255, 105, 180, 0.25)',
      border: '2px solid #FFE5EC',
    },
  };

  // --- Render Helpers ---

  const renderTable = (type, data) => (
    <div style={style.tableWrapper}>
      <div style={style.tableHeaderRow}>
        <h3 style={style.sectionTitle}>
          {type.charAt(0).toUpperCase() + type.slice(1)} ({data.length})
        </h3>
        <button
          onClick={() => handleCreate(type)}
          style={style.primaryButton}
        >
          + Add New
        </button>
      </div>

      {data.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#6B6B6B' }}>
          No {type} found.
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={style.table}>
            <thead>
              <tr>
                <th style={{ ...style.th, width: '80px' }}>ID</th>
                <th style={style.th}>Name</th>
                <th style={{ ...style.th, textAlign: 'right' }}>Fee</th>
                <th style={{ ...style.th, textAlign: 'center', width: '220px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td style={style.td}>{item.id}</td>
                  <td style={{ ...style.td, fontWeight: '600' }}>{item.name}</td>
                  <td style={{ ...style.td, textAlign: 'right', color: '#FF69B4', fontWeight: 'bold' }}>
                    R{item.fee.toFixed(2)}
                  </td>
                  <td style={{ ...style.td, textAlign: 'center' }}>
                    <button
                      onClick={() => handleEdit(type, item)}
                      style={style.secondaryButton}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(type, item.id, item.name)}
                      style={style.deleteButton}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // --- Main Render ---

  if (loading) {
    return (
      <div style={{ ...style.pageWrapper, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ color: '#FF69B4', fontSize: '1.5rem', fontWeight: 'bold' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={style.pageWrapper}>
      <div style={style.container}>
        
        {/* Header */}
        <div style={style.header}>
          <h1 style={style.title}>Lookup Management</h1>
          <p style={style.subtitle}>
            Manage menu options and system configuration.
          </p>
        </div>

        {/* Notifications */}
        {successMessage && (
          <div style={style.messageBox(false)}>
            {successMessage}
          </div>
        )}
        {error && (
          <div style={style.messageBox(true)}>
            {error}
          </div>
        )}

        {/* Tabs */}
        <div style={style.tabsContainer}>
          {['flavours', 'toppings', 'consistencies', 'config'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={style.tabButton(activeTab === tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'flavours' && renderTable('flavours', lookups.flavours)}
          {activeTab === 'toppings' && renderTable('toppings', lookups.toppings)}
          {activeTab === 'consistencies' && renderTable('consistencies', lookups.consistencies)}

          {activeTab === 'config' && (
            <form onSubmit={handleSaveConfig}>
              <div style={{ marginBottom: '30px', textAlign: 'center', color: '#E91E63', fontStyle: 'italic' }}>
                Updates to settings will only affect new orders.
              </div>

              <div style={style.configGrid}>
                {/* General Settings */}
                <div style={style.configCard}>
                  <h4 style={style.configTitle}>General Settings</h4>
                  <div style={style.formGroup}>
                    <label style={style.label}>Max Drinks Per Order</label>
                    <input
                      type="number"
                      name="maxDrinks"
                      value={configData.maxDrinks}
                      onChange={handleConfigChange}
                      required
                      style={style.input}
                      onFocus={(e) => e.target.style.borderColor = '#FF69B4'}
                      onBlur={(e) => e.target.style.borderColor = '#FFE5EC'}
                    />
                  </div>
                  <div style={style.formGroup}>
                    <label style={style.label}>VAT Percentage (%)</label>
                    <input
                      type="number"
                      name="vatPercentage"
                      value={configData.vatPercentage}
                      onChange={handleConfigChange}
                      required
                      step="0.01"
                      style={style.input}
                      onFocus={(e) => e.target.style.borderColor = '#FF69B4'}
                      onBlur={(e) => e.target.style.borderColor = '#FFE5EC'}
                    />
                  </div>
                  <div style={style.formGroup}>
                    <label style={style.label}>Max Discount Amount (R)</label>
                    <input
                      type="number"
                      name="maxDiscountAmount"
                      value={configData.maxDiscountAmount}
                      onChange={handleConfigChange}
                      required
                      step="0.01"
                      style={style.input}
                      onFocus={(e) => e.target.style.borderColor = '#FF69B4'}
                      onBlur={(e) => e.target.style.borderColor = '#FFE5EC'}
                    />
                  </div>
                </div>

                {/* Discount Tiers */}
                <div style={style.configCard}>
                   <h4 style={style.configTitle}>Tier 1 (5% Discount)</h4>
                   <div style={style.formGroup}>
                    <label style={style.label}>Min Orders</label>
                    <input
                      type="number"
                      name="discountTier1Orders"
                      value={configData.discountTier1Orders}
                      onChange={handleConfigChange}
                      required
                      style={style.input}
                      onFocus={(e) => e.target.style.borderColor = '#FF69B4'}
                      onBlur={(e) => e.target.style.borderColor = '#FFE5EC'}
                    />
                   </div>
                   <div style={style.formGroup}>
                    <label style={style.label}>Min Drinks</label>
                    <input
                      type="number"
                      name="discountTier1MinDrinks"
                      value={configData.discountTier1MinDrinks}
                      onChange={handleConfigChange}
                      required
                      style={style.input}
                      onFocus={(e) => e.target.style.borderColor = '#FF69B4'}
                      onBlur={(e) => e.target.style.borderColor = '#FFE5EC'}
                    />
                   </div>
                </div>

                <div style={style.configCard}>
                   <h4 style={style.configTitle}>Tier 2 (10% Discount)</h4>
                   <div style={style.formGroup}>
                    <label style={style.label}>Min Orders</label>
                    <input
                      type="number"
                      name="discountTier2Orders"
                      value={configData.discountTier2Orders}
                      onChange={handleConfigChange}
                      required
                      style={style.input}
                      onFocus={(e) => e.target.style.borderColor = '#FF69B4'}
                      onBlur={(e) => e.target.style.borderColor = '#FFE5EC'}
                    />
                   </div>
                   <div style={style.formGroup}>
                    <label style={style.label}>Min Drinks</label>
                    <input
                      type="number"
                      name="discountTier2MinDrinks"
                      value={configData.discountTier2MinDrinks}
                      onChange={handleConfigChange}
                      required
                      style={style.input}
                      onFocus={(e) => e.target.style.borderColor = '#FF69B4'}
                      onBlur={(e) => e.target.style.borderColor = '#FFE5EC'}
                    />
                   </div>
                </div>

                <div style={style.configCard}>
                   <h4 style={style.configTitle}>Tier 3 (15% Discount)</h4>
                   <div style={style.formGroup}>
                    <label style={style.label}>Min Orders</label>
                    <input
                      type="number"
                      name="discountTier3Orders"
                      value={configData.discountTier3Orders}
                      onChange={handleConfigChange}
                      required
                      style={style.input}
                      onFocus={(e) => e.target.style.borderColor = '#FF69B4'}
                      onBlur={(e) => e.target.style.borderColor = '#FFE5EC'}
                    />
                   </div>
                   <div style={style.formGroup}>
                    <label style={style.label}>Min Drinks</label>
                    <input
                      type="number"
                      name="discountTier3MinDrinks"
                      value={configData.discountTier3MinDrinks}
                      onChange={handleConfigChange}
                      required
                      style={style.input}
                      onFocus={(e) => e.target.style.borderColor = '#FF69B4'}
                      onBlur={(e) => e.target.style.borderColor = '#FFE5EC'}
                    />
                   </div>
                </div>
              </div>

              <div style={{ marginTop: '40px', textAlign: 'center' }}>
                <button type="submit" style={{ ...style.primaryButton, padding: '15px 40px', fontSize: '1rem' }}>
                  Save Configuration
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={style.modalOverlay}>
          <div style={style.modalContent}>
            <div style={{ textAlign: 'center', marginBottom: '25px', borderBottom: '1px solid #FFE5EC', paddingBottom: '15px' }}>
              <h2 style={{ color: '#FF69B4', margin: 0 }}>
                {modalMode === 'create' ? 'Add New' : 'Edit'} {modalType.slice(0, -1)}
              </h2>
            </div>

            {error && (
              <div style={style.messageBox(true)}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={style.formGroup}>
                <label style={style.label}>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder={`Enter name`}
                  style={style.input}
                  onFocus={(e) => e.target.style.borderColor = '#FF69B4'}
                  onBlur={(e) => e.target.style.borderColor = '#FFE5EC'}
                />
              </div>

              <div style={style.formGroup}>
                <label style={style.label}>Fee (R)</label>
                <input
                  type="number"
                  name="fee"
                  value={formData.fee}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                  placeholder="0.00"
                  style={style.input}
                  onFocus={(e) => e.target.style.borderColor = '#FF69B4'}
                  onBlur={(e) => e.target.style.borderColor = '#FFE5EC'}
                />
              </div>

              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '30px' }}>
                <button
                  type="button"
                  onClick={closeModal}
                  style={{ ...style.secondaryButton, padding: '12px 25px', color: '#6B6B6B', borderColor: '#E0E0E0', backgroundColor: '#F5F5F5' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={style.primaryButton}
                >
                  {modalMode === 'create' ? 'Create Item' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default LookupManagement;