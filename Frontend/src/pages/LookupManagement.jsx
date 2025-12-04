import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import lookupService from '../services/lookupService';

function LookupManagement() {
  const { user } = useAuth();

  // State for lookups
  const [lookups, setLookups] = useState({
    flavours: [],
    toppings: [],
    consistencies: [],
    config: null
  });

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Active tab
  const [activeTab, setActiveTab] = useState('flavours'); // 'flavours', 'toppings', 'consistencies', 'config'

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [modalType, setModalType] = useState('flavours'); // 'flavours', 'toppings', 'consistencies'
  const [currentItem, setCurrentItem] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    fee: ''
  });

  // Config form state
  const [configData, setConfigData] = useState({
    maxDrinks: '',
    vatPercentage: '',
    discountTier1Orders: '',
    discountTier1MinDrinks: '',
    discountTier2Orders: '',
    discountTier2MinDrinks: '',
    discountTier3Orders: '',
    discountTier3MinDrinks: '',
    maxDiscountAmount: ''
  });

  // Fetch lookups on component mount
  useEffect(() => {
    fetchLookups();
  }, []);

  // Update config form when lookups are loaded
  useEffect(() => {
    if (lookups.config) {
      setConfigData({
        maxDrinks: lookups.config.maxDrinks,
        vatPercentage: lookups.config.vatPercentage,
        discountTier1Orders: lookups.config.discountTier1Orders,
        discountTier1MinDrinks: lookups.config.discountTier1MinDrinks,
        discountTier2Orders: lookups.config.discountTier2Orders,
        discountTier2MinDrinks: lookups.config.discountTier2MinDrinks,
        discountTier3Orders: lookups.config.discountTier3Orders,
        discountTier3MinDrinks: lookups.config.discountTier3MinDrinks,
        maxDiscountAmount: lookups.config.maxDiscountAmount
      });
    }
  }, [lookups.config]);

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

  // Show success message temporarily
  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Open create modal
  const handleCreate = (type) => {
    setModalMode('create');
    setModalType(type);
    setCurrentItem(null);
    setFormData({ name: '', fee: '' });
    setShowModal(true);
  };

  // Open edit modal
  const handleEdit = (type, item) => {
    setModalMode('edit');
    setModalType(type);
    setCurrentItem(item);
    setFormData({ name: item.name, fee: item.fee });
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setFormData({ name: '', fee: '' });
    setCurrentItem(null);
    setError('');
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle config input change
  const handleConfigChange = (e) => {
    const { name, value } = e.target;
    setConfigData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit create/edit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }
    if (!formData.fee || parseFloat(formData.fee) < 0) {
      setError('Fee must be a positive number');
      return;
    }

    try {
      const data = {
        name: formData.name.trim(),
        fee: parseFloat(formData.fee)
      };

      if (modalMode === 'create') {
        // Create new item
        await lookupService.createLookup(modalType, data);
        showSuccess(`${modalType.slice(0, -1)} created successfully!`);
      } else {
        // Update existing item
        await lookupService.updateLookup(modalType, currentItem.id, data);
        showSuccess(`${modalType.slice(0, -1)} updated successfully!`);
      }

      // Refresh lookups
      await fetchLookups();
      closeModal();
    } catch (err) {
      setError(err.error || 'Operation failed. Please try again.');
      console.error('Error submitting form:', err);
    }
  };

  // Delete item
  const handleDelete = async (type, id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?\n\nThis action cannot be undone.`)) {
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

  // Save config
  const handleSaveConfig = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    const numericFields = Object.keys(configData);
    for (let field of numericFields) {
      if (!configData[field] || parseFloat(configData[field]) < 0) {
        setError(`All fields must be positive numbers`);
        return;
      }
    }

    try {
      const data = {
        maxDrinks: parseInt(configData.maxDrinks),
        vatPercentage: parseFloat(configData.vatPercentage),
        discountTier1Orders: parseInt(configData.discountTier1Orders),
        discountTier1MinDrinks: parseInt(configData.discountTier1MinDrinks),
        discountTier2Orders: parseInt(configData.discountTier2Orders),
        discountTier2MinDrinks: parseInt(configData.discountTier2MinDrinks),
        discountTier3Orders: parseInt(configData.discountTier3Orders),
        discountTier3MinDrinks: parseInt(configData.discountTier3MinDrinks),
        maxDiscountAmount: parseFloat(configData.maxDiscountAmount)
      };

      await lookupService.updateConfig(data);
      showSuccess('Configuration updated successfully!');
      await fetchLookups();
    } catch (err) {
      setError(err.error || 'Failed to update configuration. Please try again.');
      console.error('Error updating config:', err);
    }
  };

  // Render lookup table
  const renderTable = (type, data) => {
    return (
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h3 style={{ margin: 0 }}>
            {type.charAt(0).toUpperCase() + type.slice(1)} ({data.length})
          </h3>
          <button
            onClick={() => handleCreate(type)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            + Add New {type.slice(0, -1)}
          </button>
        </div>

        {data.length === 0 ? (
          <div style={{
            padding: '40px',
            textAlign: 'center',
            backgroundColor: '#f8f9fa',
            borderRadius: '4px',
            border: '1px solid #ddd'
          }}>
            <p style={{ color: '#666' }}>No {type} found. Add your first one!</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              backgroundColor: '#fff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#007bff', color: 'white' }}>
                  <th style={{ padding: '15px', textAlign: 'left', width: '80px' }}>ID</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Name</th>
                  <th style={{ padding: '15px', textAlign: 'right', width: '150px' }}>Fee (R)</th>
                  <th style={{ padding: '15px', textAlign: 'center', width: '200px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr
                    key={item.id}
                    style={{
                      borderBottom: '1px solid #ddd',
                      backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff'
                    }}
                  >
                    <td style={{ padding: '15px' }}>{item.id}</td>
                    <td style={{ padding: '15px', fontWeight: 'bold' }}>{item.name}</td>
                    <td style={{ padding: '15px', textAlign: 'right' }}>
                      R{item.fee.toFixed(2)}
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleEdit(type, item)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#007bff',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          marginRight: '10px'
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(type, item.id, item.name)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        🗑️ Delete
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
  };

  // Loading state
  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>⚙️ Lookup Management</h1>
        <p>Loading lookup data...</p>
        <div style={{ marginTop: '20px', fontSize: '40px' }}>⏳</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1>⚙️ Lookup Management</h1>
        <p style={{ color: '#666' }}>
          Manage menu options and system configuration
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div style={{
          padding: '15px',
          backgroundColor: '#d4edda',
          border: '1px solid #c3e6cb',
          borderRadius: '4px',
          color: '#155724',
          marginBottom: '20px'
        }}>
          ✅ {successMessage}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div style={{
          padding: '15px',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          color: '#721c24',
          marginBottom: '20px'
        }}>
          ❌ {error}
        </div>
      )}

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '30px',
        borderBottom: '2px solid #ddd',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setActiveTab('flavours')}
          style={{
            padding: '12px 24px',
            backgroundColor: activeTab === 'flavours' ? '#007bff' : 'transparent',
            color: activeTab === 'flavours' ? 'white' : '#333',
            border: 'none',
            borderBottom: activeTab === 'flavours' ? '3px solid #007bff' : 'none',
            cursor: 'pointer',
            fontWeight: activeTab === 'flavours' ? 'bold' : 'normal',
            fontSize: '16px'
          }}
        >
          🍓 Flavours
        </button>
        <button
          onClick={() => setActiveTab('toppings')}
          style={{
            padding: '12px 24px',
            backgroundColor: activeTab === 'toppings' ? '#007bff' : 'transparent',
            color: activeTab === 'toppings' ? 'white' : '#333',
            border: 'none',
            borderBottom: activeTab === 'toppings' ? '3px solid #007bff' : 'none',
            cursor: 'pointer',
            fontWeight: activeTab === 'toppings' ? 'bold' : 'normal',
            fontSize: '16px'
          }}
        >
          🍫 Toppings
        </button>
        <button
          onClick={() => setActiveTab('consistencies')}
          style={{
            padding: '12px 24px',
            backgroundColor: activeTab === 'consistencies' ? '#007bff' : 'transparent',
            color: activeTab === 'consistencies' ? 'white' : '#333',
            border: 'none',
            borderBottom: activeTab === 'consistencies' ? '3px solid #007bff' : 'none',
            cursor: 'pointer',
            fontWeight: activeTab === 'consistencies' ? 'bold' : 'normal',
            fontSize: '16px'
          }}
        >
          🥤 Consistencies
        </button>
        <button
          onClick={() => setActiveTab('config')}
          style={{
            padding: '12px 24px',
            backgroundColor: activeTab === 'config' ? '#007bff' : 'transparent',
            color: activeTab === 'config' ? 'white' : '#333',
            border: 'none',
            borderBottom: activeTab === 'config' ? '3px solid #007bff' : 'none',
            cursor: 'pointer',
            fontWeight: activeTab === 'config' ? 'bold' : 'normal',
            fontSize: '16px'
          }}
        >
          ⚙️ System Config
        </button>
      </div>

      {/* Tab Content */}
      <div style={{
        padding: '30px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        border: '1px solid #ddd',
        minHeight: '400px'
      }}>
        {activeTab === 'flavours' && renderTable('flavours', lookups.flavours)}
        {activeTab === 'toppings' && renderTable('toppings', lookups.toppings)}
        {activeTab === 'consistencies' && renderTable('consistencies', lookups.consistencies)}

        {activeTab === 'config' && (
          <div>
            <h3 style={{ marginBottom: '20px' }}>⚙️ System Configuration</h3>
            <p style={{ color: '#666', marginBottom: '30px' }}>
              Changes to these settings will only affect NEW orders. Existing orders remain unchanged.
            </p>

            <form onSubmit={handleSaveConfig}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '25px'
              }}>
                {/* Max Drinks */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Maximum Drinks Per Order
                  </label>
                  <input
                    type="number"
                    name="maxDrinks"
                    value={configData.maxDrinks}
                    onChange={handleConfigChange}
                    min="1"
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                {/* VAT Percentage */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    VAT Percentage (%)
                  </label>
                  <input
                    type="number"
                    name="vatPercentage"
                    value={configData.vatPercentage}
                    onChange={handleConfigChange}
                    min="0"
                    step="0.01"
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                {/* Max Discount Amount */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Maximum Discount Amount (R)
                  </label>
                  <input
                    type="number"
                    name="maxDiscountAmount"
                    value={configData.maxDiscountAmount}
                    onChange={handleConfigChange}
                    min="0"
                    step="0.01"
                    required
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

              {/* Discount Tiers */}
              <div style={{ marginTop: '40px' }}>
                <h4 style={{ marginBottom: '20px', color: '#28a745' }}>
                  💰 Discount Tier Settings
                </h4>

                {/* Tier 1 */}
                <div style={{
                  padding: '20px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  border: '2px solid #28a745'
                }}>
                  <h5 style={{ marginBottom: '15px', color: '#28a745' }}>Tier 1 (5% Discount)</h5>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                        Minimum Orders Required
                      </label>
                      <input
                        type="number"
                        name="discountTier1Orders"
                        value={configData.discountTier1Orders}
                        onChange={handleConfigChange}
                        min="1"
                        required
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
                        Minimum Drinks Per Order
                      </label>
                      <input
                        type="number"
                        name="discountTier1MinDrinks"
                        value={configData.discountTier1MinDrinks}
                        onChange={handleConfigChange}
                        min="1"
                        required
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
                </div>

                {/* Tier 2 */}
                <div style={{
                  padding: '20px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  border: '2px solid #ffc107'
                }}>
                  <h5 style={{ marginBottom: '15px', color: '#e67e00' }}>Tier 2 (10% Discount)</h5>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                        Minimum Orders Required
                      </label>
                      <input
                        type="number"
                        name="discountTier2Orders"
                        value={configData.discountTier2Orders}
                        onChange={handleConfigChange}
                        min="1"
                        required
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
                        Minimum Drinks Per Order
                      </label>
                      <input
                        type="number"
                        name="discountTier2MinDrinks"
                        value={configData.discountTier2MinDrinks}
                        onChange={handleConfigChange}
                        min="1"
                        required
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
                </div>

                {/* Tier 3 */}
                <div style={{
                  padding: '20px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  border: '2px solid #dc3545'
                }}>
                  <h5 style={{ marginBottom: '15px', color: '#dc3545' }}>Tier 3 (15% Discount)</h5>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                        Minimum Orders Required
                      </label>
                      <input
                        type="number"
                        name="discountTier3Orders"
                        value={configData.discountTier3Orders}
                        onChange={handleConfigChange}
                        min="1"
                        required
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
                        Minimum Drinks Per Order
                      </label>
                      <input
                        type="number"
                        name="discountTier3MinDrinks"
                        value={configData.discountTier3MinDrinks}
                        onChange={handleConfigChange}
                        min="1"
                        required
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
                </div>
              </div>

              {/* Save Button */}
              <div style={{ marginTop: '30px', textAlign: 'center' }}>
                <button
                  type="submit"
                  style={{
                    padding: '15px 40px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '18px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                >
                  💾 Save Configuration
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Modal for Create/Edit */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
          }}>
            <h2 style={{ marginBottom: '20px' }}>
              {modalMode === 'create' ? '➕ Add New' : '✏️ Edit'} {modalType.slice(0, -1)}
            </h2>

            <form onSubmit={handleSubmit}>
              {/* Name Input */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                  placeholder="Enter name"
                />
              </div>

              {/* Fee Input */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  Fee (R) *
                </label>
                <input
                  type="number"
                  name="fee"
                  value={formData.fee}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                  placeholder="0.00"
                />
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={closeModal}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  {modalMode === 'create' ? 'Create' : 'Save Changes'}
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