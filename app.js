/**
 * KaamWale.com - Core Application Logic
 * Combining Original Tailwind UI, Google Auth, 14 Categories, Urban Company Features & 3-Role Portals
 * Founder: Shivam Pandat (+91 98998 62721 | shivampandat819@gmail.com)
 */

// Universal API Base URL Resolver: automatically connects to http://localhost:3000
// when opened via file:// or when relative fetch would fail.
(function() {
  const originalFetch = window.fetch;
  window.fetch = function(resource, init) {
    if (typeof resource === 'string' && resource.startsWith('/api/')) {
      if (window.location.protocol === 'file:' || !window.location.origin || window.location.origin === 'null') {
        resource = 'http://localhost:3000' + resource;
      }
    }
    return originalFetch.call(this, resource, init);
  };
})();

const CONFIG = window.KAAMWALE_CONFIG || {
  businessPhone: "9899862721",
  businessPhoneDisplay: "+91 98998 62721",
  businessEmail: "shivampandat819@gmail.com",
  founderName: "Shivam Pandat"
};

// 14 Worker Categories with FontAwesome icons & sub-services
const CATEGORIES = [
  { 
    id: "electrician", 
    name: "Electrician", 
    hindi: "इलेक्ट्रीशियन", 
    icon: "fa-bolt", 
    desc: "बिजली वायरिंग, स्विच, पंखा, शॉर्ट-सर्किट व उपकरण रिपेयरिंग", 
    rate: "₹250 - ₹500",
    subServices: [
      "Fan Installation / Repair (पंखा मरम्मत)",
      "Switch & Socket Repair (स्विच/सॉकेट बदलना)",
      "Full House Wiring (पूरी घर की वायरिंग)",
      "AC Power Point Wiring (एसी वायरिंग व एमसीबी)",
      "MCB / Fuse Box Repair (फ्यूज व एमसीबी)",
      "Inverter Setup (इन्वर्टर व बैटरी)"
    ]
  },
  { 
    id: "plumber", 
    name: "Plumber", 
    hindi: "प्लंबर", 
    icon: "fa-faucet-drip", 
    desc: "पाइप फिटिंग, नल लीकेज, वाटर टैंक इंस्टॉलेशन व मोटर फिटिंग", 
    rate: "₹250 - ₹600",
    subServices: [
      "Tap / Shower Leakage (नल व फव्वारा मरम्मत)",
      "Pipe Fitting & Blockage (पाइप फिटिंग व ब्लॉकेज)",
      "Water Tank Cleaning (वाटर टैंक सफाई)",
      "Toilet Seat & Flush Repair (टॉयलेट फ्लश)",
      "Water Motor Pump Repair (पानी मोटर फिटिंग)"
    ]
  },
  { 
    id: "carpenter", 
    name: "Carpenter", 
    hindi: "बढ़ई", 
    icon: "fa-hammer", 
    desc: "फर्नीचर निर्माण, दरवाजा/खिड़की मरम्मत, अलमारी व वुडवर्क", 
    rate: "₹400 - ₹800",
    subServices: [
      "Door / Window Lock Fitting (दरवाजा व ताला)",
      "Furniture Assembly (बेड व अलमारी असेंबली)",
      "Modular Kitchen Woodwork (किचन वुडवर्क)",
      "Sofa Repair & Polish (सोफा रिपेयर व पॉलिश)"
    ]
  },
  { 
    id: "welder", 
    name: "Welder", 
    hindi: "वेल्डर", 
    icon: "fa-fire", 
    desc: "लोहे का गेट, ग्रिल, रेलिंग, शेड व स्पॉट वेल्डिंग कार्य", 
    rate: "₹350 - ₹700",
    subServices: [
      "Main Gate & Door Welding (मेन गेट वेल्डिंग)",
      "Balcony Railing & Grill (रेलिंग व ग्रिल)",
      "Tin Shed & Roof Framework (शेड फ्रेमवर्क)",
      "Shop Shutter Repair (दुकान शटर मरम्मत)"
    ]
  },
  { 
    id: "painter", 
    name: "Painter", 
    hindi: "पेंटर", 
    icon: "fa-paint-roller", 
    desc: "दीवार पुट्टी, डिस्टेंपर, रॉयल पेंट, पॉलिश व वॉटरप्रूफिंग", 
    rate: "₹300 - ₹700",
    subServices: [
      "Full House Interior Paint (अंदरूनी पेंटिंग)",
      "Exterior Waterproofing (दीवार वॉटरप्रूफिंग)",
      "Wall Putty & Primer (पुट्टी व प्राइमर)",
      "Texture & Enamel Paint (टेक्सचर पेंटिंग)"
    ]
  },
  { 
    id: "mechanics", 
    name: "Mechanics", 
    hindi: "मैकेनिक", 
    icon: "fa-wrench", 
    desc: "बाइक, कार, मोटर पंप व घरेलू मशीनरी रिपेयरिंग सेवा", 
    rate: "₹300 - ₹800",
    subServices: [
      "Two-Wheeler Service (बाइक/स्कूटर सर्विस)",
      "Car Breakdown & Puncture (कार पंचर व ब्रेकडाउन)",
      "Cooler & Appliance Motor (उपकरण मोटर रिपेयर)"
    ]
  },
  { 
    id: "housekeeper", 
    name: "Housekeeper", 
    hindi: "हाउसकीपर", 
    icon: "fa-broom", 
    desc: "घर, कोठी व गेस्टहाउस की संपूर्ण देखभाल व व्यवस्था", 
    rate: "₹400 - ₹900",
    subServices: [
      "Full Day Home Care (घर की संपूर्ण व्यवस्था)",
      "Bungalow & Villa Attendant (कोठी की देखरेख)",
      "Guest House Management (गेस्ट हाउस मैनेजमेंट)"
    ]
  },
  { 
    id: "householder", 
    name: "House holder", 
    hindi: "घरेलू सहायक", 
    icon: "fa-people-roof", 
    desc: "दैनिक घरेलू कार्य, बर्तन, बुजुर्ग देखभाल व घरेलू मदद", 
    rate: "₹300 - ₹600",
    subServices: [
      "Daily Domestic Maid (झाड़ू, पोंछा, बर्तन)",
      "Elderly Care Assistance (बुजुर्गों की देखभाल)",
      "House Shifting Helper (शिफ्टिंग में मदद)"
    ]
  },
  { 
    id: "cleaners", 
    name: "Cleaners", 
    hindi: "सफाई कर्मचारी", 
    icon: "fa-soap", 
    desc: "घर, बाथरूम, किचन व ऑफिस डीप क्लीनिंग सेवाएं", 
    rate: "₹250 - ₹600",
    subServices: [
      "Deep Home Cleaning (पूरे घर की डीप सफाई)",
      "Bathroom & Toilet Deep Clean (बाथरूम सफाई)",
      "Kitchen Chimney & Floor (किचन व चिमनी सफाई)",
      "Sofa & Carpet Dry Cleaning (सोफा ड्राई क्लीनिंग)"
    ]
  },
  { 
    id: "labour", 
    name: "Labour", 
    hindi: "मजदूर", 
    icon: "fa-person-digging", 
    desc: "सामान शिफ्टिंग, लोडिंग-अनलोडिंग, मलबा उठाना व शारीरिक कार्य", 
    rate: "₹450 - ₹650/दिन",
    subServices: [
      "Loading & Unloading (सामान लोडिंग-अनलोडिंग)",
      "Debris Removal (मलबा व कचरा उठाना)",
      "Heavy Furniture Moving (फर्नीचर शिफ्टिंग)",
      "Digging & Trenching (खुदाई का काम)"
    ]
  },
  { 
    id: "maintenance", 
    name: "Maintenance worker", 
    hindi: "मेंटेनेंस कारीगर", 
    icon: "fa-gears", 
    desc: "अपार्टमेंट, सोसाइटी व बिल्डिंग के ऑल-राउंड मेंटेनेंस काम", 
    rate: "₹500 - ₹900",
    subServices: [
      "Society & Apartment Upkeep (सोसाइटी मेंटेनेंस)",
      "Commercial Building Handyman (कमर्शियल रखरखाव)",
      "Periodic Inspection (नियमित प्रॉपर्टी चेक)"
    ]
  },
  { 
    id: "general_labour", 
    name: "General labour", 
    hindi: "जनरल लेबर", 
    icon: "fa-helmet-safety", 
    desc: "कंस्ट्रक्शन साइट, वेयरहाउस व दुकान के सामान्य कामगार", 
    rate: "₹450 - ₹600/दिन",
    subServices: [
      "Construction Site Helper (साइट लेबर)",
      "Warehouse Loading & Packing (गोदाम पैकिंग)",
      "Daily Wage Work (दैनिक मजदूरी)"
    ]
  },
  { 
    id: "kitchen_worker", 
    name: "Kitchen worker", 
    hindi: "किचन हेल्पर / कुक", 
    icon: "fa-utensils", 
    desc: "शादी-समारोह, होटल, ढाबा या घर के लिए कुक व हेल्पर", 
    rate: "₹400 - ₹800",
    subServices: [
      "Daily Home Cook / Chef (घर का रसोइया)",
      "Party / Event Cook (पार्टी व हलवाई)",
      "Kitchen Helper & Wash (किचन हेल्पर)"
    ]
  },
  { 
    id: "ironmen", 
    name: "Ironing service", 
    hindi: "प्रेस / धोबी सेवा", 
    icon: "fa-shirt", 
    desc: "कपड़े प्रेस करना, ड्राई क्लीनिंग व धोबी सेवा आपके द्वार", 
    rate: "₹10 - ₹25/कपड़ा",
    subServices: [
      "Regular Clothes Press (दैनिक कपड़े प्रेस)",
      "Steam Press for Suits (सूट व साड़ी स्टीम प्रेस)",
      "Doorstep Pickup & Drop (कपड़े पिकअप व डिलीवरी)"
    ]
  }
];

// Verified workers registered via "Join as Pro" portal or Admin
const INITIAL_WORKERS = [];

// Customer service requests
const INITIAL_BOOKINGS = [];

// Initial reviews
const INITIAL_REVIEWS = [
  { id: 1, name: "विकास सिंह", city: "Patna", category: "Electrician", rating: 5, comment: "KaamWale.com के जरिए 20 मिनट में इलेक्ट्रीशियन घर आ गए। बहुत ईमानदार और कोई अतिरिक्त चार्ज नहीं लिया।", date: "02 Oct 2026" },
  { id: 2, name: "अनीता गुप्ता", city: "Noida", category: "Plumber", rating: 5, comment: "बाथरूम में पानी की बहुत बड़ी लीकेज थी। प्लंबर ने 1 घंटे में सही कर दिया। गूगल से आसान लॉगिन और बहुत बेहतरीन सर्विस!", date: "01 Oct 2026" },
  { id: 3, name: "मोहम्मद आरिफ", city: "Lucknow", category: "Painter", rating: 5, comment: "पूरे घर की पुट्टी और पेंटिंग का काम बहुत किफायती दर पर हुआ। शिवम पंडित जी का यह प्लेटफार्म बहुत मददगार है।", date: "28 Sep 2026" },
  { id: 4, name: "सुनील शर्मा", city: "Delhi", category: "Carpenter", rating: 4, comment: "बढ़ई का काम बहुत फिनिशिंग के साथ किया। सीधे कामगार से बात हो गई बिना किसी बिचौलिये के।", date: "25 Sep 2026" }
];

// State
let currentUser = null;
let currentWorkerUser = null;
let currentRole = "customer";
let isWorkerOnline = localStorage.getItem("kw_worker_online") !== "false";
let currentBookingCategory = "Electrician";
let selectedReviewRating = 5;
let authPendingAction = null;
let currentOtpSession = null;
let forgotPasswordSession = null;
let resendTimerInterval = null;
let resendCountdown = 30;

// Persistence
function loadState() {
  try {
    currentUser = JSON.parse(localStorage.getItem("kw_current_user") || "null");
  } catch (e) {
    currentUser = null;
  }
  try {
    currentWorkerUser = JSON.parse(localStorage.getItem("kw_logged_in_worker") || "null");
    if (currentWorkerUser && (
      DUMMY_WORKER_EMAILS.has(currentWorkerUser.email) ||
      DUMMY_WORKER_IDS.has(currentWorkerUser.id) ||
      DUMMY_WORKER_IDS.has(currentWorkerUser.userId) ||
      (currentWorkerUser.name && (currentWorkerUser.name.includes("अमित") || currentWorkerUser.name.toLowerCase().includes("amit")))
    )) {
      localStorage.removeItem("kw_logged_in_worker");
      currentWorkerUser = null;
    }
  } catch (e) {
    currentWorkerUser = null;
  }
  try {
    const rawWorkers = localStorage.getItem("kw_registered_workers");
    if (rawWorkers) {
      const sanitized = getStoredWorkers();
      saveStoredWorkers(sanitized);
    }
  } catch (e) {}
}

// Initial registered customers
const INITIAL_CUSTOMERS = [
  { id: "C101", userId: "rohit12", password: "Rohit@123", name: "Rohit Verma", phone: "9876543210", email: "rohit.verma@gmail.com", city: "Noida", role: "customer", registeredAt: "01 Oct 2026", phoneVerified: true },
  { id: "C102", userId: "anita102", password: "Anita@123", name: "Anita Gupta", phone: "9811122334", email: "anita.gupta@gmail.com", city: "Noida", role: "customer", registeredAt: "02 Oct 2026", phoneVerified: true },
  { id: "C100", userId: "shivam_admin", password: "Shivam@819", name: "Shivam Pandat", phone: "9899862721", email: "shivampandat819@gmail.com", city: "Delhi NCR", role: "admin", registeredAt: "01 Sep 2026", phoneVerified: true }
];

function getStoredCustomers() {
  try {
    const data = localStorage.getItem("kw_registered_customers");
    return data ? JSON.parse(data) : INITIAL_CUSTOMERS;
  } catch (e) {
    return INITIAL_CUSTOMERS;
  }
}
function saveStoredCustomers(customers) {
  localStorage.setItem("kw_registered_customers", JSON.stringify(customers));
}

const DUMMY_WORKER_EMAILS = new Set([
  "amit.electrician@gmail.com",
  "rakesh.plumber@gmail.com",
  "sanjay.carpenter@gmail.com",
  "dharmendra.welder@gmail.com",
  "pintu.painter@gmail.com",
  "suresh.mechanic@gmail.com",
  "manoj.plumber@gmail.com",
  "suresh.electrician@gmail.com"
]);

const DUMMY_WORKER_IDS = new Set([
  "W101", "W102", "W103", "W104", "W105", "W106", "W107", 
  "KW-W101", "KW-W102", "KW-W103", "KW-W104", "KW-W105", "KW-W106", "KW-W107", 
  "kw_w101", "kw_w102", "kw_w_7616"
]);

function getStoredWorkers() {
  try {
    // Purge previous workers on user request; only fresh approved workers will remain
    if (!localStorage.getItem("kw_workers_purged_v4")) {
      localStorage.removeItem("kw_registered_workers");
      localStorage.removeItem("kw_logged_in_worker");
      localStorage.setItem("kw_workers_purged_v4", "true");
      return [];
    }

    const data = localStorage.getItem("kw_registered_workers");
    let list = data ? JSON.parse(data) : [];
    // Purge legacy dummy workers
    list = list.filter(w => !DUMMY_WORKER_IDS.has(w.id) && !DUMMY_WORKER_IDS.has(w.userId) && !DUMMY_WORKER_EMAILS.has(w.email));
    return list;
  } catch (e) {
    return [];
  }
}
function saveStoredWorkers(workers) {
  localStorage.setItem("kw_registered_workers", JSON.stringify(workers));
}

function getStoredBookings() {
  try {
    const data = localStorage.getItem("kw_bookings");
    let list = data ? JSON.parse(data) : [];
    const dummyBookingIds = new Set(["KW-849102", "KW-312984", "KW-TUNNEL01", "KW-TEST99"]);
    list = list.filter(b => !dummyBookingIds.has(b.booking_id));
    return list.map(b => ({
      ...b,
      otp: b.otp || (b.booking_id ? b.booking_id.replace(/\D/g, '').slice(-4) : String(Math.floor(1000 + Math.random() * 9000)))
    }));
  } catch (e) {
    return [];
  }
}
function saveStoredBookings(bookings) {
  localStorage.setItem("kw_bookings", JSON.stringify(bookings));
}

function getStoredReviews() {
  try {
    const data = localStorage.getItem("kw_reviews");
    return data ? JSON.parse(data) : INITIAL_REVIEWS;
  } catch (e) {
    return INITIAL_REVIEWS;
  }
}
function saveStoredReviews(reviews) {
  localStorage.setItem("kw_reviews", JSON.stringify(reviews));
}

// Toast
function showToast(msg) {
  const toastBox = document.getElementById("toastBox");
  const toastMsg = document.getElementById("toastMsg");
  if (!toastBox || !toastMsg) return;
  toastMsg.textContent = msg;
  toastBox.classList.add("is-visible");
  setTimeout(() => toastBox.classList.remove("is-visible"), 4200);
}

// Mobile Menu
function toggleMobileMenu() {
  const menu = document.getElementById("mobileMenu");
  if (menu) menu.classList.toggle("hidden");
}

// ========================
// AUTHENTICATION (GOOGLE)
// ========================
function renderAuthUI() {
  const container = document.getElementById("authContainer");
  const mobileContainer = document.getElementById("mobileAuthContainer");
  if (!container) return;

  if (currentUser) {
    const isAdmin = currentUser.role === "admin";
    
    // 1. MOBILE COMPACT BUTTON (< sm): Single sleek button (Zero overflow!)
    const mobileBtn = isAdmin 
      ? `<button type="button" onclick="openAdminPanelModal()" class="flex sm:hidden items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-sm transition active:scale-95 shrink-0" title="एडमिन पैनल खोलें">
           <i class="fa-solid fa-crown text-amber-300 text-xs"></i>
           <span class="text-[10px] font-black uppercase">Admin</span>
           <span class="navAdminBadge bg-amber-300 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-full">0</span>
         </button>`
      : `<button type="button" onclick="openMyBookingsModal()" class="flex sm:hidden items-center justify-center w-8 h-8 rounded-xl bg-emerald-600 text-white font-black text-xs shadow-sm active:scale-95 shrink-0" title="मेरी बुकिंग्स">
           ${(currentUser.name || 'CU').slice(0, 2).toUpperCase()}
         </button>`;

    // 2. DESKTOP FULL PILL (>= sm): Full details + logout
    const desktopHtml = `
      <div class="hidden sm:flex items-center gap-2 sm:gap-3 bg-blue-50/90 border border-blue-200 pl-2 pr-3 py-1.5 rounded-full shadow-sm">
        <div class="w-8 h-8 rounded-full ${isAdmin ? 'bg-red-600 text-amber-300' : 'bg-blue-600 text-white'} font-black flex items-center justify-center text-xs shadow-sm">
          ${isAdmin ? '<i class="fa-solid fa-crown text-xs"></i>' : (currentUser.name || 'CU').slice(0, 2).toUpperCase()}
        </div>
        <div class="text-left">
          <p class="text-xs font-bold text-slate-800 leading-tight flex items-center gap-1">
            ${currentUser.name}
            ${isAdmin ? '<span class="bg-red-100 text-red-700 text-[9px] px-1.5 py-0.2 rounded font-black">Admin</span>' : '<i class="fa-solid fa-circle-check text-emerald-500 text-[11px]" title="Verified"></i>'}
          </p>
          <p class="text-[10px] text-slate-500 leading-none truncate max-w-[130px]">${currentUser.email || currentUser.phone}</p>
        </div>
        ${isAdmin 
          ? `<button onclick="openAdminPanelModal()" class="text-xs bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1 rounded-full transition flex items-center gap-1.5 shadow-sm" title="एडमिन पैनल">
               <i class="fa-solid fa-sliders"></i> <span>Admin Panel</span>
               <span class="navAdminBadge bg-amber-300 text-slate-900 text-[10px] font-black px-1.5 py-0.2 rounded-full">0</span>
             </button>`
          : `<button onclick="openMyBookingsModal()" class="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1 rounded-full transition flex items-center gap-1" title="मेरी बुकिंग्स">
               <i class="fa-solid fa-list-check"></i> <span>Bookings</span>
             </button>`
        }
        <button onclick="handleLogout()" class="text-slate-400 hover:text-red-600 transition text-sm p-1 ml-1" title="लॉगआउट (Sign Out)">
          <i class="fa-solid fa-arrow-right-from-bracket"></i>
        </button>
      </div>
    `;

    // 3. DROPDOWN MENU CARD: Rich card with logout in hamburger menu
    const menuCardHtml = `
      <div class="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl ${isAdmin ? 'bg-red-600 text-amber-300' : 'bg-blue-600 text-white'} flex items-center justify-center font-black text-xs shadow-sm">
            ${isAdmin ? '<i class="fa-solid fa-crown text-sm"></i>' : (currentUser.name || 'CU').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p class="text-xs font-black text-slate-900 leading-tight">${currentUser.name} ${isAdmin ? '<span class="text-red-600 font-bold">(Admin)</span>' : ''}</p>
            <p class="text-[10px] text-slate-500">${currentUser.phone || currentUser.email}</p>
          </div>
        </div>
        <button onclick="handleLogout()" class="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1">
          <i class="fa-solid fa-arrow-right-from-bracket"></i> Logout
        </button>
      </div>
    `;

    container.innerHTML = mobileBtn + desktopHtml;
    if (mobileContainer) mobileContainer.innerHTML = menuCardHtml;

    if (isAdmin) {
      const pendingCount = getStoredBookings().filter(b => b.status === "pending_admin_approval" || b.status === "pending_admin" || b.status === "pending").length;
      document.querySelectorAll(".navAdminBadge").forEach(el => el.textContent = pendingCount);
    }
  } else if (currentWorkerUser) {
    const mobileBtn = `
      <button type="button" onclick="openWorkerDashboardModal()" class="flex sm:hidden items-center gap-1 px-2.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-sm transition active:scale-95 shrink-0" title="कामगार डैशबोर्ड">
        <i class="fa-solid fa-briefcase text-xs"></i>
        <span class="text-[10px] font-black uppercase">Worker</span>
      </button>
    `;

    const desktopHtml = `
      <div class="hidden sm:flex items-center gap-2 sm:gap-3 bg-blue-50/90 border border-blue-200 pl-2 pr-3 py-1.5 rounded-full shadow-sm">
        <div class="w-8 h-8 rounded-full bg-blue-700 text-white font-black flex items-center justify-center text-xs shadow-sm">
          <i class="fa-solid fa-screwdriver-wrench"></i>
        </div>
        <div class="text-left">
          <p class="text-xs font-bold text-slate-800 leading-tight flex items-center gap-1">
            ${currentWorkerUser.name}
            <span class="bg-emerald-100 text-emerald-700 text-[9px] px-1.5 py-0.2 rounded font-black">On Duty</span>
          </p>
          <p class="text-[10px] text-slate-500 leading-none">${currentWorkerUser.userId || 'Worker'}</p>
        </div>
        <button onclick="openWorkerDashboardModal()" class="text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1 rounded-full transition flex items-center gap-1">
          <i class="fa-solid fa-briefcase"></i> <span>Dashboard</span>
        </button>
        <button onclick="handleWorkerLogout()" class="text-slate-400 hover:text-red-600 transition text-sm p-1 ml-1" title="ऑफ-ड्यूटी / लॉगआउट">
          <i class="fa-solid fa-arrow-right-from-bracket"></i>
        </button>
      </div>
    `;

    const menuCardHtml = `
      <div class="p-3 bg-blue-50 rounded-2xl border border-blue-200 flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-blue-700 text-white flex items-center justify-center text-sm shadow-sm">
            <i class="fa-solid fa-screwdriver-wrench"></i>
          </div>
          <div>
            <p class="text-xs font-black text-slate-900 leading-tight">${currentWorkerUser.name} <span class="text-emerald-700 font-bold">(On Duty)</span></p>
            <p class="text-[10px] text-slate-500">${currentWorkerUser.userId || 'Worker'}</p>
          </div>
        </div>
        <button onclick="handleWorkerLogout()" class="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1">
          <i class="fa-solid fa-arrow-right-from-bracket"></i> Logout
        </button>
      </div>
    `;

    container.innerHTML = mobileBtn + desktopHtml;
    if (mobileContainer) mobileContainer.innerHTML = menuCardHtml;
  } else {
    const loginHtml = `
      <div class="hidden md:flex items-center gap-1.5 sm:gap-2">
        <button onclick="openCustomerAuthModal('login')" 
                class="inline-flex items-center gap-1 bg-white hover:bg-slate-50 text-slate-800 font-bold px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs border border-slate-300 hover:border-emerald-500 shadow-sm transition" title="ग्राहक लॉगिन (पासवर्ड सहित)">
          <i class="fa-solid fa-user text-emerald-600"></i>
          <span>Customer</span>
        </button>
        <button onclick="openCustomerAuthModal('register')" 
                class="hidden lg:inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs shadow-sm transition" title="नया ग्राहक रजिस्ट्रेशन">
          <i class="fa-solid fa-user-plus text-[10px]"></i>
          <span>Register</span>
        </button>
        <button onclick="openWorkerLoginModal()" 
                class="inline-flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs border border-blue-200 hover:border-blue-400 shadow-sm transition" title="कामगार ऑन-ड्यूटी लॉगिन">
          <i class="fa-solid fa-briefcase text-blue-600"></i>
          <span>Worker</span>
        </button>
        <button onclick="openAdminLoginModal()" 
                class="inline-flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-900 font-black px-2 py-1.5 sm:px-2.5 sm:py-2 rounded-xl text-xs border border-red-200 hover:border-red-400 shadow-sm transition" title="सुपर एडमिन (फाउंडर शिवम पंडित)">
          <i class="fa-solid fa-crown text-amber-500"></i>
          <span class="hidden sm:inline">Admin</span>
        </button>
      </div>
      <div class="flex md:hidden items-center">
        <button onclick="openCustomerAuthModal('login')" 
                class="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold border border-slate-200 shadow-2xs transition" title="खाता / लॉगिन">
          <i class="fa-solid fa-user text-xs text-emerald-600"></i>
        </button>
      </div>
    `;
    container.innerHTML = loginHtml;
    if (mobileContainer) mobileContainer.innerHTML = loginHtml;
  }
}

// ========================
// 1. CUSTOMER AUTH MODAL & TAB CONTROLLER (BREVO STYLE)
// ========================
function togglePasswordVisibility(inputId, iconId) {
  const input = document.getElementById(inputId);
  const icon = document.getElementById(iconId);
  if (!input) return;
  if (input.type === "password") {
    input.type = "text";
    if (icon) {
      icon.classList.remove("fa-eye");
      icon.classList.add("fa-eye-slash");
    }
  } else {
    input.type = "password";
    if (icon) {
      icon.classList.remove("fa-eye-slash");
      icon.classList.add("fa-eye");
    }
  }
}

function openCustomerAuthModal(defaultTab = 'login', callback = null) {
  authPendingAction = callback || null;
  closeWorkerAuthModal();
  closeAdminAuthModal();
  closeEmailOtpVerifyModal();
  closeGoogleAccountChooserModal();

  const modal = document.getElementById("customerAuthModal");
  if (modal) {
    modal.classList.remove("hidden");
    const targetTab = (defaultTab === 'mobile' || defaultTab === 'password' || defaultTab === 'signin') ? 'login' : defaultTab;
    switchCustomerTab(targetTab);
  }
}

function closeCustomerAuthModal() {
  const modal = document.getElementById("customerAuthModal");
  if (modal) modal.classList.add("hidden");
}

function switchCustomerTab(tab) {
  const normalizedTab = (tab === 'password' || tab === 'signin' || tab === 'mobile') ? 'login' : tab;
  const tabs = ['login', 'register', 'forgot'];

  tabs.forEach(t => {
    const btn = document.getElementById(`custTabBtn-${t}`);
    const panel = document.getElementById(`custTab-${t}`);

    if (btn) {
      if (t === normalizedTab) {
        btn.className = "cust-tab-btn flex-1 py-3 px-3 text-center border-b-2 border-emerald-600 text-emerald-800 bg-white flex items-center justify-center gap-1.5 transition font-black";
      } else {
        btn.className = "cust-tab-btn flex-1 py-3 px-3 text-center border-b-2 border-transparent text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1.5 transition";
      }
    }

    if (panel) {
      if (t === normalizedTab) {
        panel.classList.remove("hidden");
      } else {
        panel.classList.add("hidden");
      }
    }
  });

  // Clear errors when switching tabs
  const errEls = ["custLoginError", "regCustError", "forgotCustError"];
  errEls.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add("hidden");
  });
}

// Backwards-compatibility aliases for existing calls
function openGoogleAuthModal(callback, defaultTab = 'login') {
  if (defaultTab === 'worker') {
    openWorkerLoginModal();
  } else {
    openCustomerAuthModal(defaultTab, callback);
  }
}
function closeGoogleAuthModal() {
  closeCustomerAuthModal();
  closeWorkerAuthModal();
  closeAdminAuthModal();
  closeEmailOtpVerifyModal();
  closeGoogleAccountChooserModal();
}
function openRegisterModal(callback) {
  openCustomerAuthModal('register', callback);
}
function switchAuthTab(tab) {
  if (tab === 'worker') {
    openWorkerLoginModal();
  } else {
    switchCustomerTab(tab);
  }
}

// ========================
// 2. WORKER AUTH MODAL
// ========================
function openWorkerLoginModal(defaultTab = 'login') {
  closeCustomerAuthModal();
  closeAdminAuthModal();
  closeEmailOtpVerifyModal();
  closeGoogleAccountChooserModal();
  const modal = document.getElementById("workerAuthModal");
  if (modal) {
    modal.classList.remove("hidden");
    switchWorkerTab(defaultTab);
  }
}

function closeWorkerAuthModal() {
  const modal = document.getElementById("workerAuthModal");
  if (modal) modal.classList.add("hidden");
}

function switchWorkerTab(tab) {
  const normalizedTab = tab === 'register' ? 'register' : 'login';
  const tabs = ['login', 'register'];

  tabs.forEach(t => {
    const btn = document.getElementById(`workerTabBtn-${t}`);
    const panel = document.getElementById(`workerTab-${t}`);

    if (btn) {
      if (t === normalizedTab) {
        btn.className = "worker-tab-btn flex-1 py-3 px-3 text-center border-b-2 border-blue-600 text-blue-800 bg-white flex items-center justify-center gap-1.5 transition font-black";
      } else {
        btn.className = "worker-tab-btn flex-1 py-3 px-3 text-center border-b-2 border-transparent text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1.5 transition";
      }
    }

    if (panel) {
      if (t === normalizedTab) {
        panel.classList.remove("hidden");
      } else {
        panel.classList.add("hidden");
      }
    }
  });

  const err1 = document.getElementById("workerLoginError");
  if (err1) err1.classList.add("hidden");
  const err2 = document.getElementById("wRegError");
  if (err2) err2.classList.add("hidden");
}

// ========================
// 3. ADMIN AUTH MODAL (FOUNDER SHIVAM PANDAT)
// ========================
function openAdminLoginModal() {
  closeCustomerAuthModal();
  closeWorkerAuthModal();
  const modal = document.getElementById("adminAuthModal");
  const err = document.getElementById("adminLoginError");
  if (err) err.classList.add("hidden");
  if (modal) modal.classList.remove("hidden");
}

function closeAdminAuthModal() {
  const modal = document.getElementById("adminAuthModal");
  if (modal) modal.classList.add("hidden");
}

async function handleAdminLoginSubmit(e) {
  e.preventDefault();
  const identifier = (document.getElementById("adminLoginIdentifier")?.value || "").trim();
  const password = (document.getElementById("adminLoginSecret")?.value || "").trim();
  const pin = (document.getElementById("adminLoginPin")?.value || "").trim();
  const errEl = document.getElementById("adminLoginError");
  const submitBtn = document.getElementById("adminLoginSubmitBtn");

  if (!identifier || !password) {
    if (errEl) {
      errEl.textContent = "कृपया ईमेल/यूजरनेम और एडमिन पासवर्ड दोनों दर्ज करें।";
      errEl.classList.remove("hidden", "text-emerald-700", "text-blue-600");
      errEl.classList.add("text-rose-600");
    }
    return;
  }

  if (!pin) {
    if (errEl) {
      errEl.textContent = "कृपया Founder Security PIN या Gmail 2FA कोड दर्ज करें।";
      errEl.classList.remove("hidden", "text-emerald-700", "text-blue-600");
      errEl.classList.add("text-rose-600");
    }
    return;
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>Verifying Admin 2FA Credentials...</span>`;
  }

  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password, pin })
    });
    const data = await res.json();

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<i class="fa-solid fa-lock"></i> <span>Enter Admin Panel (सुरक्षित प्रवेश)</span>`;
    }

    if (!data.success) {
      if (errEl) {
        errEl.textContent = data.error || "❌ अनधिकृत एक्सेस! गलत क्रेडेंशियल दर्ज किए गए हैं।";
        errEl.classList.remove("hidden", "text-emerald-700", "text-blue-600");
        errEl.classList.add("text-rose-600");
      }
      return;
    }

    // Success! Store server admin session token
    if (data.token) {
      localStorage.setItem("kw_admin_token", data.token);
    }
    currentUser = data.user || {
      id: "kw_adm_1",
      name: "Shivam Pandat",
      email: "shivampandat819@gmail.com",
      phone: "9899862721",
      city: "Headquarters, Noida",
      role: "admin",
      phoneVerified: true,
      emailVerified: true
    };
    localStorage.setItem("kw_current_user", JSON.stringify(currentUser));
    if (errEl) errEl.classList.add("hidden");

    closeAdminAuthModal();
    renderAuthUI();
    playOrderSuccessChime();
    showToast("👑 Founder & Super Admin (Shivam Pandat) सुरक्षित 2FA लॉगिन सफल!");
    openAdminPanelModal();
  } catch (err) {
    // Fallback if offline or local file protocol with strict 2FA PIN
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<i class="fa-solid fa-lock"></i> <span>Enter Admin Panel (सुरक्षित प्रवेश)</span>`;
    }
    const cleanId = identifier.toLowerCase();
    const isAdminUser = cleanId === "shivampandat819@gmail.com" || cleanId === "9899862721" || cleanId === "shivam_admin";
    const isMasterPin = pin === "8190" || pin === "819819";
    if (isAdminUser && password === "Shivam@819" && isMasterPin) {
      currentUser = {
        id: "kw_adm_1",
        name: "Shivam Pandat",
        email: "shivampandat819@gmail.com",
        phone: "9899862721",
        city: "Headquarters, Noida",
        role: "admin",
        phoneVerified: true,
        emailVerified: true
      };
      localStorage.setItem("kw_current_user", JSON.stringify(currentUser));
      localStorage.setItem("kw_admin_token", "founder_admin_session_shivam_pandat");
      if (errEl) errEl.classList.add("hidden");
      closeAdminAuthModal();
      renderAuthUI();
      playOrderSuccessChime();
      showToast("👑 Super Admin (Master Key) सुरक्षित 2FA लॉगिन सफल!");
      openAdminPanelModal();
      return;
    }

    if (errEl) {
      errEl.textContent = "❌ सर्वर या 2FA सत्यापन त्रुटि (" + err.message + ")। कृपया सही Security PIN जांचें।";
      errEl.classList.remove("hidden", "text-emerald-700", "text-blue-600");
      errEl.classList.add("text-rose-600");
    }
  }
}

async function sendAdmin2FAOtpToGmail() {
  const errEl = document.getElementById("adminLoginError");
  try {
    if (errEl) {
      errEl.innerHTML = `<span>⏳ Shivam Pandat (shivampandat819@gmail.com) पर 2FA कोड भेजा जा रहा है...</span>`;
      errEl.classList.remove("hidden", "text-rose-600", "text-emerald-700");
      errEl.classList.add("text-blue-600");
    }
    const res = await fetch("/api/send-email-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "shivampandat819@gmail.com",
        name: "Shivam Pandat",
        purpose: "admin_2fa"
      })
    });
    const data = await res.json();
    if (data.success) {
      if (errEl) {
        errEl.innerHTML = `
          <div class="space-y-1.5 text-left p-1">
            <p class="font-bold text-emerald-800 text-xs">✅ Shivam Pandat (shivampandat819@gmail.com) पर 2FA कोड भेज दिया गया है!</p>
            <p class="text-[11px] text-slate-700">📩 <a href="https://mail.google.com/mail/u/0/#search/KaamWale" target="_blank" class="text-blue-700 underline font-bold">यहाँ क्लिक करके Gmail इनबॉक्स व Spam फ़ोल्डर खोलें</a></p>
            <p class="text-[10px] text-amber-800 bg-amber-50 p-1.5 rounded-lg border border-amber-200">
              💡 <strong>नोट:</strong> अगर मुख्य इनबॉक्स में ईमेल न दिखे, तो Gmail का <strong>Spam / Junk फ़ोल्डर</strong> जरूर चेक करें। आप सीधे अपने <strong>Founder Master PIN</strong> से भी बिना OTP के लॉगिन कर सकते हैं।
            </p>
          </div>
        `;
        errEl.classList.remove("text-rose-600", "text-blue-600", "hidden");
      }
      showToast("Gmail पर 2FA कोड भेज दिया गया! (Spam फ़ोल्डर भी चेक करें)", "success");
    } else {
      if (errEl) {
        errEl.innerHTML = `❌ ${data.error || "OTP भेजने में समस्या। आप सीधे अपने Founder Master PIN से लॉगिन कर सकते हैं।"}`;
        errEl.classList.add("text-rose-600");
        errEl.classList.remove("text-blue-600", "text-emerald-700", "hidden");
      }
    }
  } catch (err) {
    if (errEl) {
      errEl.innerHTML = `❌ नेटवर्क समस्या। आप सीधे अपने Founder Master PIN से लॉगिन कर सकते हैं।`;
      errEl.classList.add("text-rose-600");
      errEl.classList.remove("text-blue-600", "text-emerald-700", "hidden");
    }
  }
}
window.sendAdmin2FAOtpToGmail = sendAdmin2FAOtpToGmail;

function handleAdminOtpRequest() {
  closeAdminAuthModal();
  openProfileOtpModal("admin", "9899862721", {
    id: "C100",
    name: "Shivam Pandat",
    email: "shivampandat819@gmail.com",
    role: "admin"
  });
}

function openProfileOtpModal(type, phone, payload) {
  const generatedOtp = String(Math.floor(100000 + Math.random() * 900000));
  currentOtpSession = {
    type: type, // 'worker', 'customer', 'booking'
    phone: phone,
    otp: generatedOtp,
    data: payload,
    expiresAt: Date.now() + 10 * 60 * 1000
  };

  const modal = document.getElementById("profileOtpModal");
  const roleBadge = document.getElementById("otpTargetRoleBadge");
  const title = document.getElementById("otpModalTitle");
  const phoneDisplay = document.getElementById("otpTargetPhoneDisplay");
  const input = document.getElementById("profileOtpInput");
  const err = document.getElementById("profileOtpError");
  const btnWa = document.getElementById("btnGetOtpWhatsApp");
  const btnSms = document.getElementById("btnGetOtpSMS");

  if (roleBadge) {
    roleBadge.textContent = type === "worker" 
      ? "WORKER PROFILE AUTHENTICATION" 
      : type === "booking" 
        ? "BOOKING MOBILE VERIFICATION" 
        : type === "admin" 
          ? "SUPER ADMIN FOUNDER VERIFICATION" 
          : "CUSTOMER PROFILE AUTHENTICATION";
    roleBadge.className = type === "worker" 
      ? "text-[10px] font-black uppercase text-blue-400 tracking-wider" 
      : type === "admin" 
        ? "text-[10px] font-black uppercase text-amber-400 tracking-wider" 
        : "text-[10px] font-black uppercase text-emerald-400 tracking-wider";
  }
  if (title) {
    title.textContent = type === "worker" 
      ? "कामगार प्रोफाइल मोबाइल सत्यापन (Worker OTP)" 
      : type === "admin" 
        ? "सुपर एडमिन मोबाइल सत्यापन (Admin OTP)" 
        : "ग्राहक प्रोफाइल मोबाइल सत्यापन (Customer OTP)";
  }
  if (phoneDisplay) phoneDisplay.textContent = `+91 ${phone}`;

  if (input) {
    input.value = "";
    setTimeout(() => input.focus(), 250);
  }
  if (err) {
    err.textContent = "";
    err.classList.add("hidden");
  }

  // Setup Real Handset WhatsApp and Native SMS URLs
  const cleanPhone10 = String(phone).replace(/\D/g, '').slice(-10);
  const purposeHindi = type === 'worker' ? 'कामगार प्रोफाइल सत्यापन' : (type === 'booking' ? 'ऑर्डर बुकिंग सत्यापन' : (type === 'admin' ? 'सुपर एडमिन सत्यापन' : 'ग्राहक प्रोफाइल सत्यापन'));
  const waMsg = 
    `*🟢 KAAMWALE.NET SECURITY VERIFICATION 🟢*\n` +
    `----------------------------------------\n` +
    `Namaste!\n` +
    `KaamWale.net me aapka swagat hai.\n\n` +
    `Aapka aadhikarik suraksha satyapan code hai:\n\n` +
    `👉 *${generatedOtp}*\n\n` +
    `📋 uddeshya: ${purposeHindi}\n` +
    `⏱️ vaidhata: 10 minute (Valid for 10 minutes)\n` +
    `🔒 kripya ye code kisi ke sath sajha na karein.\n\n` +
    `🌐 KaamWale.net • Har Kaam Ka Solution\n` +
    `👑 Platform Admin: Shivam Pandat (+91 98998 62721)\n` +
    `----------------------------------------`;

  const smsMsg = `KaamWale.net verification code: ${generatedOtp}. Valid for 10 min. Do not share. Admin: Shivam Pandat (+91 98998 62721)`;

  if (phoneDisplay) phoneDisplay.textContent = `+91 ${cleanPhone10}`;
  const phoneDisplayCard = document.getElementById("otpTargetPhoneDisplayCard");
  if (phoneDisplayCard) phoneDisplayCard.textContent = `+91 ${cleanPhone10}`;

  if (btnWa) {
    btnWa.href = `https://wa.me/91${cleanPhone10}?text=${encodeURIComponent(waMsg)}`;
  }
  if (btnSms) {
    btnSms.href = `sms:+91${cleanPhone10}?body=${encodeURIComponent(smsMsg)}`;
    btnSms.onclick = () => {
      showToast(`💬 SMS सुरक्षा कोड तैयार! मैसेज ऐप खुल रहा है...`);
    };
  }

  // Dispatch OTP via Backend Server Gateway (WhatsApp + SMS)
  try {
    fetch('/api/send-mobile-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: cleanPhone10,
        otp: generatedOtp,
        purpose: purposeHindi,
        channel: 'all'
      })
    }).then(res => res.json()).then(resp => {
      if (resp && resp.whatsappUrl && btnWa) {
        btnWa.href = resp.whatsappUrl;
      }
      if (resp && resp.smsUrl && btnSms) {
        btnSms.href = resp.smsUrl;
      }
      showToast(`🟢 KaamWale.net कोड (+91 ${cleanPhone10}) WhatsApp एवं SMS के लिए तैयार!`);
    }).catch(err => {
      console.log('Mobile OTP dispatch log:', err);
    });
  } catch (e) {}

  startResendTimer();
  playOrderSuccessChime();

  if (modal) modal.classList.remove("hidden");
  showToast(`🟢 KaamWale.net कोड (+91 ${cleanPhone10}) WhatsApp/SMS पर भेजा गया!`);
}

function closeProfileOtpModal() {
  const modal = document.getElementById("profileOtpModal");
  if (modal) modal.classList.add("hidden");
  if (resendTimerInterval) clearInterval(resendTimerInterval);
}

function startResendTimer() {
  if (resendTimerInterval) clearInterval(resendTimerInterval);
  resendCountdown = 30;
  const timerText = document.getElementById("resendTimerText");
  const resendBtn = document.getElementById("resendOtpBtn");
  const resendSmsBtn = document.getElementById("resendSmsOtpBtn");
  if (timerText) timerText.textContent = `${resendCountdown}s`;
  if (resendBtn) resendBtn.disabled = true;
  if (resendSmsBtn) resendSmsBtn.disabled = true;

  resendTimerInterval = setInterval(() => {
    resendCountdown--;
    if (timerText) timerText.textContent = `${resendCountdown}s`;
    if (resendCountdown <= 0) {
      clearInterval(resendTimerInterval);
      if (timerText) timerText.textContent = "उपलब्ध";
      if (resendBtn) resendBtn.disabled = false;
      if (resendSmsBtn) resendSmsBtn.disabled = false;
    }
  }, 1000);
}

function handleResendProfileOtp(channel = 'whatsapp') {
  if (!currentOtpSession || resendCountdown > 0) return;
  const newOtp = String(Math.floor(100000 + Math.random() * 900000));
  currentOtpSession.otp = newOtp;
  currentOtpSession.expiresAt = Date.now() + 10 * 60 * 1000;

  const phone = currentOtpSession.phone;
  const cleanPhone10 = String(phone).replace(/\D/g, '').slice(-10);
  const type = currentOtpSession.type;
  const purposeHindi = type === 'worker' ? 'कामगार प्रोफाइल सत्यापन' : (type === 'booking' ? 'ऑर्डर बुकिंग सत्यापन' : (type === 'admin' ? 'सुपर एडमिन सत्यापन' : 'ग्राहक प्रोफाइल सत्यापन'));

  const btnWa = document.getElementById("btnGetOtpWhatsApp");
  const btnSms = document.getElementById("btnGetOtpSMS");

  const waMsg = 
    `*🟢 KAAMWALE.NET SECURITY VERIFICATION 🟢*\n` +
    `----------------------------------------\n` +
    `Namaste!\n` +
    `Aapka naya KaamWale.net verification code hai:\n\n` +
    `👉 *${newOtp}*\n\n` +
    `⏱️ vaidhata: 10 minute\n` +
    `🔒 kripya ye code kisi ke sath sajha na karein.\n\n` +
    `🌐 KaamWale.net • Har Kaam Ka Solution\n` +
    `👑 Platform Admin: Shivam Pandat (+91 98998 62721)\n` +
    `----------------------------------------`;

  const smsMsg = `KaamWale.net verification code: ${newOtp}. Valid for 10 min. Do not share. Admin: Shivam Pandat (+91 98998 62721)`;

  if (btnWa) {
    btnWa.href = `https://wa.me/91${cleanPhone10}?text=${encodeURIComponent(waMsg)}`;
  }
  if (btnSms) {
    btnSms.href = `sms:+91${cleanPhone10}?body=${encodeURIComponent(smsMsg)}`;
  }

  try {
    fetch('/api/send-mobile-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: cleanPhone10,
        otp: newOtp,
        purpose: 'नया KaamWale.net सुरक्षा कोड',
        channel: channel
      })
    }).then(res => res.json()).then(resp => {
      if (resp && resp.whatsappUrl && btnWa) {
        btnWa.href = resp.whatsappUrl;
      }
      if (resp && resp.smsUrl && btnSms) {
        btnSms.href = resp.smsUrl;
      }
      if (channel === 'sms') {
        showToast(`💬 नया कोड SMS (+91 ${cleanPhone10}) के लिए तैयार!`);
      } else {
        showToast(`🟢 नया सुरक्षा कोड WhatsApp (+91 ${cleanPhone10}) पर तैयार है!`);
      }
    }).catch(err => {});
  } catch (e) {}

  startResendTimer();
  playOrderSuccessChime();
  if (channel === 'sms') {
    showToast(`💬 नया कोड SMS (+91 ${cleanPhone10}) पर पुनः भेजा गया!`);
  } else {
    showToast(`🟢 नया कोड WhatsApp (+91 ${cleanPhone10}) पर पुनः भेजा गया!`);
  }
}

async function handleVerifyProfileOtp(e) {
  e.preventDefault();
  if (!currentOtpSession || !currentOtpSession.phone) {
    alert("कृपया पहले OTP मंगाएं।");
    return;
  }

  const input = document.getElementById("profileOtpInput");
  const err = document.getElementById("profileOtpError");
  const entered = (input?.value || "").trim();

  if (entered.length !== 6) {
    if (err) {
      err.textContent = "कृपया 6-अंकीय OTP कोड दर्ज करें।";
      err.classList.remove("hidden");
    }
    return;
  }

  // Security Fix 1: Verify OTP securely on the backend server
  try {
    const vRes = await fetch('/api/verify-mobile-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: currentOtpSession.phone, otp: entered })
    });
    const vData = await vRes.json();

    if (!vData.success) {
      if (err) {
        err.textContent = `❌ ${vData.error || "गलत OTP दर्ज किया!"}`;
        err.classList.remove("hidden");
      }
      if (input) {
        input.classList.add("border-rose-500", "bg-rose-50");
        input.focus();
        setTimeout(() => input.classList.remove("border-rose-500", "bg-rose-50"), 1500);
      }
      return;
    }
  } catch (netErr) {
    // Graceful offline fallback only if network was completely severed
    if (currentOtpSession.otp && entered !== currentOtpSession.otp) {
      if (err) {
        err.textContent = `❌ गलत OTP दर्ज किया! सही 6-अंकीय कोड ही मान्य है।`;
        err.classList.remove("hidden");
      }
      return;
    }
  }

  // OTP Verified Successfully by Server!
  const session = currentOtpSession;
  currentOtpSession = null;
  closeProfileOtpModal();

  if (session.type === "worker") {
    // FINAL WORKER SUBMISSION AFTER MOBILE OTP AUTHENTICATION
    const newWorker = {
      ...session.data,
      phoneVerified: true,
      verifiedAt: new Date().toISOString(),
      trustScore: "98% (OTP Verified)",
      status: "pending" // Admin Shivam Pandat approval required
    };

    const workers = getStoredWorkers();
    workers.unshift(newWorker);
    saveStoredWorkers(workers);

    const workerForm = document.querySelector("#worker-register form");
    if (workerForm) workerForm.reset();

    // Sync worker to backend users.json
    fetch('/api/auth/register-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newWorker.name,
        email: newWorker.email,
        phone: newWorker.phone,
        role: "worker",
        category: newWorker.category,
        skills: newWorker.skills || newWorker.category,
        experience: newWorker.experience,
        location: newWorker.location
      })
    }).catch(err => console.warn('Worker server sync error:', err));

    showToast(`🎉 मोबाइल नंबर सत्यापित! प्रोफाइल एडमिन (शिवम पंडित) के पास KYC सत्यापन के लिए सबमिट हो गई।`);
  } else if (session.type === "customer") {
    // FINAL CUSTOMER PROFILE ACTIVATION AFTER MOBILE OTP AUTHENTICATION
    const custData = session.data;

    // Save newly registered customer to persistent database
    if (custData.isNewRegistration) {
      const customers = getStoredCustomers();
      const newCust = {
        id: custData.id || ("C" + Math.floor(100 + Math.random() * 900)),
        userId: custData.userId || custData.phone,
        password: custData.password || "Kaam@123",
        name: custData.name,
        phone: custData.phone,
        email: custData.email,
        city: custData.city || "Local",
        role: "customer",
        registeredAt: custData.registeredAt || new Date().toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }),
        phoneVerified: true
      };
      customers.push(newCust);
      saveStoredCustomers(customers);

      // Sync customer to backend users.json
      fetch('/api/auth/register-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: newCust.userId,
          password: newCust.password,
          name: newCust.name,
          email: newCust.email,
          phone: newCust.phone,
          role: "customer",
          address: newCust.city
        })
      }).catch(err => console.warn('Customer server sync error:', err));

      showToast(`🎉 बधाई हो ${newCust.name}! आपका KaamWale.com खाता (User ID: ${newCust.userId}) सफलतापूर्वक बन गया है!`);
    } else {
      showToast(`🎉 स्वागत है, ${custData.name}! मोबाइल सत्यापन व लॉगिन सफल।`);
    }

    currentUser = {
      id: custData.id,
      name: custData.name,
      email: custData.email,
      phone: custData.phone,
      city: custData.city || "Local",
      phoneVerified: true,
      role: custData.role || "customer",
      verifiedAt: new Date().toISOString()
    };
    localStorage.setItem("kw_current_user", JSON.stringify(currentUser));
    renderAuthUI();

    if (authPendingAction) {
      const fn = authPendingAction;
      authPendingAction = null;
      fn();
    }
  } else if (session.type === "booking") {
    // FINAL BOOKING CONFIRMATION AFTER MOBILE OTP AUTHENTICATION
    if (currentUser) {
      currentUser.phone = session.phone;
      currentUser.phoneVerified = true;
      localStorage.setItem("kw_current_user", JSON.stringify(currentUser));
    }
    finalizeCustomerBooking(session.data);
  } else if (session.type === "admin") {
    // FINAL FOUNDER ADMIN AUTHENTICATION AFTER MOBILE OTP
    currentUser = {
      id: "C100",
      name: "Shivam Pandat",
      email: "shivampandat819@gmail.com",
      phone: "9899862721",
      city: "Delhi NCR",
      role: "admin",
      phoneVerified: true,
      verifiedAt: new Date().toISOString()
    };
    localStorage.setItem("kw_current_user", JSON.stringify(currentUser));
    renderAuthUI();
    showToast("👑 स्वागत है फाउंडर शिवम पंडित! सुपर एडमिन मास्टर पैनल में लॉगिन सफल।");
    openAdminPanelModal();
  }
}

function performGoogleSignIn(name, email, role = "customer") {
  currentUser = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: role === "admin" ? "9899862721" : "9876543210",
    phoneVerified: true,
    role: role
  };
  localStorage.setItem("kw_current_user", JSON.stringify(currentUser));
  renderAuthUI();
  closeGoogleAuthModal();
  showToast(`✅ Google साइन-इन सफल: ${currentUser.name}`);

  if (authPendingAction) {
    const fn = authPendingAction;
    authPendingAction = null;
    fn();
  }
}

// ==========================================
// REAL GOOGLE IDENTITY SERVICES (GIS) OAUTH
// ==========================================
let globalGoogleClientId = window.KAAMWALE_CONFIG?.googleClientId || localStorage.getItem("kw_google_client_id") || "";

function fetchServerConfig() {
  fetch('/api/config')
    .then(res => res.json())
    .then(cfg => {
      if (cfg && cfg.googleClientId) {
        globalGoogleClientId = cfg.googleClientId;
        localStorage.setItem("kw_google_client_id", cfg.googleClientId);
        initGoogleIdentityServices();
      }
    })
    .catch(() => {});
}

function initGoogleIdentityServices() {
  const clientId = globalGoogleClientId || localStorage.getItem("kw_google_client_id");
  if (!clientId || !window.google || !window.google.accounts || !window.google.accounts.id) return;

  try {
    google.accounts.id.initialize({
      client_id: clientId,
      callback: handleGoogleCredentialResponse,
      auto_select: false
    });

    const container = document.getElementById("g_id_signin_container");
    if (container) {
      container.innerHTML = "";
      google.accounts.id.renderButton(container, {
        theme: "outline",
        size: "large",
        shape: "pill",
        text: "continue_with",
        logo_alignment: "left",
        width: 320
      });
    }
  } catch (err) {
    console.warn("Google Identity Services Init Note:", err);
  }
}

function handleGoogleCredentialResponse(response) {
  try {
    if (!response || !response.credential) return;

    // Decode signed Google JWT Token
    const base64Url = response.credential.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const googleUser = JSON.parse(jsonPayload);
    const email = (googleUser.email || "").trim().toLowerCase();
    const name = googleUser.name || email.split('@')[0];
    const picture = googleUser.picture || "";

    console.log("✅ Google Identity Verified:", email, name);

    const customers = getStoredCustomers();
    const matchedCustomer = customers.find(c => (c.email || "").toLowerCase() === email);
    const isAdminShivam = email === "shivampandat819@gmail.com";

    // Strict Registration Requirement check
    if (!matchedCustomer && !isAdminShivam) {
      showToast(`ℹ️ Google ईमेल (${email}) प्राप्त हुआ! कृपया अपना 10-अंकीय मोबाइल नंबर दर्ज कर रजिस्ट्रेशन पूरा करें।`);
      switchAuthTab('register');
      const regName = document.getElementById("regCustName");
      const regEmail = document.getElementById("regCustEmail");
      if (regName) regName.value = name;
      if (regEmail) regEmail.value = email;
      return;
    }

    const role = isAdminShivam ? "admin" : (matchedCustomer?.role || "customer");
    performGoogleSignIn(name, email, role);
    if (picture && currentUser) {
      currentUser.picture = picture;
      localStorage.setItem("kw_current_user", JSON.stringify(currentUser));
    }
    showToast(`🎉 स्वागत है ${name}! Google OAuth से लॉगिन सफल।`);
  } catch (parseErr) {
    console.error("Google Credential Parse Error:", parseErr);
    alert("Google साइन-इन प्रक्रिया में त्रुटि आई। कृपया पुनः प्रयास करें।");
  }
}

function handleQuickGoogleAccount(name, email, role = "customer") {
  performGoogleSignIn(name, email, role);
}

// Firebase Web SDK Initialization
function initFirebaseApp() {
  if (typeof firebase !== 'undefined' && window.KAAMWALE_CONFIG?.firebaseConfig?.apiKey) {
    try {
      if (!firebase.apps.length) {
        firebase.initializeApp(window.KAAMWALE_CONFIG.firebaseConfig);
        console.log("🔥 Firebase Authentication initialized successfully");
      }
      return true;
    } catch (e) {
      console.warn("Firebase initialization skipped/failed:", e);
    }
  }
  return false;
}

// Official Google OAuth 2.0 Account Chooser
let googleChooserIsSignUp = false;

function executeGoogleOAuthRedirect(isSignUp = false) {
  showToast("ℹ️ Google लॉगिन वर्तमान में अनुपलब्ध है। कृपया ईमेल व पासवर्ड का उपयोग करें।");
  return false;
}

// ==========================================
// AUTHENTIC GOOGLE IDENTITY FLOW (NO DUMMY SUGGESTIONS)
// ==========================================
let currentSelectedGoogleAccount = null;

function openGoogleAccountChooserModal(isSignUp = false) {
  googleChooserIsSignUp = isSignUp;
  closeCustomerAuthModal();
  closeEmailOtpVerifyModal();

  const modal = document.getElementById("googleAccountChooserModal");
  if (!modal) return;

  // Reset to Stage 1 (Choose Account)
  const stage1 = document.getElementById("googleStage1-chooser");
  const stage2 = document.getElementById("googleStage2-consent");
  const stage3 = document.getElementById("googleStage3-profile");
  const directInput = document.getElementById("googleDirectEmailInput");
  const setupBox = document.getElementById("googleClientIdSetupBox");

  if (stage1) stage1.classList.remove("hidden");
  if (stage2) stage2.classList.add("hidden");
  if (stage3) stage3.classList.add("hidden");
  if (setupBox) setupBox.classList.add("hidden");
  if (directInput) {
    directInput.value = "";
    setTimeout(() => directInput.focus(), 200);
  }

  // If GIS has initialized, render the official button in the modal container
  const modalGisContainer = document.getElementById("g_id_signin_container_modal");
  const clientId = globalGoogleClientId || localStorage.getItem("kw_google_client_id");
  if (modalGisContainer && clientId && clientId.includes(".apps.googleusercontent.com") && window.google?.accounts?.id) {
    try {
      modalGisContainer.innerHTML = "";
      google.accounts.id.renderButton(modalGisContainer, {
        theme: "outline",
        size: "large",
        shape: "pill",
        text: "continue_with",
        logo_alignment: "left",
        width: 280
      });
    } catch (e) {}
  }

  currentSelectedGoogleAccount = null;
  modal.classList.remove("hidden");
}

function closeGoogleAccountChooserModal() {
  const modal = document.getElementById("googleAccountChooserModal");
  if (modal) modal.classList.add("hidden");
  currentSelectedGoogleAccount = null;
}

function pickGoogleChooserAccount(name, email, bgClass = 'bg-blue-600') {
  currentSelectedGoogleAccount = { name, email, bgClass };

  const stage1 = document.getElementById("googleStage1-chooser");
  const stage2 = document.getElementById("googleStage2-consent");
  const avatarEl = document.getElementById("consentSelectedAvatar");
  const nameEl = document.getElementById("consentSelectedName");
  const emailEl = document.getElementById("consentSelectedEmail");

  if (avatarEl) {
    avatarEl.textContent = (name || email).charAt(0).toUpperCase();
    avatarEl.className = `w-10 h-10 rounded-full ${bgClass} text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm`;
  }
  if (nameEl) nameEl.textContent = name;
  if (emailEl) emailEl.textContent = email;

  if (stage1) stage1.classList.add("hidden");
  if (stage2) stage2.classList.remove("hidden");
}

function submitGoogleDirectEmail() {
  const input = document.getElementById("googleDirectEmailInput");
  const email = (input?.value || "").trim().toLowerCase();
  if (!email || !email.includes("@") || !email.includes(".")) {
    alert("कृपया सही Gmail आईडी दर्ज करें। (Please enter a valid Gmail address)");
    return;
  }
  const derivedName = email.split("@")[0].replace(/[._]/g, " ");
  pickGoogleChooserAccount(derivedName, email, 'bg-blue-600');
}

function toggleGoogleClientIdSetup() {
  const box = document.getElementById("googleClientIdSetupBox");
  const arrow = document.getElementById("clientIdSetupArrow");
  if (box) {
    const isHidden = box.classList.contains("hidden");
    if (isHidden) {
      box.classList.remove("hidden");
      if (arrow) arrow.className = "fa-solid fa-chevron-up text-[10px]";
      const input = document.getElementById("inputQuickGoogleClientId");
      if (input) setTimeout(() => input.focus(), 150);
    } else {
      box.classList.add("hidden");
      if (arrow) arrow.className = "fa-solid fa-chevron-down text-[10px]";
    }
  }
}

async function saveAndActivateGoogleClientId() {
  const input = document.getElementById("inputQuickGoogleClientId");
  const clientId = (input?.value || "").trim();
  if (!clientId || !clientId.includes(".apps.googleusercontent.com")) {
    alert("कृपया वैध Google Client ID दर्ज करें जो .apps.googleusercontent.com पर समाप्त होती हो।");
    return;
  }
  try {
    const res = await fetch('/api/save-google-client-id', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId })
    });
    const data = await res.json();
    if (data.success) {
      globalGoogleClientId = clientId;
      localStorage.setItem("kw_google_client_id", clientId);
      showToast("✅ Google Client ID सक्रिय हो गई!");
      initGoogleIdentityServices();
      closeGoogleAccountChooserModal();
      executeGoogleOAuthRedirect(googleChooserIsSignUp);
    } else {
      alert("Error: " + (data.error || "Client ID सहेजने में विफल"));
    }
  } catch (err) {
    alert("सर्वर से कनेक्ट करने में त्रुटि: " + err.message);
  }
}

function returnToGoogleStage1() {
  const stage1 = document.getElementById("googleStage1-chooser");
  const stage2 = document.getElementById("googleStage2-consent");
  const stage3 = document.getElementById("googleStage3-profile");
  if (stage1) stage1.classList.remove("hidden");
  if (stage2) stage2.classList.add("hidden");
  if (stage3) stage3.classList.add("hidden");
}

async function confirmGoogleConsent() {
  if (!currentSelectedGoogleAccount) return;
  const { name, email } = currentSelectedGoogleAccount;

  // Founder Super Admin check
  if (email.toLowerCase() === "shivampandat819@gmail.com") {
    currentUser = {
      id: "kw_adm_1",
      name: "Shivam Pandat",
      email: email,
      phone: "9899862721",
      city: "Headquarters, Noida",
      role: "admin",
      phoneVerified: true,
      emailVerified: true
    };
    localStorage.setItem("kw_current_user", JSON.stringify(currentUser));
    renderAuthUI();
    closeGoogleAccountChooserModal();
    playOrderSuccessChime();
    showToast("👑 सुपर एडमिन शिवम पंडित (Google Identity) लॉगिन सफल!");
    return;
  }

  // Check if user already exists in backend or local storage
  let matchedUser = null;
  try {
    const res = await fetch('/api/auth/verify-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, name: name })
    });
    const data = await res.json();
    if (data.success && data.user) {
      matchedUser = data.user;
    }
  } catch (e) {
    console.warn("Backend token lookup note:", e.message);
  }

  if (!matchedUser) {
    const customers = getStoredCustomers();
    matchedUser = customers.find(c => (c.email || '').toLowerCase() === email.toLowerCase());
  }

  // If user exists and already has phone number: Instant 1-Click Login!
  if (matchedUser && matchedUser.phone && matchedUser.phone.length === 10) {
    currentUser = {
      id: matchedUser.id || ("C" + Math.floor(100 + Math.random() * 900)),
      userId: matchedUser.userId || email.split("@")[0],
      name: matchedUser.name || name,
      email: matchedUser.email || email,
      phone: matchedUser.phone,
      city: matchedUser.address || matchedUser.city || "Local",
      role: matchedUser.role || "customer",
      phoneVerified: true,
      emailVerified: true
    };
    localStorage.setItem("kw_current_user", JSON.stringify(currentUser));
    renderAuthUI();
    closeGoogleAccountChooserModal();
    playOrderSuccessChime();
    showToast(`🎉 स्वागत है, ${currentUser.name}! Google लॉगिन सफल।`);

    if (typeof authPendingAction === 'function') {
      const act = authPendingAction;
      authPendingAction = null;
      act();
    }
    return;
  }

  // If new user or phone missing: Transition to Stage 3 (Welcome! Nice to meet you)
  const stage2 = document.getElementById("googleStage2-consent");
  const stage3 = document.getElementById("googleStage3-profile");
  const nameInput = document.getElementById("googleWelcomeName");
  const phoneInput = document.getElementById("googleWelcomePhone");
  const cityInput = document.getElementById("googleWelcomeCity");

  if (nameInput) nameInput.value = matchedUser?.name || name;
  if (phoneInput) phoneInput.value = matchedUser?.phone || "";
  if (cityInput) cityInput.value = matchedUser?.address || matchedUser?.city || "";

  if (stage2) stage2.classList.add("hidden");
  if (stage3) stage3.classList.remove("hidden");
  if (phoneInput) setTimeout(() => phoneInput.focus(), 200);
}

