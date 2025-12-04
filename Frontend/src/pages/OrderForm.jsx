import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import lookupService from '../services/lookupService';
import orderService from '../services/orderService';
import { useAuth } from '../context/AuthContext';

function OrderForm() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Lookup data from backend
  const [lookups, setLookups] = useState({
    flavours: [],
    toppings: [],
    consistencies: [],
    config: null
  });

  // Form state
  const [numberOfDrinks, setNumberOfDrinks] = useState(1);
  const [drinks, setDrinks] = useState([]);
  const [showDrinkContainers, setShowDrinkContainers] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  // Checkout state
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');

  // Calculation results
  const [calculation, setCalculation] = useState(null);
  const [calculationLoading, setCalculationLoading] = useState(false);

  // Order submission
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderResult, setOrderResult] = useState(null);

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch lookups on component mount
  useEffect(() => {
    fetchLookups();
  }, []);

  const fetchLookups = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await lookupService.getAllLookups();
      setLookups(data);
    } catch (err) {
      setError('Failed to load menu options. Please refresh the page.');
      console.error('Error fetching lookups:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle number of drinks change
  const handleNumberChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= (lookups.config?.maxDrinks || 10)) {
      setNumberOfDrinks(value);
    }
  };

  // Initialize drink containers
  const handleNextClick = () => {
    const newDrinks = Array.from({ length: numberOfDrinks }, () => ({
      flavourId: '',
      toppingId: '',
      consistencyId: '',
      price: 0
    }));
    setDrinks(newDrinks);
    setShowDrinkContainers(true);
  };

  // Handle drink field change
  const handleDrinkChange = (index, field, value) => {
    const newDrinks = [...drinks];
    newDrinks[index][field] = value;

    // Calculate price for this drink if all fields are selected
    if (newDrinks[index].flavourId && newDrinks[index].toppingId && newDrinks[index].consistencyId) {
      const flavour = lookups.flavours.find(f => f.id === parseInt(newDrinks[index].flavourId));
      const topping = lookups.toppings.find(t => t.id === parseInt(newDrinks[index].toppingId));
      const consistency = lookups.consistencies.find(c => c.id === parseInt(newDrinks[index].consistencyId));
      
      if (flavour && topping && consistency) {
        newDrinks[index].price = flavour.fee + topping.fee + consistency.fee;
      }
    }

    setDrinks(newDrinks);
  };

  // Check if all drinks are complete
  const allDrinksComplete = () => {
    return drinks.every(drink => 
      drink.flavourId && drink.toppingId && drink.consistencyId
    );
  };

  // Calculate order total
  const handleCalculateTotal = async () => {
    setCalculationLoading(true);
    setError('');

    try {
      // Prepare drinks data for API
      const drinksData = drinks.map(drink => ({
        flavourId: parseInt(drink.flavourId),
        toppingId: parseInt(drink.toppingId),
        consistencyId: parseInt(drink.consistencyId)
      }));

      const result = await orderService.calculateOrder(drinksData);
      setCalculation(result);
      setShowCheckout(true);
    } catch (err) {
      setError('Failed to calculate order. Please try again.');
      console.error('Error calculating order:', err);
    } finally {
      setCalculationLoading(false);
    }
  };

  // Validate pickup details
  const validatePickupDetails = () => {
    if (!pickupLocation.trim()) {
      setError('Please enter a pickup location');
      return false;
    }
    if (!pickupDate) {
      setError('Please select a pickup date');
      return false;
    }
    if (!pickupTime) {
      setError('Please select a pickup time');
      return false;
    }

    // Combine date and time
    const pickupDateTime = new Date(`${pickupDate}T${pickupTime}`);
    const now = new Date();
    
    // Check if pickup time is in the past
    if (pickupDateTime <= now) {
      setError('Pickup time must be in the future');
      return false;
    }

    // Check if pickup time is at least 30 minutes from now
    const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60000);
    if (pickupDateTime < thirtyMinutesFromNow) {
      setError('Pickup time must be at least 30 minutes from now');
      return false;
    }

    return true;
  };

  // Submit order
  const handleSubmitOrder = async () => {
    if (!validatePickupDetails()) {
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      // Prepare order data
      const orderData = {
        drinks: drinks.map(drink => ({
          flavourId: parseInt(drink.flavourId),
          toppingId: parseInt(drink.toppingId),
          consistencyId: parseInt(drink.consistencyId)
        })),
        pickUpLocation: pickupLocation,
        pickUpTime: new Date(`${pickupDate}T${pickupTime}`).toISOString()
      };

      const result = await orderService.createOrder(orderData);
      setOrderResult(result);
      setOrderSuccess(true);
    } catch (err) {
      setError(err.error || 'Failed to place order. Please try again.');
      console.error('Error submitting order:', err);
      setSubmitting(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setNumberOfDrinks(1);
    setDrinks([]);
    setShowDrinkContainers(false);
    setShowCheckout(false);
    setCalculation(null);
    setPickupLocation('');
    setPickupDate('');
    setPickupTime('');
    setError('');
  };

  // Go back to drinks
  const handleBackToDrinks = () => {
    setShowCheckout(false);
    setCalculation(null);
    setError('');
  };

  // Get minimum date (today) in YYYY-MM-DD format
  const getMinDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Get minimum time (30 minutes from now) in HH:MM format
  const getMinTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    return now.toTimeString().slice(0, 5);
  };

  // Loading state
  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>🛒 Order Milkshakes</h1>
        <p>Loading menu options...</p>
        <div style={{ marginTop: '20px', fontSize: '40px' }}>⏳</div>
      </div>
    );
  }

  // Error state (initial load)
  if (error && !lookups.config) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>🛒 Order Milkshakes</h1>
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
          onClick={fetchLookups}
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

  // Order Success Screen
  if (orderSuccess && orderResult) {
    return (
      <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{
          textAlign: 'center',
          padding: '40px',
          backgroundColor: '#d4edda',
          border: '2px solid #c3e6cb',
          borderRadius: '8px'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>
          <h1 style={{ color: '#155724' }}>Order Placed Successfully!</h1>
          <p style={{ fontSize: '18px', marginTop: '20px' }}>
            Thank you, <strong>{user.firstname}</strong>! Your order has been received.
          </p>
        </div>

        <div style={{
          marginTop: '30px',
          padding: '30px',
          backgroundColor: '#fff',
          border: '1px solid #ddd',
          borderRadius: '8px'
        }}>
          <h2>Order Details</h2>
          
          <div style={{ marginTop: '20px' }}>
            <p><strong>Order ID:</strong> #{orderResult.order.id}</p>
            <p><strong>Total Amount:</strong> R{orderResult.order.totalAmount.toFixed(2)}</p>
            <p><strong>Pickup Location:</strong> {orderResult.order.pickUpLocation}</p>
            <p><strong>Pickup Time:</strong> {new Date(orderResult.order.pickUpTime).toLocaleString()}</p>
            <p><strong>Payment Status:</strong> {orderResult.order.isPaid ? '✅ Paid' : '⏳ Unpaid'}</p>
          </div>

          {orderResult.emailSent && (
            <div style={{
              marginTop: '20px',
              padding: '15px',
              backgroundColor: '#d1ecf1',
              border: '1px solid #bee5eb',
              borderRadius: '4px',
              color: '#0c5460'
            }}>
              📧 A confirmation email has been sent to <strong>{user.email}</strong>
            </div>
          )}

          <div style={{
            marginTop: '30px',
            display: 'flex',
            gap: '15px',
            justifyContent: 'center'
          }}>
            <button
              onClick={() => navigate('/my-orders')}
              style={{
                padding: '12px 24px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              View My Orders
            </button>
            <button
              onClick={() => {
                setOrderSuccess(false);
                setOrderResult(null);
                handleReset();
              }}
              style={{
                padding: '12px 24px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Place Another Order
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>🛒 Order Milkshakes</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Choose your custom milkshakes from our menu
      </p>

      {/* Error display */}
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

      {/* Step 1: Select number of drinks */}
      {!showDrinkContainers && (
        <div style={{
          padding: '30px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #ddd'
        }}>
          <h2 style={{ marginBottom: '20px' }}>Step 1: How many drinks?</h2>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
              Number of Drinks (1 - {lookups.config?.maxDrinks || 10})
            </label>
            <input
              type="number"
              min="1"
              max={lookups.config?.maxDrinks || 10}
              value={numberOfDrinks}
              onChange={handleNumberChange}
              style={{
                padding: '12px',
                fontSize: '18px',
                width: '200px',
                border: '2px solid #007bff',
                borderRadius: '4px'
              }}
            />
          </div>

          <button
            onClick={handleNextClick}
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
            onMouseEnter={(e) => e.target.style.backgroundColor = '#218838'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#28a745'}
          >
            Next: Select Drinks →
          </button>
        </div>
      )}

      {/* Step 2: Drink containers */}
      {showDrinkContainers && !showCheckout && (
        <div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '30px'
          }}>
            <h2>Step 2: Customize Your Drinks</h2>
            <button
              onClick={handleReset}
              style={{
                padding: '8px 16px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              ← Start Over
            </button>
          </div>

          {/* Drink Containers */}
          <div style={{ display: 'grid', gap: '30px' }}>
            {drinks.map((drink, index) => (
              <div
                key={index}
                style={{
                  padding: '25px',
                  backgroundColor: '#fff',
                  border: '2px solid #007bff',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                <h3 style={{ marginBottom: '20px', color: '#007bff' }}>
                  🥤 Drink #{index + 1}
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                  {/* Flavour Selection */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                      Flavour *
                    </label>
                    <select
                      value={drink.flavourId}
                      onChange={(e) => handleDrinkChange(index, 'flavourId', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    >
                      <option value="">-- Select Flavour --</option>
                      {lookups.flavours.map(flavour => (
                        <option key={flavour.id} value={flavour.id}>
                          {flavour.name} (R{flavour.fee.toFixed(2)})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Topping Selection */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                      Topping *
                    </label>
                    <select
                      value={drink.toppingId}
                      onChange={(e) => handleDrinkChange(index, 'toppingId', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    >
                      <option value="">-- Select Topping --</option>
                      {lookups.toppings.map(topping => (
                        <option key={topping.id} value={topping.id}>
                          {topping.name} (R{topping.fee.toFixed(2)})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Consistency Selection */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                      Consistency *
                    </label>
                    <select
                      value={drink.consistencyId}
                      onChange={(e) => handleDrinkChange(index, 'consistencyId', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    >
                      <option value="">-- Select Consistency --</option>
                      {lookups.consistencies.map(consistency => (
                        <option key={consistency.id} value={consistency.id}>
                          {consistency.name} (R{consistency.fee.toFixed(2)})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Price Display */}
                {drink.price > 0 && (
                  <div style={{
                    marginTop: '20px',
                    padding: '15px',
                    backgroundColor: '#d4edda',
                    border: '1px solid #c3e6cb',
                    borderRadius: '4px'
                  }}>
                    <strong>Price for this drink: R{drink.price.toFixed(2)}</strong>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Continue button */}
          {allDrinksComplete() && (
            <div style={{ marginTop: '30px', textAlign: 'center' }}>
              <button
                onClick={handleCalculateTotal}
                disabled={calculationLoading}
                style={{
                  padding: '15px 40px',
                  backgroundColor: calculationLoading ? '#ccc' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '18px',
                  cursor: calculationLoading ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
                onMouseEnter={(e) => {
                  if (!calculationLoading) e.target.style.backgroundColor = '#0056b3';
                }}
                onMouseLeave={(e) => {
                  if (!calculationLoading) e.target.style.backgroundColor = '#007bff';
                }}
              >
                {calculationLoading ? 'Calculating...' : 'Continue to Checkout →'}
              </button>
              <p style={{ marginTop: '15px', color: '#666', fontSize: '14px' }}>
                We'll calculate your total, including discounts and VAT, in the next step
              </p>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Checkout */}
      {showCheckout && calculation && (
        <div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '30px'
          }}>
            <h2>Step 3: Checkout</h2>
            <button
              onClick={handleBackToDrinks}
              style={{
                padding: '8px 16px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              ← Back to Drinks
            </button>
          </div>

          {/* Order Summary */}
          <div style={{
            padding: '30px',
            backgroundColor: '#fff',
            border: '2px solid #007bff',
            borderRadius: '8px',
            marginBottom: '30px'
          }}>
            <h3 style={{ marginBottom: '20px' }}>Order Summary</h3>

            {/* Drinks List */}
            <div style={{ marginBottom: '20px' }}>
              {calculation.drinks.map((drink, index) => (
                <div key={index} style={{
                  padding: '15px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px',
                  marginBottom: '10px'
                }}>
                  <strong>Drink #{index + 1}:</strong> {drink.flavour}, {drink.topping}, {drink.consistency}
                  <div style={{ float: 'right', fontWeight: 'bold' }}>
                    R{drink.price.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div style={{ borderTop: '2px solid #ddd', paddingTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Subtotal:</span>
                <strong>R{calculation.subtotal.toFixed(2)}</strong>
              </div>

              {calculation.discount && calculation.discount.amount > 0 && (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginBottom: '10px',
                  color: '#28a745'
                }}>
                  <span>
                    Discount ({calculation.discount.percentage}% - Tier {calculation.discount.tier}):
                  </span>
                  <strong>-R{calculation.discount.amount.toFixed(2)}</strong>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Subtotal after discount:</span>
                <strong>R{calculation.subtotalAfterDiscount.toFixed(2)}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>VAT ({calculation.vat.percentage}%):</span>
                <strong>R{calculation.vat.amount.toFixed(2)}</strong>
              </div>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                fontSize: '24px',
                marginTop: '20px',
                paddingTop: '20px',
                borderTop: '2px solid #007bff'
              }}>
                <span><strong>Total Amount:</strong></span>
                <strong style={{ color: '#007bff' }}>R{calculation.totalAmount.toFixed(2)}</strong>
              </div>
            </div>

            {/* Discount Info */}
            {calculation.discount && calculation.discount.amount > 0 && (
              <div style={{
                marginTop: '20px',
                padding: '15px',
                backgroundColor: '#d4edda',
                border: '1px solid #c3e6cb',
                borderRadius: '4px'
              }}>
                🎉 You've earned a <strong>{calculation.discount.percentage}% discount</strong> as a frequent customer!
                (Tier {calculation.discount.tier} - {calculation.discount.qualifyingOrders} qualifying orders)
              </div>
            )}
          </div>

          {/* Pickup Details Form */}
          <div style={{
            padding: '30px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #ddd'
          }}>
            <h3 style={{ marginBottom: '20px' }}>Pickup Details</h3>

            {/* Pickup Location */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Pickup Location *
              </label>
              <select
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                <option value="">-- Select Location --</option>
                <option value="Milky Shaky - V&A Waterfront">Milky Shaky - V&A Waterfront</option>
                <option value="Milky Shaky - Century City">Milky Shaky - Century City</option>
                <option value="Milky Shaky - Tyger Valley">Milky Shaky - Tyger Valley</option>
                <option value="Milky Shaky - Cavendish Square">Milky Shaky - Cavendish Square</option>
                <option value="Milky Shaky - Canal Walk">Milky Shaky - Canal Walk</option>
              </select>
            </div>

            {/* Pickup Date */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Pickup Date *
              </label>
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                min={getMinDate()}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>

            {/* Pickup Time */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Pickup Time *
              </label>
              <input
                type="time"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
              <small style={{ color: '#666', fontSize: '12px' }}>
                Must be at least 30 minutes from now
              </small>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmitOrder}
              disabled={submitting}
              style={{
                width: '100%',
                padding: '15px',
                backgroundColor: submitting ? '#ccc' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '18px',
                cursor: submitting ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                marginTop: '10px'
              }}
            >
              {submitting ? 'Placing Order...' : `Place Order - R${calculation.totalAmount.toFixed(2)}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderForm;