// backend/services/cronService.js
const cron = require('node-cron');
const User = require('../models/userModel');
const Item = require('../models/itemModel');
const sendEmail = require('./emailService');

// Function to check for expiring items and send notifications
const checkExpiringItems = async () => {
  try {
    console.log('Running expiration check cron job...');
    
    // Get the date 30 days from now
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    // Find all users with expirationAlerts enabled
    const users = await User.find({
      'notificationPreferences.expirationAlerts': true,
      isEmailVerified: true
    });
    
    // For each user, check if they have expiring items
    for (const user of users) {
      // Find items that will expire within 30 days
      const expiringItems = await Item.find({
        userId: user._id,
        expirationDate: {
          $exists: true,
          $ne: null,
          $lte: thirtyDaysFromNow,
          $gte: new Date()
        }
      }).sort({ expirationDate: 1 });
      
      // If there are expiring items, send an email notification
      if (expiringItems.length > 0) {
        // Format the items for the email
        const itemsList = expiringItems.map(item => {
          const expDate = new Date(item.expirationDate).toLocaleDateString();
          return `<li><strong>${item.name}</strong> - Expires on ${expDate}</li>`;
        }).join('');
        
        // Create email content
        const message = `
          <h1>Emergency Bag Item Expiration Alert</h1>
          <p>Hello ${user.firstName},</p>
          <p>The following items in your emergency bag are expiring within the next 30 days:</p>
          <ul>
            ${itemsList}
          </ul>
          <p>Please consider replacing these items to ensure your emergency kit remains up-to-date.</p>
          <p>Visit your <a href="${process.env.FRONTEND_URL}/dashboard">dashboard</a> to manage your items.</p>
          <p>Stay prepared,</p>
          <p>The Emergency Bag Tracker Team</p>
        `;
        
        // Send the email
        await sendEmail({
          to: user.email,
          subject: 'Items in your Emergency Bag are expiring soon',
          html: message
        });
        
        console.log(`Expiration notification sent to ${user.email}`);
      }
    }
    
    console.log('Expiration check completed');
  } catch (error) {
    console.error('Error in checkExpiringItems cron job:', error);
  }
};

// Schedule the cron job to run at 8:00 AM every day
// Format: '0 8 * * *' (minute, hour, day of month, month, day of week)
cron.schedule('0 8 * * *', checkExpiringItems);

module.exports = {
  checkExpiringItems
};