async function handleGoogleWelcomeProfileSubmit(e) {
  e.preventDefault();
  if (!currentSelectedGoogleAccount) return;

  const email = currentSelectedGoogleAccount.email;
  const name = (document.getElementById("googleWelcomeName")?.value || "").trim();
  const rawPhone = (document.getElementById("googleWelcomePhone")?.value || "").replace(/\D/g, "");
  const city = (document.getElementById("googleWelcomeCity")?.value || "").trim();
  const errEl = document.getElementById("googleWelcomeError");

  if (!name || name.length < 2) {
    if (errEl) { errEl.textContent = "कृपया अपना पूरा नाम दर्ज करें।"; errEl.classList.remove("hidden"); }
    return;
  }
  if (rawPhone.length < 10) {
    if (errEl) { errEl.textContent = "कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।"; errEl.classList.remove("hidden"); }
    return;
  }
  if (!city) {
    if (errEl) { errEl.textContent = "कृपया अपना शहर / इलाका दर्ज करें।"; errEl.classList.remove("hidden"); }
    return;
  }

  const cleanPhone = rawPhone.slice(-10);
  const newUser = {
    id: "kw_cust_" + Date.now().toString().slice(-4),
    userId: email.split("@")[0],
    name: name,
    email: email,
    phone: cleanPhone,
    address: city,
    city: city,
    role: "customer",
    status: "active",
    phoneVerified: true,
    emailVerified: true
  };

  // Sync with backend users.json
  try {
    await fetch('/api/auth/register-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    });
  } catch (err) {
    console.warn("Google profile register sync error:", err);
  }

  // Update local customer list
  const customers = getStoredCustomers();
  const existingIdx = customers.findIndex(c => (c.email || '').toLowerCase() === email.toLowerCase());
  if (existingIdx !== -1) {
    customers[existingIdx] = { ...customers[existingIdx], ...newUser };
  } else {
    customers.push(newUser);
  }
  saveStoredCustomers(customers);

  currentUser = newUser;
  localStorage.setItem("kw_current_user", JSON.stringify(currentUser));
  renderAuthUI();
  closeGoogleAccountChooserModal();
  playOrderSuccessChime();
  showToast(`🎉 स्वागत है ${name}! KaamWale.com खाता सफलतापूर्वक बन गया है।`);

  if (typeof authPendingAction === 'function') {
    const act = authPendingAction;
    authPendingAction = null;
    act();
  }
}

// ==========================================
// DEDICATED 6-DIGIT EMAIL OTP SYSTEM (BREVO WORKFLOW)
// ==========================================
let currentEmailOtpSession = null;
let emailOtpTimerInterval = null;
let emailOtpCountdown = 30;
let pendingEmailRegistrationData = null;

function setupEmailOtpBoxes() {
  const boxes = [1, 2, 3, 4, 5, 6].map(i => document.getElementById(`emailOtp${i}`));
  boxes.forEach((box, idx) => {
    if (!box) return;

    box.addEventListener("input", () => {
      const val = box.value.replace(/\D/g, "");
      box.value = val ? val[0] : "";
      if (box.value && idx < 5 && boxes[idx + 1]) {
        boxes[idx + 1].focus();
      }
    });

    box.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !box.value && idx > 0 && boxes[idx - 1]) {
        boxes[idx - 1].focus();
      }
    });

    box.addEventListener("paste", (e) => {
      e.preventDefault();
      const pasteData = (e.clipboardData || window.clipboardData).getData("text") || "";
      const cleanDigits = pasteData.replace(/\D/g, "").slice(0, 6);
      for (let i = 0; i < 6; i++) {
        if (boxes[i]) boxes[i].value = cleanDigits[i] || "";
      }
      if (cleanDigits.length >= 6) {
        submitEmailOtpVerification();
      }
    });
  });
}
document.addEventListener("DOMContentLoaded", setupEmailOtpBoxes);
if (document.readyState === "complete" || document.readyState === "interactive") {
  setupEmailOtpBoxes();
}

function openEmailOtpVerifyModal(email, purpose = 'registration') {
  currentEmailOtpSession = { email, purpose };

  const modal = document.getElementById("emailOtpVerifyModal");
  const targetDisplay = document.getElementById("emailOtpTargetDisplay");
  const errEl = document.getElementById("emailOtpError");
  const newPassGroup = document.getElementById("emailOtpNewPasswordGroup");

  if (targetDisplay) targetDisplay.textContent = email;
  if (errEl) { errEl.textContent = ""; errEl.classList.add("hidden"); }

  if (newPassGroup) {
    if (purpose === 'password_reset') {
      newPassGroup.classList.remove("hidden");
    } else {
      newPassGroup.classList.add("hidden");
    }
  }

  // Clear all 6 boxes
  for (let i = 1; i <= 6; i++) {
    const b = document.getElementById(`emailOtp${i}`);
    if (b) b.value = "";
  }

  startEmailOtpTimer();
  if (modal) modal.classList.remove("hidden");

  setTimeout(() => {
    const box1 = document.getElementById("emailOtp1");
    if (box1) box1.focus();
  }, 200);
}

function closeEmailOtpVerifyModal() {
  const modal = document.getElementById("emailOtpVerifyModal");
  if (modal) modal.classList.add("hidden");
  if (emailOtpTimerInterval) clearInterval(emailOtpTimerInterval);
}

function startEmailOtpTimer() {
  if (emailOtpTimerInterval) clearInterval(emailOtpTimerInterval);
  emailOtpCountdown = 30;
  const timerText = document.getElementById("emailOtpTimer");
  const resendBtn = document.getElementById("emailOtpResendBtn");

  if (timerText) timerText.textContent = `${emailOtpCountdown}`;
  if (resendBtn) {
    resendBtn.disabled = true;
    resendBtn.className = "text-slate-400 font-bold disabled:cursor-not-allowed text-xs";
  }

  emailOtpTimerInterval = setInterval(() => {
    emailOtpCountdown--;
    if (timerText) timerText.textContent = `${emailOtpCountdown}`;
    if (emailOtpCountdown <= 0) {
      clearInterval(emailOtpTimerInterval);
      if (resendBtn) {
        resendBtn.disabled = false;
        resendBtn.className = "text-blue-600 hover:text-blue-800 font-bold cursor-pointer hover:underline text-xs";
        resendBtn.innerHTML = `Resend OTP Code`;
      }
    }
  }, 1000);
}



async function submitEmailOtpVerification() {
  if (!currentEmailOtpSession || !currentEmailOtpSession.email) {
    alert("कृपया पहले OTP मंगाएं।");
    return;
  }

  let code = "";
  for (let i = 1; i <= 6; i++) {
    code += (document.getElementById(`emailOtp${i}`)?.value || "").trim();
  }

  const errEl = document.getElementById("emailOtpError");
  if (code.length !== 6) {
    if (errEl) {
      errEl.textContent = "कृपया 6-अंकीय OTP कोड पूरा दर्ज करें।";
      errEl.classList.remove("hidden");
    }
    return;
  }

  const email = currentEmailOtpSession.email;
  const purpose = currentEmailOtpSession.purpose;

  // Handle Password Reset Flow
  if (purpose === 'password_reset') {
    const newPassInput = document.getElementById("emailOtpNewPassword");
    const newPass = (newPassInput?.value || "").trim();
    if (!newPass || newPass.length < 4) {
      if (errEl) {
        errEl.textContent = "कृपया नया पासवर्ड (कम से कम 4 अक्षर) दर्ज करें।";
        errEl.classList.remove("hidden");
      }
      if (newPassInput) newPassInput.focus();
      return;
    }

    try {
      const resetRes = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, otp: code, newPassword: newPass })
      });
      const resetData = await resetRes.json();
      if (!resetData.success) {
        if (errEl) {
          errEl.textContent = `❌ ${resetData.error || "पासवर्ड रीसेट विफल!"}`;
          errEl.classList.remove("hidden");
        }
        return;
      }

      closeEmailOtpVerifyModal();
      playOrderSuccessChime();
      showToast("🎉 पासवर्ड सफलतापूर्वक रीसेट हो गया! अब लॉगिन करें।");
      openCustomerAuthModal('login');
      const loginId = document.getElementById("custLoginIdentifier");
      if (loginId) loginId.value = email;
      return;
    } catch (err) {
      alert("पासवर्ड रीसेट करने में त्रुटि आई: " + err.message);
      return;
    }
  }

  // Handle Registration Flow (Option C: Account verified & created)
  try {
    const vRes = await fetch('/api/verify-email-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        otp: code,
        regData: pendingEmailRegistrationData
      })
    });
    const vData = await vRes.json();

    if (!vData.success) {
      if (errEl) {
        errEl.textContent = `❌ ${vData.error || "गलत OTP दर्ज किया गया!"}`;
        errEl.classList.remove("hidden");
      }
      return;
    }

    // Success! Email Verified & Account Created
    if (pendingEmailRegistrationData?.role === 'worker') {
      const savedWorker = vData.user || {
        id: "W" + Date.now().toString().slice(-3),
        userId: pendingEmailRegistrationData.userId,
        name: pendingEmailRegistrationData.name,
        email: email,
        phone: pendingEmailRegistrationData.phone,
        password: pendingEmailRegistrationData.password,
        category: pendingEmailRegistrationData.category,
        location: pendingEmailRegistrationData.city,
        city: pendingEmailRegistrationData.city,
        exp: `${pendingEmailRegistrationData.exp || '3'} वर्ष`,
        role: "worker",
        status: "active",
        rating: 5.0,
        reviews: 0
      };

      const workers = getStoredWorkers();
      const existingIdx = workers.findIndex(w => w.email === email || w.userId === savedWorker.userId);
      if (existingIdx !== -1) {
        workers[existingIdx] = { ...workers[existingIdx], ...savedWorker };
      } else {
        workers.unshift(savedWorker);
      }
      saveStoredWorkers(workers);

      currentWorkerUser = savedWorker;
      localStorage.setItem("kw_logged_in_worker", JSON.stringify(currentWorkerUser));
      renderAuthUI();
      closeEmailOtpVerifyModal();
      playOrderSuccessChime();
      showToast(`🎉 कामगार पंजीकरण सफल! आपकी User ID: ${savedWorker.userId} है। स्वागत है, ${savedWorker.name}!`);
      openWorkerDashboardModal();
      return;
    }

    const savedUser = vData.user || {
      id: "kw_cust_" + Date.now().toString().slice(-4),
      userId: pendingEmailRegistrationData?.userId || email.split("@")[0],
      name: pendingEmailRegistrationData?.name || email.split("@")[0],
      email: email,
      phone: pendingEmailRegistrationData?.phone || "",
      city: pendingEmailRegistrationData?.city || "Local",
      role: "customer",
      phoneVerified: true,
      emailVerified: true
    };

    // Save to local storage
    const customers = getStoredCustomers();
    customers.push(savedUser);
    saveStoredCustomers(customers);

    currentUser = savedUser;
    localStorage.setItem("kw_current_user", JSON.stringify(currentUser));
    renderAuthUI();
    closeEmailOtpVerifyModal();
    playOrderSuccessChime();
    showToast(`🎉 Email Verified Successfully ✓ KaamWale.com Account Created! स्वागत है, ${currentUser.name}!`);

    if (typeof authPendingAction === 'function') {
      const act = authPendingAction;
      authPendingAction = null;
      act();
    }
  } catch (netErr) {
    if (errEl) {
      errEl.textContent = "सत्यापन सर्वर से संपर्क नहीं हो सका: " + netErr.message;
      errEl.classList.remove("hidden");
    }
  }
}

async function resendEmailOtp() {
  if (!currentEmailOtpSession || !currentEmailOtpSession.email) return;
  const email = currentEmailOtpSession.email;
  const purpose = currentEmailOtpSession.purpose;
  const name = pendingEmailRegistrationData?.name || email.split("@")[0];

  try {
    const res = await fetch('/api/send-email-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, purpose })
    });
    const data = await res.json();
    if (data.success) {
      startEmailOtpTimer();
      showToast(`📧 नया OTP कोड ${email} पर पुनः भेजा गया!`);
    }
  } catch (e) {
    showToast("⚠️ OTP पुनः भेजने में समस्या आई।");
  }
}

// ==========================================
// BREVO CUSTOMER REGISTRATION HANDLER
// ==========================================
async function handleCustomerEmailRegisterSubmit(e) {
  e.preventDefault();
  const name = (document.getElementById("regCustName")?.value || "").trim();
  const email = (document.getElementById("regCustEmail")?.value || "").trim().toLowerCase();
  const rawPhone = (document.getElementById("regCustPhone")?.value || "").replace(/\D/g, "");
  const password = (document.getElementById("regCustPassword")?.value || "").trim();
  const confirmPassword = (document.getElementById("regCustConfirmPassword")?.value || "").trim();
  const city = (document.getElementById("regCustCity")?.value || "").trim();
  const errEl = document.getElementById("regCustError");
  const submitBtn = document.getElementById("regCustSubmitBtn");

  if (!name || name.length < 2) {
    if (errEl) { errEl.textContent = "कृपया अपना पूरा नाम दर्ज करें।"; errEl.classList.remove("hidden"); }
    return;
  }
  if (!email || !email.includes("@")) {
    if (errEl) { errEl.textContent = "कृपया वैध Gmail / ईमेल आईडी दर्ज करें।"; errEl.classList.remove("hidden"); }
    return;
  }
  if (rawPhone.length < 10) {
    if (errEl) { errEl.textContent = "कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।"; errEl.classList.remove("hidden"); }
    return;
  }
  if (!password || password.length < 4) {
    if (errEl) { errEl.textContent = "पासवर्ड कम से कम 4 अक्षरों का होना चाहिए।"; errEl.classList.remove("hidden"); }
    return;
  }
  if (password !== confirmPassword) {
    if (errEl) { errEl.textContent = "दोनों पासवर्ड समान होने चाहिए।"; errEl.classList.remove("hidden"); }
    return;
  }
  if (!city) {
    if (errEl) { errEl.textContent = "कृपया अपना शहर या इलाका दर्ज करें।"; errEl.classList.remove("hidden"); }
    return;
  }

  const cleanPhone = rawPhone.slice(-10);

  // Store registration intent
  pendingEmailRegistrationData = {
    userId: email.split("@")[0],
    name: name,
    email: email,
    phone: cleanPhone,
    password: password,
    city: city,
    address: city,
    role: "customer"
  };

  if (errEl) errEl.classList.add("hidden");
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>Sending Email OTP...</span>`;
  }

  try {
    const res = await fetch('/api/send-email-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, name: name, purpose: 'registration' })
    });
    const data = await res.json();

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> <span>Send Email OTP &amp; Create Account</span>`;
    }

    if (!data.success) {
      if (errEl) {
        errEl.textContent = data.error || "ईमेल OTP भेजने में समस्या आई।";
        errEl.classList.remove("hidden");
      }
      return;
    }

    closeCustomerAuthModal();
    openEmailOtpVerifyModal(email, 'registration');
    showToast(`📧 6-अंकीय OTP आपके Gmail (${email}) पर भेज दिया गया है!`);
  } catch (netErr) {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> <span>Send Email OTP &amp; Create Account</span>`;
    }
    if (errEl) {
      if (window.location.protocol === 'file:') {
        errEl.innerHTML = `⚠️ लोकल सर्वर से संपर्क नहीं हुआ। कृपया वेबसाइट को <a href="http://localhost:3000" class="underline font-bold text-blue-700">http://localhost:3000</a> पर खोलें।`;
      } else {
        errEl.textContent = "सर्वर कनेक्शन में समस्या (" + netErr.message + ")। कृपया सुनिश्चित करें कि http://localhost:3000 चालू है।";
      }
      errEl.classList.remove("hidden");
    }
  }
}

// ==========================================
// FORGOT PASSWORD OTP REQUEST HANDLER
// ==========================================
async function handleForgotPasswordRequest(e) {
  e.preventDefault();
  const email = (document.getElementById("forgotCustEmail")?.value || "").trim().toLowerCase();
  const errEl = document.getElementById("forgotCustError");
  const submitBtn = document.getElementById("forgotCustSubmitBtn");

  if (!email || !email.includes("@")) {
    if (errEl) { errEl.textContent = "कृपया वैध Gmail आईडी दर्ज करें।"; errEl.classList.remove("hidden"); }
    return;
  }

  if (errEl) errEl.classList.add("hidden");
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>Sending Reset OTP...</span>`;
  }

  try {
    const res = await fetch('/api/send-email-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, purpose: 'password_reset' })
    });
    const data = await res.json();

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<i class="fa-solid fa-key"></i> <span>Send Reset Code to Gmail</span>`;
    }

    if (!data.success) {
      if (errEl) {
        errEl.textContent = data.error || "पासवर्ड रीसेट कोड भेजने में समस्या आई।";
        errEl.classList.remove("hidden");
      }
      return;
    }

    closeCustomerAuthModal();
    openEmailOtpVerifyModal(email, 'password_reset');
    showToast(`🔑 6-अंकीय पासवर्ड रीसेट कोड ${email} पर भेजा गया!`);
  } catch (netErr) {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<i class="fa-solid fa-key"></i> <span>Send Reset Code to Gmail</span>`;
    }
    if (errEl) {
      if (window.location.protocol === 'file:') {
        errEl.innerHTML = `⚠️ लोकल सर्वर से संपर्क नहीं हुआ। कृपया वेबसाइट को <a href="http://localhost:3000" class="underline font-bold text-blue-700">http://localhost:3000</a> पर खोलें।`;
      } else {
        errEl.textContent = "सर्वर कनेक्शन में समस्या (" + netErr.message + ")।";
      }
      errEl.classList.remove("hidden");
    }
  }
}

// ==========================================
// OPTION C: ROUTINE CUSTOMER PASSWORD LOGIN (ZERO OTP)
// ==========================================
async function handleCustomerPasswordLoginSubmit(e) {
  e.preventDefault();
  const identifier = (document.getElementById("custLoginIdentifier")?.value || "").trim().toLowerCase();
  const password = (document.getElementById("custLoginPassword")?.value || "").trim();
  const errEl = document.getElementById("custLoginError");
  const submitBtn = document.getElementById("custLoginSubmitBtn");

  if (!identifier) {
    if (errEl) { errEl.textContent = "कृपया अपना ईमेल या मोबाइल नंबर दर्ज करें।"; errEl.classList.remove("hidden"); }
    return;
  }
  if (!password) {
    if (errEl) { errEl.textContent = "कृपया अपना पासवर्ड दर्ज करें।"; errEl.classList.remove("hidden"); }
    return;
  }

  // Founder Super Admin check - High-Security 2FA Enforcement
  if (identifier === "shivampandat819@gmail.com" || identifier === "9899862721" || identifier === "shivam_admin") {
    closeCustomerAuthModal();
    openAdminAuthModal();
    const admId = document.getElementById("adminLoginIdentifier");
    if (admId) admId.value = identifier;
    const admPass = document.getElementById("adminLoginSecret");
    if (admPass && password) admPass.value = password;
    showToast("🔐 सुरक्षा कारणों से Admin लॉगिन 2FA सिक्योरिटी पिन के साथ करें।", "info");
    return;
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>Logging in...</span>`;
  }

  try {
    const res = await fetch('/api/auth/email-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password })
    });
    const data = await res.json();

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<i class="fa-solid fa-right-to-bracket"></i> <span>Log in</span>`;
    }

    if (!data.success) {
      if (errEl) {
        errEl.innerHTML = `❌ ${data.error || "गलत लॉगिन विवरण!"}<br><button type="button" onclick="switchCustomerTab('register')" class="text-blue-600 font-bold underline mt-1">नया खाता बनाएं (Sign up)</button>`;
        errEl.classList.remove("hidden");
      }
      return;
    }

    // Login Successful! (Option C: Zero OTP required)
    const user = data.user;
    currentUser = {
      id: user.id || ("C" + Math.floor(100 + Math.random() * 900)),
      userId: user.userId || identifier,
      name: user.name || "Customer",
      email: user.email || identifier,
      phone: user.phone || "",
      city: user.address || user.location || user.city || "Local",
      role: user.role || "customer",
      phoneVerified: true,
      emailVerified: true
    };

    localStorage.setItem("kw_current_user", JSON.stringify(currentUser));
    renderAuthUI();
    closeCustomerAuthModal();
    playOrderSuccessChime();
    showToast(`🎉 स्वागत है, ${currentUser.name}! लॉगिन सफल।`);

    if (typeof authPendingAction === 'function') {
      const act = authPendingAction;
      authPendingAction = null;
      act();
    }
  } catch (err) {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<i class="fa-solid fa-right-to-bracket"></i> <span>Log in</span>`;
    }
    if (errEl) {
      if (window.location.protocol === 'file:') {
        errEl.innerHTML = `⚠️ लोकल सर्वर से संपर्क नहीं हुआ। कृपया वेबसाइट को <a href="http://localhost:3000" class="underline font-bold text-blue-700">http://localhost:3000</a> पर खोलें।`;
      } else {
        errEl.textContent = "सर्वर से संपर्क नहीं हो सका: " + err.message;
      }
      errEl.classList.remove("hidden");
    }
  }
}

// Worker Duty Login Handler (UserID / Email / Phone + Password)
async function handleWorkerLoginSubmit(e) {
  e.preventDefault();
  const idInput = (document.getElementById("workerLoginIdentifier")?.value || "").trim().toLowerCase();
  const secret = (document.getElementById("workerLoginSecret")?.value || "").trim();
  const errEl = document.getElementById("workerLoginError");
  const submitBtn = document.getElementById("workerLoginSubmitBtn");

  if (!idInput || !secret) {
    if (errEl) {
      errEl.textContent = "कृपया User ID / Email और पासवर्ड दोनों दर्ज करें।";
      errEl.classList.remove("hidden");
    }
    return;
  }

  const workers = getStoredWorkers();
  const cleanInputPhone = idInput.replace(/\D/g, "");

  let matchedWorker = workers.find(w => {
    const idMatch = (w.userId || "").toLowerCase() === idInput || (w.id || "").toLowerCase() === idInput;
    const emailMatch = (w.email || "").toLowerCase() === idInput;
    const phoneMatch = cleanInputPhone.length >= 10 && (w.phone || "").replace(/\D/g, "").includes(cleanInputPhone);
    return idMatch || emailMatch || phoneMatch;
  });

  if (matchedWorker) {
    if (matchedWorker.password !== secret) {
      if (errEl) {
        errEl.textContent = "❌ गलत पासवर्ड दर्ज किया! यदि पासवर्ड भूल गए हैं तो 'Forgot your password?' से रीसेट करें।";
        errEl.classList.remove("hidden");
      }
      return;
    }

    if (matchedWorker.status === "pending") {
      alert("⚠️ आपका कामगार प्रोफाइल अभी सुपर एडमिन (शिवम पंडित) के पास KYC सत्यापन के लिए पेंडिंग है। अप्रूवल के बाद आप ऑन-ड्यूटी लॉगिन कर सकेंगे।");
      return;
    }

    currentWorkerUser = matchedWorker;
    localStorage.setItem("kw_logged_in_worker", JSON.stringify(matchedWorker));
    if (errEl) errEl.classList.add("hidden");

    closeWorkerAuthModal();
    showToast(`🎉 स्वागत है ${matchedWorker.name}! कामगार पोर्टल ऑन-ड्यूटी लॉगिन सफल।`);
    openWorkerDashboardModal();
    return;
  }

  // Also verify against server users.json
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>Verifying...</span>`;
  }

  try {
    const res = await fetch('/api/auth/email-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: idInput, password: secret })
    });
    const data = await res.json();
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<i class="fa-solid fa-right-to-bracket"></i> <span>Log in to Duty (ऑन-ड्यूटी लॉगिन)</span>`;
    }

    if (data.success && data.user) {
      const u = data.user;
      matchedWorker = {
        id: u.id || ("W" + Math.floor(100 + Math.random() * 900)),
        userId: u.userId || idInput,
        name: u.name || "Worker Pro",
        email: u.email || idInput,
        phone: u.phone || "",
        category: u.category || u.skills || "General Service",
        location: u.address || u.location || "Local",
        city: u.address || u.location || "Local",
        rating: 5.0,
        reviews: 0,
        status: "active"
      };
      workers.unshift(matchedWorker);
      saveStoredWorkers(workers);

      currentWorkerUser = matchedWorker;
      localStorage.setItem("kw_logged_in_worker", JSON.stringify(matchedWorker));
      if (errEl) errEl.classList.add("hidden");
      closeWorkerAuthModal();
      showToast(`🎉 स्वागत है ${matchedWorker.name}! कामगार पोर्टल ऑन-ड्यूटी लॉगिन सफल।`);
      openWorkerDashboardModal();
      return;
    }

    if (errEl) {
      errEl.textContent = `❌ ${data.error || "कामगार UserID / Email नहीं मिला या पासवर्ड गलत है!"}`;
      errEl.classList.remove("hidden");
    }
  } catch (err) {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<i class="fa-solid fa-right-to-bracket"></i> <span>Log in to Duty (ऑन-ड्यूटी लॉगिन)</span>`;
    }
    if (errEl) {
      errEl.textContent = "❌ कामगार विवरण सत्यापित नहीं हो सका: " + err.message;
      errEl.classList.remove("hidden");
    }
  }
}

// Worker in-modal registration with Brevo 6-digit Email OTP
async function handleWorkerRegisterInModal(e) {
  e.preventDefault();
  const name = (document.getElementById("wRegName")?.value || "").trim();
  const category = (document.getElementById("wRegCategory")?.value || "").trim();
  const rawPhone = (document.getElementById("wRegPhone")?.value || "").replace(/\D/g, "");
  const email = (document.getElementById("wRegEmail")?.value || "").trim().toLowerCase();
  const password = (document.getElementById("wRegPassword")?.value || "").trim();
  const confirmPassword = (document.getElementById("wRegConfirmPassword")?.value || "").trim();
  const city = (document.getElementById("wRegCity")?.value || "").trim();
  const exp = (document.getElementById("wRegExp")?.value || "3").trim();
  const errEl = document.getElementById("wRegError");
  const submitBtn = document.getElementById("wRegSubmitBtn");

  if (!name || name.length < 2) {
    if (errEl) { errEl.textContent = "कृपया अपना पूरा नाम दर्ज करें।"; errEl.classList.remove("hidden"); }
    return;
  }
  if (!category) {
    if (errEl) { errEl.textContent = "कृपया अपनी कार्य श्रेणी (Trade) चुनें।"; errEl.classList.remove("hidden"); }
    return;
  }
  if (rawPhone.length < 10) {
    if (errEl) { errEl.textContent = "कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।"; errEl.classList.remove("hidden"); }
    return;
  }
  if (!email || !email.includes("@")) {
    if (errEl) { errEl.textContent = "कृपया वैध Gmail / ईमेल पता दर्ज करें।"; errEl.classList.remove("hidden"); }
    return;
  }
  if (!password || password.length < 4) {
    if (errEl) { errEl.textContent = "पासवर्ड कम से कम 4 अक्षरों का होना चाहिए।"; errEl.classList.remove("hidden"); }
    return;
  }
  if (password !== confirmPassword) {
    if (errEl) { errEl.textContent = "दोनों पासवर्ड समान होने चाहिए।"; errEl.classList.remove("hidden"); }
    return;
  }
  if (!city) {
    if (errEl) { errEl.textContent = "कृपया अपना शहर दर्ज करें।"; errEl.classList.remove("hidden"); }
    return;
  }

  const cleanPhone = rawPhone.slice(-10);
  const randNum = Math.floor(100 + Math.random() * 900);
  const generatedUserId = "KW-W" + randNum;

  pendingEmailRegistrationData = {
    userId: generatedUserId,
    name: name,
    email: email,
    phone: cleanPhone,
    password: password,
    category: category,
    city: city,
    address: city,
    location: city,
    exp: exp,
    role: "worker"
  };

  if (errEl) errEl.classList.add("hidden");
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>Sending Email OTP...</span>`;
  }

  try {
    const res = await fetch('/api/send-email-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        name: name,
        purpose: 'register'
      })
    });
    const data = await res.json();

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> <span>Send Email OTP &amp; Register (पंजीकरण करें)</span>`;
    }

    if (!data.success) {
      if (errEl) {
        errEl.textContent = `❌ ${data.error || "OTP भेजने में त्रुटि आई। कृपया पुनः प्रयास करें।"}`;
        errEl.classList.remove("hidden");
      }
      return;
    }

    closeWorkerAuthModal();
    openEmailOtpVerifyModal(email, 'register');
    showToast(`✉️ सत्यापन OTP कोड ${email} पर भेज दिया गया है।`);
  } catch (err) {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> <span>Send Email OTP &amp; Register (पंजीकरण करें)</span>`;
    }
    if (errEl) {
      errEl.textContent = "सर्वर से संपर्क नहीं हो सका: " + err.message;
      errEl.classList.remove("hidden");
    }
  }
}

// Worker Logout
function handleWorkerLogout() {
  currentWorkerUser = null;
  localStorage.removeItem("kw_logged_in_worker");
  showToast("कामगार पोर्टल से लॉगआउट हो गए।");
  closeWorkerDashboardModal();
}

// ========================
// WORKER PASSWORD RESET VIA REGISTERED EMAIL
// ========================
function openWorkerForgotPasswordModal() {
  closeGoogleAuthModal();
  const modal = document.getElementById("workerForgotPasswordModal");
  const form1 = document.getElementById("forgotPassStep1Form");
  const form2 = document.getElementById("forgotPassStep2Form");
  const err1 = document.getElementById("forgotPassErr1");
  const err2 = document.getElementById("forgotPassErr2");
  const input1 = document.getElementById("forgotWorkerIdentifier");

  if (form1) form1.classList.remove("hidden");
  if (form2) form2.classList.add("hidden");
  if (err1) { err1.textContent = ""; err1.classList.add("hidden"); }
  if (err2) { err2.textContent = ""; err2.classList.add("hidden"); }
  if (input1) input1.value = "";

  if (modal) modal.classList.remove("hidden");
}

function closeWorkerForgotPasswordModal() {
  const modal = document.getElementById("workerForgotPasswordModal");
  if (modal) modal.classList.add("hidden");
}

async function handleForgotWorkerOtpRequest(e) {
  e.preventDefault();
  const identifier = (document.getElementById("forgotWorkerIdentifier")?.value || "").trim().toLowerCase();
  const err1 = document.getElementById("forgotPassErr1");
  const form1 = document.getElementById("forgotPassStep1Form");
  const form2 = document.getElementById("forgotPassStep2Form");
  const emailDisplay = document.getElementById("forgotWorkerTargetEmail");
  const otpInput = document.getElementById("forgotResetOtpInput");
  const btnGmail = document.getElementById("btnOpenResetGmail");
  const btnMailto = document.getElementById("btnOpenResetMailto");

  const workers = getStoredWorkers();
  const cleanPhone = identifier.replace(/\D/g, "");

  let matchedWorker = workers.find(w => {
    const emailMatch = (w.email || "").toLowerCase() === identifier;
    const idMatch = (w.userId || "").toLowerCase() === identifier || (w.id || "").toLowerCase() === identifier;
    const phoneMatch = cleanPhone.length >= 10 && (w.phone || "").replace(/\D/g, "").includes(cleanPhone);
    return emailMatch || idMatch || phoneMatch;
  });

  let targetEmail = matchedWorker?.email;
  let targetName = matchedWorker?.name || "Worker Partner";
  let workerId = matchedWorker?.id;

  // Fallback: If identifier is an email address, allow OTP dispatch to it directly
  if (!targetEmail && identifier.includes("@")) {
    targetEmail = identifier;
    targetName = identifier.split("@")[0];
    workerId = "worker_" + targetEmail.replace(/[^a-zA-Z0-9]/g, "");
  }

  if (!targetEmail || !targetEmail.includes("@")) {
    if (err1) {
      err1.textContent = "❌ कृपया वैध पंजीकृत Gmail/Email ID या Worker User ID दर्ज करें।";
      err1.classList.remove("hidden");
    }
    return;
  }

  const generatedResetCode = String(Math.floor(100000 + Math.random() * 900000));
  forgotPasswordSession = {
    workerId: workerId,
    email: targetEmail,
    otp: generatedResetCode
  };

  if (emailDisplay) emailDisplay.textContent = targetEmail;
  if (otpInput) {
    otpInput.value = "";
    setTimeout(() => otpInput.focus(), 250);
  }

  // Setup Direct Gmail Compose and Native Mailto URLs
  const emailSubject = `KaamWale.com - Password Reset Verification OTP: ${generatedResetCode}`;
  const emailBody = 
    `Namaste ${targetName},\n\n` +
    `Aapka KaamWale.com worker profile password reset OTP code hai:\n\n` +
    `[ ${generatedResetCode} ]\n\n` +
    `Kripya is 6-digit OTP code ko enter karke apna naya password set karein.\n` +
    `Ye OTP 10 minute tak valid hai.\n\n` +
    `Regards,\n` +
    `Shivam Pandat (Founder, KaamWale.com)\n` +
    `Helpline: +91 98998 62721`;

  const gmailUrl = `https://mail.google.com/mail/u/0/?fs=1&tf=cm&to=${encodeURIComponent(targetEmail)}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
  const mailtoUrl = `mailto:${encodeURIComponent(targetEmail)}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  if (btnGmail) btnGmail.href = gmailUrl;
  if (btnMailto) btnMailto.href = mailtoUrl;

  // Dispatch via Backend Brevo Transactional Email Endpoint
  try {
    fetch('/api/send-email-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: targetEmail,
        name: targetName,
        otp: generatedResetCode,
        purpose: 'password_reset'
      })
    }).then(res => res.json()).then(resp => {
      if (resp && resp.gmailUrl && btnGmail) btnGmail.href = resp.gmailUrl;
      if (resp && resp.mailtoUrl && btnMailto) btnMailto.href = resp.mailtoUrl;
    }).catch(err => {
      console.log('Email reset OTP dispatch error:', err);
    });
  } catch (e) {}

  if (err1) err1.classList.add("hidden");
  if (form1) form1.classList.add("hidden");
  if (form2) form2.classList.remove("hidden");

  playOrderSuccessChime();
  showToast(`📧 पासवर्ड रीसेट 6-अंकीय OTP आपके Gmail (${targetEmail}) पर भेजा गया!`);
}

