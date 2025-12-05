import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import lookupService from '../services/lookupService';
import orderService from '../services/orderService';
import { useAuth } from '../context/AuthContext';

function OrderForm() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // --- LOGIC (Unchanged) ---
  const [lookups, setLookups] = useState({
    flavours: [],
    toppings: [],
    consistencies: [],
    config: null
  });

  const [numberOfDrinks, setNumberOfDrinks] = useState(1);
  const [drinks, setDrinks] = useState([]);
  const [showDrinkContainers, setShowDrinkContainers] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [calculation, setCalculation] = useState(null);
  const [calculationLoading, setCalculationLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const handleNumberChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= (lookups.config?.maxDrinks || 10)) {
      setNumberOfDrinks(value);
    }
  };

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

  const handleDrinkChange = (index, field, value) => {
    const newDrinks = [...drinks];
    newDrinks[index][field] = value;
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

  const allDrinksComplete = () => {
    return drinks.every(drink => drink.flavourId && drink.toppingId && drink.consistencyId);
  };

  const handleCalculateTotal = async () => {
    setCalculationLoading(true);
    setError('');
    try {
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
    } finally {
      setCalculationLoading(false);
    }
  };

  const validatePickupDetails = () => {
    if (!pickupLocation.trim()) { setError('Please enter a pickup location'); return false; }
    if (!pickupDate) { setError('Please select a pickup date'); return false; }
    if (!pickupTime) { setError('Please select a pickup time'); return false; }
    const pickupDateTime = new Date(`${pickupDate}T${pickupTime}`);
    const now = new Date();
    if (pickupDateTime <= now) { setError('Pickup time must be in the future'); return false; }
    const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60000);
    if (pickupDateTime < thirtyMinutesFromNow) { setError('Pickup time must be at least 30 minutes from now'); return false; }
    return true;
  };

  const handleSubmitOrder = async () => {
    if (!validatePickupDetails()) return;
    setSubmitting(true);
    setError('');
    try {
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
      setSubmitting(false);
    }
  };

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

  const handleBackToDrinks = () => {
    setShowCheckout(false);
    setCalculation(null);
    setError('');
  };

  const getMinDate = () => new Date().toISOString().split('T')[0];

  // --- STYLES (Ported from Home Page) ---
  
  const glassCardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '24px',
    boxShadow: '0 20px 60px rgba(255, 105, 180, 0.15), 0 0 1px rgba(255, 105, 180, 0.1)',
    border: '1px solid rgba(255, 182, 217, 0.3)',
    backdropFilter: 'blur(10px)',
    padding: '40px',
    marginBottom: '30px',
    transition: 'all 0.3s ease'
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    fontSize: '15px',
    border: '2px solid rgba(255, 182, 193, 0.5)',
    borderRadius: '12px',
    backgroundColor: '#FFFFFF', // Explicit white
    color: '#4A4A4A',
    outline: 'none',
    transition: 'border-color 0.3s, box-shadow 0.3s',
    boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#4A4A4A',
    fontSize: '14px',
    letterSpacing: '0.3px'
  };

  const primaryBtnStyle = {
    padding: '16px 40px',
    fontSize: '16px',
    background: 'linear-gradient(135deg, #FF1493 0%, #FF69B4 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '600',
    boxShadow: '0 8px 24px rgba(255, 20, 147, 0.3)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    letterSpacing: '0.5px'
  };

  const secondaryBtnStyle = {
    padding: '10px 24px',
    fontSize: '14px',
    background: 'white',
    color: '#FF1493',
    border: '2px solid #FF1493',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(255, 20, 147, 0.1)'
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FFE5EC 0%, #FFC2D4 50%, #FFB3C6 100%)',
      padding: '80px 20px',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* --- Decorative Background Elements (From Home) --- */}
      <div style={{ position: 'absolute', top: '5%', left: '-5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(255, 105, 180, 0.15) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(255, 182, 193, 0.2) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(80px)' }} />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(100px)', animation: 'pulse 8s infinite ease-in-out' }} />
      
      {/* Floating shapes */}
      <div style={{ position: 'absolute', top: '15%', left: '10%', width: '60px', height: '60px', background: 'linear-gradient(135deg, rgba(255, 105, 180, 0.2) 0%, rgba(255, 20, 147, 0.1) 100%)', borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)', animation: 'float 6s infinite ease-in-out' }} />
      <div style={{ position: 'absolute', top: '70%', right: '15%', width: '45px', height: '45px', background: 'linear-gradient(135deg, rgba(255, 182, 193, 0.25) 0%, rgba(255, 105, 180, 0.15) 100%)', borderRadius: '50% 50% 50% 0', transform: 'rotate(135deg)', animation: 'float 8s infinite ease-in-out 2s' }} />

      {/* --- Main Content --- */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '48px',
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #FF1493 0%, #FF69B4 50%, #FFB6C1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: '800',
            letterSpacing: '-1px'
          }}>
            Order Your Milkshake
          </h1>
          <p style={{ color: '#4A4A4A', fontSize: '18px', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
             Create your perfect mix, {user?.firstname}. Choose your flavors and we'll handle the rest.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ ...glassCardStyle, textAlign: 'center', padding: '60px' }}>
             <h2 style={{ color: '#FF1493' }}>Loading Menu...</h2>
             <div style={{ fontSize: '40px', marginTop: '20px' }}>⏳</div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div style={{ 
            ...glassCardStyle, 
            backgroundColor: 'rgba(255, 235, 238, 0.95)', 
            border: '2px solid #FFCDD2',
            textAlign: 'center' 
          }}>
             <h3 style={{ color: '#C62828' }}>❌ {error}</h3>
             {!lookups.config && (
                <button onClick={fetchLookups} style={{ ...secondaryBtnStyle, marginTop: '20px' }}>Retry</button>
             )}
          </div>
        )}

        {/* Success State */}
        {orderSuccess && orderResult && (
          <div style={{ ...glassCardStyle, borderTop: '4px solid #4CAF50', textAlign: 'center' }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>
            <h2 style={{ color: '#2E7D32', fontSize: '32px' }}>Order Placed Successfully!</h2>
            <p style={{ fontSize: '18px', color: '#555', margin: '15px 0' }}>
              We've received your order, <strong>{user.firstname}</strong>.
            </p>
            
            <div style={{ 
              backgroundColor: '#F1F8E9', 
              padding: '25px', 
              borderRadius: '16px', 
              textAlign: 'left',
              maxWidth: '600px',
              margin: '30px auto'
            }}>
              <h3 style={{ color: '#2E7D32', borderBottom: '1px solid #C8E6C9', paddingBottom: '10px' }}>Order Details #{orderResult.order.id}</h3>
              <div style={{ display: 'grid', gap: '10px', marginTop: '15px', color: '#333' }}>
                <div><strong>Total:</strong> R{orderResult.order.totalAmount.toFixed(2)}</div>
                <div><strong>Location:</strong> {orderResult.order.pickUpLocation}</div>
                <div><strong>Pickup:</strong> {new Date(orderResult.order.pickUpTime).toLocaleString()}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
               <button onClick={() => navigate('/my-orders')} style={{ ...secondaryBtnStyle, borderColor: '#4CAF50', color: '#4CAF50' }}>
                 View My Orders
               </button>
               <button onClick={() => { setOrderSuccess(false); setOrderResult(null); handleReset(); }} style={{ ...primaryBtnStyle, background: '#4CAF50' }}>
                 Place Another Order
               </button>
            </div>
          </div>
        )}

        {/* Step 1: Quantity */}
        {!loading && !orderSuccess && !showDrinkContainers && (
          <div style={{ ...glassCardStyle, textAlign: 'center', padding: '60px 40px' }}>
            <h2 style={{ color: '#2D2D2D', marginBottom: '30px' }}>How many drinks are you ordering?</h2>
            
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
              <input
                type="number"
                min="1"
                max={lookups.config?.maxDrinks || 10}
                value={numberOfDrinks}
                onChange={handleNumberChange}
                style={{ ...inputStyle, width: '120px', fontSize: '24px', textAlign: 'center', padding: '15px' }}
              />
            </div>
            
            <button onClick={handleNextClick} style={primaryBtnStyle}>
              Start Customizing →
            </button>
          </div>
        )}

        {/* Step 2: Drinks Config */}
        {!loading && !orderSuccess && showDrinkContainers && !showCheckout && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: '#2D2D2D', margin: 0 }}>Customize Drinks</h2>
              <button onClick={handleReset} style={{ ...secondaryBtnStyle, padding: '8px 16px' }}>← Restart</button>
            </div>

            <div style={{ display: 'grid', gap: '25px' }}>
              {drinks.map((drink, index) => (
                <div key={index} style={glassCardStyle}>
                  <h3 style={{ color: '#FF1493', borderBottom: '1px solid rgba(255, 182, 193, 0.5)', paddingBottom: '15px', marginBottom: '25px' }}>
                    🥤 Drink #{index + 1}
                  </h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '25px' }}>
                    <div>
                      <label style={labelStyle}>Flavour</label>
                      <select value={drink.flavourId} onChange={(e) => handleDrinkChange(index, 'flavourId', e.target.value)} style={inputStyle}>
                        <option value="">Select Flavour...</option>
                        {lookups.flavours.map(f => <option key={f.id} value={f.id}>{f.name} (+R{f.fee.toFixed(2)})</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Topping</label>
                      <select value={drink.toppingId} onChange={(e) => handleDrinkChange(index, 'toppingId', e.target.value)} style={inputStyle}>
                        <option value="">Select Topping...</option>
                        {lookups.toppings.map(t => <option key={t.id} value={t.id}>{t.name} (+R{t.fee.toFixed(2)})</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Consistency</label>
                      <select value={drink.consistencyId} onChange={(e) => handleDrinkChange(index, 'consistencyId', e.target.value)} style={inputStyle}>
                        <option value="">Select Consistency...</option>
                        {lookups.consistencies.map(c => <option key={c.id} value={c.id}>{c.name} (+R{c.fee.toFixed(2)})</option>)}
                      </select>
                    </div>
                  </div>
                  
                  {drink.price > 0 && (
                    <div style={{ marginTop: '20px', textAlign: 'right', fontWeight: 'bold', color: '#4A4A4A' }}>
                      Price: R{drink.price.toFixed(2)}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {allDrinksComplete() && (
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button onClick={handleCalculateTotal} disabled={calculationLoading} style={primaryBtnStyle}>
                  {calculationLoading ? 'Calculating...' : 'Review Order →'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Checkout */}
        {!loading && !orderSuccess && showCheckout && calculation && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: '#2D2D2D', margin: 0 }}>Checkout</h2>
              <button onClick={handleBackToDrinks} style={{ ...secondaryBtnStyle, padding: '8px 16px' }}>← Edit</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
              
              {/* Left Column: Summary */}
              <div style={glassCardStyle}>
                <h3 style={{ marginBottom: '20px', color: '#4A4A4A' }}>Order Summary</h3>
                <div style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '10px' }}>
                  {calculation.drinks.map((drink, index) => (
                    <div key={index} style={{ padding: '15px', backgroundColor: '#FFF', borderRadius: '12px', marginBottom: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.03)', border: '1px solid #F0F0F0' }}>
                      <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Drink #{index + 1}</div>
                      <div style={{ fontWeight: '600', color: '#2D2D2D' }}>{drink.flavour}, {drink.topping}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px', fontSize: '13px' }}>
                        <span style={{color: '#888'}}>{drink.consistency}</span>
                        <span style={{fontWeight: 'bold'}}>R{drink.price.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '2px solid rgba(255, 182, 193, 0.3)', paddingTop: '20px', marginTop: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#666' }}>
                    <span>Subtotal</span>
                    <span>R{calculation.subtotal.toFixed(2)}</span>
                  </div>
                  {calculation.discount && calculation.discount.amount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#2E7D32' }}>
                      <span>Discount ({calculation.discount.percentage}%)</span>
                      <span>-R{calculation.discount.amount.toFixed(2)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#666' }}>
                    <span>VAT</span>
                    <span>R{calculation.vat.amount.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', fontSize: '20px', fontWeight: '800', color: '#FF1493' }}>
                    <span>Total</span>
                    <span>R{calculation.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Details */}
              <div style={glassCardStyle}>
                <h3 style={{ marginBottom: '20px', color: '#4A4A4A' }}>Pickup Details</h3>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={labelStyle}>Location *</label>
                  <select value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} style={inputStyle}>
                    <option value="">Select Location...</option>
                    <option value="Milky Shaky - V&A Waterfront">Milky Shaky - V&A Waterfront</option>
                    <option value="Milky Shaky - Century City">Milky Shaky - Century City</option>
                    <option value="Milky Shaky - Tyger Valley">Milky Shaky - Tyger Valley</option>
                    <option value="Milky Shaky - Cavendish Square">Milky Shaky - Cavendish Square</option>
                    <option value="Milky Shaky - Canal Walk">Milky Shaky - Canal Walk</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '10px' }}>
                  <div>
                    <label style={labelStyle}>Date *</label>
                    <input type="date" value={pickupDate} min={getMinDate()} onChange={(e) => setPickupDate(e.target.value)} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Time *</label>
                    <input type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} style={inputStyle} />
                  </div>
                </div>
                <div style={{ fontSize: '13px', color: '#888', fontStyle: 'italic', marginBottom: '30px' }}>
                   * Minimum 30 mins from now
                </div>

                <button onClick={handleSubmitOrder} disabled={submitting} style={{ ...primaryBtnStyle, width: '100%' }}>
                  {submitting ? 'Processing...' : `Pay R${calculation.totalAmount.toFixed(2)}`}
                </button>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* Styles for animation definitions (floats and pulses) */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-45deg); }
          50% { transform: translateY(-25px) rotate(-45deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.5; transform: translate(-50%, -50%) scale(1.1); }
        }
      `}</style>
    </div>
  );
}

export default OrderForm;