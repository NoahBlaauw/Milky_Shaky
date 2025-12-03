const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Verify transporter configuration
const verifyEmailConfig = async () => {
  try {
    await transporter.verify();
    console.log('✅ Email server is ready to send messages');
    return true;
  } catch (error) {
    console.error('❌ Email server configuration error:', error.message);
    return false;
  }
};

// ============================================
// SEND ORDER CONFIRMATION EMAIL
// ============================================
const sendOrderConfirmation = async (user, order) => {
  try {
    // Build drinks list HTML
    let drinksHTML = '';
    order.drinks.forEach((drink, index) => {
      drinksHTML += `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            <strong>Drink ${index + 1}</strong><br/>
            ${drink.flavour.name} + ${drink.topping.name} + ${drink.consistency.name}
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
            R${drink.price.toFixed(2)}
          </td>
        </tr>
      `;
    });

    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: white; padding: 30px; border: 1px solid #ddd; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; color: #666; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .total-row { font-weight: bold; background: #f8f9fa; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🥤 Order Confirmation</h1>
            <p>Thank you for your order, ${user.firstname}!</p>
          </div>
          
          <div class="content">
            <h2>Order #${order.id}</h2>
            <p><strong>Status:</strong> ${order.isPaid ? '✅ Paid' : '⏳ Awaiting Payment'}</p>
            <p><strong>Pick Up Location:</strong> ${order.pickUpLocation}</p>
            <p><strong>Pick Up Time:</strong> ${new Date(order.pickUpTime).toLocaleString()}</p>
            
            <h3>Order Details:</h3>
            <table>
              <thead>
                <tr style="background: #f8f9fa;">
                  <th style="padding: 10px; text-align: left;">Item</th>
                  <th style="padding: 10px; text-align: right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${drinksHTML}
                <tr>
                  <td style="padding: 10px;"><strong>Subtotal</strong></td>
                  <td style="padding: 10px; text-align: right;"><strong>R${(order.totalAmount - order.vatAmount + order.discountApplied).toFixed(2)}</strong></td>
                </tr>
                ${order.discountApplied > 0 ? `
                <tr>
                  <td style="padding: 10px; color: green;">Discount Applied</td>
                  <td style="padding: 10px; text-align: right; color: green;">-R${order.discountApplied.toFixed(2)}</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 10px;">VAT (15%)</td>
                  <td style="padding: 10px; text-align: right;">R${order.vatAmount.toFixed(2)}</td>
                </tr>
                <tr class="total-row">
                  <td style="padding: 15px; font-size: 18px;">TOTAL AMOUNT</td>
                  <td style="padding: 15px; text-align: right; font-size: 18px;">R${order.totalAmount.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
            
            ${!order.isPaid ? `
              <p style="text-align: center;">
                <a href="#" class="button">Proceed to Payment</a>
              </p>
            ` : ''}
            
            <p style="margin-top: 30px; color: #666;">
              We're preparing your delicious milkshakes! Please arrive at the pick-up time to collect your order.
            </p>
          </div>
          
          <div class="footer">
            <p>Milky Shaky Drinks | Cape Town, South Africa</p>
            <p>Questions? Reply to this email or call us at 021-555-0100</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: `Order Confirmation #${order.id} - Milky Shaky`,
      html: emailHTML
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Order confirmation email sent to ${user.email}`);
    console.log('Message ID:', info.messageId);
    
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error);
    return { success: false, error: error.message };
  }
};

// ============================================
// SEND PAYMENT RECEIPT EMAIL
// ============================================
const sendPaymentReceipt = async (user, order, paymentDetails) => {
  try {
    // Build drinks list HTML
    let drinksHTML = '';
    order.drinks.forEach((drink, index) => {
      drinksHTML += `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            <strong>Drink ${index + 1}</strong><br/>
            ${drink.flavour.name} + ${drink.topping.name} + ${drink.consistency.name}
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
            R${drink.price.toFixed(2)}
          </td>
        </tr>
      `;
    });

    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: white; padding: 30px; border: 1px solid #ddd; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; color: #666; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .total-row { font-weight: bold; background: #f0fdf4; }
          .success-badge { background: #10b981; color: white; padding: 5px 15px; border-radius: 20px; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Payment Successful!</h1>
            <p>Your payment has been confirmed</p>
          </div>
          
          <div class="content">
            <div style="text-align: center; margin: 20px 0;">
              <span class="success-badge">PAID</span>
            </div>
            
            <h2>Receipt for Order #${order.id}</h2>
            <p><strong>Customer:</strong> ${user.firstname}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Payment ID:</strong> ${paymentDetails?.paymentId || 'N/A'}</p>
            
            <hr style="margin: 30px 0; border: none; border-top: 2px solid #eee;">
            
            <h3>Order Details:</h3>
            <p><strong>Pick Up Location:</strong> ${order.pickUpLocation}</p>
            <p><strong>Pick Up Time:</strong> ${new Date(order.pickUpTime).toLocaleString()}</p>
            
            <table>
              <thead>
                <tr style="background: #f8f9fa;">
                  <th style="padding: 10px; text-align: left;">Item</th>
                  <th style="padding: 10px; text-align: right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${drinksHTML}
                <tr>
                  <td style="padding: 10px;"><strong>Subtotal</strong></td>
                  <td style="padding: 10px; text-align: right;"><strong>R${(order.totalAmount - order.vatAmount + order.discountApplied).toFixed(2)}</strong></td>
                </tr>
                ${order.discountApplied > 0 ? `
                <tr>
                  <td style="padding: 10px; color: green;">Discount Applied</td>
                  <td style="padding: 10px; text-align: right; color: green;">-R${order.discountApplied.toFixed(2)}</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 10px;">VAT (15%)</td>
                  <td style="padding: 10px; text-align: right;">R${order.vatAmount.toFixed(2)}</td>
                </tr>
                <tr class="total-row">
                  <td style="padding: 15px; font-size: 18px;">AMOUNT PAID</td>
                  <td style="padding: 15px; text-align: right; font-size: 18px; color: #10b981;">R${order.totalAmount.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
            
            <div style="background: #f0fdf4; padding: 20px; border-radius: 10px; margin-top: 30px;">
              <h3 style="margin-top: 0; color: #059669;">🎉 Thank You!</h3>
              <p>Your order is confirmed and we're preparing your delicious milkshakes!</p>
              <p><strong>Next Steps:</strong></p>
              <ul>
                <li>Arrive at <strong>${order.pickUpLocation}</strong></li>
                <li>Pick up your order at <strong>${new Date(order.pickUpTime).toLocaleTimeString()}</strong></li>
                <li>Show this email or your order number: <strong>#${order.id}</strong></li>
              </ul>
            </div>
          </div>
          
          <div class="footer">
            <p>Milky Shaky Drinks | Cape Town, South Africa</p>
            <p>Questions? Reply to this email or call us at 021-555-0100</p>
            <p style="margin-top: 10px; color: #999;">This is an automated receipt. Please keep it for your records.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: `Payment Receipt #${order.id} - Milky Shaky`,
      html: emailHTML,
      attachments: [
        {
          filename: `receipt-${order.id}.txt`,
          content: `
MILKY SHAKY DRINKS - PAYMENT RECEIPT
=====================================

Order #: ${order.id}
Date: ${new Date().toLocaleString()}
Customer: ${user.firstname}
Email: ${user.email}

PICK UP DETAILS:
Location: ${order.pickUpLocation}
Time: ${new Date(order.pickUpTime).toLocaleString()}

ORDER SUMMARY:
${order.drinks.map((d, i) => `Drink ${i+1}: ${d.flavour.name} + ${d.topping.name} + ${d.consistency.name} - R${d.price.toFixed(2)}`).join('\n')}

Subtotal: R${(order.totalAmount - order.vatAmount + order.discountApplied).toFixed(2)}
${order.discountApplied > 0 ? `Discount: -R${order.discountApplied.toFixed(2)}\n` : ''}VAT (15%): R${order.vatAmount.toFixed(2)}
TOTAL PAID: R${order.totalAmount.toFixed(2)}

Payment ID: ${paymentDetails?.paymentId || 'N/A'}

Thank you for your order!
          `
        }
      ]
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Payment receipt sent to ${user.email}`);
    console.log('Message ID:', info.messageId);
    
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('❌ Error sending payment receipt:', error);
    return { success: false, error: error.message };
  }
};

// ============================================
// TEST EMAIL FUNCTION
// ============================================
const sendTestEmail = async (toEmail) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: toEmail,
      subject: 'Test Email - Milky Shaky',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>🥤 Milky Shaky Email Test</h2>
          <p>If you're reading this, the email configuration is working correctly!</p>
          <p>Server is ready to send order confirmations and payment receipts.</p>
          <hr>
          <p style="color: #666; font-size: 12px;">Sent from Milky Shaky Backend</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Test email sent successfully');
    console.log('Message ID:', info.messageId);
    
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('❌ Error sending test email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  verifyEmailConfig,
  sendOrderConfirmation,
  sendPaymentReceipt,
  sendTestEmail
};