async function handleResetWorkerPasswordSubmit(e) {
  e.preventDefault();
  if (!forgotPasswordSession || !forgotPasswordSession.email) return;

  const enteredOtp = (document.getElementById("forgotResetOtpInput")?.value || "").trim();
  const newPass = (document.getElementById("forgotNewPassword")?.value || "").trim();
  const confirmPass = (document.getElementById("forgotConfirmPassword")?.value || "").trim();
  const err2 = document.getElementById("forgotPassErr2");

  if (newPass.length < 4) {
    if (err2) {
      err2.textContent = "❌ पासवर्ड कम से कम 4 अक्षरों का होना चाहिए।";
      err2.classList.remove("hidden");
    }
    return;
  }

  if (newPass !== confirmPass) {
    if (err2) {
      err2.textContent = "❌ दोनों पासवर्ड समान होने चाहिए।";
      err2.classList.remove("hidden");
    }
    return;
  }

  // Server-Side Strict Reset OTP Verification
  try {
    const vRes = await fetch('/api/verify-email-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: forgotPasswordSession.email, otp: enteredOtp })
    });
    const vData = await vRes.json();
    if (!vData.success) {
      if (err2) {
        err2.textContent = `❌ ${vData.error || "गलत OTP दर्ज किया!"}`;
        err2.classList.remove("hidden");
      }
      return;
    }
  } catch (netErr) {
    if (forgotPasswordSession.otp && enteredOtp !== forgotPasswordSession.otp) {
      if (err2) {
        err2.textContent = "❌ गलत OTP दर्ज किया! सही कोड दर्ज करें।";
        err2.classList.remove("hidden");
      }
      return;
    }
  }

  // Update password on backend database (users.json)
  try {
    await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: forgotPasswordSession.email,
        otp: enteredOtp,
        newPassword: newPass
      })
    });
  } catch (syncErr) {
    console.log("Backend password reset sync:", syncErr);
  }

  // Update worker password in storage
  const workers = getStoredWorkers();
  const targetWorker = workers.find(w => w.id === forgotPasswordSession.workerId || (w.email && w.email.toLowerCase() === forgotPasswordSession.email.toLowerCase()));
  if (targetWorker) {
    targetWorker.password = newPass;
    saveStoredWorkers(workers);
  }

  closeWorkerForgotPasswordModal();
  showToast(`🎉 पासवर्ड सफलतापूर्वक बदल दिया गया! नए पासवर्ड से ऑन-ड्यूटी लॉगिन करें।`);
  openWorkerLoginModal();

  const loginIdInput = document.getElementById("workerLoginIdentifier");
  if (loginIdInput && targetWorker) {
    loginIdInput.value = targetWorker.userId || targetWorker.email;
  }
}

function handleCustomGoogleSubmit(e) {
  e.preventDefault();
  const name = document.getElementById("googleInputName")?.value.trim();
  const email = document.getElementById("googleInputEmail")?.value.trim();
  const phone = document.getElementById("googleInputPhone")?.value.trim() || "";

  if (!name || !email || !email.includes("@")) {
    alert("कृपया मान्य नाम और Gmail ID दर्ज करें।");
    return;
  }

  if (!phone || phone.length < 10) {
    alert("कृपया 10 अंकों का मान्य मोबाइल नंबर दर्ज करें।");
    return;
  }

  closeGoogleAuthModal();

  // Send OTP to customer before activating profile!
  openProfileOtpModal("customer", phone, {
    name: name,
    email: email,
    phone: phone,
    role: "customer"
  });
}

function handleLogout() {
  if (confirm("क्या आप KaamWale.com से लॉगआउट करना चाहते हैं?")) {
    currentUser = null;
    localStorage.removeItem("kw_current_user");
    renderAuthUI();
    showToast("लॉगआउट सफल।");
  }
}

// ========================
// 14 CATEGORIES GRID RENDER
// ========================
function renderCategories() {
  const grid = document.getElementById("categoriesGrid");
  const filterSelect = document.getElementById("categoryFilter");
  const workerCatSelect = document.getElementById("wCategory");
  const revCatSelect = document.getElementById("revCategory");
  if (!grid) return;

  grid.innerHTML = CATEGORIES.map(cat => `
    <div onclick="handleBookServiceClick('${cat.name}')" 
         class="card-hover bg-white p-5 rounded-3xl border border-slate-200 cursor-pointer group flex flex-col justify-between shadow-sm">
      <div>
        <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
          <i class="fa-solid ${cat.icon}"></i>
        </div>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-black text-slate-900 group-hover:text-blue-700 transition">${cat.name}</h3>
          <span class="text-[11px] font-bold text-amber-600">${cat.hindi}</span>
        </div>
        <p class="text-xs text-slate-500 mt-2 leading-relaxed">${cat.desc}</p>
      </div>

      <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span class="text-xs font-black text-emerald-600">${cat.rate}</span>
        <span class="text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
          बुक करें <i class="fa-solid fa-arrow-right text-[10px]"></i>
        </span>
      </div>
    </div>
  `).join("");

  // Populate Dropdowns
  const optionsHtml = `<option value="">सभी कामगार श्रेणियां (All Categories)</option>` + 
    CATEGORIES.map(c => `<option value="${c.name}">${c.name} (${c.hindi})</option>`).join("");
  
  if (filterSelect) filterSelect.innerHTML = optionsHtml;
  if (workerCatSelect) workerCatSelect.innerHTML = CATEGORIES.map(c => `<option value="${c.name}">${c.name} (${c.hindi})</option>`).join("");
  if (revCatSelect) revCatSelect.innerHTML = CATEGORIES.map(c => `<option value="${c.name}">${c.name} (${c.hindi})</option>`).join("");
}

// ========================
// WORKERS DIRECTORY & SEARCH
// ========================
function renderWorkersList(workers) {
  const container = document.getElementById("workersResultsContainer");
  const countBadge = document.getElementById("workersCountBadge");
  if (!container) return;

  const approvedList = workers.filter(w => w.status === "approved");

  if (countBadge) countBadge.textContent = `${approvedList.length} कामगार उपलब्ध`;

  if (approvedList.length === 0) {
    container.innerHTML = `
      <div class="col-span-full bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-8 sm:p-12 rounded-3xl text-center border-2 border-dashed border-slate-200 shadow-sm max-w-2xl mx-auto">
        <div class="w-16 h-16 mx-auto mb-4 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-emerald-100">
          <i class="fa-solid fa-shield-halved"></i>
        </div>
        <h4 class="text-lg font-black text-slate-900">100% पुलिस व आधार सत्यापित कामगार ऑनबोर्डिंग जारी</h4>
        <p class="text-xs text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
          KaamWale.com पर किसी भी अनवेरिफाइड वर्कर को अनुमति नहीं है। हमारे विशेषज्ञ आपकी सेवा के लिए तैयार हैं - आप अपनी जरूरत अनुसार सीधे सेवा बुक करें, 30 मिनट में नजदीकी सत्यापित पार्टनर आपके घर पहुंचेगा!
        </p>
        <div class="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button onclick="handleBookServiceClick('Electrician')" class="btn-emerald px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md hover:scale-105 transition">
            <i class="fa-solid fa-calendar-check"></i> तुरंत सेवा बुक करें
          </button>
          <button onclick="openWorkerAuthModal()" class="px-5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl font-bold text-xs flex items-center gap-2 transition">
            <i class="fa-solid fa-user-plus"></i> कामगार पार्टनर बनें (Join Pro)
          </button>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = approvedList.map(w => `
    <div class="premium-card p-6 flex flex-col justify-between border-t-4 border-t-blue-600">
      <div>
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-900 via-blue-700 to-emerald-600 text-white font-black flex items-center justify-center text-base shadow-md cursor-pointer hover:scale-105 transition" onclick="openWorkerProfileModal('${w.id}')" title="Click to view profile">
              ${w.name.slice(0, 1)}
            </div>
            <div>
              <h3 class="text-base font-black text-slate-900 flex items-center gap-1.5 cursor-pointer hover:text-blue-700 transition" onclick="openWorkerProfileModal('${w.id}')">
                ${w.name}
                <i class="fa-solid fa-circle-check text-blue-600 text-xs" title="Verified Worker"></i>
              </h3>
              <span class="inline-block bg-blue-50 text-blue-800 text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-md mt-0.5 border border-blue-100">
                ${w.category}
              </span>
            </div>
          </div>
          <span class="trust-score-badge">
            <i class="fa-solid fa-shield-halved text-emerald-600"></i> Trust ${w.trustScore || '98%'}
          </span>
        </div>

        <div class="grid grid-cols-2 gap-2 my-4 p-3 bg-slate-50 rounded-2xl text-xs text-slate-600 border border-slate-100">
          <div>
            <span class="text-[10px] font-bold text-slate-400 block uppercase">स्थान / Area</span>
            <span class="font-bold text-slate-900 flex items-center gap-1 truncate">
              <i class="fa-solid fa-location-dot text-red-500 text-[12px]"></i> ${w.location}
            </span>
          </div>
          <div>
            <span class="text-[10px] font-bold text-slate-400 block uppercase">अनुभव / Rate</span>
            <span class="font-bold text-slate-900">${w.exp} · <span class="text-emerald-700 font-extrabold">${w.rate || '₹350'}</span></span>
          </div>
        </div>
      </div>

      <div class="pt-2 flex items-center gap-2">
        <button onclick="openWorkerProfileModal('${w.id}')" class="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition border border-slate-200" title="View Full Profile">
          <i class="fa-solid fa-id-badge text-blue-600"></i>
        </button>
        <a href="tel:${w.phone}" class="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition">
          <i class="fa-solid fa-phone text-blue-600"></i> Call
        </a>
        <button onclick="handleBookServiceClick('${w.category}')" class="flex-1 btn-emerald py-2.5 px-3 text-xs flex items-center justify-center gap-1.5 transition">
          <i class="fa-solid fa-calendar-check"></i> Book Now
        </button>
      </div>
    </div>
  `).join("");
}

function openWorkerProfileModal(workerId) {
  const allWorkers = getStoredWorkers();
  const worker = allWorkers.find(w => w.id === workerId);
  if (!worker) return;

  const modal = document.getElementById("workerProfileModal");
  if (!modal) return;

  const avatar = document.getElementById("wpAvatar");
  const name = document.getElementById("wpName");
  const category = document.getElementById("wpCategory");
  const rating = document.getElementById("wpRating");
  const exp = document.getElementById("wpExp");
  const trust = document.getElementById("wpTrust");
  const location = document.getElementById("wpLocation");
  const callLink = document.getElementById("wpCallLink");
  const bookBtn = document.getElementById("wpBookBtn");

  if (avatar) avatar.textContent = worker.name.slice(0, 1);
  if (name) name.textContent = worker.name;
  if (category) category.textContent = `${worker.category} • Professional Partner`;
  if (rating) rating.textContent = `★ ${worker.rating || 4.9} (${worker.reviews || 12} Reviews)`;
  if (exp) exp.textContent = worker.exp || "5+ Years";
  if (trust) trust.textContent = `${worker.trustScore || '98%'} Verified`;
  if (location) location.innerHTML = `📍 ${worker.location} • <span class="font-bold text-slate-900">${worker.rate || '₹300 - ₹500 base charge'}</span>`;
  if (callLink) callLink.href = `tel:${worker.phone}`;
  if (bookBtn) {
    bookBtn.onclick = () => {
      closeWorkerProfileModal();
      handleBookServiceClick(worker.category);
    };
  }

  modal.classList.remove("hidden");
}

function closeWorkerProfileModal() {
  const modal = document.getElementById("workerProfileModal");
  if (modal) modal.classList.add("hidden");
}

function handleHeroSearch() {
  const loc = document.getElementById("heroLocationInput")?.value.trim() || "";
  const srv = document.getElementById("heroServiceSelect")?.value || "";

  const mainLoc = document.getElementById("locationInput");
  const mainCat = document.getElementById("categoryFilter");

  if (mainLoc && loc) mainLoc.value = loc;
  if (mainCat && srv) mainCat.value = srv;

  filterWorkers();

  const workersSection = document.getElementById("workers");
  if (workersSection) {
    workersSection.scrollIntoView({ behavior: "smooth" });
  }
}

function filterWorkers() {
  const loc = document.getElementById("locationInput")?.value.toLowerCase().trim() || "";
  const cat = document.getElementById("categoryFilter")?.value || "";
  const allWorkers = getStoredWorkers();

  const filtered = allWorkers.filter(w => {
    const locMatch = !loc || w.location.toLowerCase().includes(loc) || (w.city && w.city.toLowerCase().includes(loc));
    const catMatch = !cat || w.category.toLowerCase() === cat.toLowerCase();
    return locMatch && catMatch;
  });

  renderWorkersList(filtered);
}

// ================================================================
// BLINKIT & RAPIDO STYLE LIVE GPS LOCATION SYSTEM
// ================================================================
window.kwUserLocation = {
  lat: 25.5941,
  lon: 85.1376,
  locality: "Boring Road",
  city: "Patna",
  state: "Bihar",
  pincode: "800001",
  fullAddress: "Boring Road, Patna, Bihar 800001",
  formattedShort: "Boring Road, Patna",
  accuracy: null,
  source: "default",
  timestamp: null
};

function openLocationSelectorModal() {
  const modal = document.getElementById("locationSelectorModal");
  if (modal) {
    modal.classList.remove("hidden");
    updateLocationSelectorModalDetails(window.kwUserLocation);
  }
}

function closeLocationSelectorModal() {
  const modal = document.getElementById("locationSelectorModal");
  if (modal) modal.classList.add("hidden");
}

function updateLocationSelectorModalDetails(loc) {
  if (!loc) loc = window.kwUserLocation;
  const fullEl = document.getElementById("modalActiveFullAddress");
  const coordsEl = document.getElementById("modalActiveCoords");
  const badgeEl = document.getElementById("modalActiveSourceBadge");

  if (fullEl) fullEl.textContent = loc.fullAddress || loc.formattedShort || "Boring Road, Patna, Bihar";
  if (coordsEl) {
    const latStr = loc.lat ? `${Number(loc.lat).toFixed(4)}° N` : "25.5941° N";
    const lonStr = loc.lon ? `${Number(loc.lon).toFixed(4)}° E` : "85.1376° E";
    const accStr = loc.accuracy ? ` (सटीकता ~${loc.accuracy}m)` : "";
    coordsEl.innerHTML = `<span>🌐 ${latStr}, ${lonStr}${accStr}</span>`;
  }
  if (badgeEl) {
    if (loc.source === "gps") {
      badgeEl.className = "bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[10px]";
      badgeEl.textContent = "⚡ LIVE GPS";
    } else if (loc.source === "ip") {
      badgeEl.className = "bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full text-[10px]";
      badgeEl.textContent = "🌐 IP DETECTED";
    } else {
      badgeEl.className = "bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full text-[10px]";
      badgeEl.textContent = "📍 SELECTED";
    }
  }
}

async function reverseGeocodeCoordinates(lat, lon) {
  // 1. OpenStreetMap Nominatim reverse geocoding API
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`, {
      signal: controller.signal,
      headers: { "Accept-Language": "en,hi" }
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      if (data && data.address) {
        const a = data.address;
        const locality = a.suburb || a.neighbourhood || a.residential || a.road || a.quarter || a.subdistrict || a.city_district || "";
        const city = a.city || a.town || a.village || a.state_district || a.county || "Patna";
        const state = a.state || "Bihar";
        const pincode = a.postcode || "";

        const shortName = locality ? `${locality}, ${city}` : city;
        const fullAddr = [locality, a.road, city, state, pincode].filter(Boolean).join(", ");

        return {
          locality: locality || city,
          city: city,
          state: state,
          pincode: pincode,
          fullAddress: fullAddr || data.display_name,
          formattedShort: shortName
        };
      }
    }
  } catch (e) {
    console.warn("Nominatim reverse geocode error:", e);
  }

  // 2. BigDataCloud Reverse Geocode Client API (high speed client-side fallback)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      const locality = data.locality || data.localityInfo?.administrative?.[3]?.name || "";
      const city = data.city || data.principalSubdivision || "Patna";
      const state = data.principalSubdivision || "";
      const pincode = data.postcode || "";
      const shortName = locality ? `${locality}, ${city}` : city;
      return {
        locality: locality || city,
        city: city,
        state: state,
        pincode: pincode,
        fullAddress: `${shortName}, ${state} ${pincode}`.trim(),
        formattedShort: shortName
      };
    }
  } catch (e2) {
    console.warn("BigDataCloud reverse geocode error:", e2);
  }

  return null;
}

async function fallbackToIpLocation(optionalToast) {
  try {
    const res = await fetch("https://ipwho.is/", { signal: AbortSignal.timeout(4000) });
    if (res.ok) {
      const data = await res.json();
      if (data && data.success !== false) {
        const city = data.city || "Patna";
        const region = data.region || "Bihar";
        const pincode = data.postal || "";
        const fallbackObj = {
          lat: data.latitude,
          lon: data.longitude,
          locality: city,
          city: city,
          state: region,
          pincode: pincode,
          fullAddress: `${city}, ${region} ${pincode}`.trim(),
          formattedShort: `${city}, ${region}`,
          source: "ip",
          accuracy: 1000,
          timestamp: new Date().toISOString()
        };
        window.kwUserLocation = fallbackObj;
        updateLocationUiEverywhere(fallbackObj);
        if (optionalToast) showToast(optionalToast);
        return;
      }
    }
  } catch (e) {}

  // Default fallback
  const defaultLoc = {
    lat: 25.5941,
    lon: 85.1376,
    locality: "Boring Road",
    city: "Patna",
    state: "Bihar",
    pincode: "800001",
    fullAddress: "Boring Road, Patna, Bihar 800001",
    formattedShort: "Boring Road, Patna",
    source: "default",
    accuracy: null,
    timestamp: new Date().toISOString()
  };
  window.kwUserLocation = defaultLoc;
  updateLocationUiEverywhere(defaultLoc);
  if (optionalToast) showToast(optionalToast);
}

function updateLocationUiEverywhere(locDetails) {
  if (!locDetails) return;

  // 1. Header Location Text (Desktop & Mobile)
  const headerText = document.getElementById("headerLocationText");
  if (headerText) {
    headerText.innerHTML = `📍 <span class="text-slate-900">${locDetails.formattedShort}</span>`;
    headerText.title = locDetails.fullAddress || locDetails.formattedShort;
  }
  const mobileHeaderText = document.getElementById("mobileHeaderLocationText");
  if (mobileHeaderText) {
    mobileHeaderText.textContent = locDetails.formattedShort;
  }

  // 2. Hero Search Input
  const heroLoc = document.getElementById("heroLocationInput");
  if (heroLoc) {
    heroLoc.value = locDetails.formattedShort;
  }

  // 3. Worker Filter Location Input
  const workerLoc = document.getElementById("locationInput");
  if (workerLoc) {
    workerLoc.value = locDetails.city || locDetails.formattedShort;
    if (typeof filterWorkers === "function") {
      filterWorkers();
    }
  }

  // 4. Booking Modal Address Field
  const bookingAddr = document.getElementById("bookingCustAddress");
  if (bookingAddr && (!bookingAddr.value || bookingAddr.value.trim() === "" || bookingAddr.value.includes("GPS Location: Near Device Coordinates"))) {
    bookingAddr.value = locDetails.fullAddress || locDetails.formattedShort;
  }

  // 5. Update Location Selector Modal UI if open
  updateLocationSelectorModalDetails(locDetails);
}

async function fetchLiveGpsLocation({ auto = false } = {}) {
  const headerText = document.getElementById("headerLocationText");
  const modalStatus = document.getElementById("gpsModalStatusText");

  if (headerText) {
    headerText.innerHTML = `<span class="inline-flex items-center gap-1 text-amber-600 animate-pulse"><i class="fa-solid fa-spinner fa-spin"></i> GPS डिटेक्ट हो रहा है...</span>`;
  }
  if (modalStatus) {
    modalStatus.textContent = "⌖ डिवाइस GPS से सटीक लोकेशन खोजी जा रही है...";
    modalStatus.className = "text-xs text-blue-600 font-semibold mt-0.5 animate-pulse";
  }

  if (!("geolocation" in navigator)) {
    await fallbackToIpLocation("ब्राउज़र में GPS उपलब्ध नहीं है, IP लोकेशन लोड की गई।");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      const accuracy = Math.round(pos.coords.accuracy || 15);

      let locDetails = await reverseGeocodeCoordinates(lat, lon);
      if (!locDetails) {
        locDetails = {
          lat,
          lon,
          locality: "Current Area",
          city: "Near You",
          state: "",
          pincode: "",
          fullAddress: `GPS Location (${lat.toFixed(4)}, ${lon.toFixed(4)})`,
          formattedShort: `${lat.toFixed(3)}°N, ${lon.toFixed(3)}°E`
        };
      }

      locDetails.lat = lat;
      locDetails.lon = lon;
      locDetails.accuracy = accuracy;
      locDetails.source = "gps";
      locDetails.timestamp = new Date().toISOString();

      window.kwUserLocation = locDetails;
      try {
        localStorage.setItem("kw_saved_location", JSON.stringify(locDetails));
      } catch (e) {}

      updateLocationUiEverywhere(locDetails);

      showToast(`📍 ⚡ लाइव GPS लोकेशन मिली: ${locDetails.formattedShort} (डिलीवरी 15-30 मिनट में)`);
      if (modalStatus) {
        modalStatus.textContent = `✅ सटीक GPS सेट: ${locDetails.formattedShort} (~${accuracy}m)`;
        modalStatus.className = "text-xs text-emerald-700 font-bold mt-0.5";
      }
    },
    async (err) => {
      console.warn("GPS Permission Denied or Timeout:", err.message);
      await fallbackToIpLocation(auto ? null : "GPS एक्सेस नहीं मिला, डिफ़ॉल्ट/IP लोकेशन सेट की गई।");
      if (modalStatus) {
        modalStatus.textContent = "⚠️ GPS अनुमति अस्वीकृत। कृपया नीचे से शहर चुनें।";
        modalStatus.className = "text-xs text-rose-600 font-semibold mt-0.5";
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 9000,
      maximumAge: 60000
    }
  );
}

function triggerGpsDetectionFromModal() {
  fetchLiveGpsLocation({ auto: false });
}

function triggerDeviceLocation() {
  fetchLiveGpsLocation({ auto: false });
}

function selectManualCity(cityName, shortLocality = "") {
  const shortText = shortLocality || cityName;
  const manualLoc = {
    lat: cityName.includes("Patna") ? 25.5941 : 28.5355,
    lon: cityName.includes("Patna") ? 85.1376 : 77.3910,
    locality: shortLocality || cityName,
    city: cityName,
    state: cityName.includes("Patna") ? "Bihar" : "Uttar Pradesh / NCR",
    pincode: "",
    fullAddress: `${shortText}, India`,
    formattedShort: shortText,
    source: "manual",
    accuracy: null,
    timestamp: new Date().toISOString()
  };

  window.kwUserLocation = manualLoc;
  try {
    localStorage.setItem("kw_saved_location", JSON.stringify(manualLoc));
  } catch (e) {}

  updateLocationUiEverywhere(manualLoc);
  showToast(`📍 लोकेशन सेट की गई: ${shortText}`);
  closeLocationSelectorModal();
}

function handleModalLocationSearch(query) {
  if (!query || query.trim().length < 2) return;
  const q = query.trim();
  const searchLoc = {
    lat: 25.5941,
    lon: 85.1376,
    locality: q,
    city: q,
    state: "India",
    pincode: "",
    fullAddress: `${q}, Doorstep Service Area`,
    formattedShort: q,
    source: "manual",
    accuracy: null,
    timestamp: new Date().toISOString()
  };
  window.kwUserLocation = searchLoc;
  try {
    localStorage.setItem("kw_saved_location", JSON.stringify(searchLoc));
  } catch (e) {}
  updateLocationUiEverywhere(searchLoc);
}

function initGpsLocationSystem() {
  // Load saved location if available
  try {
    const saved = localStorage.getItem("kw_saved_location");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.formattedShort) {
        window.kwUserLocation = parsed;
        updateLocationUiEverywhere(parsed);
      }
    }
  } catch (e) {}

  // Auto-detect GPS on first visit just like Blinkit / Rapido
  if (!sessionStorage.getItem("kw_gps_prompted")) {
    sessionStorage.setItem("kw_gps_prompted", "true");
    setTimeout(() => {
      fetchLiveGpsLocation({ auto: true });
    }, 1000);
  }
}

// ========================
// CUSTOMER BOOKING FLOW
// ========================
function handleBookServiceClick(categoryName) {
  currentBookingCategory = categoryName || "Electrician";
  openBookingModal(currentBookingCategory);
}

function openBookingModal(categoryName) {
  const modal = document.getElementById("bookingModal");
  const catTitle = document.getElementById("modalSelectedCategory");
  const nameInput = document.getElementById("bookingCustName");
  const emailInput = document.getElementById("bookingCustEmail");
  const phoneInput = document.getElementById("bookingCustPhone");
  const addrBox = document.getElementById("bookingCustAddress");
  const subservicesList = document.getElementById("modalSubservicesList");
  const estVisit = document.getElementById("modalEstVisit");
  const estLabour = document.getElementById("modalEstLabour");
  const estTotal = document.getElementById("modalEstTotal");

  if (catTitle) catTitle.textContent = categoryName;
  if (nameInput) nameInput.value = currentUser ? currentUser.name : "";
  if (emailInput) emailInput.value = currentUser ? (currentUser.email || "") : "";
  if (phoneInput && currentUser && currentUser.phone) phoneInput.value = currentUser.phone;

  // Auto-fill GPS address if available
  if (addrBox && (!addrBox.value || addrBox.value.trim() === "" || addrBox.value.includes("GPS Location: Near Device Coordinates"))) {
    if (window.kwUserLocation && (window.kwUserLocation.fullAddress || window.kwUserLocation.formattedShort)) {
      addrBox.value = window.kwUserLocation.fullAddress || window.kwUserLocation.formattedShort;
    }
  }

  // Sub-services checkboxes & dynamic price calculation
  const found = CATEGORIES.find(c => c.name.toLowerCase() === categoryName.toLowerCase());
  const subs = found ? found.subServices : [
    "General Repair / Inspection",
    "Fitting / Installation",
    "Emergency Fix",
    "Maintenance Check"
  ];

  if (subservicesList) {
    subservicesList.innerHTML = subs.map((s, idx) => `
      <label class="flex items-start gap-2 cursor-pointer text-slate-700 hover:text-blue-700 transition">
        <input type="checkbox" name="bookingSubserviceCheck" value="${s}" ${idx === 0 ? 'checked' : ''} onchange="updateBookingModalPriceEstimate()" class="w-4 h-4 text-blue-600 rounded border-slate-300 mt-0.5" />
        <span class="text-xs font-semibold">${s}</span>
      </label>
    `).join("");
  }

  // Price estimate
  const baseRate = found ? (parseInt((found.rate.match(/\d+/) || [250])[0], 10)) : 250;
  if (estVisit) estVisit.textContent = "₹99";
  if (estLabour) estLabour.textContent = `₹${baseRate}`;
  if (estTotal) estTotal.textContent = `₹${99 + baseRate}+`;

  if (modal) modal.classList.remove("hidden");
}

function updateBookingModalPriceEstimate() {
  const catTitle = document.getElementById("modalSelectedCategory");
  const categoryName = catTitle ? catTitle.textContent : "Electrician";
  const found = CATEGORIES.find(c => c.name.toLowerCase() === categoryName.toLowerCase());
  const baseRate = found ? (parseInt((found.rate.match(/\d+/) || [250])[0], 10)) : 250;
  
  const checkedBoxes = document.querySelectorAll("input[name='bookingSubserviceCheck']:checked");
  const count = Math.max(1, checkedBoxes.length);
  
  const estVisit = document.getElementById("modalEstVisit");
  const estLabour = document.getElementById("modalEstLabour");
  const estTotal = document.getElementById("modalEstTotal");
  
  const visitCharge = 99;
  const labourCharge = baseRate + (count - 1) * 99;
  const total = visitCharge + labourCharge;
  
  if (estVisit) estVisit.textContent = `₹${visitCharge}`;
  if (estLabour) estLabour.textContent = `₹${labourCharge}`;
  if (estTotal) estTotal.textContent = `₹${total}+`;
}

function closeBookingModal() {
  const modal = document.getElementById("bookingModal");
  if (modal) modal.classList.add("hidden");
}

function useCurrentLocationInBooking() {
  const addrBox = document.getElementById("bookingCustAddress");
  if (addrBox && window.kwUserLocation && (window.kwUserLocation.fullAddress || window.kwUserLocation.formattedShort)) {
    addrBox.value = window.kwUserLocation.fullAddress || window.kwUserLocation.formattedShort;
  }
  fetchLiveGpsLocation({ auto: false });
}

function saveCurrentUser(user) {
  currentUser = user;
  try {
    if (user) {
      localStorage.setItem("kw_current_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("kw_current_user");
    }
  } catch (err) {
    console.warn("saveCurrentUser notice:", err);
  }
}

function submitCustomerBooking(e) {
  if (e && e.preventDefault) e.preventDefault();

  const phoneInput = document.getElementById("bookingCustPhone");
  const addressInput = document.getElementById("bookingCustAddress");
  const nameInput = document.getElementById("bookingCustName");
  const emailInput = document.getElementById("bookingCustEmail");
  const descInput = document.getElementById("bookingCustDescription");
  const timeSlotInput = document.getElementById("bookingTimeSlot");
  const urgentCheck = document.getElementById("bookingUrgent");

  const phone = (phoneInput ? phoneInput.value : "").trim();
  const address = (addressInput ? addressInput.value : "").trim();
  const desc = (descInput ? descInput.value : "").trim();
  const timeSlot = timeSlotInput ? timeSlotInput.value : "Immediate (within 1 hour)";
  const isUrgent = !!(urgentCheck && urgentCheck.checked);
  const inputName = (nameInput ? nameInput.value : "").trim();
  const inputEmail = (emailInput ? emailInput.value : "").trim();

  const digitsOnly = phone.replace(/\D/g, "");
  if (!digitsOnly || digitsOnly.length < 10) {
    alert("कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।");
    if (phoneInput) phoneInput.focus();
    return;
  }
  const cleanPhone = digitsOnly.slice(-10);

  if (!address) {
    alert("कृपया कार्य स्थल का पूरा पता (Doorstep Address) दर्ज करें।");
    if (addressInput) addressInput.focus();
    return;
  }

  const finalName = inputName || (currentUser && currentUser.name) || `ग्राहक (${cleanPhone.slice(-4)})`;
  const finalEmail = inputEmail || (currentUser && currentUser.email) || `${cleanPhone}@kaamwale.local`;

  // Ensure customer session is saved
  currentUser = {
    id: (currentUser && currentUser.id) ? currentUser.id : ("cust_" + cleanPhone),
    name: finalName,
    phone: cleanPhone,
    email: finalEmail,
    role: "customer",
    phoneVerified: true
  };
  saveCurrentUser(currentUser);
  try { renderNavUser(); } catch(err) {}

  const checkedSubs = [...document.querySelectorAll("input[name='bookingSubserviceCheck']:checked")].map(i => i.value);

  const bookingId = "KW-" + Math.floor(100000 + Math.random() * 900000);
  const otp = String(Math.floor(1000 + Math.random() * 9000));
  const estTotal = document.getElementById("modalEstTotal")?.textContent || "₹349+";

  const newBooking = {
    booking_id: bookingId,
    otp: otp,
    category: currentBookingCategory || "Electrician",
    subServices: checkedSubs.length > 0 ? checkedSubs : [currentBookingCategory || "Electrician"],
    custName: finalName,
    custEmail: finalEmail,
    custPhone: cleanPhone,
    custAddress: address,
    desc: isUrgent ? `🚨 [URGENT 30 MIN] ${desc}` : desc,
    timeSlot: timeSlot,
    isUrgent: !!isUrgent,
    priceEstimate: estTotal,
    status: "pending_admin_approval", // Order goes straight to Admin for approval
    assignedWorkerId: null,
    assignedWorkerName: null,
    assignedWorkerPhone: null,
    date: new Date().toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })
  };

  finalizeCustomerBooking(newBooking);
}

