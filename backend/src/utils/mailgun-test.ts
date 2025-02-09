import formData from 'form-data';
import Mailgun, { MailgunMessageData } from 'mailgun.js';
import dotenv from 'dotenv';

dotenv.config();
console.log(process.env.MAIL_GUN_TEST_KEY)

// Initialize mailgun with correct typing
const mailgun = new Mailgun.default(formData);

const DOMAIN = process.env.MAIL_GUN_TEST_DOMAIN || '';
const mg = mailgun.client({
    username: 'api',
    key: process.env.MAIL_GUN_TEST_KEY || ''
});
const TEST_EMAIL = process.env.MAIL_GUN_TEST_EMAIL || '';
const TEST_SENDER = process.env.MAIL_GUN_TEST_SENDER || '';

console.log(TEST_SENDER)

async function testEmailSending() {
    try {
        const messageData: MailgunMessageData = {
            from: `DigitailPets <${TEST_SENDER}>`,
            to: [TEST_EMAIL],
            subject: 'Hello from DigitailPets Testing!',
            text: 'This is a another test email via Mailgun',
            html: '<h1>This is a test email via Mailgun</h1><p>If you see this, the test was successful!</p>'
        }

        const response = await mg.messages.create(DOMAIN, messageData);
        console.log('Email sent successfully!');
        console.log('Response:', response);
        
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

testEmailSending();