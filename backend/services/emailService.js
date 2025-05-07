// backend/services/emailService.js
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Send an email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - Email body in HTML format
 * @returns {Promise<void>}
 */
const sendEmail = async (options) => {
  const msg = {
    to: options.to,
    from: process.env.FROM_EMAIL,
    subject: options.subject,
    html: options.html
  };

  await sgMail.send(msg);
};

module.exports = sendEmail;