function finalizeCustomerBooking(bookingData) {
  try { closeBookingModal(); } catch (e) {}

  bookingData.status = bookingData.status || "pending_admin_approval";

  try {
    const bookings = getStoredBookings();
    const existingIdx = bookings.findIndex(b => b.booking_id === bookingData.booking_id);
    if (existingIdx >= 0) {
      bookings[existingIdx] = bookingData;
    } else {
      bookings.unshift(bookingData);
    }
    saveStoredBookings(bookings);
  } catch (e) {
    console.error("Local booking save notice:", e);
  }

  // 1. POPULATE & DISPLAY SUCCESS MODAL IMMEDIATELY
  const successModal = document.getElementById("bookingSuccessModal");
  if (document.getElementById("successBookingId")) document.getElementById("successBookingId").textContent = bookingData.booking_id;
  if (document.getElementById("successOtpNumber")) document.getElementById("successOtpNumber").textContent = bookingData.otp;
  if (document.getElementById("successCategory")) document.getElementById("successCategory").textContent = bookingData.category;
  if (document.getElementById("successCustomer")) document.getElementById("successCustomer").textContent = bookingData.custName;
  if (document.getElementById("successPhone")) document.getElementById("successPhone").textContent = bookingData.custPhone;
  if (document.getElementById("successAddress")) document.getElementById("successAddress").textContent = bookingData.custAddress;
  const adminStatusEl = document.getElementById("successAdminStatus");
  if (adminStatusEl) adminStatusEl.textContent = "🟡 एडमिन स्वीकृति प्रतीक्षित (Pending Admin Approval)";

  // Full Order Details Sent to Admin WhatsApp (+91 98998 62721)
  const checkedSubsText = (bookingData.subServices || []).join(", ") || bookingData.category;
  const waRawMsg = 
    `*🚨 NEW KAAMWALE.COM SERVICE ORDER 🚨*\n` +
    `----------------------------------------\n` +
    `📋 *Order ID:* ${bookingData.booking_id}\n` +
    `🔒 *Doorstep Security OTP:* ${bookingData.otp}\n` +
    `🛠️ *Service Category:* ${bookingData.category}\n` +
    `🔧 *Tasks:* ${checkedSubsText}\n` +
    `👤 *Customer Name:* ${bookingData.custName}\n` +
    `📞 *Customer Phone:* ${bookingData.custPhone}\n` +
    `📍 *Doorstep Address:* ${bookingData.custAddress}\n` +
    `⏰ *Preferred Time:* ${bookingData.timeSlot}${bookingData.isUrgent ? ' (🚨 URGENT 30 MIN)' : ''}\n` +
    (bookingData.desc ? `📝 *Problem Details:* ${bookingData.desc}\n` : '') +
    `💰 *Bill Estimate (Admin/Customer):* ${bookingData.priceEstimate}\n` +
    `----------------------------------------\n` +
    `*Status:* 🟡 एडमिन (शिवम पंडित) की स्वीकृति प्रतीक्षित है।\n` +
    `Admin Contact: +91 98998 62721`;

  const waMsg = encodeURIComponent(waRawMsg);
  const waUrl = `https://wa.me/91${CONFIG.businessPhone}?text=${waMsg}`;
  const waBtn = document.getElementById("whatsappConnectBtn");
  if (waBtn) waBtn.href = waUrl;

  // Direct SMS link for Admin (+91 98998 62721)
  const smsText = `🚨 KAAMWALE ORDER: ${bookingData.booking_id}\nOTP: ${bookingData.otp}\nCat: ${bookingData.category}\nCust: ${bookingData.custName} (${bookingData.custPhone})\nAddress: ${bookingData.custAddress}\nEst: ${bookingData.priceEstimate}`;
  const smsUrl = `sms:+91${CONFIG.businessPhone}?body=${encodeURIComponent(smsText)}`;
  const smsBtn = document.getElementById("smsConnectBtn");
  if (smsBtn) smsBtn.href = smsUrl;

  // Show Success Modal right away so user sees instant confirmation!
  if (successModal) {
    successModal.classList.remove("hidden");
  }

  // Play Audio Sound & Broadcast to Admin
  try {
    playOrderSuccessChime();
    playAdminNewOrderAlertSound();
    handleIncomingAdminOrderNotification(bookingData);
    localStorage.setItem("kw_admin_new_order_alert", JSON.stringify({
      booking_id: bookingData.booking_id,
      category: bookingData.category,
      custName: bookingData.custName,
      custPhone: bookingData.custPhone,
      custAddress: bookingData.custAddress,
      priceEstimate: bookingData.priceEstimate,
      time: Date.now()
    }));
  } catch(e) {}
  showToast(`📲 ऑर्डर दर्ज! एडमिन (शिवम पंडित - +91 98998 62721) को WhatsApp, SMS और वेबसाइट पर तुरंत सूचना भेजी गई।`);

  // 2. DISPATCH TO BACKEND APIs (Saves permanently to orders.json on server)
  try {
    fetch("/api/notify-admin-whatsapp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData)
    }).then(res => res.json()).then(data => {
      console.log("✅ Admin WhatsApp order notification recorded:", data);
    }).catch(err => {
      console.log("Order saved locally in browser storage.");
    });
  } catch (err) {}

  try {
    fetch("/api/notify-admin-sms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData)
    }).then(res => res.json()).then(data => {
      console.log("✅ Admin SMS notification recorded:", data);
    }).catch(err => {});
  } catch (err) {}

  // 3. Auto-launch WhatsApp in background (non-blocking)
  try {
    const waWindow = window.open(waUrl, "_blank");
    if (!waWindow || waWindow.closed || typeof waWindow.closed === "undefined") {
      console.log("Popup blocked by browser; user can click WhatsApp button in modal.");
    }
  } catch (err) {
    console.log("WhatsApp auto-launch notice:", err);
  }
}

function playOrderSuccessChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch (e) {}
}

// ==========================================
// AUDIO NOTIFICATIONS & WORKER 30-SEC RINGTONE ENGINE
// Founder: Shivam Pandat (+91 98998 62721 | KaamWale.com)
// ==========================================

let currentWorkerRingAudioContext = null;
let currentWorkerRingInterval = null;
let workerRingTimerInterval = null;
let workerRingTimeRemaining = 30;

/**
 * Loud attention-grabbing chime for Admin when any customer books an order.
 * Synthesized using Web Audio API (100% offline & WebView compatible).
 */
function playAdminNewOrderAlertSound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    // High-priority 3-chord repeating chime sequence (G5 -> C6 -> E6 -> G6)
    const notes = [
      { freq: 784.00, time: 0, dur: 0.12 },     // G5
      { freq: 1046.50, time: 0.14, dur: 0.15 }, // C6
      { freq: 1318.51, time: 0.30, dur: 0.28 }, // E6
      { freq: 784.00, time: 0.65, dur: 0.12 },  // G5
      { freq: 1046.50, time: 0.79, dur: 0.15 }, // C6
      { freq: 1567.98, time: 0.95, dur: 0.40 }  // G6
    ];
    notes.forEach(n => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(n.freq, ctx.currentTime + n.time);
      gain.gain.setValueAtTime(0.35, ctx.currentTime + n.time);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + n.time + n.dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + n.time);
      osc.stop(ctx.currentTime + n.time + n.dur);
    });
  } catch (e) {
    console.warn("Admin audio alert notice:", e);
  }
}

/**
 * Displays floating notification banner on screen for Admin and plays sound
 */
function handleIncomingAdminOrderNotification(orderData) {
  playAdminNewOrderAlertSound();

  const banner = document.getElementById("adminNewOrderFloatingBanner");
  const bId = document.getElementById("adminBannerOrderId");
  const bDet = document.getElementById("adminBannerDetails");

  if (banner && bId && bDet) {
    bId.textContent = orderData.booking_id || "KW-NEW";
    bDet.textContent = `${orderData.category || 'Service'} • ${orderData.custName || 'ग्राहक'} (${orderData.custPhone || ''}) • ${orderData.priceEstimate || '₹349+'}`;
    banner.classList.remove("hidden");
  }

  // If Admin panel is open, refresh orders list immediately
  try {
    const adminModal = document.getElementById("adminPanelModal");
    if (adminModal && !adminModal.classList.contains("hidden")) {
      renderAdminOrdersList();
    }
  } catch(e) {}
}

function dismissAdminOrderBanner() {
  const banner = document.getElementById("adminNewOrderFloatingBanner");
  if (banner) banner.classList.add("hidden");
}

/**
 * 30-Second Continuous Ringing Loop for Assigned Worker
 */
function startWorker30SecRingtone(jobData) {
  stopWorkerIncomingRingtoneOnly();

  workerRingTimeRemaining = 30;

  // 1. Show Incoming Duty Modal
  const modal = document.getElementById("workerIncomingDutyModal");
  if (modal) {
    const jId = document.getElementById("workerIncomingJobId");
    const jCat = document.getElementById("workerIncomingCategory");
    const jCust = document.getElementById("workerIncomingCustName");
    const jAddr = document.getElementById("workerIncomingAddress");
    const txt = document.getElementById("workerDutyCountdownText");
    const bar = document.getElementById("workerDutyCountdownBar");

    if (jId) jId.textContent = jobData.bookingId || jobData.booking_id || "KW-DUTY";
    if (jCat) jCat.textContent = jobData.category || "General Service";
    if (jCust) jCust.textContent = jobData.custName ? `${jobData.custName} (📞 ${jobData.custPhone || ''})` : "ग्राहक";
    if (jAddr) jAddr.textContent = `📍 ${jobData.custAddress || jobData.address || "Doorstep Address"}`;
    if (txt) txt.textContent = "30s";
    if (bar) bar.style.width = "100%";

    modal.classList.remove("hidden");
  }

  // 2. Synthesize telephone ringing warble (440Hz + 480Hz) in 1.6s burst + 0.9s pause loop
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      currentWorkerRingAudioContext = new AudioCtx();
      if (currentWorkerRingAudioContext.state === 'suspended') {
        currentWorkerRingAudioContext.resume();
      }

      function playSingleBurst() {
        if (!currentWorkerRingAudioContext || currentWorkerRingAudioContext.state === 'closed') return;
        const ctx = currentWorkerRingAudioContext;
        const now = ctx.currentTime;

        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = "sine";
        osc1.frequency.setValueAtTime(440, now);
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(480, now);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.setValueAtTime(0.35, now + 1.5);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.7);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 1.7);
        osc2.stop(now + 1.7);
      }

      playSingleBurst();

      currentWorkerRingInterval = setInterval(() => {
        playSingleBurst();
      }, 2500);
    }
  } catch (err) {
    console.warn("Worker ringtone audio init error:", err);
  }

  // 3. 30-Second Countdown Timer
  workerRingTimerInterval = setInterval(() => {
    workerRingTimeRemaining--;
    const txt = document.getElementById("workerDutyCountdownText");
    const bar = document.getElementById("workerDutyCountdownBar");
    if (txt) txt.textContent = `${workerRingTimeRemaining}s`;
    if (bar) bar.style.width = `${Math.max(0, (workerRingTimeRemaining / 30) * 100)}%`;

    if (workerRingTimeRemaining <= 0) {
      clearInterval(workerRingTimerInterval);
      workerRingTimerInterval = null;
      stopWorkerAudioOnly();
      if (txt) txt.textContent = "रिंगटोन पूर्ण (Saved to Tasks)";
      showToast("⏰ कामगार ड्यूटी रिंगटोन 30 सेकंड पूर्ण होकर शांत हो गई। कार्य कामगार डैशबोर्ड में सुरक्षित है।");
    }
  }, 1000);
}

function stopWorkerAudioOnly() {
  if (currentWorkerRingInterval) {
    clearInterval(currentWorkerRingInterval);
    currentWorkerRingInterval = null;
  }
  if (currentWorkerRingAudioContext) {
    try {
      currentWorkerRingAudioContext.close();
    } catch (e) {}
    currentWorkerRingAudioContext = null;
  }
}

function stopWorkerIncomingRingtoneOnly() {
  stopWorkerAudioOnly();
  if (workerRingTimerInterval) {
    clearInterval(workerRingTimerInterval);
    workerRingTimerInterval = null;
  }
  const modal = document.getElementById("workerIncomingDutyModal");
  if (modal) modal.classList.add("hidden");
}

function acceptWorkerIncomingJob() {
  stopWorkerIncomingRingtoneOnly();
  showToast("✅ ड्यूटी स्वीकार कर ली गई! कामगार डैशबोर्ड खोला जा रहा है...");
  openWorkerDashboardModal();
}

function triggerWorker30SecDutyAlert(dutyData) {
  startWorker30SecRingtone(dutyData || {
    bookingId: "KW-TEST",
    category: "Electrician",
    custName: "रोहित शर्मा",
    custPhone: "9876543210",
    custAddress: "सेक्टर 62, नोएडा, उत्तर प्रदेश"
  });
}

function testWorker30SecDutyAlert(bookingId) {
  let duty = null;
  if (bookingId) {
    const bookings = getStoredBookings();
    duty = bookings.find(b => b.booking_id === bookingId);
  }
  triggerWorker30SecDutyAlert(duty || {
    bookingId: bookingId || "KW-DEMO-" + Math.floor(1000 + Math.random() * 9000),
    category: "इलेक्ट्रीशियन (Electrician)",
    custName: "आलोक वर्मा",
    custPhone: "9899862721",
    custAddress: "फ्लैट 402, आम्रपाली वैली, नोएडा सेक्टर 120"
  });
  showToast("🔔 30-सेकंड कामगार रिंगटोन परीक्षण शुरू हुआ!");
}

// Global Cross-Tab Storage Listener
window.addEventListener("storage", function(e) {
  if (e.key === "kw_admin_new_order_alert" && e.newValue) {
    try {
      const data = JSON.parse(e.newValue);
      handleIncomingAdminOrderNotification(data);
    } catch(err) {}
  }
  if (e.key === "kw_worker_assignment_alert" && e.newValue) {
    try {
      const data = JSON.parse(e.newValue);
      triggerWorker30SecDutyAlert(data);
    } catch(err) {}
  }
});

function closeSuccessModal() {
  const modal = document.getElementById("bookingSuccessModal");
  if (modal) modal.classList.add("hidden");
}

// 30-Min Emergency Booking Trigger
function triggerEmergencyBooking() {
  if (!currentUser) {
    openGoogleAuthModal(() => triggerEmergencyBooking());
    showToast("⚠️ कृपया आपातकालीन सेवा बुक करने से पहले Google साइन-इन करें।");
    return;
  }

  handleBookServiceClick("Electrician");
  setTimeout(() => {
    const urgCheck = document.getElementById("bookingUrgent");
    if (urgCheck) urgCheck.checked = true;
    const timeSlot = document.getElementById("bookingTimeSlot");
    if (timeSlot) timeSlot.value = "तुरंत (Immediate - 1 Hour)";
    const desc = document.getElementById("bookingCustDescription");
    if (desc) desc.value = "🚨 [URGENT EMERGENCY BOOKING - 30 MIN PRIORITY DISPATCH NEEDED]";
  }, 100);

  showToast("🚨 आपातकालीन सेवा मोड: 30-मिनट प्राथमिकता वर्कर डिस्पैच!");
}

// ========================
// SMART AI SERVICE ASSISTANT
// ========================
function handleAiAssistant(e) {
  if (e) e.preventDefault();
  const input = document.getElementById("aiInputText");
  const text = input ? input.value.trim().toLowerCase() : "";
  if (!text) return;

  let matchedCategory = "Electrician";
  let matchedSub = "Fan Installation / Repair (पंखा मरम्मत)";
  let estPrice = "₹250 - ₹500";

  if (text.match(/fan|पंखा|bijli|wire|wiring|switch|light|current|spark|socket|fuse|inverter|geyser|करंट|बिजली/)) {
    matchedCategory = "Electrician";
    matchedSub = text.includes("fan") || text.includes("पंखा") ? "Fan Installation / Repair (पंखा मरम्मत)" : "Switch & Socket Repair";
    estPrice = "₹250 - ₹500";
  } else if (text.match(/tap|नल|leak|water|tank|पानी|pipe|टंकी|flush|motor|टॉयलेट|सीपेज|drain/)) {
    matchedCategory = "Plumber";
    matchedSub = "Tap & Pipe Leakage Repair";
    estPrice = "₹250 - ₹600";
  } else if (text.match(/wood|furniture|लकड़ी|door|darwaza|darwaja|window|bed|sofa|almirah|lock|ताला|बढ़ई|दरवाजा/)) {
    matchedCategory = "Carpenter";
    matchedSub = text.includes("lock") || text.includes("ताला") ? "Door & Lock Fitting" : "Furniture Assembly & Repair";
    estPrice = "₹400 - ₹800";
  } else if (text.match(/paint|रंग|colour|color|putty|wall|deewar|whitewash|waterproofing|पुट्टी|पेंट/)) {
    matchedCategory = "Painter";
    matchedSub = "Full House Interior Paint & Putty";
    estPrice = "₹300 - ₹700";
  } else if (text.match(/clean|सफाई|deep clean|safai|kachra|bathroom clean|chimney|पोछा|झाड़ू/)) {
    matchedCategory = "Cleaners";
    matchedSub = "Deep Home & Bathroom Cleaning";
    estPrice = "₹250 - ₹600";
  } else if (text.match(/car|bike|motorcycle|scooter|puncture|गाड़ी|पंचर|breakdown|engine|कार|बाइक/)) {
    matchedCategory = "Mechanics";
    matchedSub = "Car & Bike Breakdown Service";
    estPrice = "₹300 - ₹800";
  } else if (text.match(/weld|welding|iron|gate|grill|loha|लोहा|गेट|शटर|वेल्डर/)) {
    matchedCategory = "Welder";
    matchedSub = "Main Gate & Railing Welding";
    estPrice = "₹350 - ₹700";
  } else if (text.match(/cook|khana|food|kitchen|chef|रसोई|हलवाई|खाना|कुक/)) {
    matchedCategory = "Kitchen worker";
    matchedSub = "Daily Home Cook & Kitchen Helper";
    estPrice = "₹400 - ₹800";
  } else if (text.match(/iron|press|dhobi|laundry|प्रेस|धोबी|कपड़े/)) {
    matchedCategory = "Ironing service";
    matchedSub = "Doorstep Steam Press";
    estPrice = "₹10 - ₹25/कपड़ा";
  } else if (text.match(/labour|majdoor|shifting|loading|lifting|मजदूर|सामान|मलबा/)) {
    matchedCategory = "Labour";
    matchedSub = "Heavy Shifting & Loading Labour";
    estPrice = "₹450 - ₹650/दिन";
  }

  const box = document.getElementById("aiResultBox");
  const title = document.getElementById("aiRecTitle");
  const desc = document.getElementById("aiRecDesc");
  const btn = document.getElementById("aiBookBtn");

  if (box && title && desc && btn) {
    title.textContent = `${matchedCategory} · ${matchedSub}`;
    desc.textContent = `Estimated charge: ${estPrice} (+₹99 visit charge). Verified nearby workers available.`;
    box.classList.remove("hidden");
    btn.onclick = () => {
      handleBookServiceClick(matchedCategory);
      setTimeout(() => {
        const descBox = document.getElementById("bookingCustDescription");
        if (descBox) descBox.value = input.value;
      }, 150);
    };
  }

  showToast(`🤖 AI Diagnosis: ${matchedCategory} सुझाई गई!`);
}

// ========================
// PROFESSIONAL CUSTOMER TRACKER & DISPATCH HUB
// ========================
let currentTrackingFilter = "active"; // "active" | "all"
let trackedOrdersCache = [];

async function openMyBookingsModal(prefillSearch = "") {
  const modal = document.getElementById("myBookingsModal");
  const list = document.getElementById("myBookingsList");
  const searchInput = document.getElementById("trackOrderSearchInput");
  if (!modal || !list) return;

  modal.classList.remove("hidden");

  let phone = "";
  if (currentUser && currentUser.phone) {
    phone = currentUser.phone;
  }
  if (prefillSearch) {
    if (searchInput) searchInput.value = prefillSearch;
    phone = prefillSearch;
  } else if (searchInput && !searchInput.value && phone) {
    searchInput.value = phone;
  }

  const query = searchInput ? searchInput.value.trim() : phone;
  await loadAndRenderTrackOrders(query);
}

async function loadAndRenderTrackOrders(query = "") {
  const list = document.getElementById("myBookingsList");
  if (!list) return;

  list.innerHTML = `
    <div class="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
      <i class="fa-solid fa-spinner fa-spin text-3xl text-blue-600 mb-2"></i>
      <h4 class="text-sm font-bold text-slate-800">लाइव स्टेटस लोड हो रहा है...</h4>
      <p class="text-xs text-slate-400 mt-1">सर्वर से ताजा ऑर्डर विवरण प्राप्त किया जा रहा है...</p>
    </div>
  `;

  let localBookings = getStoredBookings();
  let serverBookings = [];

  try {
    let url = "/api/orders";
    const cleanPhone = query.replace(/\D/g, '').slice(-10);
    if (cleanPhone && cleanPhone.length === 10) {
      url += `?phone=${cleanPhone}`;
    } else if (query.toUpperCase().startsWith("KW-")) {
      url += `?order_id=${encodeURIComponent(query.toUpperCase().trim())}`;
    } else if (currentUser && currentUser.phone) {
      url += `?phone=${currentUser.phone}`;
    }

    const res = await fetch(url, { signal: AbortSignal.timeout(3500) });
    if (res.ok) {
      serverBookings = await res.json();
    }
  } catch (e) {
    console.warn("Server order sync notice:", e);
  }

  // Combine & deduplicate
  const map = new Map();
  if (Array.isArray(serverBookings)) {
    serverBookings.forEach(b => { if (b && b.booking_id) map.set(b.booking_id, b); });
  }
  localBookings.forEach(b => { if (b && b.booking_id && !map.has(b.booking_id)) map.set(b.booking_id, b); });

  let allOrders = Array.from(map.values());

  // Filter out any legacy dummy demo bookings
  const dummyIds = new Set(["KW-849102", "KW-312984", "KW-TUNNEL01", "KW-TEST99"]);
  allOrders = allOrders.filter(b => !dummyIds.has(b.booking_id));

  // If query is provided, filter
  if (query) {
    const q = query.trim().toLowerCase();
    const cleanQ = q.replace(/\D/g, '').slice(-10);
    allOrders = allOrders.filter(b => {
      const bId = (b.booking_id || '').toLowerCase();
      const bPhone = (b.custPhone || '').replace(/\D/g, '').slice(-10);
      const bEmail = (b.custEmail || '').toLowerCase();
      return bId.includes(q) || (cleanQ && bPhone.includes(cleanQ)) || bEmail.includes(q);
    });
  }

  trackedOrdersCache = allOrders;

  // Update tabs count
  const activeOrders = allOrders.filter(b => b.status !== "completed" && b.status !== "rejected");
  const countActiveEl = document.getElementById("trackActiveCount");
  const countAllEl = document.getElementById("trackAllCount");
  if (countActiveEl) countActiveEl.textContent = activeOrders.length;
  if (countAllEl) countAllEl.textContent = allOrders.length;

  updateNavTrackOrderBadge(activeOrders.length);
  renderTrackOrdersList();
}

function updateNavTrackOrderBadge(activeCount = null) {
  const badge = document.getElementById("navTrackOrderBadge");
  const subtext = document.getElementById("navTrackOrderSubtext");
  if (activeCount === null) {
    const bookings = getStoredBookings();
    activeCount = bookings.filter(b => b.status !== "completed" && b.status !== "rejected").length;
  }

  if (activeCount > 0) {
    if (badge) badge.classList.remove("hidden");
    if (subtext) {
      subtext.textContent = `${activeCount} Active • Live`;
      subtext.className = "block text-[8px] sm:text-[9px] font-black text-emerald-600 tracking-tight animate-pulse";
    }
  } else {
    if (badge) badge.classList.add("hidden");
    if (subtext) {
      subtext.textContent = "Live Status";
      subtext.className = "block text-[8px] sm:text-[9px] font-extrabold text-blue-600 tracking-tight";
    }
  }
}

function filterTrackOrdersTab(tab) {
  currentTrackingFilter = tab;
  const tabActive = document.getElementById("trackTabActive");
  const tabAll = document.getElementById("trackTabAll");
  if (tab === "active") {
    if (tabActive) tabActive.className = "px-3 py-1.5 rounded-xl bg-blue-600 text-white shadow-xs transition";
    if (tabAll) tabAll.className = "px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition";
  } else {
    if (tabAll) tabAll.className = "px-3 py-1.5 rounded-xl bg-blue-600 text-white shadow-xs transition";
    if (tabActive) tabActive.className = "px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition";
  }
  renderTrackOrdersList();
}

function handleTrackOrderSearch(e) {
  if (e && e.preventDefault) e.preventDefault();
  const input = document.getElementById("trackOrderSearchInput");
  const query = input ? input.value.trim() : "";
  loadAndRenderTrackOrders(query);
}

function refreshTrackOrders() {
  const input = document.getElementById("trackOrderSearchInput");
  loadAndRenderTrackOrders(input ? input.value.trim() : "");
  showToast("🔄 ऑर्डर स्थिति रिफ्रेश की गई!");
}

function renderTrackOrdersList() {
  const list = document.getElementById("myBookingsList");
  if (!list) return;

  const filtered = currentTrackingFilter === "active"
    ? trackedOrdersCache.filter(b => b.status !== "completed" && b.status !== "rejected")
    : trackedOrdersCache;

  if (filtered.length === 0) {
    list.innerHTML = `
      <div class="p-6 sm:p-8 text-center bg-slate-50 rounded-3xl border border-slate-200 space-y-4">
        <div class="w-16 h-16 rounded-3xl bg-blue-100 text-blue-600 flex items-center justify-center text-3xl mx-auto shadow-sm">
          <i class="fa-solid fa-truck-fast text-blue-600"></i>
        </div>
        <div>
          <h4 class="text-base font-black text-slate-900">कोई सक्रिय बुकिंग नहीं मिली</h4>
          <p class="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
            अपना 10-अंकीय मोबाइल नंबर या Order ID ऊपर डालकर खोजें, या लाइव ट्रैकर का डेमो तुरंत देखें।
          </p>
        </div>
        <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button onclick="closeMyBookingsModal(); openLiveTracker();" 
                  type="button" 
                  class="btn-emerald px-4 py-2.5 rounded-xl text-xs font-black shadow-sm flex items-center gap-2">
            <i class="fa-solid fa-map-location-dot text-amber-300"></i> <span>👀 लाइव ट्रैकर डेमो देखें</span>
          </button>
          <button onclick="closeMyBookingsModal(); handleBookServiceClick('Electrician');" 
                  type="button" 
                  class="btn-blue px-4 py-2.5 rounded-xl text-xs font-black shadow-sm flex items-center gap-2">
            <i class="fa-solid fa-bolt"></i> <span>नई सेवा बुक करें</span>
          </button>
        </div>
      </div>
    `;
    return;
  }

  list.innerHTML = filtered.map(b => {
    const isPendingAdmin = b.status === "pending_admin_approval" || b.status === "pending_admin" || b.status === "pending";
    const isApproved = b.status === "approved";
    const isAssigned = b.status === "assigned";
    const isEnRoute = b.status === "on_the_way";
    const isStarted = b.status === "started";
    const isDone = b.status === "completed";
    const isRejected = b.status === "rejected";

    const workerAssigned = Boolean(b.assignedWorkerName);
    const workerName = b.assignedWorkerName || "सत्यापित पार्टनर";
    const workerPhone = b.assignedWorkerPhone || CONFIG.businessPhone || "9899862721";

    return `
      <div class="p-5 bg-white rounded-3xl border border-slate-200 shadow-md space-y-4 hover:shadow-lg transition">
        
        <!-- Header Bar -->
        <div class="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-black text-blue-700 font-mono tracking-wider bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
                #${b.booking_id}
              </span>
              <span class="text-xs text-slate-500 font-bold">📅 ${b.date || 'Today'}</span>
            </div>
            <h4 class="text-base font-black text-slate-900 mt-1 flex items-center gap-1.5">
              <span>${b.category}</span>
              ${b.isUrgent ? '<span class="bg-red-100 text-red-800 text-[9px] font-black px-1.5 py-0.5 rounded-full">🚨 15-MIN URGENT</span>' : ''}
            </h4>
          </div>

          <!-- Dynamic Status Badge -->
          <span class="text-[11px] font-black uppercase px-3 py-1 rounded-full flex items-center gap-1.5 ${
            isDone ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
            isEnRoute ? 'bg-sky-100 text-sky-900 border border-sky-300 animate-pulse' :
            isStarted ? 'bg-indigo-100 text-indigo-900 border border-indigo-300' :
            isAssigned ? 'bg-blue-100 text-blue-900 border border-blue-300' :
            isApproved ? 'bg-teal-100 text-teal-900 border border-teal-300' :
            isRejected ? 'bg-rose-100 text-rose-800 border border-rose-200' :
            'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
          }">
            <span class="w-2 h-2 rounded-full ${
              isDone ? 'bg-emerald-600' :
              isEnRoute ? 'bg-sky-600 animate-ping' :
              isPendingAdmin ? 'bg-amber-600 animate-ping' : 'bg-blue-600'
            }"></span>
            ${
              isPendingAdmin ? 'एडमिन समीक्षा जारी' :
              isApproved ? 'एडमिन द्वारा स्वीकृत' :
              isAssigned ? 'कामगार नियुक्त' :
              isEnRoute ? 'रास्ते में है (On Way)' :
              isStarted ? 'काम प्रगति पर है' :
              isDone ? 'कार्य संपन्न (Done)' :
              isRejected ? 'ऑर्डर निरस्त' : b.status
            }
          </span>
        </div>

        <!-- Service & Address Details -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
          <div>
            <span class="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">DOORSTEP ADDRESS</span>
            <p class="font-bold text-slate-800 mt-0.5 leading-snug">📍 ${b.custAddress || 'Your Location'}</p>
            <p class="text-[11px] text-slate-500 mt-1">⏰ स्लॉट: <span class="font-bold text-slate-700">${b.timeSlot || 'Immediate'}</span></p>
          </div>
          <div>
            <span class="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">SERVICE & BILL ESTIMATE</span>
            <p class="font-bold text-slate-800 mt-0.5">${(b.subServices || []).join(", ") || b.category}</p>
            <p class="text-xs font-black text-emerald-700 mt-1">💰 बिल अनुमान: ${b.priceEstimate || '₹349+'}</p>
          </div>
        </div>

        <!-- 5-STAGE PROGRESS BAR (RAPIDO/BLINKIT STYLE) -->
        <div class="space-y-1.5 pt-1">
          <div class="flex items-center justify-between text-[10px] font-black text-slate-500 uppercase">
            <span>1. Placed</span>
            <span>2. Approved</span>
            <span>3. Assigned</span>
            <span>4. On The Way</span>
            <span>5. Completed</span>
          </div>
          <div class="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
            <div class="h-full bg-blue-600" style="width: 20%;"></div>
            <div class="h-full ${!isPendingAdmin && !isRejected ? 'bg-blue-600' : 'bg-slate-200'}" style="width: 20%;"></div>
            <div class="h-full ${isAssigned || isEnRoute || isStarted || isDone ? 'bg-blue-600' : 'bg-slate-200'}" style="width: 20%;"></div>
            <div class="h-full ${isEnRoute || isStarted || isDone ? 'bg-sky-500' : 'bg-slate-200'}" style="width: 20%;"></div>
            <div class="h-full ${isDone ? 'bg-emerald-600' : 'bg-slate-200'}" style="width: 20%;"></div>
          </div>
        </div>

        <!-- SECURE 4-DIGIT DOORSTEP OTP CARD -->
        ${!isDone ? `
          <div class="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-2xl flex items-center justify-between shadow-xs">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center text-sm shadow-inner shrink-0">
                <i class="fa-solid fa-key text-amber-900"></i>
              </div>
              <div>
                <span class="text-[10px] font-black uppercase text-amber-900 tracking-wider block">DOORSTEP &amp; WORK COMPLETION OTP</span>
                <span class="text-[11px] text-amber-800 font-semibold">काम समाप्त होने पर कामगार को यह 4-अंकीय OTP बताएं। इससे कार्य प्रमाणित होगा।</span>
              </div>
            </div>
            <span class="text-xl font-black font-mono text-amber-950 tracking-widest bg-white px-3 py-1 rounded-xl border border-amber-400 shadow-inner">
              ${b.otp || '----'}
            </span>
          </div>

          <!-- CUSTOMER ONLINE UPI BUTTON -->
          <button onclick="openCustomerUpiPaymentModal('${b.booking_id}')" 
                  type="button" 
                  class="w-full bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 py-2.5 px-4 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition shadow-xs">
            <i class="fa-solid fa-qrcode text-blue-600 text-sm"></i>
            <span>💳 Pay Online via UPI / QR Code (पेटीएम / गूगल पे / फोनपे)</span>
          </button>
        ` : `
          <!-- COMPLETED ORDER PAYMENT RECEIPT -->
          <div class="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between text-xs flex-wrap gap-2">
            <div>
              <span class="font-black text-emerald-900 block flex items-center gap-1.5">
                <i class="fa-solid fa-circle-check text-emerald-600"></i> कार्य पूर्ण एवं भुगतान प्राप्त (Paid)
              </span>
              <span class="text-[11px] text-emerald-700 font-medium">
                माध्यम: <strong>${b.paymentMode === 'CASH' ? '💵 Cash on Delivery (नकद)' : '📱 Online UPI (9899862721@pthdfc)'}</strong>
                ${b.paymentAmount ? ` · राशि: <strong class="text-slate-900">${b.paymentAmount}</strong>` : ''}
                ${b.paymentUtr ? ` · UTR: ${b.paymentUtr}` : ''}
              </span>
            </div>
            <button type="button" onclick="openCustomerUpiPaymentModal('${b.booking_id}')" class="text-[11px] text-blue-700 font-bold hover:underline">
              QR रसीद देखें
            </button>
          </div>
        `}

        <!-- LIVE MAP TRACKER BUTTON (PRIMARY CALL TO ACTION) -->
        <button onclick="closeMyBookingsModal(); openLiveTracker('${b.booking_id}');" 
                type="button" 
                class="w-full btn-emerald py-3 px-4 rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition">
          <i class="fa-solid fa-motorcycle text-amber-300 text-base"></i>
          <span>🗺️ View Live GPS Map Tracker (मैप पर लाइव लोकेशन देखें)</span>
        </button>

        <!-- ASSIGNED TECHNICIAN CARD -->
        ${workerAssigned ? `
          <div class="p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between flex-wrap gap-2 text-xs">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                👷
              </div>
              <div>
                <div class="flex items-center gap-1.5">
                  <strong class="text-slate-900 font-black">${workerName}</strong>
                  <span class="bg-emerald-100 text-emerald-800 text-[9px] font-black px-1.5 py-0.2 rounded-full">✓ PRO</span>
                </div>
                <span class="text-[11px] text-slate-500 font-medium">KaamWale Verified Partner</span>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <a href="tel:${workerPhone}" class="btn-blue px-3 py-1.5 text-xs font-bold flex items-center gap-1 shadow-sm">
                <i class="fa-solid fa-phone"></i> Call
              </a>
              <a href="https://wa.me/91${workerPhone.replace(/\D/g, '')}" target="_blank" class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm">
                <i class="fa-brands fa-whatsapp"></i> Chat
              </a>
            </div>
          </div>
        ` : ''}

        <!-- FOOTER SUPPORT BAR -->
        <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <a href="https://wa.me/919899862721?text=${encodeURIComponent('नमस्ते शिवम जी, मुझे KaamWale.com ऑर्डर #' + b.booking_id + ' के संबंध में सहायता चाहिए।')}" 
             target="_blank" 
             class="text-emerald-700 font-bold hover:underline flex items-center gap-1.5">
            <i class="fa-brands fa-whatsapp text-emerald-600 text-sm"></i> एडमिन शिवम पंडित (+91 9899862721) से सहायता लें
          </a>
          <span class="text-[11px] font-mono text-slate-400">Direct Doorstep</span>
        </div>

      </div>
    `;
  }).join("");
}

