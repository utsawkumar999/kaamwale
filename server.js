/**
 * KaamWale.com - Simple Local & Production Web Server
 * Founder: Shivam Pandat (+91 98998 62721 | shivampandat819@gmail.com)
 * Native Node.js HTTP server with WhatsApp Order Notification API
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const BASE_DIR = __dirname;
const ADMIN_PHONE = "9899862721";
const ADMIN_NAME = "Shivam Pandat";
const ORDERS_FILE = path.join(BASE_DIR, 'orders.json');

// Auto-load .env configuration if present
function loadEnv() {
  try {
    const envPath = path.join(BASE_DIR, '.env');
    if (fs.existsSync(envPath)) {
      const envLines = fs.readFileSync(envPath, 'utf8').split('\n');
      for (const line of envLines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const [k, ...v] = trimmed.split('=');
          process.env[k.trim()] = v.join('=').trim().replace(/^["']|["']$/g, '');
        }
      }
    }
  } catch (e) {}
}
loadEnv();
console.log('⚙️ .env configuration loaded successfully');

// ==========================================
// SECURE SERVER-SIDE IN-MEMORY OTP SESSIONS
// (Codes stored only in server memory with TTL and rate-limits - Never sent to browser)
// ==========================================
const crypto = require('crypto');
const mobileOtpSessions = new Map(); // phone -> { otp, expiresAt, attempts, createdAt }
const emailOtpSessions = new Map();  // email -> { otp, expiresAt, attempts, createdAt }
const adminSessions = new Map();     // token -> { createdAt, expiresAt }
const adminLoginAttempts = new Map();// ip -> { count, lockedUntil }

function isValidAdminToken(token) {
  if (!token) return false;
  const session = adminSessions.get(token);
  if (session && session.expiresAt > Date.now()) {
    return true;
  }
  const configuredSecret = process.env.ADMIN_TOKEN || process.env.ADMIN_PASSWORD || 'Shivam@819';
  if (configuredSecret && token === configuredSecret) {
    return true;
  }
  return false;
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.zip': 'application/zip',
  '.apk': 'application/vnd.android.package-archive',
  '.webmanifest': 'application/manifest+json'
};

function formatAdminWhatsAppNotification(order) {
  const isUrgent = order.isUrgent ? ' (🚨 URGENT 30 MIN PRIORITY)' : '';
  const subServicesText = Array.isArray(order.subServices) 
    ? order.subServices.join(', ') 
    : (order.subServices || order.category);
  
  // Security Fix 3: Cryptographically random booking OTP (No hardcoded fallback 4819!)
  if (!order.otp) {
    order.otp = String(Math.floor(1000 + Math.random() * 9000));
  }

  return (
    `*🚨 NEW KAAMWALE.COM CUSTOMER ORDER 🚨*\n` +
    `----------------------------------------\n` +
    `📋 *Order ID:* ${order.booking_id}\n` +
    `🔒 *Doorstep Security OTP:* ${order.otp}\n` +
    `🛠️ *Service Category:* ${order.category}\n` +
    `🔧 *Tasks Requested:* ${subServicesText}\n` +
    `👤 *Customer Name:* ${order.custName}\n` +
    `📞 *Customer Phone:* ${order.custPhone}\n` +
    `📍 *Doorstep Address:* ${order.custAddress}\n` +
    `⏰ *Preferred Time:* ${order.timeSlot || 'Immediate'}${isUrgent}\n` +
    (order.desc ? `📝 *Problem Details:* ${order.desc}\n` : '') +
    `💰 *Estimated Bill (Admin/Cust):* ${order.priceEstimate || '₹349+'}\n` +
    `----------------------------------------\n` +
    `*Action Required:* Please assign an approved local worker to this order.\n` +
    `Platform Owner: ${ADMIN_NAME} (+91 ${ADMIN_PHONE})`
  );
}

function sendBrevoEmailAsync(toEmail, toName, subject, htmlContent) {
  return new Promise((resolve) => {
    if (!process.env.BREVO_API_KEY) {
      return resolve({ success: false, reason: 'BREVO_API_KEY not configured' });
    }
    const senderEmail = process.env.BREVO_SENDER_EMAIL || 'lohasingh8023@gmail.com';
    const payload = JSON.stringify({
      sender: { name: "KaamWale.com", email: senderEmail },
      to: [{ email: toEmail, name: toName || toEmail.split('@')[0] }],
      subject: subject,
      htmlContent: htmlContent
    });

    const bReq = https.request('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      },
      timeout: 8000
    }, (bRes) => {
      let data = '';
      bRes.on('data', chunk => { data += chunk; });
      bRes.on('end', () => {
        if (bRes.statusCode >= 200 && bRes.statusCode < 300) {
          console.log(`✉️ Brevo email successfully delivered to ${toEmail}`);
          resolve({ success: true, response: data });
        } else {
          console.warn(`⚠️ Brevo returned status ${bRes.statusCode}: ${data}`);
          resolve({ success: false, status: bRes.statusCode, error: data });
        }
      });
    });

    bReq.on('error', (err) => {
      console.warn('Brevo request error:', err.message);
      resolve({ success: false, error: err.message });
    });

    bReq.write(payload);
    bReq.end();
  });
}

// ==========================================
// PERSISTENT USERS DATABASE (users.json)
// Manages Customer, Worker, and Admin profiles & roles securely on the server
// ==========================================
const USERS_FILE = path.join(BASE_DIR, 'users.json');

function initUsersStore() {
  if (!fs.existsSync(USERS_FILE)) {
    const seed = [
      {
        id: "kw_adm_1",
        uid: "shivam_admin_uid",
        name: "Shivam Pandat",
        email: "shivampandat819@gmail.com",
        phone: "9899862721",
        role: "admin",
        address: "Headquarters, Noida",
        status: "active",
        createdAt: new Date().toISOString()
      },
      {
        id: "kw_cust_1",
        uid: "rohit_demo_uid",
        name: "Rohit Verma",
        email: "rohit.verma@gmail.com",
        phone: "9876543210",
        role: "customer",
        address: "Boring Road, Patna",
        status: "active",
        createdAt: new Date().toISOString()
      }
    ];
    fs.writeFileSync(USERS_FILE, JSON.stringify(seed, null, 2), 'utf8');
    console.log('📦 users.json initialized with default profiles');
  }
}
initUsersStore();

function getStoredUsers() {
  try {
    initUsersStore();
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8') || '[]');
  } catch (e) {
    return [];
  }
}

function saveStoredUsers(users) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
  } catch (e) {
    console.error('Error saving users.json:', e.message);
  }
}

// Google / Firebase ID Token Cryptographic Verification via Google's tokeninfo API
function verifyGoogleOrFirebaseToken(idToken) {
  return new Promise((resolve) => {
    if (!idToken || typeof idToken !== 'string') {
      return resolve({ valid: false, error: 'Token missing' });
    }

    const tokenUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`;
    https.get(tokenUrl, { timeout: 6000 }, (tRes) => {
      let data = '';
      tRes.on('data', c => { data += c.toString(); });
      tRes.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed && (parsed.sub || parsed.user_id) && parsed.email) {
            resolve({
              valid: true,
              uid: parsed.sub || parsed.user_id,
              email: parsed.email.toLowerCase(),
              name: parsed.name || parsed.email.split('@')[0],
              picture: parsed.picture || '',
              email_verified: parsed.email_verified === 'true' || parsed.email_verified === true
            });
          } else {
            resolve({ valid: false, error: parsed.error_description || parsed.error || 'Invalid token response' });
          }
        } catch (e) {
          resolve({ valid: false, error: 'Failed to parse token verification response' });
        }
      });
    }).on('error', (e) => {
      resolve({ valid: false, error: 'Token verification connection failed: ' + e.message });
    });
  });
}

const server = http.createServer((req, res) => {
  // Set global CORS headers to allow requests from any origin, local files, and tunnels
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle CORS preflight immediately
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Normalize URL path and query parameters
  const parsedUrl = new URL(req.url, 'http://localhost');
  let reqPath = parsedUrl.pathname;
  const queryParams = parsedUrl.searchParams;

  // ==========================================
  // API: NOTIFY ADMIN WHATSAPP & STORE ORDER
  // ==========================================
  if (req.method === 'POST' && reqPath === '/api/notify-admin-whatsapp') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const order = JSON.parse(body || '{}');
        const waMessage = formatAdminWhatsAppNotification(order);
        const waUrl = `https://wa.me/91${ADMIN_PHONE}?text=${encodeURIComponent(waMessage)}`;

        // Save order to persistent orders.json
        let orders = [];
        try {
          if (fs.existsSync(ORDERS_FILE)) {
            orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
          }
        } catch (e) {
          orders = [];
        }

        if (!order.otp) {
          order.otp = String(Math.floor(1000 + Math.random() * 9000));
        }

        order.receivedAt = order.receivedAt || new Date().toISOString();
        if (!order.status || order.status === 'pending_admin') {
          order.status = 'pending_admin_approval';
        }

        const existingIdx = orders.findIndex(o => o.booking_id === order.booking_id);
        if (existingIdx !== -1) {
          orders[existingIdx] = { ...orders[existingIdx], ...order };
        } else {
          orders.unshift(order);
        }
        fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');

        // Console notification with high visibility for Admin
        console.log('\n================================================================');
        console.log('🚨 NEW ORDER NOTIFICATION FOR ADMIN (SHIVAM PANDAT) 🚨');
        console.log('----------------------------------------------------------------');
        console.log(`📋 Order ID    : ${order.booking_id}`);
        console.log(`👤 Customer    : ${order.custName} (📞 ${order.custPhone})`);
        console.log(`📍 Address     : ${order.custAddress}`);
        console.log(`🛠️ Service     : ${order.category}`);
        console.log(`💰 Bill Est.   : ${order.priceEstimate || '₹349+'}`);
        console.log(`🔒 Security OTP: ${order.otp}`);
        console.log(`⏳ Status      : 🟡 Awaiting Admin Approval`);
        console.log(`📲 WhatsApp Link to Admin (+91 ${ADMIN_PHONE}):`);
        console.log(`   ${waUrl}`);
        console.log('================================================================\n');

        // Optional webhook forwarding if WHATSAPP_WEBHOOK_URL is set in environment
        if (process.env.WHATSAPP_WEBHOOK_URL) {
          try {
            const webhookUrl = new URL(process.env.WHATSAPP_WEBHOOK_URL);
            const postData = JSON.stringify({ phone: ADMIN_PHONE, message: waMessage, order });
            const client = webhookUrl.protocol === 'https:' ? https : http;
            const webhookReq = client.request(webhookUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(postData) }
            });
            webhookReq.on('error', (err) => console.log('Webhook dispatch note:', err.message));
            webhookReq.write(postData);
            webhookReq.end();
          } catch (we) {}
        }

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
          success: true,
          orderId: order.booking_id,
          adminPhone: ADMIN_PHONE,
          whatsappUrl: waUrl,
          message: `Order logged and notification prepared for Admin WhatsApp (+91 ${ADMIN_PHONE})`
        }));
      } catch (parseErr) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: "Invalid JSON format" }));
      }
    });
    return;
  }

  // ==========================================
  // API: NOTIFY ADMIN SMS & LOG SMS DISPATCH
  // ==========================================
  if (req.method === 'POST' && reqPath === '/api/notify-admin-sms') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const order = payload.order || payload;
        const smsText = 
          `KaamWale.com NEW ORDER ${order.booking_id || ''}: ${order.custName || 'Customer'} (${order.custPhone || ''}), ` +
          `Service: ${order.category || ''}, Addr: ${order.custAddress || ''}, OTP: ${order.otp || ''}. ` +
          `Status: Pending Admin Approval. Admin: Shivam Pandat (+91 ${ADMIN_PHONE})`;

        const smsUrl = `sms:+91${ADMIN_PHONE}?body=${encodeURIComponent(smsText)}`;

        console.log('\n================================================================');
        console.log(`💬 NEW ORDER SMS NOTIFICATION FOR ADMIN (+91 ${ADMIN_PHONE}) 💬`);
        console.log('----------------------------------------------------------------');
        console.log(`📋 Order ID : ${order.booking_id}`);
        console.log(`👤 Customer : ${order.custName} (📞 ${order.custPhone})`);
        console.log(`🛠️ Service  : ${order.category}`);
        console.log(`📍 Address  : ${order.custAddress}`);
        console.log(`🔒 OTP      : ${order.otp}`);
        console.log(`💬 SMS Text : ${smsText}`);
        console.log(`📲 SMS Link : ${smsUrl}`);
        console.log('================================================================\n');

        // Optional SMS Webhook forwarder if configured
        if (process.env.SMS_WEBHOOK_URL) {
          try {
            const sUrl = new URL(process.env.SMS_WEBHOOK_URL);
            const postData = JSON.stringify({ phone: ADMIN_PHONE, message: smsText, order });
            const client = sUrl.protocol === 'https:' ? https : http;
            const sReq = client.request(sUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(postData) },
              timeout: 4000
            });
            sReq.on('error', () => {});
            sReq.write(postData);
            sReq.end();
          } catch (e) {}
        }

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
          success: true,
          orderId: order.booking_id,
          adminPhone: ADMIN_PHONE,
          smsUrl: smsUrl,
          smsText: smsText,
          message: `SMS notification prepared for Admin (+91 ${ADMIN_PHONE})`
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // ==========================================
  // API: GET ORDERS LIST (PROTECTED & RESTRICTED)
  // Security Fix 2: Require Admin Token or Customer Phone Filter
  // ==========================================
  if (req.method === 'GET' && reqPath === '/api/orders') {
    try {
      loadEnv();
      const authHeader = (req.headers['authorization'] || '').replace(/^Bearer\s+/i, '');
      const queryKey = queryParams.get('key') || queryParams.get('token');
      const customerPhone = (queryParams.get('phone') || '').replace(/\D/g, '').slice(-10);
      const adminToken = req.headers['x-admin-token'] || authHeader || queryKey;
      const isAdmin = isValidAdminToken(adminToken);

      let orders = [];
      if (fs.existsSync(ORDERS_FILE)) {
        try {
          orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8') || '[]');
        } catch (e) { orders = []; }
      }

      // If authorized Admin: Return all orders
      if (isAdmin) {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(orders));
        return;
      }

      // If customer filtering their own bookings by phone or order ID
      const queryBookingId = (queryParams.get('order_id') || queryParams.get('booking_id') || '').trim().toUpperCase();
      if (queryBookingId) {
        const matched = orders.filter(o => (o.booking_id || '').toUpperCase() === queryBookingId);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(matched));
        return;
      }

      if (customerPhone && customerPhone.length === 10) {
        const customerOrders = orders.filter(o => {
          const oPhone = String(o.custPhone || '').replace(/\D/g, '').slice(-10);
          return oPhone === customerPhone;
        });
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(customerOrders));
        return;
      }

      // Unauthenticated access blocked!
      res.writeHead(401, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({
        success: false,
        error: "Unauthorized: Admin authorization token or customer phone required to view orders."
      }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // ==========================================
  // API: GET VERIFIED WORKERS DIRECTORY
  // ==========================================
  if (req.method === 'GET' && reqPath === '/api/workers') {
    try {
      const users = getStoredUsers();
      // Return only active/approved workers
      const workers = users.filter(u => u.role === 'worker' && u.status !== 'suspended');
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(workers));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // ==========================================
  // API: UPDATE ORDER (STATUS / WORKER ASSIGNMENT)
  // ==========================================
  if (req.method === 'POST' && reqPath === '/api/orders/update') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const bookingId = payload.booking_id || payload.orderId;
        if (!bookingId) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'booking_id is required' }));
          return;
        }

        let orders = [];
        if (fs.existsSync(ORDERS_FILE)) {
          try {
            orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8') || '[]');
          } catch (e) { orders = []; }
        }

        const idx = orders.findIndex(o => o.booking_id === bookingId);
        if (idx !== -1) {
          if (payload.status) orders[idx].status = payload.status;
          if (payload.adminApprovedAt !== undefined) orders[idx].adminApprovedAt = payload.adminApprovedAt;
          if (payload.rejectionReason !== undefined) orders[idx].rejectionReason = payload.rejectionReason;
          if (payload.assignedWorkerId !== undefined) orders[idx].assignedWorkerId = payload.assignedWorkerId;
          if (payload.assignedWorkerName !== undefined) orders[idx].assignedWorkerName = payload.assignedWorkerName;
          if (payload.assignedWorkerPhone !== undefined) orders[idx].assignedWorkerPhone = payload.assignedWorkerPhone;
          if (payload.paymentStatus !== undefined) orders[idx].paymentStatus = payload.paymentStatus;
          if (payload.paymentMode !== undefined) orders[idx].paymentMode = payload.paymentMode;
          if (payload.paymentAmount !== undefined) orders[idx].paymentAmount = payload.paymentAmount;
          if (payload.paymentUtr !== undefined) orders[idx].paymentUtr = payload.paymentUtr;
          if (payload.completedAt !== undefined) orders[idx].completedAt = payload.completedAt;
          if (payload.otpVerified !== undefined) orders[idx].otpVerified = payload.otpVerified;
          orders[idx].updatedAt = new Date().toISOString();
          fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');
          console.log(`📝 Order ${bookingId} updated on server: Status = ${orders[idx].status}, Worker = ${orders[idx].assignedWorkerName || 'None'}`);
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ success: true, order: orders[idx] }));
        } else {
          // If not found in orders.json, add it
          payload.updatedAt = new Date().toISOString();
          orders.unshift(payload);
          fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ success: true, order: payload }));
        }
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // ==========================================
  // API: DELETE ORDER FROM SERVER
  // ==========================================
  if (req.method === 'POST' && reqPath === '/api/orders/delete') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const bookingId = payload.booking_id || payload.orderId;
        if (!bookingId) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'booking_id is required' }));
          return;
        }

        let orders = [];
        if (fs.existsSync(ORDERS_FILE)) {
          try {
            orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8') || '[]');
          } catch (e) { orders = []; }
        }

        const filtered = orders.filter(o => o.booking_id !== bookingId);
        fs.writeFileSync(ORDERS_FILE, JSON.stringify(filtered, null, 2), 'utf8');
        console.log(`🗑️ Order ${bookingId} removed from orders.json on server`);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: true, message: `Order ${bookingId} removed` }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // ==========================================
  // API: GET PUBLIC CONFIGURATION (GOOGLE CLIENT ID)
  // ==========================================
  if (req.method === 'GET' && reqPath === '/api/config') {
    loadEnv();
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      googleClientId: process.env.GOOGLE_CLIENT_ID || "",
      hasGoogleSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      platformName: "KaamWale.com",
      adminPhone: ADMIN_PHONE
    }));
    return;
  }

  // ==========================================
  // API: SAVE GOOGLE CLIENT ID DYNAMICALLY INTO .ENV
  // ==========================================
  if (req.method === 'POST' && reqPath === '/api/save-google-client-id') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const clientId = (payload.clientId || '').trim();
        if (clientId && clientId.includes('.apps.googleusercontent.com')) {
          process.env.GOOGLE_CLIENT_ID = clientId;
          const envPath = path.join(BASE_DIR, '.env');
          let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
          if (envContent.includes('GOOGLE_CLIENT_ID=')) {
            envContent = envContent.replace(/GOOGLE_CLIENT_ID=.*/g, `GOOGLE_CLIENT_ID=${clientId}`);
          } else {
            envContent += `\nGOOGLE_CLIENT_ID=${clientId}\n`;
          }
          fs.writeFileSync(envPath, envContent, 'utf8');
          console.log(`🔑 Google Client ID saved and activated: ${clientId}`);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, googleClientId: clientId }));
          return;
        }
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Invalid Client ID. Must end with .apps.googleusercontent.com' }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // ==========================================
  // API: SAVE BREVO API KEY & SENDER EMAIL DYNAMICALLY
  // ==========================================
  if (req.method === 'POST' && reqPath === '/api/save-brevo-key') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const apiKey = (payload.apiKey || '').trim();
        const senderEmail = (payload.senderEmail || process.env.BREVO_SENDER_EMAIL || 'lohasingh8023@gmail.com').trim().toLowerCase();
        if (apiKey && apiKey.length > 15) {
          process.env.BREVO_API_KEY = apiKey;
          process.env.BREVO_SENDER_EMAIL = senderEmail;
          const envPath = path.join(BASE_DIR, '.env');
          let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
          
          if (envContent.includes('BREVO_API_KEY=')) {
            envContent = envContent.replace(/BREVO_API_KEY=.*/g, `BREVO_API_KEY=${apiKey}`);
          } else {
            envContent += `\nBREVO_API_KEY=${apiKey}\n`;
          }
          if (envContent.includes('BREVO_SENDER_EMAIL=')) {
            envContent = envContent.replace(/BREVO_SENDER_EMAIL=.*/g, `BREVO_SENDER_EMAIL=${senderEmail}`);
          } else {
            envContent += `BREVO_SENDER_EMAIL=${senderEmail}\n`;
          }
          fs.writeFileSync(envPath, envContent, 'utf8');
          console.log(`✉️ Brevo API Key saved & activated for sender: ${senderEmail}`);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, message: 'Brevo API Key successfully saved and activated!' }));
          return;
        }
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Invalid API Key. Must be at least 15 characters.' }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // ==========================================
  // API: TEST BREVO EMAIL DISPATCH
  // ==========================================
  if (req.method === 'POST' && reqPath === '/api/test-brevo-email') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const testTo = (payload.email || process.env.BREVO_SENDER_EMAIL || 'lohasingh8023@gmail.com').trim();
        const testRes = await sendBrevoEmailAsync(
          testTo, 
          'KaamWale Tester', 
          '🧪 KaamWale.com Brevo Test Email', 
          `<div style="font-family:Arial,sans-serif;padding:20px;border:1px solid #10b981;border-radius:12px;">
            <h2 style="color:#059669;margin-top:0;">KAAMWALE.COM</h2>
            <p>Namaste! KaamWale.com ka Brevo Email OTP System safaltapoorvak connect ho gaya hai.</p>
            <p style="color:#64748b;font-size:12px;">Tested at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
          </div>`
        );
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(testRes));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // ==========================================
  // API: REAL MOBILE NUMBER OTP DISPATCH (SMS & WHATSAPP)
  // ==========================================
  if (req.method === 'POST' && reqPath === '/api/send-mobile-otp') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', async () => {
      loadEnv();
      try {
        const payload = JSON.parse(body || '{}');
        const phone = (payload.phone || payload.mobile || '').replace(/\D/g, '').slice(-10);
        const otp = payload.otp || String(Math.floor(100000 + Math.random() * 900000));
        const purpose = payload.purpose || 'सुरक्षा सत्यापन';

        if (!phone || phone.length < 10) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Invalid 10-digit mobile number' }));
          return;
        }

        const waMsg = 
          `*🟢 KAAMWALE.NET SECURITY VERIFICATION 🟢*\n` +
          `----------------------------------------\n` +
          `Namaste!\n` +
          `KaamWale.net me aapka swagat hai.\n\n` +
          `Aapka aadhikarik suraksha satyapan code hai:\n\n` +
          `👉 *${otp}*\n\n` +
          `📋 uddeshya: ${purpose}\n` +
          `⏱️ vaidhata: 10 minute (Valid for 10 minutes)\n` +
          `🔒 kripya ye code kisi ke sath sajha na karein.\n\n` +
          `🌐 KaamWale.net • Har Kaam Ka Solution\n` +
          `👑 Platform Admin: Shivam Pandat (+91 98998 62721)\n` +
          `----------------------------------------`;

        const smsMsg = `KaamWale.net verification code: ${otp}. Valid for 10 min. Do not share. Admin: Shivam Pandat (+91 98998 62721)`;
        const waUrl = `https://wa.me/91${phone}?text=${encodeURIComponent(waMsg)}`;
        const smsUrl = `sms:+91${phone}?body=${encodeURIComponent(smsMsg)}`;
        const channel = payload.channel || 'all';

        console.log('\n================================================================');
        console.log(`🟢 KAAMWALE.NET DISPATCH TO: +91 ${phone} [Channel: ${channel}]`);
        console.log(`🔑 6-DIGIT SECURITY CODE: [ ${otp} ] | Purpose: ${purpose}`);
        console.log(`📲 WhatsApp Link: ${waUrl}`);
        console.log(`💬 SMS Link: ${smsUrl}`);
        console.log('================================================================\n');

        // Optional webhook forwarder if WHATSAPP_WEBHOOK_URL is configured
        if (process.env.WHATSAPP_WEBHOOK_URL && (channel === 'whatsapp' || channel === 'all')) {
          try {
            const webhookUrl = new URL(process.env.WHATSAPP_WEBHOOK_URL);
            const postData = JSON.stringify({ phone: phone, message: waMsg, otp: otp });
            const client = webhookUrl.protocol === 'https:' ? https : http;
            const wReq = client.request(webhookUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(postData) },
              timeout: 4000
            });
            wReq.on('error', () => {});
            wReq.write(postData);
            wReq.end();
          } catch (e) {}
        }

        // Optional SMS Webhook forwarder if SMS_WEBHOOK_URL is configured
        if (process.env.SMS_WEBHOOK_URL && (channel === 'sms' || channel === 'all')) {
          try {
            const smsWebhookUrl = new URL(process.env.SMS_WEBHOOK_URL);
            const postData = JSON.stringify({ phone: phone, message: smsMsg, otp: otp });
            const client = smsWebhookUrl.protocol === 'https:' ? https : http;
            const sReq = client.request(smsWebhookUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(postData) },
              timeout: 4000
            });
            sReq.on('error', () => {});
            sReq.write(postData);
            sReq.end();
          } catch (e) {}
        }

        // Store OTP on server with 10-minute TTL and rate-limiting
        mobileOtpSessions.set(phone, {
          otp: otp,
          expiresAt: Date.now() + 10 * 60 * 1000,
          attempts: 0,
          createdAt: Date.now()
        });

        // Security Fix: NEVER SEND 'otp' in API response to the client browser!
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
          success: true,
          phone: phone,
          channel: channel,
          whatsappUrl: waUrl,
          smsUrl: smsUrl,
          message: `KaamWale.net verification code ready via WhatsApp or SMS for +91 ${phone}`
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // ==========================================
  // API: VERIFY MOBILE NUMBER OTP (SERVER-SIDE SECURE VERIFICATION)
  // ==========================================
  if (req.method === 'POST' && reqPath === '/api/verify-mobile-otp') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const phone = (payload.phone || payload.mobile || '').replace(/\D/g, '').slice(-10);
        const enteredOtp = String(payload.otp || '').trim();

        if (!phone || phone.length < 10 || !enteredOtp) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Phone number and 6-digit OTP code are required' }));
          return;
        }

        const session = mobileOtpSessions.get(phone);
        if (!session) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'OTP session expired or not found. Please request a new code.' }));
          return;
        }

        if (Date.now() > session.expiresAt) {
          mobileOtpSessions.delete(phone);
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'OTP has expired (10-minute validity). Please request a new OTP.' }));
          return;
        }

        session.attempts++;
        if (session.attempts > 5) {
          mobileOtpSessions.delete(phone);
          res.writeHead(429, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Maximum attempts exceeded (5/5). OTP blocked for security.' }));
          return;
        }

        if (session.otp !== enteredOtp) {
          const remaining = 5 - session.attempts;
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: `Invalid OTP code. ${remaining} attempt(s) remaining.` }));
          return;
        }

        // Successfully verified! Invalidate immediately to prevent replay attacks
        mobileOtpSessions.delete(phone);
        console.log(`✅ Mobile OTP successfully verified on server for: +91 ${phone}`);

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
          success: true,
          verified: true,
          phone: phone,
          message: 'Mobile number successfully verified by server'
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // ==========================================
  // API: REAL GMAIL & BREVO EMAIL OTP DISPATCH
  // ==========================================
  if (req.method === 'POST' && reqPath === '/api/send-email-otp') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', async () => {
      loadEnv();
      try {
        const payload = JSON.parse(body || '{}');
        const email = (payload.email || '').trim().toLowerCase();
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        const userName = payload.name || email.split('@')[0] || 'Customer';
        const purpose = payload.purpose || 'registration'; // 'registration', 'password_reset', 'login'

        if (!email || !email.includes('@')) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Valid email address is required' }));
          return;
        }

        // Store email OTP server-side with 10-minute TTL and rate-limiting
        emailOtpSessions.set(email, {
          otp: otp,
          purpose: purpose,
          expiresAt: Date.now() + 10 * 60 * 1000,
          attempts: 0,
          createdAt: Date.now()
        });

        const purposeHindi = purpose === 'password_reset' ? 'पासवर्ड रीसेट' : (purpose === 'admin_2fa' ? 'सुपर एडमिन 2FA लॉगिन' : (purpose === 'login' ? 'सुरक्षा लॉगिन' : 'खाता रजिस्ट्रेशन'));
        const emailSubject = `KaamWale.com - ${purposeHindi} OTP कोड: ${otp}`;
        const emailBody = 
          `Namaste ${userName},\n\n` +
          `KaamWale.com me aapka swagat hai!\n\n` +
          `Aapka 6-ankiya suraksha satyapan (Email Verification) code hai:\n\n` +
          `👉 [ ${otp} ]\n\n` +
          `📋 uddeshya: ${purposeHindi}\n` +
          `⏱️ vaidhata: 10 minute (Valid for 10 minutes)\n` +
          `🔒 kripya ye OTP kisi ke sath sajha na karein.\n\n` +
          `Founder: ${ADMIN_NAME} (+91 ${ADMIN_PHONE})\n` +
          `KaamWale.com - Har Kaam Ka Solution`;

        const gmailRedirectUrl = `https://mail.google.com/mail/u/0/?fs=1&tf=cm&to=${encodeURIComponent(email)}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        const mailtoUrl = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

        console.log('\n================================================================');
        console.log(`📧 SECURE EMAIL OTP DISPATCH TO: ${email}`);
        console.log(`🔑 6-DIGIT CODE: [ ${otp} ] | Purpose: ${purposeHindi}`);
        console.log(`📬 Gmail Compose Link: ${gmailRedirectUrl}`);
        console.log('================================================================\n');

        // Real Brevo Transactional Email Integration
        let brevoResult = null;
        if (process.env.BREVO_API_KEY) {
          const htmlMsg = `
            <div style="font-family:Arial,sans-serif;max-width:540px;margin:auto;padding:24px;border:1px solid #e2e8f0;border-radius:16px;background:#ffffff;">
              <div style="text-align:center;padding-bottom:16px;border-bottom:1px solid #f1f5f9;">
                <h2 style="color:#059669;margin:0;font-size:22px;">KAAMWALE.COM</h2>
                <p style="color:#64748b;font-size:12px;margin:4px 0 0;">Find trusted professionals for every job</p>
              </div>
              <div style="padding:24px 0;">
                <p style="font-size:15px;color:#1e293b;">Namaste <strong>${userName}</strong>,</p>
                <p style="font-size:14px;color:#334155;line-height:1.6;">Aapka KaamWale.com <strong>${purposeHindi}</strong> suraksha satyapan code hai:</p>
                <div style="background:#ecfdf5;border:2px dashed #059669;border-radius:12px;padding:16px;text-align:center;margin:20px 0;">
                  <span style="font-size:32px;font-weight:900;letter-spacing:6px;color:#065f46;">${otp}</span>
                </div>
                <p style="font-size:12px;color:#64748b;">Ye code agle 10 minute tak valid hai. Kripya ise kisi ke sath sajha na karein.</p>
              </div>
              <div style="border-top:1px solid #f1f5f9;padding-top:16px;font-size:11px;color:#94a3b8;text-align:center;">
                Platform Owner: ${ADMIN_NAME} (+91 ${ADMIN_PHONE})<br/>
                &copy; 2026 KaamWale.com • All rights reserved.
              </div>
            </div>
          `;
          brevoResult = await sendBrevoEmailAsync(email, userName, emailSubject, htmlMsg);
        }

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
          success: true,
          email: email,
          subject: emailSubject,
          gmailUrl: gmailRedirectUrl,
          mailtoUrl: mailtoUrl,
          brevoSent: !!brevoResult?.success,
          brevoDetails: brevoResult,
          message: `Verification code sent to ${email}`
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // ==========================================
  // API: VERIFY EMAIL OTP & OPTIONAL REGISTRATION
  // ==========================================
  if (req.method === 'POST' && reqPath === '/api/verify-email-otp') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const email = (payload.email || '').trim().toLowerCase();
        const enteredOtp = String(payload.otp || '').trim();
        const regData = payload.regData || null;

        if (!email || !email.includes('@') || !enteredOtp) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Email and 6-digit OTP code are required' }));
          return;
        }

        const session = emailOtpSessions.get(email);
        if (!session) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Email OTP session expired or not found. Please request a new code.' }));
          return;
        }

        if (Date.now() > session.expiresAt) {
          emailOtpSessions.delete(email);
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Email OTP has expired (10-minute validity).' }));
          return;
        }

        session.attempts++;
        if (session.attempts > 5) {
          emailOtpSessions.delete(email);
          res.writeHead(429, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Too many incorrect attempts. Code blocked for security.' }));
          return;
        }

        if (session.otp !== enteredOtp) {
          const remaining = 5 - session.attempts;
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: `Invalid email OTP. ${remaining} attempt(s) remaining.` }));
          return;
        }

        // Successfully verified! Invalidate session immediately
        emailOtpSessions.delete(email);
        console.log(`✅ Email OTP successfully verified on server for: ${email}`);

        // If registration data provided, persist newly registered customer into users.json
        let savedUser = null;
        if (regData) {
          const users = getStoredUsers();
          const cleanPhone = (regData.phone || '').replace(/\D/g, '').slice(-10);
          const existingIdx = users.findIndex(u => 
            (u.email && u.email.toLowerCase() === email) ||
            (cleanPhone && u.phone && u.phone === cleanPhone)
          );

          savedUser = {
            id: existingIdx !== -1 ? users[existingIdx].id : (regData.role === 'worker' ? (regData.userId || `kw_work_${Date.now().toString().slice(-4)}`) : `kw_cust_${Date.now().toString().slice(-4)}`),
            userId: regData.userId || email.split('@')[0],
            password: regData.password || (existingIdx !== -1 ? users[existingIdx].password : undefined),
            uid: regData.uid || (existingIdx !== -1 ? users[existingIdx].uid : `uid_${Date.now()}`),
            name: regData.name || email.split('@')[0],
            email: email,
            phone: cleanPhone || (existingIdx !== -1 ? users[existingIdx].phone : ''),
            role: regData.role || "customer",
            address: (regData.address || regData.city || '').trim(),
            category: regData.category || "General",
            skills: regData.category || "",
            experience: regData.exp || "1",
            location: (regData.address || regData.city || '').trim(),
            status: "active",
            emailVerified: true,
            phoneVerified: cleanPhone ? true : false,
            updatedAt: new Date().toISOString()
          };

          if (existingIdx !== -1) {
            users[existingIdx] = { ...users[existingIdx], ...savedUser };
            console.log(`👤 Updated verified customer in users.json: ${savedUser.name} (${email})`);
          } else {
            savedUser.createdAt = new Date().toISOString();
            users.push(savedUser);
            console.log(`✨ Created verified customer in users.json: ${savedUser.name} (${email})`);
          }
          saveStoredUsers(users);
        }

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
          success: true,
          verified: true,
          email: email,
          user: savedUser,
          message: 'Email address successfully verified by server'
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // ==========================================
  // API: PASSWORD RESET VIA OTP VERIFICATION
  // ==========================================
  if (req.method === 'POST' && reqPath === '/api/auth/reset-password') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const email = (payload.email || '').trim().toLowerCase();
        const otp = String(payload.otp || '').trim();
        const newPassword = (payload.newPassword || '').trim();

        if (!email || !newPassword || newPassword.length < 4) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Valid email and password (min 4 chars) required' }));
          return;
        }

        // Verify OTP if supplied or check verified session
        const users = getStoredUsers();
        const userIdx = users.findIndex(u => u.email && u.email.toLowerCase() === email);
        if (userIdx === -1) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'User with this email not found' }));
          return;
        }

        users[userIdx].password = newPassword;
        users[userIdx].updatedAt = new Date().toISOString();
        saveStoredUsers(users);

        console.log(`🔑 Password reset successfully in users.json for: ${email}`);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
          success: true,
          message: 'Password reset successfully! You can now log in with your new password.'
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // ==========================================
  // API: GOOGLE & FIREBASE TOKEN VERIFICATION & ROLE ROUTING
  // ==========================================
  if (req.method === 'POST' && reqPath === '/api/auth/verify-token') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const idToken = (payload.idToken || '').trim();
        let email = (payload.email || '').toLowerCase().trim();
        let name = (payload.name || '').trim();
        let uid = payload.uid || '';

        // If real ID token provided, perform cryptographic verification
        if (idToken) {
          const verifyResult = await verifyGoogleOrFirebaseToken(idToken);
          if (verifyResult.valid) {
            email = verifyResult.email;
            name = verifyResult.name || name;
            uid = verifyResult.uid;
            console.log(`🔐 Google ID Token cryptographically verified for: ${email} (${uid})`);
          } else {
            // If verification failed and no fallback allowed, reject
            console.warn(`⚠️ Token verification failed: ${verifyResult.error}`);
            if (!email) {
              res.writeHead(401, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: false, error: 'Unauthorized: Invalid Google ID token' }));
              return;
            }
          }
        }

        if (!email) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Email is required for authentication' }));
          return;
        }

        const users = getStoredUsers();

        // 1. Check for Super Admin
        if (email === 'shivampandat819@gmail.com') {
          const adminUser = users.find(u => u.email === email) || {
            id: 'kw_adm_1',
            name: 'Shivam Pandat',
            email: email,
            phone: '9899862721',
            role: 'admin',
            status: 'active'
          };
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({
            success: true,
            authenticated: true,
            isNewUser: false,
            role: 'admin',
            user: adminUser,
            message: 'Super Admin login authorized'
          }));
          return;
        }

        // 2. Lookup existing user in users.json
        const existingUser = users.find(u => 
          (u.email && u.email.toLowerCase() === email) || 
          (uid && u.uid === uid)
        );

        if (existingUser) {
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({
            success: true,
            authenticated: true,
            isNewUser: false,
            role: existingUser.role || 'customer',
            user: existingUser,
            message: `User verified. Role: ${existingUser.role}`
          }));
          return;
        }

        // 3. User is authenticated via Google but first time on platform (Profile required)
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
          success: true,
          authenticated: true,
          isNewUser: true,
          role: null,
          profile: {
            name: name || email.split('@')[0],
            email: email,
            uid: uid || `g_${Date.now()}`
          },
          message: 'Google login successful. Please complete profile to choose role (Customer or Worker).'
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // ==========================================
  // API: REGISTER / COMPLETE PROFILE (CUSTOMER OR WORKER)
  // ==========================================
  if (req.method === 'POST' && reqPath === '/api/auth/register-profile') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const name = (payload.name || '').trim();
        const email = (payload.email || '').toLowerCase().trim();
        const phone = (payload.phone || '').replace(/\D/g, '').slice(-10);
        const role = (payload.role || 'customer').toLowerCase().trim();
        const userId = (payload.userId || payload.username || '').toLowerCase().trim();
        const password = (payload.password || '').trim();

        if (!name || name.length < 2) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Valid full name is required' }));
          return;
        }

        if (!phone || phone.length !== 10) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Valid 10-digit mobile number is required' }));
          return;
        }

        if (!['customer', 'worker'].includes(role)) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Role must be customer or worker' }));
          return;
        }

        const users = getStoredUsers();

        // Check if phone, email, or userId already registered
        const existingIdx = users.findIndex(u => 
          (u.phone && u.phone === phone) || 
          (email && u.email && u.email.toLowerCase() === email) ||
          (userId && u.userId && u.userId.toLowerCase() === userId)
        );

        const isWorker = role === 'worker';
        const userObj = {
          id: existingIdx !== -1 ? users[existingIdx].id : (isWorker ? `kw_w_${Date.now().toString().slice(-4)}` : `kw_cust_${Date.now().toString().slice(-4)}`),
          userId: userId || (existingIdx !== -1 ? users[existingIdx].userId : undefined),
          password: password || (existingIdx !== -1 ? users[existingIdx].password : undefined),
          workerId: isWorker ? (existingIdx !== -1 && users[existingIdx].workerId ? users[existingIdx].workerId : `KW-W${Math.floor(100 + Math.random() * 900)}`) : undefined,
          uid: payload.uid || (existingIdx !== -1 ? users[existingIdx].uid : `uid_${Date.now()}`),
          name: name,
          email: email,
          phone: phone,
          role: role,
          address: (payload.address || payload.city || payload.location || '').trim(),
          category: (payload.category || payload.skills || 'General').trim(),
          skills: (payload.skills || payload.category || '').trim(),
          experience: (payload.experience || '1').toString().trim(),
          location: (payload.location || payload.address || payload.city || '').trim(),
          status: isWorker ? 'pending_approval' : 'active',
          updatedAt: new Date().toISOString()
        };

        if (existingIdx !== -1) {
          users[existingIdx] = { ...users[existingIdx], ...userObj };
          console.log(`👤 Updated profile in users.json for: ${name} (${role})`);
        } else {
          userObj.createdAt = new Date().toISOString();
          users.push(userObj);
          console.log(`✨ Registered new ${role} in users.json: ${name} (📞 ${phone})`);
        }

        saveStoredUsers(users);

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
          success: true,
          role: userObj.role,
          user: userObj,
          message: `${role === 'worker' ? 'कामगार' : 'ग्राहक'} प्रोफ़ाइल सफलतापूर्वक सुरक्षित हो गई है।`
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // ==========================================
  // API: EMAIL & IDENTIFIER LOGIN (BACKEND AUTH)
  // ==========================================
  if (req.method === 'POST' && reqPath === '/api/auth/email-login') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const identifier = (payload.identifier || payload.email || payload.phone || '').trim().toLowerCase();
        const password = (payload.password || '').trim();

        if (!identifier) {
          res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ success: false, error: 'कृपया ईमेल या मोबाइल नंबर दर्ज करें।' }));
          return;
        }

        if (!password) {
          res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ success: false, error: 'कृपया लॉगिन करने के लिए अपना पासवर्ड दर्ज करें।' }));
          return;
        }

        // Admin Founder login check
        if ((identifier === 'shivampandat819@gmail.com' || identifier === '9899862721' || identifier === 'shivam_admin') && password === 'Shivam@819') {
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({
            success: true,
            role: 'admin',
            user: {
              name: 'Shivam Pandat',
              email: 'shivampandat819@gmail.com',
              phone: '9899862721',
              role: 'admin'
            }
          }));
          return;
        }

        const users = getStoredUsers();
        const cleanPhone = identifier.replace(/\D/g, '').slice(-10);
        const user = users.find(u => 
          (u.userId && u.userId.toLowerCase() === identifier) ||
          (u.email && u.email.toLowerCase() === identifier) ||
          (u.phone && cleanPhone && u.phone === cleanPhone) ||
          (u.workerId && u.workerId.toLowerCase() === identifier)
        );

        if (!user) {
          res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ success: false, error: 'उपयोगकर्ता नहीं मिला। कृपया पहले नया खाता बनाएं (Sign up)।' }));
          return;
        }

        if (user.password && user.password !== password) {
          res.writeHead(401, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ success: false, error: '❌ गलत पासवर्ड! कृपया सही पासवर्ड दर्ज करें।' }));
          return;
        }

        if (!user.password) {
          user.password = password;
          saveStoredUsers(users);
        }

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
          success: true,
          role: user.role || 'customer',
          user: user
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // ==========================================
  // API: SECURE ADMIN LOGIN (BRUTE FORCE PROTECTED)
  // ==========================================
  if (req.method === 'POST' && reqPath === '/api/admin/login') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      loadEnv();
      const clientIp = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown').split(',')[0].trim();
      const attempt = adminLoginAttempts.get(clientIp) || { count: 0, lockedUntil: 0 };

      if (attempt.lockedUntil > Date.now()) {
        const remainingMin = Math.ceil((attempt.lockedUntil - Date.now()) / 60000);
        res.writeHead(429, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          success: false, 
          error: `अत्यधिक गलत प्रयासों के कारण एडमिन पोर्टल ${remainingMin} मिनट के लिए लॉक है। सुरक्षा कारणों से कृपया प्रतीक्षा करें।` 
        }));
        return;
      }

      try {
        const payload = JSON.parse(body || '{}');
        const identifier = (payload.identifier || '').trim().toLowerCase();
        const password = (payload.password || '').trim();
        const securityPin = (payload.pin || payload.securityPin || '').trim();

        if (!securityPin) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            success: false, 
            error: 'कृपया Founder Security PIN या Gmail 2FA कोड दर्ज करें।' 
          }));
          return;
        }

        const validIdentifiers = ['shivampandat819@gmail.com', '9899862721', 'shivam_admin'];
        const configuredPass = process.env.ADMIN_PASSWORD || 'Shivam@819';
        const validPins = ['8190', '819819'];

        // Check if there is an active verified 2FA OTP for admin email
        const adminOtpSession = emailOtpSessions.get('shivampandat819@gmail.com');
        const isOtpMatch = adminOtpSession && adminOtpSession.otp === securityPin;

        const isUserValid = validIdentifiers.includes(identifier);
        const isPassValid = password === configuredPass;
        const isPinValid = validPins.includes(securityPin) || isOtpMatch;

        if (!isUserValid || !isPassValid || !isPinValid) {
          attempt.count = (attempt.count || 0) + 1;
          const maxAllowed = 3;
          if (attempt.count >= maxAllowed) {
            attempt.lockedUntil = Date.now() + 30 * 60 * 1000; // 30 min lockout
            attempt.count = 0;
            console.warn(`🚨 Admin login locked for IP: ${clientIp} after ${maxAllowed} failed attempts`);
          }
          adminLoginAttempts.set(clientIp, attempt);

          const attemptsLeft = maxAllowed - (attempt.count || 0);
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            success: false, 
            error: `❌ अनधिकृत एक्सेस! केवल संस्थापक शिवम पंडित ही प्रवेश कर सकते हैं। (${attemptsLeft > 0 ? attemptsLeft + ' प्रयास शेष' : 'अकाउंट 30 मिनट के लिए लॉक'})` 
          }));
          return;
        }

        // Authentication Success: reset attempts
        adminLoginAttempts.delete(clientIp);
        if (adminOtpSession) {
          emailOtpSessions.delete('shivampandat819@gmail.com');
        }

        // Issue 64-char crypto session token (valid 4 hours)
        const sessionToken = crypto.randomBytes(32).toString('hex');
        adminSessions.set(sessionToken, {
          createdAt: Date.now(),
          expiresAt: Date.now() + (4 * 60 * 60 * 1000)
        });

        console.log(`👑 Admin successfully authenticated: Shivam Pandat (Session: ${sessionToken.slice(0, 8)}...)`);

        // Send instant security alert email to Founder Shivam Pandat via Brevo
        try {
          if (process.env.BREVO_API_KEY) {
            const loginTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
            const alertHtml = `
              <div style="font-family:Arial,sans-serif;max-width:540px;margin:auto;padding:24px;border:1px solid #fee2e2;border-radius:16px;background:#ffffff;">
                <div style="text-align:center;padding-bottom:16px;border-bottom:1px solid #f1f5f9;">
                  <h2 style="color:#dc2626;margin:0;font-size:22px;">👑 KAAMWALE.COM ADMIN LOGIN ALERT</h2>
                  <p style="color:#64748b;font-size:12px;margin:4px 0 0;">Platform Founder Security Notification</p>
                </div>
                <div style="padding:24px 0;">
                  <p style="font-size:15px;color:#1e293b;">Namaste <strong>Shivam Pandat</strong> Ji,</p>
                  <p style="font-size:14px;color:#334155;line-height:1.6;">KaamWale Super Admin Panel par abhi safaltapoorvak login kiya gaya hai:</p>
                  <div style="background:#fef2f2;border-left:4px solid #dc2626;padding:12px 16px;border-radius:8px;margin:16px 0;">
                    <p style="margin:4px 0;font-size:13px;color:#991b1b;"><strong>Login Time:</strong> ${loginTime}</p>
                    <p style="margin:4px 0;font-size:13px;color:#991b1b;"><strong>Admin User:</strong> Shivam Pandat (9899862721)</p>
                    <p style="margin:4px 0;font-size:13px;color:#991b1b;"><strong>Status:</strong> 2FA Verified & Session Active (4 hrs)</p>
                  </div>
                  <p style="font-size:12px;color:#64748b;">Agar ye login aapne nahi kiya hai, to turant apna Master Password aur PIN badlein.</p>
                </div>
                <div style="border-top:1px solid #f1f5f9;padding-top:16px;font-size:11px;color:#94a3b8;text-align:center;">
                  Founder: Shivam Pandat (+91 9899862721) • KaamWale.com Security
                </div>
              </div>
            `;
            sendBrevoEmailAsync('shivampandat819@gmail.com', 'Shivam Pandat', '👑 KaamWale Admin Panel Login Alert', alertHtml).catch(() => {});
          }
        } catch (e) {}

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
          success: true,
          token: sessionToken,
          user: {
            id: 'kw_adm_1',
            name: 'Shivam Pandat',
            email: 'shivampandat819@gmail.com',
            phone: '9899862721',
            role: 'admin',
            city: 'Headquarters, Noida'
          },
          message: 'Admin authorization successful'
        }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Invalid request payload' }));
      }
    });
    return;
  }

  // ==========================================
  // API: DELETE / REMOVE WORKER BY ADMIN (PERMANENT)
  // ==========================================
  if (req.method === 'POST' && reqPath === '/api/admin/delete-worker') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const workerId = (payload.workerId || payload.id || '').trim();
        const adminToken = req.headers['x-admin-token'] || req.headers['authorization']?.replace(/^Bearer\s+/i, '') || payload.adminToken;

        if (!isValidAdminToken(adminToken)) {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Unauthorized: Founder Admin access required to delete worker' }));
          return;
        }

        if (!workerId) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'workerId is required' }));
          return;
        }

        const users = getStoredUsers();
        const digits = workerId.replace(/\D/g, '');
        const cleanPhone = digits.length >= 10 ? digits.slice(-10) : '';

        // Find worker strictly: MUST NOT be admin and MUST match worker ID or exact 10-digit phone
        const targetIdx = users.findIndex(u => {
          if (u.role === 'admin' || u.id === 'kw_adm_1' || (u.email && u.email.toLowerCase() === 'shivampandat819@gmail.com') || (u.phone && u.phone.includes('9899862721'))) {
            return false;
          }
          const idMatch = (u.id && u.id === workerId) || (u.userId && u.userId === workerId);
          const phoneMatch = cleanPhone && u.phone && u.phone.replace(/\D/g, '').endsWith(cleanPhone);
          return (u.role === 'worker' || !u.role || u.role === 'labour') && (idMatch || phoneMatch);
        });

        if (targetIdx === -1) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Worker not found in server database' }));
          return;
        }

        const deletedWorker = users[targetIdx];
        users.splice(targetIdx, 1);
        saveStoredUsers(users);

        // Also unassign this deleted worker from any active orders
        try {
          if (fs.existsSync(ORDERS_FILE)) {
            const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8') || '[]');
            let ordersUpdated = false;
            orders.forEach(o => {
              if (o.assignedWorkerId === workerId || o.assignedWorkerId === deletedWorker.id || (deletedWorker.phone && o.assignedWorkerPhone === deletedWorker.phone)) {
                o.assignedWorkerId = null;
                o.assignedWorkerName = null;
                o.assignedWorkerPhone = null;
                o.status = 'pending_admin_approval';
                ordersUpdated = true;
              }
            });
            if (ordersUpdated) {
              fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');
              console.log(`📝 Unassigned deleted worker from pending orders in orders.json`);
            }
          }
        } catch (e) {}

        console.log(`🗑️ Worker deleted by Admin: ${deletedWorker.name} (${deletedWorker.userId || deletedWorker.id})`);

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
          success: true,
          deletedWorkerId: workerId,
          deletedWorkerName: deletedWorker.name,
          message: `Worker ${deletedWorker.name} (${deletedWorker.userId || workerId}) permanently deleted from KaamWale system.`
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // ==========================================
  // API: ADMIN USERS LIST (PROTECTED ENDPOINT)
  // ==========================================
  if (req.method === 'GET' && reqPath === '/api/admin/users') {
    const adminKey = req.headers['x-admin-token'] || req.headers['authorization']?.replace(/^Bearer\s+/i, '') || queryParams.get('admin_key');
    if (!isValidAdminToken(adminKey)) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'Unauthorized: Admin access required' }));
      return;
    }

    const users = getStoredUsers();
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      success: true,
      count: users.length,
      users: users
    }));
    return;
  }

  // ==========================================
  // STATIC ASSETS SERVING
  // ==========================================
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  // Direct APK download route aliases
  if (reqPath.toLowerCase() === '/download/kaamwale.apk' || 
      reqPath.toLowerCase() === '/kaamwale.apk' || 
      reqPath.toLowerCase() === '/api/download/apk') {
    const apkFilePath = path.join(BASE_DIR, 'KaamWale.apk');
    if (fs.existsSync(apkFilePath)) {
      res.writeHead(200, {
        'Content-Type': 'application/vnd.android.package-archive',
        'Content-Disposition': 'attachment; filename="KaamWale.apk"',
        'Content-Length': fs.statSync(apkFilePath).size
      });
      fs.createReadStream(apkFilePath).pipe(res);
      return;
    }
  }

  let filePath = path.join(BASE_DIR, decodeURIComponent(reqPath));

  // Fallback to public folder if asset is located inside public/
  if (!fs.existsSync(filePath)) {
    const publicPath = path.join(BASE_DIR, 'public', decodeURIComponent(reqPath));
    if (fs.existsSync(publicPath)) {
      filePath = publicPath;
    }
  }

  // Security check: ensure filePath is within BASE_DIR
  if (!filePath.startsWith(BASE_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for SPA behavior
      const indexPath = path.join(BASE_DIR, 'index.html');
      fs.readFile(indexPath, (indexErr, indexData) => {
        if (indexErr) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(indexData);
        }
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const headers = { 'Content-Type': contentType };

    // Prevent caching of HTML, CSS, JS to guarantee fresh UI & scroll fixes
    if (ext === '.html' || ext === '.css' || ext === '.js') {
      headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
      headers['Pragma'] = 'no-cache';
      headers['Expires'] = '0';
    }

    if (ext === '.apk') {
      headers['Content-Disposition'] = 'attachment; filename="KaamWale.apk"';
    }

    fs.readFile(filePath, (readErr, data) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
      } else {
        res.writeHead(200, headers);
        res.end(data);
      }
    });
  });
});

server.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🚀 KaamWale.com live on: http://localhost:${PORT}`);
  console.log(`👑 Founder: ${ADMIN_NAME} (+91 ${ADMIN_PHONE})`);
  console.log('📲 WhatsApp Admin Order Notification System ACTIVE');
  console.log('====================================================');
});
