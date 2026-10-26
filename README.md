# 🛠️ KaamWale.com - On-Demand Local Services & Verified Worker Dispatch Platform

> **"In one frame to provide easily. One click and get location to provide these facilities. Easy registration, transparent pricing, verified partners, zero hidden charges."**  
> — **Shivam Pandat (Founder & Platform Owner)**

---

## 🌟 Overview
**KaamWale.com** is an enterprise-grade hyperlocal service marketplace built with Node.js, Express, TailwindCSS, and Leaflet.js. It seamlessly connects households and businesses with 100% verified local service professionals (Electricians, Plumbers, Carpenters, Painters, Housekeepers, Cleaners, and more).

---

## 🚀 Key Features

### 1. 🔐 Multi-Factor Authentication
- **Google One-Tap / GIS Sign-In**: Direct OAuth identity verification.
- **Brevo OTP Delivery**: 6-digit transaction PIN via transactional email and SMS API.

### 2. 🛡️ 100% Police & Identity Verified Partners
- Strict onboarding criteria with zero dummy accounts.
- Complete admin approval workflow with direct WhatsApp credential delivery.

### 3. 📍 Blinkit & Rapido Style GPS Live Location
- Automatic geolocation fetching on visit.
- Real-time Leaflet map tracker showing technician movement, polyline routes, and live ETA calculation.

### 4. 🔑 Doorstep 4-Digit Security & Job Completion OTP
- Every order is provisioned with a secure 4-digit PIN.
- Upon job completion, the service worker must verify the customer's completion code before marking the service done.

### 5. 💳 Dual Payment Gateway (Cash on Delivery & Instant UPI)
- **💵 Cash on Delivery (COD)**: On-site cash settlement.
- **📱 Instant Online UPI & QR Code**: Integrated Paytm UPI QR code with direct intent deep-links for Paytm, PhonePe, and Google Pay.
  - **Account Holder**: Shivam Sharma
  - **UPI ID**: `9899862721@pthdfc`
  - **Account Number**: `2948684915` (IFSC: `KKBK0005304`)

### 6. 👑 Super Admin Dashboard
- Live real-time dispatch dashboard for Shivam Pandat.
- Instant approval, technician assignment, and payment reconciliation.

---

## 🛠️ Tech Stack
- **Backend**: Node.js, Express HTTP server
- **Frontend**: Vanilla JS (ES6+), HTML5, TailwindCSS, FontAwesome
- **Maps**: Leaflet.js & OpenStreetMap
- **Database**: Local JSON storage (`users.json`, `orders.json`)
- **Notifications**: Brevo API & WhatsApp Click-to-Chat

---

## 🚀 24×7 Free Cloud Deployment (Render.com)

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Production release of KaamWale.com"
   git branch -M main
   git remote add origin https://github.com/<your-username>/kaamwale.git
   git push -u origin main
   ```

2. **Deploy on Render.com**:
   - Create a free Web Service connected to your GitHub repo.
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Environment Variables**: Add your `BREVO_API_KEY` in Render dashboard.

---

## 🔍 Google Search Console & SEO
- Contains pre-configured `robots.txt` and `sitemap.xml`.
- Submit `sitemap.xml` in [Google Search Console](https://search.google.com/search-console) for indexing within 24-48 hours.

---

## 📞 Support & Inquiries
- **Founder & Owner**: Shivam Pandat
- **Mobile / WhatsApp**: +91 9899862721
- **Email**: shivampandat819@gmail.com