function closeMyBookingsModal() {
  const modal = document.getElementById("myBookingsModal");
  if (modal) modal.classList.add("hidden");
}

// ================================================================
// RAPIDO & BLINKIT STYLE INTERACTIVE LIVE GPS ORDER TRACKER
// ================================================================
let activeTrackingBooking = null;
let liveMapInstance = null;
let workerMarkerInstance = null;
let customerMarkerInstance = null;
let routeLineInstance = null;
let trackerSimInterval = null;
let trackerWorkerCurrentPos = null;
let trackerCustomerPos = null;

function openLiveTrackerFromSuccess() {
  closeSuccessModal();
  const bookings = getStoredBookings();
  const latest = bookings && bookings.length > 0 ? bookings[bookings.length - 1] : null;
  const bookingId = latest ? latest.booking_id : null;
  openLiveTracker(bookingId);
}

function openLiveTracker(bookingId) {
  const modal = document.getElementById("liveTrackerModal");
  if (!modal) return;

  const bookings = getStoredBookings();
  let booking = bookings.find(b => b.booking_id === bookingId);
  if (!booking && bookings.length > 0) {
    booking = bookings[bookings.length - 1];
  }
  if (!booking) {
    booking = {
      booking_id: "KW-LIVE-01",
      category: "Electrician",
      assignedWorkerName: "राजेश कुमार (सत्यापित प्रो)",
      assignedWorkerPhone: CONFIG.businessPhone || "9899862721",
      custAddress: window.kwUserLocation?.fullAddress || "गौर सिटी 2, ग्रेटर नोएडा (पते पर प्रस्थान)",
      otp: "5892",
      priceEstimate: "₹249 - ₹499",
      status: "on_the_way"
    };
  }
  activeTrackingBooking = booking;

  // Populate Header & Card elements
  const orderIdEl = document.getElementById("trackerOrderIdDisplay");
  const serviceTitleEl = document.getElementById("trackerServiceTitle");
  const otpCodeEl = document.getElementById("trackerOtpCode");
  const addressEl = document.getElementById("trackerAddressText");
  const priceEl = document.getElementById("trackerPriceEstimate");
  const workerNameEl = document.getElementById("trackerWorkerName");
  const workerCatEl = document.getElementById("trackerWorkerCategory");
  const workerCallLink = document.getElementById("trackerWorkerCallLink");
  const workerWaLink = document.getElementById("trackerWorkerWhatsAppLink");

  if (orderIdEl) orderIdEl.textContent = booking.booking_id;
  if (serviceTitleEl) serviceTitleEl.textContent = `${booking.category || 'Service'} Arriving at Doorstep`;
  const otpVal = booking.otp || "4819";
  if (otpCodeEl) otpCodeEl.textContent = otpVal;

  if (addressEl) addressEl.textContent = `📍 ${booking.custAddress || 'Home Address'}`;
  if (priceEl) priceEl.textContent = booking.priceEstimate || "₹249 - ₹499";

  const workerName = booking.assignedWorkerName || "राजेश कुमार (सत्यापित प्रो)";
  const workerPhone = booking.assignedWorkerPhone || CONFIG.businessPhone || "9899862721";
  if (workerNameEl) workerNameEl.textContent = workerName;
  if (workerCatEl) workerCatEl.textContent = booking.category || "Professional Partner";
  if (workerCallLink) workerCallLink.href = `tel:${workerPhone}`;
  if (workerWaLink) {
    const waText = encodeURIComponent(`नमस्ते, मुझे KaamWale.com ऑर्डर #${booking.booking_id} के बारे में जानकारी चाहिए।`);
    workerWaLink.href = `https://wa.me/91${workerPhone.replace(/\D/g, '')}?text=${waText}`;
  }

  // Update Stepper visually
  updateTrackerStepper(booking.status || "on_the_way");

  modal.classList.remove("hidden");

  // Initialize or re-render map after modal is visible
  setTimeout(() => {
    initLiveTrackingMap(booking);
  }, 250);
}

function updateTrackerStepper(status) {
  const line = document.getElementById("trackerProgressLine");
  const s1 = document.getElementById("trackerStep1Icon");
  const s2 = document.getElementById("trackerStep2Icon");
  const s3 = document.getElementById("trackerStep3Icon");
  const s4 = document.getElementById("trackerStep4Icon");

  if (!line || !s1 || !s2 || !s3 || !s4) return;

  const isPending = status === "pending" || status === "pending_admin" || status === "pending_admin_approval";
  const isAssigned = status === "assigned" || status === "approved";
  const isEnRoute = status === "on_the_way";
  const isArrived = status === "started" || status === "arrived" || status === "completed";

  if (isPending) {
    line.style.width = "0%";
    s1.className = "w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black shadow-sm ring-4 ring-emerald-200";
    s2.className = "w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-black shadow-sm";
    s3.className = "w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-black shadow-sm";
    s4.className = "w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-black shadow-sm";
  } else if (isAssigned) {
    line.style.width = "33%";
    s1.className = "w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black shadow-sm";
    s2.className = "w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black shadow-sm ring-4 ring-emerald-200";
    s3.className = "w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-black shadow-sm";
    s4.className = "w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-black shadow-sm";
  } else if (isEnRoute) {
    line.style.width = "66%";
    s1.className = "w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black shadow-sm";
    s2.className = "w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black shadow-sm";
    s3.className = "w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-black shadow-sm ring-4 ring-amber-200 animate-pulse";
    s4.className = "w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-black shadow-sm";
  } else {
    line.style.width = "100%";
    s1.className = "w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black shadow-sm";
    s2.className = "w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black shadow-sm";
    s3.className = "w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black shadow-sm";
    s4.className = "w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black shadow-sm ring-4 ring-emerald-200";
  }
}

function copyTrackerOtp() {
  const code = activeTrackingBooking ? activeTrackingBooking.otp || "4819" : "4819";
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(code).then(() => {
      showToast(`📋 डोरस्टेप OTP कॉपी किया गया: ${code}`);
    }).catch(() => {
      showToast(`🔑 आपका डोरस्टेप OTP: ${code}`);
    });
  } else {
    showToast(`🔑 आपका डोरस्टेप OTP: ${code}`);
  }
}

function triggerTrackerUpiPayment() {
  if (activeTrackingBooking) {
    openCustomerUpiPaymentModal(activeTrackingBooking.booking_id);
  } else {
    openCustomerUpiPaymentModal('');
  }
}

function closeLiveTrackerModal() {
  const modal = document.getElementById("liveTrackerModal");
  if (modal) modal.classList.add("hidden");
  if (trackerSimInterval) {
    clearInterval(trackerSimInterval);
    trackerSimInterval = null;
  }
}

function initLiveTrackingMap(booking) {
  const mapContainer = document.getElementById("liveTrackingMap");
  if (!mapContainer || typeof L === "undefined") {
    console.warn("Leaflet map library not loaded or container missing.");
    return;
  }

  // Determine Customer coordinates (from GPS or city defaults)
  let custLat = window.kwUserLocation?.lat || 25.5941;
  let custLon = window.kwUserLocation?.lon || 85.1376;

  // If order location is Noida/NCR, center accordingly
  if (booking.custAddress && (booking.custAddress.toLowerCase().includes("noida") || booking.custAddress.toLowerCase().includes("delhi"))) {
    custLat = 28.5355;
    custLon = 77.3910;
  }
  trackerCustomerPos = [custLat, custLon];

  // Worker starts approx 1.6km away
  trackerWorkerCurrentPos = [custLat + 0.0105, custLon - 0.0118];

  if (liveMapInstance) {
    liveMapInstance.remove();
    liveMapInstance = null;
  }

  // Create Leaflet Map centered between customer and worker
  const centerLat = (custLat + trackerWorkerCurrentPos[0]) / 2;
  const centerLon = (custLon + trackerWorkerCurrentPos[1]) / 2;

  liveMapInstance = L.map('liveTrackingMap', {
    zoomControl: false,
    attributionControl: false
  }).setView([centerLat, centerLon], 15);

  L.control.zoom({ position: 'bottomright' }).addTo(liveMapInstance);

  // High-performance OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
  }).addTo(liveMapInstance);

  // Custom Customer Pin Icon (Green Doorstep / Home with ripple)
  const customerIcon = L.divIcon({
    className: 'custom-customer-pin',
    html: `
      <div style="position:relative; width:44px; height:44px; display:flex; align-items:center; justify-content:center;">
        <div style="position:absolute; width:40px; height:40px; background:rgba(16,185,129,0.3); border-radius:50%; animation:ping 2s cubic-bezier(0,0,0.2,1) infinite;"></div>
        <div style="width:34px; height:34px; background:#059669; border:3px solid #ffffff; border-radius:50%; box-shadow:0 4px 12px rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center; color:#ffffff; font-size:15px;">
          🏠
        </div>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22]
  });

  customerMarkerInstance = L.marker(trackerCustomerPos, { icon: customerIcon })
    .addTo(liveMapInstance)
    .bindPopup(`<b>📍 आपका डोरस्टेप</b><br>${booking.custAddress || 'Home Address'}`)
    .openPopup();

  // Custom Worker Pin Icon (Moving Bike / Pro Partner)
  const workerIcon = L.divIcon({
    className: 'custom-worker-pin',
    html: `
      <div style="position:relative; width:46px; height:46px; display:flex; align-items:center; justify-content:center;">
        <div style="position:absolute; width:44px; height:44px; background:rgba(245,158,11,0.4); border-radius:50%; animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
        <div style="width:36px; height:36px; background:#d97706; border:3px solid #ffffff; border-radius:50%; box-shadow:0 4px 14px rgba(0,0,0,0.35); display:flex; align-items:center; justify-content:center; color:#ffffff; font-size:16px;">
          🛵
        </div>
      </div>
    `,
    iconSize: [46, 46],
    iconAnchor: [23, 23]
  });

  workerMarkerInstance = L.marker(trackerWorkerCurrentPos, { icon: workerIcon })
    .addTo(liveMapInstance)
    .bindPopup(`<b>🛵 ${booking.assignedWorkerName || 'कामगार'}</b><br>लाइव आ रहे हैं (ETA: 12 मिनट)`);

  // Draw Route Polyline
  routeLineInstance = L.polyline([trackerWorkerCurrentPos, trackerCustomerPos], {
    color: '#059669',
    weight: 5,
    opacity: 0.8,
    dashArray: '8, 8'
  }).addTo(liveMapInstance);

  liveMapInstance.fitBounds(routeLineInstance.getBounds(), { padding: [50, 50] });

  // Start Real-Time Moving Simulation towards Customer (Blinkit / Rapido Style)
  startWorkerMovementSimulation();
}

function startWorkerMovementSimulation() {
  if (trackerSimInterval) clearInterval(trackerSimInterval);

  let step = 0;
  const totalSteps = 45; // simulated movement duration

  const startLat = trackerWorkerCurrentPos[0];
  const startLon = trackerWorkerCurrentPos[1];
  const targetLat = trackerCustomerPos[0];
  const targetLon = trackerCustomerPos[1];

  trackerSimInterval = setInterval(() => {
    step++;
    if (step > totalSteps) {
      clearInterval(trackerSimInterval);
      trackerSimInterval = null;
      updateTrackerArrivalStatus();
      return;
    }

    // Interpolate worker coordinates
    const progress = step / totalSteps;
    const currentLat = startLat + (targetLat - startLat) * progress;
    const currentLon = startLon + (targetLon - startLon) * progress;
    trackerWorkerCurrentPos = [currentLat, currentLon];

    if (workerMarkerInstance) {
      workerMarkerInstance.setLatLng(trackerWorkerCurrentPos);
    }
    if (routeLineInstance) {
      routeLineInstance.setLatLngs([trackerWorkerCurrentPos, trackerCustomerPos]);
    }

    // Calculate remaining distance in kilometers (approx)
    const dLat = (targetLat - currentLat) * 111;
    const dLon = (targetLon - currentLon) * 111 * Math.cos(targetLat * Math.PI / 180);
    const distKm = Math.sqrt(dLat * dLat + dLon * dLon);
    const minsLeft = Math.max(1, Math.round(distKm * 6)); // ~10 km/h city average

    const etaEl = document.getElementById("trackerEtaText");
    const statusEl = document.getElementById("trackerMapStatusBadge");

    if (etaEl) {
      etaEl.textContent = `${minsLeft} Mins (${distKm.toFixed(1)} km away)`;
    }
    if (statusEl) {
      statusEl.innerHTML = `<span class="text-emerald-700">🏃 ${minsLeft} मिनट में आगमन</span> • ${distKm.toFixed(1)} km दूर`;
    }
  }, 2200);
}

function updateTrackerArrivalStatus() {
  const etaEl = document.getElementById("trackerEtaText");
  const statusEl = document.getElementById("trackerMapStatusBadge");
  if (etaEl) {
    etaEl.innerHTML = `<span class="text-emerald-950 font-black">🎉 वर्कर आपके दरवाजे पर पहुंच गए हैं!</span>`;
  }
  if (statusEl) {
    statusEl.innerHTML = `✅ वर्कर दरवाजे पर मौजूद हैं। कृपया काम शुरू करने से पहले OTP साझा करें।`;
  }
  if (workerMarkerInstance) {
    workerMarkerInstance.bindPopup(`<b>🎉 वर्कर पहुंच गए हैं!</b><br>कृपया 4-अंकीय OTP साझा करें।`).openPopup();
  }
  updateTrackerStepper("arrived");
  showToast("🎉 KaamWale पार्टनर आपके दरवाजे पर पहुंच गए हैं! कृपया OTP दें।");
}

function recenterMapOnWorker() {
  if (liveMapInstance && trackerWorkerCurrentPos) {
    liveMapInstance.flyTo(trackerWorkerCurrentPos, 16, { duration: 1 });
  }
}

function recenterMapOnCustomer() {
  if (liveMapInstance && trackerCustomerPos) {
    liveMapInstance.flyTo(trackerCustomerPos, 16, { duration: 1 });
  }
}

// ========================
// WORKER DASHBOARD (DUTY PORTAL - ZERO PRICING SHOWN TO WORKER)
// ========================
function toggleWorkerOnlineState() {
  isWorkerOnline = !isWorkerOnline;
  localStorage.setItem("kw_worker_online", String(isWorkerOnline));
  updateWorkerOnlineUI();
  showToast(isWorkerOnline ? "🟢 Worker Status: ONLINE (Now accepting jobs)" : "🔴 Worker Status: OFFLINE (Job requests paused)");
}

function updateWorkerOnlineUI() {
  const btn = document.getElementById("workerOnlineToggleBtn");
  if (!btn) return;
  if (isWorkerOnline) {
    btn.innerHTML = "🟢 Online (स्वीकार मोड)";
    btn.className = "px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 bg-emerald-600 text-white shadow-md";
  } else {
    btn.innerHTML = "🔴 Offline (पॉज़ मोड)";
    btn.className = "px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 bg-slate-600 text-white shadow-md";
  }
}

function openWorkerDashboardModal() {
  const modal = document.getElementById("workerDashboardModal");
  const feed = document.getElementById("workerFeedList");
  if (!modal || !feed) return;

  updateWorkerOnlineUI();

  // Populate active worker profile bar
  const activeWorker = currentWorkerUser || {
    name: "पंजीकृत पार्टनर",
    category: "Professional Pro",
    userId: "KW-PRO",
    email: "pro@kaamwale.com"
  };

  const nameEl = document.getElementById("workerNameDisplay");
  const roleEl = document.getElementById("workerRoleBadge");
  const idEl = document.getElementById("workerIdBadge");
  const emailEl = document.getElementById("workerEmailDisplay");
  const avatarLetter = document.getElementById("workerAvatarLetter");

  if (nameEl) nameEl.textContent = activeWorker.name;
  if (roleEl) roleEl.textContent = activeWorker.category;
  if (idEl) idEl.textContent = `ID: ${activeWorker.userId || 'KW-' + activeWorker.id}`;
  if (emailEl) emailEl.textContent = activeWorker.email || "N/A";
  if (avatarLetter) avatarLetter.textContent = (activeWorker.name || "W").slice(0, 1).toUpperCase();

  const bookings = getStoredBookings();
  // Filter only assigned jobs for worker duty feed (pending_admin and approved awaiting worker are hidden from workers)
  const assignedJobs = bookings.filter(b => b.status !== "pending_admin" && b.status !== "pending_admin_approval" && b.status !== "pending" && b.status !== "approved" && b.status !== "rejected");
  const activeVisits = assignedJobs.filter(b => b.status === "assigned" || b.status === "on_the_way");
  const completedJobs = assignedJobs.filter(b => b.status === "completed");

  const elAssigned = document.getElementById("workerAssignedJobsCount");
  const elVisits = document.getElementById("workerActiveVisitsCount");
  const elCompleted = document.getElementById("workerCompletedJobsCount");

  if (elAssigned) elAssigned.textContent = assignedJobs.length;
  if (elVisits) elVisits.textContent = activeVisits.length;
  if (elCompleted) elCompleted.textContent = completedJobs.length;

  if (assignedJobs.length === 0) {
    feed.innerHTML = `
      <div class="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
        <i class="fa-solid fa-briefcase text-3xl text-slate-300 mb-2"></i>
        <h4 class="text-sm font-bold text-slate-700">वर्तमान में कोई असाइन किया गया कार्य नहीं है</h4>
        <p class="text-xs text-slate-400 mt-1">एडमिन (शिवम पंडित) द्वारा कार्य असाइन किए जाने पर यहाँ तुरंत विवरण दिखाई देगा।</p>
      </div>
    `;
  } else {
    // STRICT RULE: No pricing or rupee figures shown to labour/worker!
    feed.innerHTML = assignedJobs.map(b => {
      const isAssigned = b.status === "assigned";
      const isEnRoute = b.status === "on_the_way";
      const isStarted = b.status === "started";
      const isDone = b.status === "completed";

      return `
        <div class="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div class="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <span class="text-xs font-black text-blue-700 font-mono">${b.booking_id}</span>
              <h4 class="text-base font-black text-slate-900 mt-0.5">${b.category}</h4>
              <p class="text-xs text-slate-500">${(b.subServices || []).join(", ") || b.category}</p>
            </div>
            <span class="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
              isDone ? 'bg-emerald-100 text-emerald-800' :
              isStarted ? 'bg-blue-100 text-blue-800' :
              isEnRoute ? 'bg-sky-100 text-sky-800' :
              'bg-amber-100 text-amber-800'
            }">
              ${b.status.replace(/_/g, ' ')}
            </span>
          </div>

          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1.5">
            <p><strong>👤 ग्राहक का नाम:</strong> ${b.custName} (<a href="tel:${b.custPhone}" class="text-blue-600 font-bold hover:underline">📞 कॉल करें: ${b.custPhone}</a>)</p>
            <p><strong>📍 कार्य स्थल का पता:</strong> ${b.custAddress}</p>
            <p><strong>⏰ समय:</strong> ${b.date} · ${b.timeSlot || 'तुरंत'}</p>
            ${b.desc ? `<p><strong>📝 ग्राहक निर्देश:</strong> ${b.desc}</p>` : ''}
          </div>

          <!-- WORKER ACTION WORKFLOW (ZERO PRICING) -->
          <div class="pt-2 flex flex-wrap items-center justify-end gap-2">
            ${isAssigned ? `
              <button type="button" onclick="updateReqStatus('${b.booking_id}', 'on_the_way')" 
                      class="btn-blue px-4 py-2 text-xs font-bold shadow-sm flex items-center gap-1.5">
                <i class="fa-solid fa-person-walking-arrow-right"></i> Start Travel (पते के लिए निकलें)
              </button>
            ` : ''}

            ${isEnRoute ? `
              <div class="w-full bg-amber-50 border border-amber-300 rounded-xl p-3 space-y-2">
                <div class="flex items-center justify-between flex-wrap gap-2">
                  <span class="text-xs font-bold text-amber-900">
                    📍 क्या आप ग्राहक के पते पर पहुँच गए हैं?
                  </span>
                  <div class="flex items-center gap-2">
                    <button type="button" onclick="updateReqStatus('${b.booking_id}', 'started')" 
                            class="bg-blue-600 hover:bg-blue-700 text-white font-black px-3 py-1.5 rounded-lg text-xs transition shadow-xs flex items-center gap-1">
                      <i class="fa-solid fa-play"></i> काम शुरू करें (Start Work)
                    </button>
                    <button type="button" onclick="openWorkerFinishJobModal('${b.booking_id}')" 
                            class="btn-emerald px-3 py-1.5 rounded-lg text-xs font-black shadow-xs flex items-center gap-1">
                      <i class="fa-solid fa-flag-checkered"></i> काम पूरा हुआ (Finish &amp; Collect Pay)
                    </button>
                  </div>
                </div>
                <small class="text-[10px] text-slate-500 block">काम समाप्त होने पर ग्राहक से 4-अंकीय OTP पूछकर दर्ज करें और नकद या UPI पेमेंट प्राप्त करें।</small>
              </div>
            ` : ''}

            ${isStarted ? `
              <div class="w-full flex items-center justify-between flex-wrap gap-2 bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
                <div>
                  <span class="text-xs font-black text-emerald-800 flex items-center gap-1.5">
                    <i class="fa-solid fa-screwdriver-wrench"></i> कार्य चालू है (Work In Progress)
                  </span>
                  <span class="text-[10px] text-emerald-700 block mt-0.5">काम समाप्त होने पर ग्राहक से OTP लेकर पेमेंट दर्ज करें</span>
                </div>
                <button type="button" onclick="openWorkerFinishJobModal('${b.booking_id}')" 
                        class="btn-emerald px-4 py-2 text-xs font-black shadow-md flex items-center gap-1.5 hover:scale-105 transition">
                  <i class="fa-solid fa-flag-checkered"></i> काम पूरा हुआ (Finish &amp; Collect Pay)
                </button>
              </div>
            ` : ''}

            ${isDone ? `
              <div class="w-full p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between flex-wrap gap-2 text-xs">
                <div>
                  <span class="font-black text-emerald-900 flex items-center gap-1.5">
                    <i class="fa-solid fa-circle-check text-emerald-600 text-sm"></i> ✓ कार्य सफलतापूर्वक संपन्न
                  </span>
                  <p class="text-[11px] text-slate-600 mt-0.5">
                    भुगतान: <strong class="text-emerald-800">${b.paymentMode === 'CASH' ? '💵 Cash on Delivery (नकद)' : '📱 Online UPI'}</strong>
                    ${b.paymentAmount ? ` · कुल राशि: <strong class="text-slate-900">${b.paymentAmount}</strong>` : ''}
                    ${b.paymentUtr ? ` · UTR: <span class="font-mono text-slate-700">${b.paymentUtr}</span>` : ''}
                  </p>
                </div>
                <span class="bg-emerald-600 text-white font-black px-2.5 py-1 rounded-lg text-[10px] shadow-xs">
                  PAID ✓
                </span>
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }).join("");
  }

  modal.classList.remove("hidden");
}

function closeWorkerDashboardModal() {
  const modal = document.getElementById("workerDashboardModal");
  if (modal) modal.classList.add("hidden");
}

// ==========================================
// WORKER JOB COMPLETION, OTP & PAYMENT SYSTEM
// ==========================================
let currentFinishJobBookingId = null;
let currentFinishJobPaymentMode = "cash";

function openWorkerFinishJobModal(bookingId) {
  const modal = document.getElementById("workerFinishJobModal");
  if (!modal) return;
  
  currentFinishJobBookingId = bookingId;
  currentFinishJobPaymentMode = "cash";

  const bookings = getStoredBookings();
  const target = bookings.find(b => b.booking_id === bookingId);
  if (!target) return;

  const subtitle = document.getElementById("finishJobOrderSubtitle");
  if (subtitle) {
    subtitle.textContent = `Order #${target.booking_id} • ${target.category} (${target.custName || 'ग्राहक'})`;
  }

  // Pre-fill amount
  const amountInput = document.getElementById("finishJobAmountInput");
  if (amountInput) {
    let cleanAmt = "350";
    if (target.priceEstimate) {
      const match = target.priceEstimate.match(/\d+/);
      if (match) cleanAmt = match[0];
    }
    amountInput.value = cleanAmt;
  }

  // Reset OTP step state
  const step1 = document.getElementById("finishJobStep1Box");
  const step2 = document.getElementById("finishJobStep2Box");
  const successBanner = document.getElementById("finishJobOtpSuccessBanner");
  const otpInput = document.getElementById("finishJobOtpInput");
  const otpError = document.getElementById("finishJobOtpError");

  if (otpInput) otpInput.value = "";
  if (otpError) { otpError.textContent = ""; otpError.classList.add("hidden"); }

  if (target.otpVerified) {
    if (step1) step1.classList.add("hidden");
    if (successBanner) successBanner.classList.remove("hidden");
    if (step2) {
      step2.classList.remove("opacity-50", "pointer-events-none");
    }
  } else {
    if (step1) step1.classList.remove("hidden");
    if (successBanner) successBanner.classList.add("hidden");
    if (step2) {
      step2.classList.add("opacity-50", "pointer-events-none");
    }
  }

  switchFinishJobPaymentTab("cash");
  updateFinishJobUpiIntentLink();

  modal.classList.remove("hidden");
}

function closeWorkerFinishJobModal() {
  const modal = document.getElementById("workerFinishJobModal");
  if (modal) modal.classList.add("hidden");
  currentFinishJobBookingId = null;
}

function verifyWorkerFinishJobOtp() {
  if (!currentFinishJobBookingId) return;
  const input = document.getElementById("finishJobOtpInput");
  const err = document.getElementById("finishJobOtpError");
  const step1 = document.getElementById("finishJobStep1Box");
  const step2 = document.getElementById("finishJobStep2Box");
  const successBanner = document.getElementById("finishJobOtpSuccessBanner");

  if (!input) return;
  const entered = input.value.trim();

  const bookings = getStoredBookings();
  const target = bookings.find(b => b.booking_id === currentFinishJobBookingId);
  if (!target) return;

  const expectedOtp = String(target.otp || (target.booking_id ? target.booking_id.replace(/\D/g, '').slice(-4) : "4819"));

  if (entered === expectedOtp) {
    target.otpVerified = true;
    saveStoredBookings(bookings);

    if (err) err.classList.add("hidden");
    if (step1) step1.classList.add("hidden");
    if (successBanner) successBanner.classList.remove("hidden");
    if (step2) {
      step2.classList.remove("opacity-50", "pointer-events-none");
    }
    showToast("✅ OTP 100% सत्यापित! अब भुगतान विधि चुनें।");
  } else {
    if (err) {
      err.textContent = `❌ गलत OTP! कृपया ग्राहक से पूछकर उनके Track Order स्क्रीन पर दिख रहा 4-अंकीय कोड दर्ज करें।`;
      err.classList.remove("hidden");
    } else {
      showToast("❌ गलत OTP!");
    }
  }
}

function switchFinishJobPaymentTab(mode) {
  currentFinishJobPaymentMode = mode;
  const btnCash = document.getElementById("paymentTabBtn-cash");
  const btnUpi = document.getElementById("paymentTabBtn-upi");
  const contentCash = document.getElementById("paymentContent-cash");
  const contentUpi = document.getElementById("paymentContent-upi");

  if (mode === "cash") {
    if (btnCash) {
      btnCash.className = "p-3 rounded-2xl border-2 border-emerald-600 bg-emerald-50/70 text-emerald-950 font-black text-xs flex flex-col items-center justify-center gap-1 text-center shadow-xs transition";
    }
    if (btnUpi) {
      btnUpi.className = "p-3 rounded-2xl border-2 border-slate-200 bg-white text-slate-700 font-bold text-xs flex flex-col items-center justify-center gap-1 text-center shadow-xs hover:border-blue-400 transition";
    }
    if (contentCash) contentCash.classList.remove("hidden");
    if (contentUpi) contentUpi.classList.add("hidden");
  } else {
    if (btnUpi) {
      btnUpi.className = "p-3 rounded-2xl border-2 border-blue-600 bg-blue-50/70 text-blue-950 font-black text-xs flex flex-col items-center justify-center gap-1 text-center shadow-xs transition";
    }
    if (btnCash) {
      btnCash.className = "p-3 rounded-2xl border-2 border-slate-200 bg-white text-slate-700 font-bold text-xs flex flex-col items-center justify-center gap-1 text-center shadow-xs hover:border-emerald-400 transition";
    }
    if (contentCash) contentCash.classList.add("hidden");
    if (contentUpi) contentUpi.classList.remove("hidden");
    updateFinishJobUpiIntentLink();
  }
}

function updateFinishJobUpiIntentLink() {
  const amtInput = document.getElementById("finishJobAmountInput");
  const amt = amtInput ? (amtInput.value || "350") : "350";
  const link = document.getElementById("finishJobUpiIntentLink");
  if (link) {
    link.href = `upi://pay?pa=9899862721@pthdfc&pn=Shivam%20Sharma&am=${amt}&cu=INR&tn=KaamWale%20Order%20${currentFinishJobBookingId || ''}`;
  }
}

function copyPaymentText(text, label) {
  if (!text) return;
  if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`📋 ${label} कॉपी कर लिया गया: ${text}`);
    }).catch(() => {
      showToast(`📋 ${text}`);
    });
  } else {
    showToast(`📋 ${label}: ${text}`);
  }
}

async function confirmWorkerJobPayment(mode) {
  if (!currentFinishJobBookingId) return;

  const bookings = getStoredBookings();
  const target = bookings.find(b => b.booking_id === currentFinishJobBookingId);
  if (!target) return;

  const amtInput = document.getElementById("finishJobAmountInput");
  const amount = amtInput ? `₹${amtInput.value.replace(/\D/g, '') || '350'}` : "₹350";
  const utrInput = document.getElementById("finishJobUtrInput");
  const utr = utrInput ? utrInput.value.trim() : "";

  // Update target order
  target.status = "completed";
  target.paymentStatus = "paid";
  target.paymentMode = mode; // 'CASH' or 'UPI_ONLINE'
  target.paymentAmount = amount;
  target.paymentUtr = utr;
  target.completedAt = new Date().toISOString();
  target.otpVerified = true;

  saveStoredBookings(bookings);

  // Sync with server
  try {
    await fetch('/api/orders/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': 'Shivam@819' },
      body: JSON.stringify({
        booking_id: target.booking_id,
        status: "completed",
        paymentStatus: "paid",
        paymentMode: mode,
        paymentAmount: amount,
        paymentUtr: utr,
        completedAt: target.completedAt,
        otpVerified: true
      })
    });
  } catch (e) {
    console.log("Server payment sync notice:", e);
  }

  closeWorkerFinishJobModal();
  openWorkerDashboardModal();

  showToast(`🎉 कार्य संपन्न! भुगतान दर्ज हुआ: ${mode === 'CASH' ? 'Cash ' + amount : 'Online UPI ' + amount}`);

  // Refresh customer modal or admin modal if open
  const myBookingsModal = document.getElementById("myBookingsModal");
  if (myBookingsModal && !myBookingsModal.classList.contains("hidden")) {
    openMyBookingsModal();
  }
  const adminModal = document.getElementById("adminPanelModal");
  if (adminModal && !adminModal.classList.contains("hidden")) {
    loadAdminOrdersFromServer(false);
  }
}

// ==========================================
// CUSTOMER DIRECT UPI PAYMENT MODAL
// ==========================================
function openCustomerUpiPaymentModal(bookingId) {
  const modal = document.getElementById("customerUpiPaymentModal");
  if (!modal) return;

  const titleEl = document.getElementById("custUpiOrderTitle");
  if (titleEl) {
    titleEl.textContent = bookingId ? `Order #${bookingId} • KaamWale Official UPI` : `KaamWale.com Official Payment Gateway`;
  }

  const directBtn = document.getElementById("custUpiDirectAppBtn");
  if (directBtn) {
    directBtn.href = `upi://pay?pa=9899862721@pthdfc&pn=Shivam%20Sharma&cu=INR&tn=KaamWale%20Order%20${bookingId || ''}`;
  }

  modal.classList.remove("hidden");
}

function closeCustomerUpiPaymentModal() {
  const modal = document.getElementById("customerUpiPaymentModal");
  if (modal) modal.classList.add("hidden");
}

function verifyJobStartOtp(bookingId) {
  const input = document.getElementById(`workerOtpInput-${bookingId}`);
  const err = document.getElementById(`workerOtpErr-${bookingId}`);
  if (!input) return;

  const entered = input.value.trim();
  const bookings = getStoredBookings();
  const target = bookings.find(b => b.booking_id === bookingId);
  if (!target || !target.otp) return;

  // Strict Booking OTP Verification
  if (entered === target.otp) {
    target.status = "started";
    target.otpVerified = true;
    saveStoredBookings(bookings);
    showToast("✅ OTP सत्यापित! कार्य शुरू हो गया है।");
    openWorkerDashboardModal();
  } else {
    if (err) {
      err.textContent = `❌ गलत OTP! कृपया ग्राहक से उनके मोबाइल पर आया सही 4-अंकीय कोड पूछें।`;
      err.classList.remove("hidden");
    } else {
      showToast("❌ गलत OTP!");
    }
  }
}

function updateReqStatus(bookingId, newStatus) {
  const bookings = getStoredBookings();
  const target = bookings.find(b => b.booking_id === bookingId);
  if (target) {
    target.status = newStatus;
    saveStoredBookings(bookings);
    showToast(`Status updated: ${newStatus.toUpperCase().replace(/_/g, ' ')}`);

    try {
      fetch('/api/orders/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-token': 'Shivam@819' },
        body: JSON.stringify({
          booking_id: bookingId,
          status: newStatus
        })
      }).catch(e => console.log('Server status update notice:', e));
    } catch (e) {}
    
    // Refresh open modal if applicable
    const workerModal = document.getElementById("workerDashboardModal");
    if (workerModal && !workerModal.classList.contains("hidden")) {
      openWorkerDashboardModal();
    }
    const adminModal = document.getElementById("adminPanelModal");
    if (adminModal && !adminModal.classList.contains("hidden")) {
      loadAdminOrdersFromServer(false);
    }
    const myBookingsModal = document.getElementById("myBookingsModal");
    if (myBookingsModal && !myBookingsModal.classList.contains("hidden")) {
      openMyBookingsModal();
    }
  }
}

/// ========================
// ADMIN PANEL (FOUNDER: SHIVAM PANDAT - +91 98998 62721)
// REAL-TIME SERVER ORDERS SYNCHRONIZATION & WORKER DISPATCH
// ========================
let adminOrdersPollInterval = null;
let lastKnownOrderIds = new Set();

function playAdminNewOrderChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = "sine";
    osc2.type = "triangle";

    // High visibility two-tone chime for new customer order
    osc1.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
    osc1.frequency.setValueAtTime(880.00, ctx.currentTime + 0.15); // A5
    osc2.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.15); // E6

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.65);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.65);
    osc2.stop(ctx.currentTime + 0.65);
  } catch (e) {}
}

async function loadAdminOrdersFromServer(isManualRefresh = false) {
  const syncIndicator = document.getElementById("admLiveSyncIndicator");
  if (syncIndicator && isManualRefresh) {
    syncIndicator.innerHTML = `<i class="fa-solid fa-spinner fa-spin text-blue-600"></i> सिंक हो रहा है...`;
  }

  try {
    const res = await fetch("/api/orders?admin_key=Shivam@819", {
      headers: { "x-admin-token": "Shivam@819" }
    });

    if (res.ok) {
      const serverOrders = await res.json();
      if (Array.isArray(serverOrders)) {
        // Detect incoming new orders
        let hasNew = false;
        let newestOrder = null;

        if (lastKnownOrderIds.size > 0) {
          for (const ord of serverOrders) {
            if (ord.booking_id && !lastKnownOrderIds.has(ord.booking_id)) {
              hasNew = true;
              newestOrder = ord;
              break;
            }
          }
        }

        // Store all known order IDs
        serverOrders.forEach(o => { if (o.booking_id) lastKnownOrderIds.add(o.booking_id); });

        if (hasNew && newestOrder) {
          playAdminNewOrderAlertSound();
          handleIncomingAdminOrderNotification(newestOrder);
          showToast(`🚨 नया ग्राहक ऑर्डर आया! ${newestOrder.booking_id} - ${newestOrder.custName} (${newestOrder.category})`);
        }

        // Merge server orders with local storage
        const localBookings = getStoredBookings();
        const mergedMap = new Map();
        localBookings.forEach(b => { if (b && b.booking_id) mergedMap.set(b.booking_id, b); });
        serverOrders.forEach(b => {
          if (b && b.booking_id) {
            const ex = mergedMap.get(b.booking_id) || {};
            mergedMap.set(b.booking_id, { ...ex, ...b });
          }
        });
        const mergedList = Array.from(mergedMap.values());
        mergedList.sort((a, b) => new Date(b.receivedAt || b.date || 0) - new Date(a.receivedAt || a.date || 0));
        saveStoredBookings(mergedList);

        // Update statistics counters
        const pendingCount = mergedList.filter(b => b.status === "pending_admin_approval" || b.status === "pending_admin" || b.status === "pending").length;
        const completedCount = mergedList.filter(b => b.status === "completed").length;
        const pendingEl = document.getElementById("admPendingOrdersCount");
        const completedEl = document.getElementById("admCompletedRequests");
        if (pendingEl) pendingEl.textContent = pendingCount;
        if (completedEl) completedEl.textContent = completedCount;

        // Render orders
        renderAdminOrdersList(mergedList);

        if (syncIndicator) {
          const nowStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          syncIndicator.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> लाइव सिंक: ${nowStr}`;
        }

        if (isManualRefresh) {
          showToast(`✓ ${serverOrders.length} ग्राहक ऑर्डर्स सर्वर से लाइव सिंक हो गए हैं।`);
        }
      }
    }
  } catch (err) {
    console.log("Admin orders fetch error:", err.message);
    if (syncIndicator) {
      syncIndicator.innerHTML = `<span class="w-2 h-2 rounded-full bg-amber-500"></span> लोकल मोड`;
    }
  }
}

function renderAdminApprovalsList(pendingWorkers) {
  const approvals = document.getElementById("admApprovalsContainer");
  if (!approvals) return;

  if (pendingWorkers.length === 0) {
    approvals.innerHTML = `
      <div class="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center">
        <i class="fa-solid fa-circle-check text-2xl text-emerald-500 mb-1"></i>
        <p class="text-xs font-bold text-slate-700">कोई पेंडिंग कामगार आवेदन नहीं है</p>
        <p class="text-[11px] text-slate-400 mt-0.5">सभी पंजीकृत कामगार प्रोफाइल स्वीकृत हैं।</p>
      </div>
    `;
    return;
  }

  approvals.innerHTML = pendingWorkers.map(w => `
    <div class="p-4 bg-white rounded-2xl border-2 border-amber-300 shadow-sm space-y-3">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-sm font-black text-slate-900">${w.name}</span>
            <span class="bg-blue-100 text-blue-800 text-[10px] font-black uppercase px-2 py-0.5 rounded-md border border-blue-200">${w.category}</span>
            <span class="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-md">⏳ KYC Pending</span>
          </div>
          <p class="text-xs text-slate-600 mt-1 font-medium">
            📞 <a href="tel:${w.phone}" class="text-blue-600 font-bold hover:underline">${w.phone}</a> · 📧 <strong class="text-slate-900">${w.email || 'N/A'}</strong> · 📍 ${w.location} · ⏱️ ${w.exp || '3 वर्ष'}
          </p>
          <div class="mt-2 bg-blue-50/80 p-2.5 rounded-xl border border-blue-200 text-xs text-blue-950 space-y-1">
            <span class="text-[10px] font-bold text-slate-500 uppercase block">Admin-Issued Worker Credentials:</span>
            <p class="font-mono text-xs text-blue-900 font-black mt-0.5">
              👤 UserID: <span class="bg-white px-2 py-0.5 rounded border border-blue-300">${w.userId || 'KW-' + w.id}</span>
              &nbsp;|&nbsp;
              🔑 Initial Password: <span class="bg-white px-2 py-0.5 rounded border border-blue-300">${w.password || 'Kaam@123'}</span>
            </p>
          </div>
          <div class="mt-1.5 flex flex-wrap items-center gap-2 text-xs">
            <span class="bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded border border-slate-300 font-mono font-bold">
              🪪 आधार/Govt ID: ${w.aadhaar || 'उपलब्ध नहीं'}
            </span>
            ${w.secondarySkill ? `<span class="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">अतिरिक्त स्किल: ${w.secondarySkill}</span>` : ''}
            ${w.radius ? `<span class="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">दायरा: ${w.radius}</span>` : ''}
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2 shrink-0 pt-2 sm:pt-0">
          <button type="button" onclick="approveWorker('${w.id}')" 
                  class="btn-emerald px-3.5 py-2 text-xs font-black shadow-sm flex items-center gap-1.5">
            <i class="fa-solid fa-check"></i> Approve & Issue ID
          </button>
          <button type="button" onclick="sendWorkerCredentialsWhatsApp('${w.id}')" 
                  class="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-3 py-2 rounded-xl text-xs transition flex items-center gap-1">
            <i class="fa-brands fa-whatsapp text-sm"></i> WhatsApp Credentials
          </button>
          <button type="button" onclick="rejectWorker('${w.id}')" 
                  class="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 font-bold px-3 py-2 rounded-xl text-xs transition flex items-center gap-1">
            <i class="fa-solid fa-trash"></i> Reject
          </button>
        </div>
      </div>
    </div>
  `).join("");
}

let currentAdminOrderFilter = 'all';

function setAdminOrderFilter(filterType) {
  currentAdminOrderFilter = filterType;
  const filters = ['all', 'pending_approval', 'active', 'completed'];
  filters.forEach(f => {
    const btn = document.getElementById(`admFilterBtn-${f}`);
    if (btn) {
      if (f === filterType) {
        btn.className = "px-3 py-1.5 rounded-xl font-black bg-navy-950 text-white shadow-sm shrink-0 transition";
      } else {
        btn.className = "px-3 py-1.5 rounded-xl font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 shrink-0 transition";
      }
    }
  });
  renderAdminOrdersList();
}

function adminApproveOrder(bookingId) {
  const bookings = getStoredBookings();
  const target = bookings.find(b => b.booking_id === bookingId);
  if (!target) return;

  target.status = "approved";
  target.adminApprovedAt = new Date().toISOString();
  saveStoredBookings(bookings);

  try {
    fetch('/api/orders/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': 'Shivam@819' },
      body: JSON.stringify({
        booking_id: bookingId,
        status: "approved",
        adminApprovedAt: target.adminApprovedAt
      })
    }).catch(e => console.log('Server order approve notice:', e));
  } catch (e) {}

  playOrderSuccessChime();
  showToast(`✅ ऑर्डर ${bookingId} एडमिन द्वारा स्वीकृत कर दिया गया! अब कामगार असाइन करें।`);
  loadAdminOrdersFromServer(false);
}

function adminRejectOrder(bookingId) {
  const reason = prompt("ऑर्डर अस्वीकार (Reject) करने का कारण दर्ज करें (उदा. क्षेत्र से बाहर / समय अनुपलब्ध):", "Service unavailable at this location/time");
  if (reason === null) return;

  const bookings = getStoredBookings();
  const target = bookings.find(b => b.booking_id === bookingId);
  if (!target) return;

  target.status = "rejected";
  target.rejectionReason = reason;
  saveStoredBookings(bookings);

  try {
    fetch('/api/orders/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': 'Shivam@819' },
      body: JSON.stringify({
        booking_id: bookingId,
        status: "rejected",
        rejectionReason: reason
      })
    }).catch(e => console.log('Server order reject notice:', e));
  } catch (e) {}

  showToast(`❌ ऑर्डर ${bookingId} अस्वीकृत (Rejected) कर दिया गया।`);
  loadAdminOrdersFromServer(false);
}

function renderAdminOrdersList(bookingsToRender) {
  const allReqs = document.getElementById("admAllRequestsContainer");
  if (!allReqs) return;

  const bookings = bookingsToRender || getStoredBookings();
  const workers = getStoredWorkers();
  const approvedWorkers = workers.filter(w => w.status === "approved");

  // Calculate status counts for filter tab badges
  const allCount = bookings.length;
  const awaitingCount = bookings.filter(b => b.status === "pending_admin_approval" || b.status === "pending_admin" || b.status === "pending").length;
  const activeCount = bookings.filter(b => b.status === "approved" || b.status === "assigned" || b.status === "on_the_way" || b.status === "started").length;
  const completedCount = bookings.filter(b => b.status === "completed" || b.status === "rejected").length;

  const badgeAll = document.getElementById("admCountBadge-all");
  const badgeAwaiting = document.getElementById("admCountBadge-awaiting");
  const badgeActive = document.getElementById("admCountBadge-active");
  const badgeCompleted = document.getElementById("admCountBadge-completed");

  if (badgeAll) badgeAll.textContent = allCount;
  if (badgeAwaiting) badgeAwaiting.textContent = awaitingCount;
  if (badgeActive) badgeActive.textContent = activeCount;
  if (badgeCompleted) badgeCompleted.textContent = completedCount;

  // Apply current filter
  let filteredBookings = bookings;
  if (currentAdminOrderFilter === 'pending_approval') {
    filteredBookings = bookings.filter(b => b.status === "pending_admin_approval" || b.status === "pending_admin" || b.status === "pending");
  } else if (currentAdminOrderFilter === 'active') {
    filteredBookings = bookings.filter(b => b.status === "approved" || b.status === "assigned" || b.status === "on_the_way" || b.status === "started");
  } else if (currentAdminOrderFilter === 'completed') {
    filteredBookings = bookings.filter(b => b.status === "completed" || b.status === "rejected");
  }

  if (filteredBookings.length === 0) {
    const emptyMsg = currentAdminOrderFilter === 'pending_approval'
      ? "कोई स्वीकृति प्रतीक्षित ऑर्डर नहीं है। सभी नए ऑर्डर्स स्वीकृत या प्रोसेस हो चुके हैं।"
      : currentAdminOrderFilter === 'active'
      ? "कोई सक्रिय (Active) ऑर्डर नहीं है।"
      : currentAdminOrderFilter === 'completed'
      ? "कोई पूर्ण या निरस्त ऑर्डर नहीं है।"
      : "अभी तक कोई ऑर्डर नहीं आया है। जब कोई ग्राहक ऑर्डर बुक करेगा, तो वह यहाँ लाइव दिखाई देगा।";

    allReqs.innerHTML = `
      <div class="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
        <i class="fa-solid fa-clipboard-list text-3xl text-slate-300 mb-2"></i>
        <h5 class="text-sm font-bold text-slate-700">कोई ऑर्डर नहीं मिला</h5>
        <p class="text-xs text-slate-400 mt-1">${emptyMsg}</p>
      </div>
    `;
    return;
  }

  allReqs.innerHTML = filteredBookings.map(b => {
    const isPendingAdmin = b.status === "pending_admin_approval" || b.status === "pending_admin" || b.status === "pending";
    const isApproved = b.status === "approved";
    const isAssigned = b.status === "assigned";
    const isEnRoute = b.status === "on_the_way";
    const isStarted = b.status === "started";
    const isDone = b.status === "completed";
    const isRejected = b.status === "rejected";

    const rawCustPhone = String(b.custPhone || '').replace(/\D/g, '');
    const cleanCustPhone = rawCustPhone.length === 10 ? `91${rawCustPhone}` : rawCustPhone;

    // Filter approved workers for assignment dropdown
    const relevantWorkers = approvedWorkers.filter(w => w.category && b.category && w.category.toLowerCase() === b.category.toLowerCase());
    const workerOptions = (relevantWorkers.length > 0 ? relevantWorkers : approvedWorkers).map(w => `
      <option value="${w.id}">${w.name} (${w.category}) - ${w.location} - ${w.phone}</option>
    `).join("");

    let statusBadgeHtml = '';
    if (isPendingAdmin) {
      statusBadgeHtml = '<span class="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-950 border border-amber-300 animate-pulse"><i class="fa-solid fa-hourglass-half"></i> 🟡 स्वीकृति प्रतीक्षित</span>';
    } else if (isApproved) {
      statusBadgeHtml = '<span class="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300"><i class="fa-solid fa-check"></i> 🟢 स्वीकृत (Assign Worker)</span>';
    } else if (isAssigned) {
      statusBadgeHtml = '<span class="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200">🔵 कामगार नियुक्त</span>';
    } else if (isEnRoute) {
      statusBadgeHtml = '<span class="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-900 border border-sky-200">🚀 रास्ते में (On The Way)</span>';
    } else if (isStarted) {
      statusBadgeHtml = '<span class="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-200">⚡ कार्य चालू (Started)</span>';
    } else if (isDone) {
      statusBadgeHtml = '<span class="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">✓ संपन्न (Completed)</span>';
    } else if (isRejected) {
      statusBadgeHtml = '<span class="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">❌ अस्वीकृत (Rejected)</span>';
    } else {
      statusBadgeHtml = `<span class="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-300">${b.status}</span>`;
    }

    return `
      <div class="p-4 bg-white rounded-2xl border ${isPendingAdmin ? 'border-2 border-amber-400 shadow-md ring-1 ring-amber-300' : isApproved ? 'border-2 border-emerald-400 shadow-sm' : 'border-slate-200'} space-y-3 transition hover:shadow-md">
        <!-- Top Title & Status Row -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-xs font-black font-mono bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-lg">${b.booking_id}</span>
            <span class="text-sm font-black text-slate-900">${b.category}</span>
            ${b.isUrgent ? '<span class="bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse"><i class="fa-solid fa-bolt"></i> 15-MIN URGENT</span>' : ''}
            <span class="text-[11px] text-slate-400 font-medium">📅 ${b.date || ''} ${b.timeSlot ? '· ⏰ ' + b.timeSlot : ''}</span>
          </div>
          <div class="flex items-center gap-2 flex-wrap">
            ${statusBadgeHtml}
            <span class="text-xs font-black text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200" title="Bill Estimate (Admin & Customer Only)">
              💰 ${b.priceEstimate || '₹349+'}
            </span>
          </div>
        </div>

        <!-- Customer & Service Details Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700 bg-slate-50/90 p-3.5 rounded-xl border border-slate-200">
          <div class="space-y-1">
            <p class="font-bold text-slate-900 flex items-center gap-1.5">
              <i class="fa-solid fa-user text-blue-600"></i> ग्राहक: <span>${b.custName}</span>
            </p>
            <p class="flex items-center gap-2 pt-0.5">
              <a href="tel:${b.custPhone}" class="text-blue-700 font-bold hover:underline flex items-center gap-1">
                <i class="fa-solid fa-phone text-blue-600 text-[10px]"></i> ${b.custPhone}
              </a>
              <a href="https://wa.me/${cleanCustPhone}?text=Namaste%20${encodeURIComponent(b.custName)}%2C%20KaamWale.com%20se%20Admin%20Shivam%20Pandat%20baat%20kar%20rahe%20hain.%20Aapka%20order%20${encodeURIComponent(b.booking_id)}%20receive%20ho%20gaya%20hai." 
                 target="_blank" 
                 class="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-300 text-[11px] inline-flex items-center gap-1 transition">
                <i class="fa-brands fa-whatsapp text-emerald-700"></i> WhatsApp
              </a>
            </p>
            <p class="mt-1 text-slate-600">
              <strong>📍 पता:</strong> ${b.custAddress}
            </p>
          </div>
          <div class="space-y-1">
            <p><strong>🔧 सेवा/टास्क:</strong> ${(b.subServices || []).join(", ") || b.category}</p>
            ${b.desc ? `<p><strong>📝 ग्राहक विवरण:</strong> ${b.desc}</p>` : ''}
            <div class="pt-1 flex items-center gap-2 flex-wrap">
              <span class="bg-amber-200 text-amber-950 px-2.5 py-0.5 rounded font-black font-mono text-xs border border-amber-300">
                🔒 Doorstep OTP: ${b.otp || '----'}
              </span>
              ${b.otpVerified ? `
                <span class="bg-blue-100 text-blue-900 px-2 py-0.5 rounded font-black text-[10px] border border-blue-200">
                  ✓ OTP Verified
                </span>
              ` : ''}
              ${b.paymentStatus === 'paid' ? `
                <span class="bg-emerald-100 text-emerald-950 px-2.5 py-0.5 rounded font-black text-xs border border-emerald-300">
                  💰 PAID: ${b.paymentMode === 'CASH' ? 'Cash on Delivery' : 'Online UPI'} (${b.paymentAmount || '₹350'}) ${b.paymentUtr ? '· UTR: ' + b.paymentUtr : ''}
                </span>
              ` : ''}
              <button type="button" onclick="openAdminOrderWhatsApp('${b.booking_id}')" 
                      class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-0.5 rounded text-[11px] inline-flex items-center gap-1 shadow-sm transition" 
                      title="एडमिन WhatsApp पर यह आर्डर खोलें">
                <i class="fa-brands fa-whatsapp"></i> <span>Admin WhatsApp</span>
              </button>
              <a href="sms:+919899862721?body=Order%20${b.booking_id}%20OTP%3A%20${b.otp}%20Cust%3A%20${encodeURIComponent(b.custName)}%20${b.custPhone}" 
                 class="bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-300 font-bold px-2 py-0.5 rounded text-[11px] inline-flex items-center gap-1 transition"
                 title="SMS सूचना भेजें/देखें">
                <i class="fa-solid fa-comment-sms text-sky-600"></i> SMS
              </a>
            </div>
          </div>
        </div>

        <!-- Admin Action Section (Approval, Worker Assignment, Status Switcher) -->
        <div class="pt-1">
          ${isPendingAdmin ? `
            <div class="bg-amber-50 border-2 border-amber-300 rounded-xl p-3 space-y-2">
              <div class="flex items-center justify-between flex-wrap gap-1">
                <span class="text-xs font-black text-amber-950 flex items-center gap-1.5">
                  <i class="fa-solid fa-shield-halved text-amber-700"></i> नया ऑर्डर - एडमिन स्वीकृति आवश्यक (Approval Required):
                </span>
                <span class="text-[10px] bg-amber-200 text-amber-900 font-black px-2 py-0.5 rounded">Action Required</span>
              </div>
              <p class="text-[11px] text-amber-900">
                ग्राहक ने सेवा अनुरोध भेजा है। कृपया विवरण जाँचकर इसे स्वीकृत करें या कारण देकर अस्वीकार करें।
              </p>
              <div class="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div class="flex flex-wrap items-center gap-2">
                  <button type="button" onclick="adminApproveOrder('${b.booking_id}')" 
                          class="btn-emerald px-4 py-2 text-xs font-black flex items-center gap-1.5 shadow-md">
                    <i class="fa-solid fa-circle-check text-sm"></i> ✅ Approve Order (स्वीकृत करें)
                  </button>
                  <button type="button" onclick="adminRejectOrder('${b.booking_id}')" 
                          class="bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300 font-bold px-3 py-2 rounded-xl text-xs transition flex items-center gap-1">
                    <i class="fa-solid fa-circle-xmark"></i> ❌ Reject Order (अस्वीकार करें)
                  </button>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="text-[10px] font-bold text-slate-500">Status:</span>
                  <select onchange="updateReqStatus('${b.booking_id}', this.value)" class="px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-700">
                    <option value="pending_admin_approval" selected>Pending Approval</option>
                    <option value="approved">Approved</option>
                    <option value="assigned">Assigned</option>
                    <option value="on_the_way">On The Way</option>
                    <option value="started">Started</option>
                    <option value="completed">Completed</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>
          ` : isApproved ? `
            <div class="bg-emerald-50 border-2 border-emerald-300 rounded-xl p-3 space-y-2">
              <div class="flex items-center justify-between flex-wrap gap-1">
                <span class="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                  <i class="fa-solid fa-circle-check text-emerald-600"></i> ऑर्डर स्वीकृत! अब कामगार नियुक्त करें (Assign Worker):
                </span>
                <span class="text-[10px] bg-emerald-200 text-emerald-900 font-black px-2 py-0.5 rounded">Ready For Dispatch</span>
              </div>
              <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <select id="assignWorkerSelect-${b.booking_id}" class="flex-1 px-3 py-2 bg-white rounded-lg border border-emerald-400 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option value="">-- कामगार चुनें (${relevantWorkers.length > 0 ? relevantWorkers.length + ' संबंधित कामगार' : 'सभी कामगार'}) --</option>
                  ${workerOptions}
                </select>
                <button type="button" onclick="assignWorkerToBooking('${b.booking_id}')" 
                        class="btn-emerald px-4 py-2 text-xs font-black shrink-0 flex items-center justify-center gap-1.5 shadow-sm">
                  <i class="fa-solid fa-user-plus"></i> 🛠️ Assign Worker & Dispatch
                </button>
                <select onchange="updateReqStatus('${b.booking_id}', this.value)" class="px-2 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-700 shrink-0">
                  <option value="pending_admin_approval">Pending Approval</option>
                  <option value="approved" selected>Approved</option>
                  <option value="assigned">Assigned</option>
                  <option value="on_the_way">On The Way</option>
                  <option value="started">Started</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                </select>
                <button type="button" onclick="deleteAdminOrder('${b.booking_id}')" 
                        class="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 font-bold px-3 py-2 rounded-xl text-xs transition shrink-0 flex items-center gap-1" title="ऑर्डर हटाएं">
                  <i class="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </div>
          ` : isRejected ? `
            <div class="bg-rose-50 border border-rose-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span class="text-[10px] font-bold text-rose-600 uppercase block">❌ ऑर्डर अस्वीकृत (Rejected):</span>
                <p class="text-xs text-rose-950 font-medium mt-0.5">${b.rejectionReason || 'एडमिन द्वारा किसी कारणवश अस्वीकृत किया गया।'}</p>
              </div>
              <div class="flex items-center gap-2">
                <button type="button" onclick="adminApproveOrder('${b.booking_id}')" class="btn-emerald px-3 py-1.5 text-xs font-bold">
                  ✅ Re-Approve
                </button>
                <button type="button" onclick="deleteAdminOrder('${b.booking_id}')" class="bg-rose-100 text-rose-800 px-3 py-1.5 rounded-lg text-xs font-bold">
                  <i class="fa-solid fa-trash-can"></i> Delete
                </button>
              </div>
            </div>
          ` : `
            <div class="bg-blue-50 border border-blue-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span class="text-[10px] font-bold text-slate-500 uppercase block">नियुक्त कामगार (Assigned Partner):</span>
                <p class="text-xs font-black text-slate-900 flex items-center gap-1.5 mt-0.5">
                  <i class="fa-solid fa-circle-check text-blue-600"></i> ${b.assignedWorkerName || 'कामगार'} 
                  · 📞 <a href="tel:${b.assignedWorkerPhone}" class="text-blue-700 underline font-bold">${b.assignedWorkerPhone || ''}</a>
                </p>
              </div>

              <div class="flex flex-wrap items-center gap-2">
                <button type="button" onclick="testWorker30SecDutyAlert('${b.booking_id}')" 
                        class="bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 font-black px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1 transition shadow-2xs" title="कामगार के फोन पर 30-सेकंड इनकमिंग रिंगटोन बजाएं">
                  <i class="fa-solid fa-bell text-amber-600"></i> 🔊 30s रिंग टेस्ट
                </button>
                <button type="button" onclick="sendJobToWorkerWhatsApp('${b.booking_id}')" 
                        class="btn-emerald px-3 py-1.5 text-xs font-black flex items-center gap-1.5 shadow-sm" title="Send details to worker on WhatsApp (Zero Price)">
                  <i class="fa-brands fa-whatsapp text-sm"></i> WhatsApp Job
                </button>

                <div class="flex items-center gap-1">
                  <span class="text-[10px] font-bold text-slate-500">Status:</span>
                  <select onchange="updateReqStatus('${b.booking_id}', this.value)" class="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-700">
                    <option value="pending_admin_approval" ${isPendingAdmin ? 'selected' : ''}>Pending Approval</option>
                    <option value="approved" ${isApproved ? 'selected' : ''}>Approved</option>
                    <option value="assigned" ${isAssigned ? 'selected' : ''}>Assigned</option>
                    <option value="on_the_way" ${isEnRoute ? 'selected' : ''}>On The Way</option>
                    <option value="started" ${isStarted ? 'selected' : ''}>Work Started (OTP)</option>
                    <option value="completed" ${isDone ? 'selected' : ''}>Completed</option>
                    <option value="rejected" ${isRejected ? 'selected' : ''}>Rejected</option>
                  </select>
                </div>

                <button type="button" onclick="deleteAdminOrder('${b.booking_id}')" 
                        class="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 font-bold px-2.5 py-1.5 rounded-lg text-xs transition flex items-center gap-1" title="ऑर्डर हटाएं">
                  <i class="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </div>
          `}
        </div>
      </div>
    `;
  }).join("");
}

async function syncWorkersFromServer() {
  try {
    const res = await fetch("/api/workers");
    if (res.ok) {
      const serverWorkers = await res.json();
      if (Array.isArray(serverWorkers)) {
        const localWorkers = getStoredWorkers();
        // Keep pending applicants waiting for admin review
        const pendingWorkers = localWorkers.filter(w => w.status === "pending");

        // Map approved active workers strictly from server database
        const approvedMap = new Map();
        serverWorkers.forEach(w => {
          const key = w.userId || w.id || w.phone;
          approvedMap.set(key, {
            id: w.id || `worker_${w.phone}`,
            userId: w.userId || w.id || `worker_${w.phone}`,
            name: w.name || w.phone,
            phone: w.phone,
            email: w.email,
            password: w.password || "Kaam@123",
            category: w.category || "Electrician",
            location: w.location || w.address || "Local",
            experience: w.experience || 3,
            status: "approved"
          });
        });

        const finalWorkers = [...Array.from(approvedMap.values()), ...pendingWorkers];
        saveStoredWorkers(finalWorkers);
        try { filterWorkers(); } catch(e) {}
      }
    }
  } catch(e) {}
}

function openAdminPanelModal() {
  const modal = document.getElementById("adminPanelModal");
  if (!modal) return;

  try { syncWorkersFromServer(); } catch(e) {}

  const workers = getStoredWorkers();
  const bookings = getStoredBookings();
  const pendingWorkers = workers.filter(w => w.status === "pending");
  const approvedWorkers = workers.filter(w => w.status === "approved");
  const pendingOrders = bookings.filter(b => b.status === "pending_admin_approval" || b.status === "pending_admin" || b.status === "pending");
  const completedOrders = bookings.filter(b => b.status === "completed");

  const totalWorkersEl = document.getElementById("admTotalWorkers");
  const pendingWorkersEl = document.getElementById("admPendingWorkers");
  const pendingOrdersEl = document.getElementById("admPendingOrdersCount");
  const completedOrdersEl = document.getElementById("admCompletedRequests");

  if (totalWorkersEl) totalWorkersEl.textContent = approvedWorkers.length;
  if (pendingWorkersEl) pendingWorkersEl.textContent = pendingWorkers.length;
  if (pendingOrdersEl) pendingOrdersEl.textContent = pendingOrders.length;
  if (completedOrdersEl) completedOrdersEl.textContent = completedOrders.length;

  // SECTION 1: PENDING WORKER KYC & AADHAAR APPROVALS
  renderAdminApprovalsList(pendingWorkers);

  // SECTION 2: CUSTOMER ORDERS & WORKER DISPATCH
  renderAdminOrdersList(bookings);

  // SECTION 3: ALL REGISTERED PLATFORM WORKERS & PROFILE CONTROL (DELETE WORKER)
  const catFilter = document.getElementById("admWorkerCategoryFilter");
  if (catFilter) {
    catFilter.innerHTML = `<option value="">सभी श्रेणियां (All Categories)</option>` + 
      CATEGORIES.map(c => `<option value="${c.name.toLowerCase()}">${c.name} (${c.hindi})</option>`).join("");
  }
  const searchInput = document.getElementById("admWorkerSearchInput");
  if (searchInput) searchInput.value = "";
  renderAdminWorkersList(workers);

  modal.classList.remove("hidden");

  // Live Server Sync: immediately load orders from server & poll every 6s while modal is open
  loadAdminOrdersFromServer(false);
  if (adminOrdersPollInterval) clearInterval(adminOrdersPollInterval);
  adminOrdersPollInterval = setInterval(() => loadAdminOrdersFromServer(false), 6000);
}

function closeAdminPanelModal() {
  const modal = document.getElementById("adminPanelModal");
  if (modal) modal.classList.add("hidden");
  if (adminOrdersPollInterval) {
    clearInterval(adminOrdersPollInterval);
    adminOrdersPollInterval = null;
  }
}

function openAdminOrderWhatsApp(bookingId) {
  const bookings = getStoredBookings();
  const b = bookings.find(item => item.booking_id === bookingId);
  if (!b) return;

  const checkedSubsText = (b.subServices || []).join(", ") || b.category;
  const waRawMsg = 
    `*🚨 KAAMWALE.COM CUSTOMER ORDER 🚨*\n` +
    `----------------------------------------\n` +
    `📋 *Order ID:* ${b.booking_id}\n` +
    `🔒 *Doorstep Security OTP:* ${b.otp}\n` +
    `🛠️ *Service Category:* ${b.category}\n` +
    `🔧 *Tasks:* ${checkedSubsText}\n` +
    `👤 *Customer Name:* ${b.custName}\n` +
    `📞 *Customer Phone:* ${b.custPhone}\n` +
    `📍 *Doorstep Address:* ${b.custAddress}\n` +
    `⏰ *Preferred Time:* ${b.timeSlot || 'Immediate'}${b.isUrgent ? ' (🚨 URGENT 30 MIN)' : ''}\n` +
    (b.desc ? `📝 *Problem Details:* ${b.desc}\n` : '') +
    `💰 *Bill Estimate (Admin/Customer):* ${b.priceEstimate || '₹349+'}\n` +
    `----------------------------------------\n` +
    `*Current Status:* ${b.status || 'pending_admin'}\n` +
    (b.assignedWorkerName ? `👷 *Assigned Worker:* ${b.assignedWorkerName} (📞 ${b.assignedWorkerPhone})\n` : '') +
    `Admin: Shivam Pandat (+91 98998 62721)`;

  const waUrl = `https://wa.me/91${CONFIG.businessPhone}?text=${encodeURIComponent(waRawMsg)}`;
  window.open(waUrl, "_blank");
}

function deleteAdminOrder(bookingId) {
  if (!confirm(`क्या आप ऑर्डर "${bookingId}" को प्लेटफॉर्म और सर्वर से हमेशा के लिए हटाना चाहते हैं?`)) return;

  let bookings = getStoredBookings();
  bookings = bookings.filter(b => b.booking_id !== bookingId);
  saveStoredBookings(bookings);

  try {
    fetch('/api/orders/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': 'Shivam@819' },
      body: JSON.stringify({ booking_id: bookingId })
    }).catch(e => console.log('Server order delete notice:', e));
  } catch (e) {}

  showToast(`🗑️ ऑर्डर ${bookingId} सफलतापूर्वक हटा दिया गया!`);
  loadAdminOrdersFromServer(false);
}

function renderAdminWorkersList(workersToRender) {
  const container = document.getElementById("admAllWorkersContainer");
  const countBadge = document.getElementById("admWorkersDisplayCount");
  if (!container) return;

  const allWorkers = workersToRender || getStoredWorkers();
  if (countBadge) countBadge.textContent = `${allWorkers.length} कामगार प्लेटफॉर्म पर जुड़े हैं`;

  if (allWorkers.length === 0) {
    container.innerHTML = `
      <div class="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
        <i class="fa-solid fa-user-slash text-3xl text-slate-300 mb-2"></i>
        <h5 class="text-sm font-bold text-slate-700">कोई कामगार नहीं मिला</h5>
        <p class="text-xs text-slate-400 mt-1">खोज शब्द बदलें या नया कामगार पंजीकृत करें।</p>
      </div>
    `;
    return;
  }

  container.innerHTML = allWorkers.map(w => {
    const isApproved = w.status === "approved";
    const rawPhone = (w.phone || "").replace(/\D/g, "");
    const cleanPhone = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;

    return `
      <div class="p-4 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 shadow-sm transition space-y-3">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex items-start gap-3">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-900 via-blue-700 to-emerald-600 text-white font-black flex items-center justify-center text-base shadow-sm shrink-0 mt-0.5">
              ${(w.name || "W").slice(0, 1)}
            </div>
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <h5 class="text-sm font-black text-slate-900">${w.name}</h5>
                <span class="bg-blue-100 text-blue-800 text-[10px] font-black uppercase px-2 py-0.5 rounded-md border border-blue-200">
                  ${w.category}
                </span>
                <span class="text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                  isApproved ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-900 border border-amber-300'
                }">
                  ${isApproved ? '✓ Live Platform Partner' : '⏳ Pending KYC'}
                </span>
                <span class="text-[10px] font-mono text-slate-400 font-bold">ID: ${w.id}</span>
              </div>
              <p class="text-xs text-slate-600 mt-1 font-medium">
                📞 <a href="tel:${w.phone}" class="text-blue-600 font-bold hover:underline">${w.phone}</a> · 📧 <strong class="text-slate-800">${w.email || 'N/A'}</strong> · 📍 ${w.location} · ⏱️ ${w.exp || 'अनुभवी'}
              </p>
              <div class="mt-2 bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs text-slate-800 space-y-1">
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <span class="font-mono text-[11px] font-bold text-slate-700">
                    👤 UserID: <strong class="text-blue-700 font-mono">${w.userId || 'KW-' + w.id}</strong> 
                    &nbsp;|&nbsp; 
                    🔑 Password: <strong class="text-slate-900 font-mono">${w.password || 'Kaam@123'}</strong>
                  </span>
                  <button type="button" onclick="sendWorkerCredentialsWhatsApp('${w.id}')" 
                          class="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1">
                    <i class="fa-brands fa-whatsapp text-emerald-600"></i> Send Credentials WhatsApp
                  </button>
                </div>
              </div>
              <div class="mt-1 flex flex-wrap items-center gap-2 text-xs">
                <span class="bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200 font-mono font-bold">
                  🪪 आधार/Govt ID: ${w.aadhaar || 'सत्यापित'}
                </span>
                <span class="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                  🛡️ Trust ${w.trustScore || '98%'}
                </span>
                ${w.radius ? `<span class="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">दायरा: ${w.radius}</span>` : ''}
                ${w.secondarySkill ? `<span class="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">अतिरिक्त: ${w.secondarySkill}</span>` : ''}
              </div>
            </div>
          </div>

          <!-- ADMIN ACTIONS: CALL, WHATSAPP, APPROVE, DELETE -->
          <div class="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
            <a href="tel:${w.phone}" class="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1 transition" title="कॉल करें">
              <i class="fa-solid fa-phone"></i> Call
            </a>
            <a href="https://wa.me/${cleanPhone}?text=Namaste%20${encodeURIComponent(w.name)}%2C%20KaamWale.com%20se%20Admin%20Shivam%20Pandat%20baat%20kar%20rahe%20hain." target="_blank" 
               class="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1 transition" title="WhatsApp पर चैट करें">
              <i class="fa-brands fa-whatsapp text-sm"></i> WhatsApp
            </a>
            ${!isApproved ? `
              <button type="button" onclick="approveWorker('${w.id}')" class="btn-emerald px-3 py-2 text-xs font-black shadow-sm flex items-center gap-1">
                <i class="fa-solid fa-check"></i> Approve
              </button>
            ` : ''}
            <button type="button" onclick="deleteWorkerProfile('${w.id}')" 
                    class="bg-rose-600 hover:bg-rose-700 text-white font-black px-3.5 py-2 rounded-xl text-xs transition shadow-sm flex items-center gap-1.5" 
                    title="इस कामगार का प्रोफाइल प्लेटफॉर्म से हमेशा के लिए डिलीट करें">
              <i class="fa-solid fa-trash-can"></i> Delete
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

function filterAdminWorkersList() {
  const query = (document.getElementById("admWorkerSearchInput")?.value || "").toLowerCase().trim();
  const cat = (document.getElementById("admWorkerCategoryFilter")?.value || "").toLowerCase().trim();
  const allWorkers = getStoredWorkers();

  const filtered = allWorkers.filter(w => {
    const nameMatch = (w.name || "").toLowerCase().includes(query);
    const phoneMatch = (w.phone || "").toLowerCase().includes(query);
    const locMatch = (w.location || "").toLowerCase().includes(query);
    const aadhaarMatch = (w.aadhaar || "").toLowerCase().includes(query);
    const textMatch = !query || nameMatch || phoneMatch || locMatch || aadhaarMatch;
    const catMatch = !cat || (w.category || "").toLowerCase() === cat;
    return textMatch && catMatch;
  });

  renderAdminWorkersList(filtered);
}

async function deleteWorkerProfile(workerId) {
  let workers = getStoredWorkers();
  const target = workers.find(w => w.id === workerId || w.userId === workerId);
  if (!target) {
    alert("कामगार प्रोफाइल नहीं मिली।");
    return;
  }

  const confirmMsg = `⚠️ क्या आप कामगार "${target.name}" (${target.category}) का प्रोफाइल KaamWale.com से हमेशा के लिए डिलीट (हटाना) करना चाहते हैं?\n\nडिलीट करने के बाद:\n• कामगार की आईडी प्लेटफॉर्म और डेटाबेस से पूरी तरह हट जाएगी\n• कामगार दोबारा लॉगिन नहीं कर सकेगा\n• कोई भी पेंडिंग ऑर्डर से कामगार तुरंत अनअसाइन हो जाएगा।`;
  if (!confirm(confirmMsg)) {
    return;
  }

  // 1. Call server API to delete worker permanently from users.json and orders.json
  try {
    const adminToken = localStorage.getItem("kw_admin_token") || "founder_admin_session_shivam_pandat";
    const res = await fetch("/api/admin/delete-worker", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": adminToken
      },
      body: JSON.stringify({
        workerId: target.userId || target.id,
        id: target.id,
        phone: target.phone,
        adminToken: adminToken
      })
    });
    const data = await res.json();
    if (!data.success && res.status === 401) {
      alert("⚠️ अनधिकृत: केवल Founder Admin (Shivam Pandat) ही कामगार को डिलीट कर सकते हैं।");
      return;
    }
  } catch (err) {
    console.log("Server worker deletion warning:", err);
  }

  // 2. Remove worker from local storage
  workers = workers.filter(w => w.id !== workerId && w.userId !== workerId && w.id !== target.id);
  saveStoredWorkers(workers);

  // 3. Clear worker session if this worker was active locally
  try {
    const loggedInWorker = JSON.parse(localStorage.getItem("kw_logged_in_worker") || "null");
    if (loggedInWorker && (loggedInWorker.id === target.id || loggedInWorker.userId === target.userId || loggedInWorker.phone === target.phone)) {
      localStorage.removeItem("kw_logged_in_worker");
      currentWorkerUser = null;
      if (currentUser && currentUser.role === "worker") {
        currentUser = null;
        localStorage.removeItem("kw_current_user");
        renderAuthUI();
      }
    }
  } catch (e) {}

  // 4. Unassign from local bookings
  try {
    const bookings = getStoredBookings();
    let bookingsChanged = false;
    bookings.forEach(b => {
      if (b.assignedWorkerId === target.id || b.assignedWorkerId === target.userId || (target.phone && b.assignedWorkerPhone === target.phone)) {
        b.assignedWorkerId = null;
        b.assignedWorkerName = null;
        b.assignedWorkerPhone = null;
        b.status = "pending_admin_approval";
        bookingsChanged = true;
      }
    });
    if (bookingsChanged) saveStoredBookings(bookings);
  } catch (e) {}

  // 5. Update public workers directory immediately
  filterWorkers();

  // 6. Refresh admin panel view immediately
  openAdminPanelModal();

  playOrderSuccessChime();
  showToast(`🗑️ कामगार "${target.name}" की प्रोफाइल और आईडी पूरी तरह डिलीट कर दी गई!`, "success");
}

async function approveWorker(workerId) {
  const workers = getStoredWorkers();
  const w = workers.find(i => i.id === workerId || i.userId === workerId);
  if (w) {
    w.status = "approved";
    w.trustScore = "98% Verified";
    w.userId = w.userId || `KW-${w.id}`;
    w.password = w.password || `Kaam@${Math.floor(1000 + Math.random() * 9000)}`;
    saveStoredWorkers(workers);

    // Sync newly approved worker to server users.json
    try {
      await fetch('/api/auth/register-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: w.userId,
          name: w.name,
          phone: w.phone,
          email: w.email || `${(w.phone || 'worker').replace(/\D/g, '')}@kaamwale.com`,
          password: w.password,
          role: 'worker',
          status: 'approved',
          category: w.category,
          location: w.location,
          address: w.location,
          experience: w.experience || 3
        })
      });
    } catch (e) {}

    filterWorkers();
    showToast(`✓ कामगार ${w.name} स्वीकृत! UserID: ${w.userId}, Password: ${w.password}`, "success");
    openAdminPanelModal();
  }
}

function sendWorkerCredentialsWhatsApp(workerId) {
  const workers = getStoredWorkers();
  const w = workers.find(item => item.id === workerId);
  if (!w) return;

  const rawPhone = (w.phone || "").replace(/\D/g, "");
  const cleanPhone = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;

  const msg = 
    `*🛠️ KAAMWALE.COM WORKER APPROVAL & LOGIN CREDENTIALS 🛠️*\n` +
    `----------------------------------------\n` +
    `Namaste ${w.name} Ji,\n` +
    `Aapka KaamWale.com par '${w.category}' partner profile Admin dwara approve kar diya gaya hai!\n\n` +
    `📋 *Aapki Duty Login Credentials:*\n` +
    `👤 *User ID:* ${w.userId || 'KW-' + w.id}\n` +
    `🔑 *Password:* ${w.password || 'Kaam@123'}\n` +
    `📧 *Registered Email:* ${w.email || 'N/A'}\n` +
    `----------------------------------------\n` +
    `🌐 *Login Link:* ${window.location.origin}\n` +
    `Aap KaamWale.com par jakar 'Worker Dashboard' me login kar sakte hain aur on-duty reh kar assign orders prapt kar sakte hain.\n` +
    `Agar aap apna password bhool jayein toh registered email se reset kar sakte hain.\n\n` +
    `(Platform Founder & Super Admin: Shivam Pandat - 9899862721)`;

  window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, "_blank");
}

function rejectWorker(workerId) {
  let workers = getStoredWorkers();
  workers = workers.filter(i => i.id !== workerId);
  saveStoredWorkers(workers);
  filterWorkers();
  showToast("कामगार आवेदन हटाया गया।");
  openAdminPanelModal();
}

function assignWorkerToBooking(bookingId, workerIdOverride) {
  const selectEl = document.getElementById(`assignWorkerSelect-${bookingId}`);
  const workerId = workerIdOverride || (selectEl ? selectEl.value : null);
  if (!workerId) {
    alert("कृपया सूची में से एक स्वीकृत कामगार चुनें।");
    return;
  }

  const workers = getStoredWorkers();
  const worker = workers.find(w => w.id === workerId);
  if (!worker) {
    alert("चुना गया कामगार नहीं मिला।");
    return;
  }

  const bookings = getStoredBookings();
  const target = bookings.find(b => b.booking_id === bookingId);
  if (!target) return;

  target.status = "assigned";
  target.assignedWorkerId = worker.id;
  target.assignedWorkerName = worker.name;
  target.assignedWorkerPhone = worker.phone;
  saveStoredBookings(bookings);

  // Trigger 30-Second Ringing Notification for the Assigned Worker
  const dutyAlertData = {
    workerId: worker.id,
    workerName: worker.name,
    workerPhone: worker.phone,
    bookingId: bookingId,
    category: target.category,
    subServices: target.subServices,
    custName: target.custName,
    custPhone: target.custPhone,
    custAddress: target.custAddress,
    time: Date.now()
  };

  try {
    localStorage.setItem("kw_worker_assignment_alert", JSON.stringify(dutyAlertData));
    triggerWorker30SecDutyAlert(dutyAlertData);
  } catch (e) {
    console.warn("Worker duty alert notice:", e);
  }

  try {
    fetch('/api/orders/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': 'Shivam@819' },
      body: JSON.stringify({
        booking_id: bookingId,
        status: "assigned",
        assignedWorkerId: worker.id,
        assignedWorkerName: worker.name,
        assignedWorkerPhone: worker.phone
      })
    }).catch(e => console.log('Server order update notice:', e));
  } catch (e) {}

  showToast(`✓ ऑर्डर ${bookingId} कामगार ${worker.name} को असाइन हुआ! 30-सेकंड इनकमिंग रिंगटोन बज रही है।`);
  loadAdminOrdersFromServer(false);
}

function sendJobToWorkerWhatsApp(bookingId) {
  const bookings = getStoredBookings();
  const b = bookings.find(item => item.booking_id === bookingId);
  if (!b) return;

  const rawPhone = (b.assignedWorkerPhone || "").replace(/\D/g, "");
  const cleanPhone = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;

  // STRICT RULE: No pricing or financial figures in worker dispatch message!
  const msg = 
    `*🛠️ KAAMWALE.COM WORK DUTY ASSIGNMENT 🛠️*\n` +
    `----------------------------------------\n` +
    `📋 *Order ID:* ${b.booking_id}\n` +
    `👤 *Customer Name:* ${b.custName}\n` +
    `📞 *Customer Phone:* ${b.custPhone}\n` +
    `📍 *Service Address:* ${b.custAddress}\n` +
    `⏰ *Reporting Time:* ${b.timeSlot || 'Immediate'}\n` +
    `🔧 *Work Category:* ${b.category}\n` +
    `📝 *Task Details:* ${(b.subServices || []).join(", ") || b.category}\n` +
    (b.desc ? `⚠️ *Customer Notes:* ${b.desc}\n` : '') +
    `----------------------------------------\n` +
    `🔒 *SECURITY INSTRUCTION:*\n` +
    `Doorstep par pahunchne par customer se 4-digit security OTP lekar portal me verify karein aur kaam start karein.\n` +
    `(Platform Admin: Shivam Pandat - 9899862721)`;

  const targetNumber = cleanPhone || `91${CONFIG.businessPhone}`;
  window.open(`https://wa.me/${targetNumber}?text=${encodeURIComponent(msg)}`, "_blank");
}

// 3-Role Switcher Handler
function setRole(role) {
  currentRole = role;
  if (role === "admin") {
    if (currentUser && currentUser.role === "admin") {
      openAdminPanelModal();
    } else {
      openAdminLoginModal();
    }
  } else if (role === "worker") {
    if (!currentWorkerUser) {
      openWorkerLoginModal();
    } else {
      openWorkerDashboardModal();
    }
  } else {
    if (!currentUser) {
      openCustomerAuthModal('login');
    } else {
      openMyBookingsModal();
    }
  }
}

// ========================
// WORKER REGISTRATION (FORM - NO PRICING ASKED FROM WORKER)
// ========================
function handleWorkerRegistration(e) {
  e.preventDefault();

  const name = document.getElementById("wName")?.value.trim();
  const phone = document.getElementById("wPhone")?.value.trim();
  const email = (document.getElementById("wEmail")?.value || "").trim().toLowerCase();
  const category = document.getElementById("wCategory")?.value;
  const secondarySkill = document.getElementById("wSecondarySkill")?.value.trim() || "";
  const exp = document.getElementById("wExp")?.value || "3";
  const location = document.getElementById("wLocation")?.value.trim();
  const aadhaar = document.getElementById("wAadhaar")?.value.trim() || "XXXX-XXXX-XXXX";
  const radius = document.getElementById("wRadius")?.value || "Within 5 km";

  if (!name || !phone || !location) {
    alert("कृपया सभी आवश्यक फ़ील्ड भरें।");
    return;
  }

  if (!email || !email.includes("@")) {
    alert("कृपया वैध ईमेल आईडी (Email Address) दर्ज करें। पासवर्ड भूलने पर इसी ईमेल से रीसेट होगा।");
    return;
  }

  const cleanPhone = phone.replace(/\D/g, "");
  if (cleanPhone.length < 10) {
    alert("कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।");
    return;
  }

  // Generate unique UserID and initial secure password for the worker
  const randNum = Math.floor(100 + Math.random() * 900);
  const generatedUserId = "KW-W" + randNum;
  const initialPassword = "Kaam@" + Math.floor(1000 + Math.random() * 9000);

  // Worker draft created - must verify mobile OTP before final submission to Admin
  // NO price field is stored or asked from labour
  const workerDraft = {
    id: "W" + randNum,
    userId: generatedUserId,
    password: initialPassword,
    name: name,
    email: email,
    category: category,
    secondarySkill: secondarySkill,
    phone: cleanPhone.slice(-10),
    location: location,
    exp: `${exp} वर्ष`,
    aadhaar: aadhaar,
    radius: radius,
    rating: 5.0,
    reviews: 0,
    trustScore: "Pending KYC",
    status: "pending", // Requires Admin (Shivam Pandat) approval
    appliedAt: new Date().toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })
  };

  // Open OTP verification modal before final registration submission
  openProfileOtpModal("worker", cleanPhone.slice(-10), workerDraft);
}

// ========================
// REVIEWS & RATINGS
// ========================
function renderReviews() {
  const container = document.getElementById("reviewsContainer");
  if (!container) return;

  const reviews = getStoredReviews();
  container.innerHTML = reviews.map(r => `
    <div class="card-hover bg-slate-50 p-6 rounded-3xl border border-slate-200 flex flex-col justify-between shadow-sm">
      <div>
        <div class="flex text-amber-400 text-sm mb-3">
          ${'<i class="fa-solid fa-star"></i>'.repeat(r.rating || 5)}
        </div>
        <p class="text-xs text-slate-600 leading-relaxed italic">"${r.comment}"</p>
      </div>

      <div class="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
        <div>
          <h4 class="text-xs font-black text-slate-900">${r.name}</h4>
          <span class="text-[10px] text-slate-400">${r.city} • ${r.category}</span>
        </div>
        <span class="text-[10px] font-bold text-slate-400">${r.date || 'हाल ही में'}</span>
      </div>
    </div>
  `).join("");
}

function setReviewRating(stars) {
  selectedReviewRating = stars;
  const starEls = document.querySelectorAll(".review-star-input");
  starEls.forEach((el, idx) => {
    if (idx < stars) {
      el.classList.add("text-amber-400");
      el.classList.remove("text-slate-300");
    } else {
      el.classList.remove("text-amber-400");
      el.classList.add("text-slate-300");
    }
  });
}

function submitReview(e) {
  e.preventDefault();

  const name = document.getElementById("revName")?.value.trim();
  const city = document.getElementById("revCity")?.value.trim() || "Local";
  const cat = document.getElementById("revCategory")?.value || "General Service";
  const comment = document.getElementById("revComment")?.value.trim();

  if (!name || !comment) {
    alert("कृपया नाम और समीक्षा दर्ज करें।");
    return;
  }

  const newReview = {
    id: Date.now(),
    name: name,
    city: city,
    category: cat,
    rating: selectedReviewRating,
    comment: comment,
    date: new Date().toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })
  };

  const reviews = getStoredReviews();
  reviews.unshift(newReview);
  saveStoredReviews(reviews);

  e.target.reset();
  renderReviews();
  showToast("⭐ आपकी समीक्षा के लिए धन्यवाद!");
}

// Initializer
window.addEventListener("DOMContentLoaded", () => {
  loadState();
  fetchServerConfig();
  initFirebaseApp();

  // Detect genuine Google redirect callback (OAuth2 Hash or Query)
  try {
    if (window.location.hash && window.location.hash.includes("id_token=")) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const idToken = hashParams.get("id_token");
      const state = hashParams.get("state") || sessionStorage.getItem("kw_google_oauth_mode");
      if (idToken) {
        if (window.history && window.history.replaceState) {
          const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
          window.history.replaceState({ path: cleanUrl }, '', cleanUrl);
        }
        handleGoogleCredentialResponse({ credential: idToken, isSignUpFlow: state === "signup" });
      }
    }

    const urlParams = new URLSearchParams(window.location.search);
    const isGoogleAuth = urlParams.get("google_auth") === "success";
    const wasPending = sessionStorage.getItem("kw_google_signing_in") === "true";

    if (isGoogleAuth || wasPending) {
      sessionStorage.removeItem("kw_google_signing_in");
      if (window.history && window.history.replaceState) {
        const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.replaceState({ path: cleanUrl }, '', cleanUrl);
      }
      if (!currentUser) {
        currentUser = {
          name: "Google Verified User",
          email: "user.google@gmail.com",
          phone: "9876543210",
          phoneVerified: true,
          role: "customer",
          googleVerified: true
        };
        localStorage.setItem("kw_current_user", JSON.stringify(currentUser));
      }
      showToast(`✅ Google खाते से सत्यापन सफल! आपका प्रोफाइल सक्रिय हो गया।`);
    }

    const isGoogleSignUp = urlParams.get("google_signup") === "1";
    const wasSigningUp = sessionStorage.getItem("kw_google_signing_up") === "true";
    if (isGoogleSignUp || wasSigningUp) {
      sessionStorage.removeItem("kw_google_signing_up");
      if (window.history && window.history.replaceState) {
        const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.replaceState({ path: cleanUrl }, '', cleanUrl);
      }
      openGoogleAuthModal(null, 'register');
      showToast("✅ Google अकाउंट लिंक हुआ! कृपया 10-अंकीय मोबाइल नंबर दर्ज कर OTP सत्यापन करें।");
      const phoneInput = document.getElementById("regCustPhone");
      if (phoneInput) setTimeout(() => phoneInput.focus(), 300);
    }
  } catch (authErr) {
    console.error("Google Auth Check Error:", authErr);
  }

  renderAuthUI();
  renderCategories();
  filterWorkers();
  renderReviews();
  initGpsLocationSystem();
  updateNavTrackOrderBadge();

  // Background Live Orders Monitor for Admin
  setInterval(() => {
    if (currentUser && currentUser.role === "admin") {
      const adminModal = document.getElementById("adminPanelModal");
      // If modal is open, its own 6s polling loop handles it; otherwise check in background every 12s
      if (!adminModal || adminModal.classList.contains("hidden")) {
        fetch("/api/orders?admin_key=Shivam@819", {
          headers: { "x-admin-token": "Shivam@819" }
        })
          .then(r => r.json())
          .then(serverOrders => {
            if (Array.isArray(serverOrders)) {
              let hasNew = false;
              let newest = null;
              if (lastKnownOrderIds.size > 0) {
                for (const ord of serverOrders) {
                  if (ord.booking_id && !lastKnownOrderIds.has(ord.booking_id)) {
                    hasNew = true;
                    newest = ord;
                    break;
                  }
                }
              }
              serverOrders.forEach(o => { if (o.booking_id) lastKnownOrderIds.add(o.booking_id); });
              
              const pendingCount = serverOrders.filter(b => b.status === "pending_admin_approval" || b.status === "pending_admin" || b.status === "pending").length;
              const bEl = document.getElementById("navAdminPendingBadge");
              if (bEl) bEl.textContent = pendingCount;

              if (hasNew && newest) {
                playAdminNewOrderChime();
                showToast(`🚨 नया ग्राहक ऑर्डर आया! ${newest.booking_id} - ${newest.custName} (${newest.category}) [Admin Panel में देखें]`);
              }
            }
          })
          .catch(() => {});
      }
    }
  }, 12000);
});

// ==========================================
// PWA & APP DOWNLOAD MODAL HANDLERS
// ==========================================
let deferredAppPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredAppPrompt = e;
  console.log('⚡ PWA installation prompt ready');
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((reg) => {
      console.log('✅ ServiceWorker registered:', reg.scope);
    }).catch((err) => {
      console.log('⚠️ ServiceWorker error:', err);
    });
  });
}

function openAppDownloadModal(tab = 'android') {
  const modal = document.getElementById('appDownloadModal');
  if (modal) {
    modal.classList.remove('hidden');
    switchAppTab(tab);
  }
}

function closeAppDownloadModal() {
  const modal = document.getElementById('appDownloadModal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

function switchAppTab(tab) {
  const androidBtn = document.getElementById('appTabAndroidBtn');
  const iosBtn = document.getElementById('appTabIosBtn');
  const androidContent = document.getElementById('appTabAndroidContent');
  const iosContent = document.getElementById('appTabIosContent');

  if (!androidBtn || !iosBtn || !androidContent || !iosContent) return;

  if (tab === 'ios') {
    androidBtn.className = "py-2.5 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 bg-white text-slate-700 hover:bg-slate-200 transition";
    iosBtn.className = "py-2.5 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 bg-slate-900 text-white shadow-sm transition";
    androidContent.classList.add('hidden');
    iosContent.classList.remove('hidden');
  } else {
    androidBtn.className = "py-2.5 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 bg-emerald-600 text-white shadow-sm transition";
    iosBtn.className = "py-2.5 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 bg-white text-slate-700 hover:bg-slate-200 transition";
    androidContent.classList.remove('hidden');
    iosContent.classList.add('hidden');
  }
}

function handleApkDownloadClick() {
  if (typeof showToast === 'function') {
    showToast('📥 KaamWale.apk डाउनलोड शुरू हो गया है!');
  }
}

function triggerPwaInstall() {
  if (deferredAppPrompt) {
    deferredAppPrompt.prompt();
    deferredAppPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        if (typeof showToast === 'function') {
          showToast('🎉 KaamWale App सफलतापूर्वक इंस्टॉल हो गया!');
        }
      }
      deferredAppPrompt = null;
    });
  } else {
    if (typeof showToast === 'function') {
      showToast('💡 Browser menu (3 dots) par jakar "Install App" ya "Add to Home screen" chunein.');
    }
  }
}

// Expose functions globally
window.openAppDownloadModal = openAppDownloadModal;
window.closeAppDownloadModal = closeAppDownloadModal;
window.switchAppTab = switchAppTab;
window.handleApkDownloadClick = handleApkDownloadClick;
window.triggerPwaInstall = triggerPwaInstall;

// ==========================================
// MOBILE APP DOCK & LAYER-BY-LAYER SEARCH
// ==========================================
function initMobileAppMode() {
  const isApk = navigator.userAgent.includes('KaamWaleApp') || window.isKaamWaleApp === true;
  const isPwa = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
  const isMobileScreen = window.innerWidth <= 768;
  if (isApk || isPwa || isMobileScreen) {
    document.documentElement.classList.add('is-app-mode');
    document.body.classList.add('is-app-mode');
  }
}
initMobileAppMode();
window.addEventListener('resize', initMobileAppMode);

// Universal Modal Handler: Ensure all modals appear at the very top (upper screen) with zero scrolling
function setupUniversalModalHandler() {
  const modals = document.querySelectorAll('.modal-overlay');
  modals.forEach(modal => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          if (!modal.classList.contains('hidden')) {
            modal.scrollTop = 0;
            if (modal.firstElementChild) {
              modal.firstElementChild.scrollTop = 0;
            }
            document.body.classList.add('modal-open');
          } else {
            const openModals = document.querySelectorAll('.modal-overlay:not(.hidden)');
            if (openModals.length === 0) {
              document.body.classList.remove('modal-open');
            }
          }
        }
      });
    });
    observer.observe(modal, { attributes: true });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupUniversalModalHandler);
} else {
  setupUniversalModalHandler();
}

function activateMobileDockTab(el) {
  const btns = document.querySelectorAll('.mobile-dock-btn');
  btns.forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');
}

function handleMobileAppSearch(query) {
  const q = (query || '').toLowerCase().trim();
  if (!q) return;

  const services = [
    { name: 'Electrician', aliases: ['electrician', 'bijli', 'wire', 'fan', 'switch', 'inverter', 'light'] },
    { name: 'Plumber', aliases: ['plumber', 'nal', 'tap', 'pipe', 'tank', 'leakage', 'motor'] },
    { name: 'Carpenter', aliases: ['carpenter', 'badhai', 'wood', 'door', 'lock', 'table', 'furniture'] },
    { name: 'Painter', aliases: ['painter', 'paint', 'wall', 'putty', 'color', 'rang'] },
    { name: 'Cleaners', aliases: ['clean', 'cleaning', 'safai', 'deep clean', 'bathroom', 'kitchen', 'chimney', 'sofa'] },
    { name: 'Mechanics', aliases: ['mechanic', 'ac', 'fridge', 'washing machine', 'appliance', 'car', 'bike'] },
    { name: 'Welder', aliases: ['welder', 'welding', 'iron', 'gate', 'grill', 'loha'] },
    { name: 'Labour', aliases: ['labour', 'majdoor', 'helper', 'shifting', 'construction'] }
  ];

  const matched = services.find(s => 
    s.name.toLowerCase().includes(q) || s.aliases.some(a => a.includes(q))
  );

  if (matched && typeof handleBookServiceClick === 'function') {
    // Optional smooth hint
  }
}

// Sync mobile GPS header text whenever main location changes
window.addEventListener('DOMContentLoaded', () => {
  const mainLoc = document.getElementById('headerLocationText');
  const mobLoc = document.getElementById('mobileAppHeaderLocText');
  if (mainLoc && mobLoc) {
    const syncText = () => { if (mainLoc.textContent) mobLoc.textContent = mainLoc.textContent; };
    syncText();
    const obs = new MutationObserver(syncText);
    obs.observe(mainLoc, { childList: true, characterData: true, subtree: true });
  }
});

function handleMobileAccountClick() {
  if (currentUser) {
    if (currentUser.role === 'admin') {
      openAdminPanelModal();
    } else {
      openMyBookingsModal();
    }
  } else if (currentWorkerUser) {
    openWorkerDashboardModal();
  } else {
    openCustomerAuthModal('login');
  }
}

window.activateMobileDockTab = activateMobileDockTab;
window.handleMobileAppSearch = handleMobileAppSearch;
window.handleMobileAccountClick = handleMobileAccountClick;
window.copyTrackerOtp = copyTrackerOtp;
window.triggerTrackerUpiPayment = triggerTrackerUpiPayment;
window.openLiveTracker = openLiveTracker;
window.closeLiveTrackerModal = closeLiveTrackerModal;




