/**
 * Maharashtra Medical Council, Mumbai — Rural Healthcare Prototype (SIH 26)
 * Interactive Frontend Demonstrations & UI Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initI18n();
  initSharedState();
  initAuthProtection();
  initNav();
  initAccessibility();
  initRoleSwitcher();
  initPatientDashboard();
  initAshaDashboard();
  initDoctorDashboard();
  initAppointmentFeature();
  initRiskConsultFeature();
  initReferralFeature();
  initCarePlanFeature();
  initMedicineSearchFeature();
  initAshaTablet();
  initModals();
  initComplaintsPage();
  initFeedbackPage();
});

/* ==========================================================================
   0. Shared Mock State Store (Single Source of Truth Across 3 Dashboards)
   ========================================================================== */
function initSharedState() {
  const existing = localStorage.getItem("swasthya_shared_state");
  if (!existing) {
    const initialState = {
      patients: [
        {
          id: "MMC-PT-108",
          name: "Sita Devi",
          age: 28,
          gender: "Female",
          village: "Vadgaon",
          phone: "+91 98234 56711",
          healthSummary: "2nd Trimester ANC (24 weeks), Mild Gestational BP, Monitored",
          vitals: { bp: "138/88", pulse: 78, spo2: 98, hb: "10.2", weight: "54 kg" },
          priority: "High",
          priorityScore: 3,
          symptoms: ["Mild frontal headache", "Slight ankle swelling"],
          prescriptions: [
            { drug: "Tab Iron & Folic Acid (IFA)", dosage: "1 tab daily", duration: "90 days", date: "25 Aug 2026", doctor: "Dr. Sharma" },
            { drug: "Tab Calcium 500mg", dosage: "1 tab twice daily", duration: "90 days", date: "25 Aug 2026", doctor: "Dr. Sharma" }
          ],
          documents: [
            { title: "PHC Clinical Prescription", type: "Prescription", date: "25 Aug 2026", facility: "PHC ABC" },
            { title: "Complete Blood Count (CBC) & Sugar", type: "Lab Report", date: "18 Aug 2026", facility: "Vadgaon Diagnostic Unit" },
            { title: "Obstetric Anomaly Referral Slip", type: "Referral Document", date: "08 Sep 2026", facility: "Sub-Centre Vadgaon" },
            { title: "ANC Mother & Child Protection Card", type: "Medical Record", date: "02 May 2026", facility: "Govt of Maharashtra RCH" }
          ]
        },
        {
          id: "MMC-PT-109",
          name: "Anita Shinde",
          age: 32,
          gender: "Female",
          village: "Vadgaon",
          phone: "+91 98765 12340",
          healthSummary: "Acute febrile illness, suspected viral pyrexia",
          vitals: { bp: "124/80", pulse: 88, spo2: 97, hb: "11.5", temp: "100.4 °F" },
          priority: "Priority",
          priorityScore: 2,
          symptoms: ["High fever", "Body ache", "Mild cough"]
        },
        {
          id: "MMC-PT-110",
          name: "Ramesh Patil",
          age: 54,
          gender: "Male",
          village: "Vadgaon",
          phone: "+91 94220 98123",
          healthSummary: "Type 2 Diabetes Mellitus & Primary Hypertension (Routine Monitoring)",
          vitals: { bp: "130/84", pulse: 72, spo2: 98, bsl: "142 mg/dL" },
          priority: "Normal",
          priorityScore: 1,
          symptoms: ["Routine quarterly review"]
        },
        {
          id: "MMC-PT-111",
          name: "Meena Kamble",
          age: 45,
          gender: "Female",
          village: "Vadgaon",
          phone: "+91 98211 44556",
          healthSummary: "Mild osteoarthritis knee, routine analgesic refill",
          vitals: { bp: "122/78", pulse: 76, spo2: 99 },
          priority: "Normal",
          priorityScore: 1,
          symptoms: ["Knee pain on prolonged walking"]
        }
      ],
      appointments: [
        {
          id: "APT-1001",
          patientId: "MMC-PT-108",
          patientName: "Sita Devi",
          doctorName: "Dr. Sharma",
          facility: "PHC ABC, Vadgaon Block",
          date: "10 September 2026",
          time: "10:00 AM",
          consultType: "In-Person (OPD)",
          token: "Token #04",
          priority: "High",
          status: "Waiting"
        },
        {
          id: "APT-1002",
          patientId: "MMC-PT-109",
          patientName: "Anita Shinde",
          doctorName: "Dr. Sharma",
          facility: "PHC ABC, Vadgaon Block",
          date: "10 September 2026",
          time: "10:30 AM",
          consultType: "In-Person (OPD)",
          token: "Token #05",
          priority: "Priority",
          status: "Waiting"
        },
        {
          id: "APT-1003",
          patientId: "MMC-PT-110",
          patientName: "Ramesh Patil",
          doctorName: "Dr. Sharma",
          facility: "PHC ABC, Vadgaon Block",
          date: "10 September 2026",
          time: "11:00 AM",
          consultType: "In-Person (OPD)",
          token: "Token #01",
          priority: "Normal",
          status: "Completed"
        }
      ],
      referrals: [
        {
          id: "REF-1024",
          patientId: "MMC-PT-108",
          patientName: "Sita Devi",
          fromFacility: "PHC ABC / Sub-Centre Vadgaon",
          toFacility: "Rural Hospital (RH) Vadgaon / Sub-District Hospital",
          specialty: "Obstetric Ultrasonography & High-Risk Pregnancy",
          reason: "2nd Trimester Anomaly Scan & Gestational BP Evaluation",
          priority: "High",
          date: "08 Sep 2026",
          status: "Referred", // "Referred" -> "Arrived" -> "Consulted" -> "Completed"
          stepIndex: 1
        }
      ],
      followups: [
        {
          id: "FLW-201",
          patientName: "Sita Devi",
          patientId: "MMC-PT-108",
          type: "ANC 2nd Trimester Follow-Up",
          dueDate: "10 September 2026",
          category: "today",
          status: "Due Today",
          assignedTo: "Sunita Tai (ASHA)"
        },
        {
          id: "FLW-202",
          patientName: "Anita Shinde",
          patientId: "MMC-PT-109",
          type: "Post-Febrile Vitals Verification",
          dueDate: "12 September 2026",
          category: "upcoming",
          status: "Upcoming",
          assignedTo: "Sunita Tai (ASHA)"
        },
        {
          id: "FLW-203",
          patientName: "Ramesh Patil",
          patientId: "MMC-PT-110",
          type: "Monthly Fasting Sugar & BP Log",
          dueDate: "07 September 2026",
          category: "overdue",
          status: "Overdue",
          assignedTo: "Sunita Tai (ASHA)"
        },
        {
          id: "FLW-204",
          patientName: "Sunita Gaikwad",
          patientId: "MMC-PT-095",
          type: "Postnatal Day 14 Home Check",
          dueDate: "05 September 2026",
          category: "completed",
          status: "Completed",
          assignedTo: "Sunita Tai (ASHA)"
        }
      ],
      medicines: [
        {
          name: "Paracetamol 500mg",
          category: "Analgesic / Antipyretic",
          facilities: [
            { name: "Sub-Centre Vadgaon", distance: "0.8 km", status: "Available", stock: "150 strips", badgeClass: "in-stock" },
            { name: "PHC ABC", distance: "2.5 km", status: "Available", stock: "420 strips", badgeClass: "in-stock" },
            { name: "PHC XYZ", distance: "5.2 km", status: "Out of Stock", stock: "0 strips", badgeClass: "out-of-stock" }
          ]
        },
        {
          name: "Iron & Folic Acid (IFA)",
          category: "Maternal Health Supplement",
          facilities: [
            { name: "Sub-Centre Vadgaon", distance: "0.8 km", status: "Available", stock: "300 strips", badgeClass: "in-stock" },
            { name: "PHC ABC", distance: "2.5 km", status: "Available", stock: "800 strips", badgeClass: "in-stock" },
            { name: "Rural Hospital", distance: "12.0 km", status: "Available", stock: "1500 strips", badgeClass: "in-stock" }
          ]
        },
        {
          name: "Calcium 500mg",
          category: "Essential Mineral",
          facilities: [
            { name: "Sub-Centre Vadgaon", distance: "0.8 km", status: "Available", stock: "120 strips", badgeClass: "in-stock" },
            { name: "PHC ABC", distance: "2.5 km", status: "Available", stock: "500 strips", badgeClass: "in-stock" }
          ]
        },
        {
          name: "Amoxicillin 500mg",
          category: "Antibiotic",
          facilities: [
            { name: "Sub-Centre Vadgaon", distance: "0.8 km", status: "Low Stock", stock: "15 strips", badgeClass: "in-stock" },
            { name: "PHC ABC", distance: "2.5 km", status: "Available", stock: "280 strips", badgeClass: "in-stock" }
          ]
        }
      ]
    };
    localStorage.setItem("swasthya_shared_state", JSON.stringify(initialState));
  }
}

function getSharedState() {
  initSharedState();
  try {
    const state = JSON.parse(localStorage.getItem("swasthya_shared_state"));
    if (state) {
      if (!Array.isArray(state.patients)) state.patients = [];
      if (!Array.isArray(state.appointments)) state.appointments = [];
      if (!Array.isArray(state.medicines) || state.medicines.length === 0) {
        state.medicines = [
          {
            name: "Paracetamol 500mg",
            category: "Analgesic / Antipyretic",
            facilities: [
              { name: "Sub-Centre Vadgaon", distance: "0.8 km", status: "Available", stock: "150 strips", badgeClass: "in-stock" },
              { name: "PHC ABC", distance: "2.5 km", status: "Available", stock: "420 strips", badgeClass: "in-stock" },
              { name: "PHC XYZ", distance: "5.2 km", status: "Out of Stock", stock: "0 strips", badgeClass: "out-of-stock" }
            ]
          },
          {
            name: "Iron & Folic Acid (IFA)",
            category: "Maternal Health Supplement",
            facilities: [
              { name: "Sub-Centre Vadgaon", distance: "0.8 km", status: "Available", stock: "300 strips", badgeClass: "in-stock" },
              { name: "PHC ABC", distance: "2.5 km", status: "Available", stock: "800 strips", badgeClass: "in-stock" },
              { name: "Rural Hospital", distance: "12.0 km", status: "Available", stock: "1500 strips", badgeClass: "in-stock" }
            ]
          },
          {
            name: "Calcium 500mg",
            category: "Essential Mineral",
            facilities: [
              { name: "Sub-Centre Vadgaon", distance: "0.8 km", status: "Available", stock: "120 strips", badgeClass: "in-stock" },
              { name: "PHC ABC", distance: "2.5 km", status: "Available", stock: "500 strips", badgeClass: "in-stock" }
            ]
          },
          {
            name: "Amoxicillin 500mg",
            category: "Antibiotic",
            facilities: [
              { name: "Sub-Centre Vadgaon", distance: "0.8 km", status: "Low Stock", stock: "15 strips", badgeClass: "in-stock" },
              { name: "PHC ABC", distance: "2.5 km", status: "Available", stock: "280 strips", badgeClass: "in-stock" }
            ]
          }
        ];
        saveSharedState(state);
      }
    }
    return state;
  } catch (e) {
    return null;
  }
}

function saveSharedState(state) {
  localStorage.setItem("swasthya_shared_state", JSON.stringify(state));
}

/* ==========================================================================
   0. Authentication Session & Gatekeeper Protection with Role Guard
   ========================================================================== */
function initAuthProtection() {
  const currentPath = window.location.pathname.split('/').filter(Boolean).pop() || 'index.html';

  // Synchronize session storage with local storage if logged in
  if (localStorage.getItem("loggedIn") === "true" && sessionStorage.getItem("loggedIn") !== "true") {
    sessionStorage.setItem("loggedIn", "true");
    sessionStorage.setItem("userRole", localStorage.getItem("userRole") || "asha");
    sessionStorage.setItem("userName", localStorage.getItem("userName") || "");
  }
  if (sessionStorage.getItem("loggedIn") === "true" && localStorage.getItem("loggedIn") !== "true") {
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("userRole", sessionStorage.getItem("userRole") || "asha");
    localStorage.setItem("userName", sessionStorage.getItem("userName") || "");
  }

  const isLoggedIn = localStorage.getItem("loggedIn") === "true" || sessionStorage.getItem("loggedIn") === "true";

  // Role dashboards authentication & demo tolerance
  const protectedDashboards = ['patient-dashboard.html', 'asha-dashboard.html', 'doctor-dashboard.html'];
  const userLoggedOut = sessionStorage.getItem("userLoggedOut") === "true";
  if (protectedDashboards.includes(currentPath)) {
    if (userLoggedOut) {
      window.location.replace("login.html");
      return;
    }
    if (!isLoggedIn) {
      const defaultRole = currentPath === 'patient-dashboard.html' ? 'patient' : currentPath === 'doctor-dashboard.html' ? 'doctor' : 'asha';
      const defaultName = defaultRole === 'patient' ? 'Sita Devi' : defaultRole === 'doctor' ? 'Dr. Sharma' : 'Sunita Tai';
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("userRole", defaultRole);
      localStorage.setItem("userName", defaultName);
      sessionStorage.setItem("loggedIn", "true");
      sessionStorage.setItem("userRole", defaultRole);
      sessionStorage.setItem("userName", defaultName);
    }
  }

  // Populate user pill if elements exist (Never on public landing / Home page)
  try {
    const isHomePage = currentPath === 'index.html' || currentPath === '' || currentPath === '/';
    if (isHomePage) {
      const userPill = document.getElementById('userSessionPill');
      const logoutBtn = document.getElementById('logoutBtn');
      const drawerLogout = document.getElementById('drawerLogoutWrap');
      if (userPill) userPill.style.display = 'none';
      if (logoutBtn) logoutBtn.style.display = 'none';
      if (drawerLogout) drawerLogout.style.display = 'none';
      return;
    }
    const userPill = document.getElementById('userSessionPill');
    const userName = document.getElementById('userSessionName');
    const userIcon = document.getElementById('userSessionRoleIcon');
    const logoutBtn = document.getElementById('logoutBtn');
    const userRole = localStorage.getItem("userRole") || "asha";

    if (isLoggedIn) {
      const storedName = localStorage.getItem("userName") || (userRole === 'patient' ? 'Sita Devi' : userRole === 'doctor' ? 'Dr. Sharma' : 'Sunita Tai');
      if (userPill && userName) {
        userName.textContent = storedName;
        if (userIcon) {
          userIcon.textContent = userRole === 'doctor' ? '🩺' : userRole === 'asha' ? '👩‍⚕️' : '👤';
        }
        userPill.style.display = 'inline-flex';
      }
      if (logoutBtn) logoutBtn.style.display = 'inline-flex';
    } else {
      if (userPill) userPill.style.display = 'none';
      if (logoutBtn) logoutBtn.style.display = 'none';
    }
  } catch (e) {}

  // Working Logout trigger across all dashboards
  const handleLogout = (e) => {
    if (e) e.preventDefault();
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    sessionStorage.removeItem("loggedIn");
    sessionStorage.removeItem("userRole");
    sessionStorage.removeItem("userName");
    sessionStorage.removeItem('mmc_user_session');
    localStorage.removeItem('mmc_user_session');
    sessionStorage.setItem("userLoggedOut", "true");
    window.location.replace("index.html");
  };

  document.querySelectorAll('#logoutBtn, #drawerLogoutBtn, .gov-logout-btn, .drawer-logout-link').forEach(btn => {
    btn.addEventListener('click', handleLogout);
  });
}

/* ==========================================================================
   1. Navigation & Mobile Drawer
   ========================================================================== */
function initNav() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const drawer = document.getElementById('mobileNavDrawer');
  const closeBtn = document.getElementById('drawerCloseBtn');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', () => {
      drawer.classList.add('open');
    });
  }

  if (closeBtn && drawer) {
    closeBtn.addEventListener('click', () => {
      drawer.classList.remove('open');
    });
  }

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
    });
  });

  // Highlight active link based on current page URL
  let currentPath = window.location.pathname.split('/').filter(Boolean).pop() || 'index.html';
  if (currentPath === '' || currentPath === '/') {
    currentPath = 'index.html';
  }

  document.querySelectorAll('.nav-link, .drawer-link').forEach(link => {
    const href = link.getAttribute('href');
    const cleanHref = href ? href.split('#')[0].split('?')[0] : '';
    if (cleanHref === currentPath || (currentPath === 'index.html' && (cleanHref === 'index.html' || cleanHref === '/' || cleanHref === ''))) {
      link.classList.add('active');
    } else if (cleanHref && !cleanHref.startsWith('#')) {
      link.classList.remove('active');
    }
  });

  // Ensure Home item is always highlighted/active when on Home page or root URL
  if (currentPath === 'index.html') {
    const homeNav = document.querySelector('.nav-link[href="index.html"], .nav-link[href="/"]');
    if (homeNav) homeNav.classList.add('active');
    const homeDrawer = document.querySelector('.drawer-link[href="index.html"], .drawer-link[href="/"]');
    if (homeDrawer) homeDrawer.classList.add('active');
  }
}

/* ==========================================================================
   2. Multilingual (i18n) Engine & Accessibility Controls
   ========================================================================== */

function getLanguage() {
  return localStorage.getItem('language') || 
         localStorage.getItem('mmc_language') || 
         sessionStorage.getItem('language') || 
         sessionStorage.getItem('mmc_language') || 
         'en';
}

function t(key, fallback) {
  const lang = getLanguage();
  const allDicts = window.translations || window.MMC_TRANSLATIONS;
  if (allDicts && allDicts[lang] && allDicts[lang][key] !== undefined) {
    return allDicts[lang][key];
  }
  if (allDicts && allDicts['en'] && allDicts['en'][key] !== undefined) {
    return allDicts['en'][key];
  }
  return fallback !== undefined ? fallback : key;
}

// Expose globally for inline scripts on any page
window.t = t;
window.getLanguage = getLanguage;
window.setLanguage = setLanguage;

function applyTranslations(lang) {
  const allDicts = window.translations || window.MMC_TRANSLATIONS;
  if (!allDicts) return;
  const dict = allDicts[lang] || allDicts['en'];
  if (!dict) return;

  // 1. Text elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) {
      if (el.tagName === 'TITLE') {
        document.title = dict[key];
      } else if (typeof dict[key] === 'string' && dict[key].includes('<') && dict[key].includes('>')) {
        el.innerHTML = dict[key];
      } else {
        el.textContent = dict[key];
      }
    }
  });

  // 2. Input placeholders with data-i18n-placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key] !== undefined) {
      el.setAttribute('placeholder', dict[key]);
    }
  });

  // 3. Titles with data-i18n-title
  document.querySelectorAll('[data-i18n-title]').forEach((el) => {
    const key = el.getAttribute('data-i18n-title');
    if (dict[key] !== undefined) {
      el.setAttribute('title', dict[key]);
    }
  });

  // 4. Aria labels with data-i18n-aria
  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    const key = el.getAttribute('data-i18n-aria');
    if (dict[key] !== undefined) {
      el.setAttribute('aria-label', dict[key]);
    }
  });

  // 5. Synchronize all language selectors
  const langSelects = document.querySelectorAll('#langSelect, #drawerLangSelect, .lang-select');
  langSelects.forEach((sel) => {
    if (sel.value !== lang) {
      sel.value = lang;
    }
  });

  // 6. Update legacy toggle button if present
  const langToggleBtn = document.getElementById('langToggleBtn');
  if (langToggleBtn) {
    const labelMap = { en: 'English', hi: 'हिंदी', mr: 'मराठी' };
    langToggleBtn.innerHTML = `<span>🌐</span> ${labelMap[lang] || 'English'}`;
  }

  // 7. Update document lang attribute
  document.documentElement.setAttribute('lang', lang);
}

function setLanguage(lang, notify = true) {
  if (!['en', 'hi', 'mr'].includes(lang)) lang = 'en';
  localStorage.setItem('language', lang);
  localStorage.setItem('mmc_language', lang);
  sessionStorage.setItem('language', lang);
  sessionStorage.setItem('mmc_language', lang);
  
  applyTranslations(lang);

  window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));

  if (notify) {
    const msgs = {
      en: 'Language switched to English',
      hi: 'भाषा बदलकर हिंदी कर दी गई है',
      mr: 'भाषा बदलून मराठी करण्यात आली आहे'
    };
    showToast(msgs[lang] || 'Language updated');
  }
}

function initI18n() {
  const currentLang = getLanguage();
  document.documentElement.setAttribute('lang', currentLang);

  // Apply immediately if translations are already loaded in memory
  if (window.MMC_TRANSLATIONS) {
    applyTranslations(currentLang);
  }

  // Bind change events to all language selectors
  document.querySelectorAll('#langSelect, #drawerLangSelect, .lang-select').forEach((sel) => {
    sel.value = currentLang;
    sel.addEventListener('change', (e) => {
      setLanguage(e.target.value, true);
    });
  });

  // Backward compatibility click handler for legacy button
  const toggleBtn = document.getElementById('langToggleBtn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const cur = getLanguage();
      const next = cur === 'en' ? 'hi' : cur === 'hi' ? 'mr' : 'en';
      setLanguage(next, true);
    });
  }
}

function initAccessibility() {
  const root = document.documentElement;
  let currentSize = 16;

  document.getElementById('fontDecBtn')?.addEventListener('click', () => {
    if (currentSize > 13) {
      currentSize -= 1;
      root.style.fontSize = `${currentSize}px`;
      showToast(`Text size: ${currentSize}px`);
    }
  });

  document.getElementById('fontResetBtn')?.addEventListener('click', () => {
    currentSize = 16;
    root.style.fontSize = '16px';
    showToast(t('gov.font_reset_toast', 'Text size reset to default (16px)'));
  });

  document.getElementById('fontIncBtn')?.addEventListener('click', () => {
    if (currentSize < 20) {
      currentSize += 1;
      root.style.fontSize = `${currentSize}px`;
      showToast(`Text size: ${currentSize}px`);
    }
  });
}

/* ==========================================================================
   3. Feature 1: Appointment & Slot Booking
   ========================================================================== */
function initAppointmentFeature() {
  let selectedSlot = '10:30 AM';
  let selectedType = 'Video';

  const slotBtns = document.querySelectorAll('.slot-btn');
  slotBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      slotBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedSlot = btn.dataset.slot || btn.textContent.trim();
    });
  });

  const consultTypeBtns = document.querySelectorAll('.consult-type-btn');
  consultTypeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      consultTypeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedType = btn.dataset.type || btn.textContent.trim();
    });
  });

  const confirmBtn = document.getElementById('confirmApptBtn');
  confirmBtn?.addEventListener('click', () => {
    const modal = document.getElementById('apptSuccessModal');
    const detailEl = document.getElementById('apptModalDetail');
    if (detailEl) {
      detailEl.textContent = `${selectedSlot} — Dr. Sharma (${selectedType} Consultation)`;
    }
    openModal(modal);
  });
}

/* ==========================================================================
   4. Feature 2: Risk-Based Earlier Consultation
   ========================================================================== */
function initRiskConsultFeature() {
  const consultNowBtn = document.getElementById('riskConsultNowBtn');
  const viewOptionsBtn = document.getElementById('riskViewOptionsBtn');

  consultNowBtn?.addEventListener('click', () => {
    const modal = document.getElementById('teleconsultModal');
    openModal(modal);
  });

  viewOptionsBtn?.addEventListener('click', () => {
    showToast(t('toast.phc_priority', 'Prioritizing nearest PHC ABC (25 mins) and e-Sanjeevani Teleconsult (12 mins)'));
  });
}

/* ==========================================================================
   5. Feature 3: E-Referral & Referral ID
   ========================================================================== */
function initReferralFeature() {
  const toggleBtn = document.getElementById('updateReferralStatusBtn');
  const trackBtn = document.getElementById('trackReferralBtn');
  const statusBadge = document.getElementById('referralStatusBadge');
  const progressLine = document.getElementById('referralProgressLine');
  const nodeReferred = document.getElementById('refNodeReferred');
  const nodeArrived = document.getElementById('refNodeArrived');
  const nodeConsulted = document.getElementById('refNodeConsulted');

  let statusState = 1; // 1: Referred, 2: Arrived, 3: Consulted

  function updateStatusUI() {
    if (statusState === 1) {
      statusBadge.className = 'badge-status badge-yellow';
      statusBadge.innerHTML = '<span class="status-dot"></span> 🟡 Referred';
      progressLine.style.width = '0%';
      nodeReferred.className = 'status-step-node completed';
      nodeArrived.className = 'status-step-node';
      nodeConsulted.className = 'status-step-node';
      toggleBtn.textContent = 'Mark as Arrived (Demonstration)';
      toggleBtn.className = 'btn-primary';
    } else if (statusState === 2) {
      statusBadge.className = 'badge-status badge-blue';
      statusBadge.innerHTML = '<span class="status-dot"></span> 🔵 Arrived';
      progressLine.style.width = '50%';
      nodeReferred.className = 'status-step-node completed';
      nodeArrived.className = 'status-step-node active';
      nodeConsulted.className = 'status-step-node';
      toggleBtn.textContent = 'Complete Consultation (Demonstration)';
      toggleBtn.className = 'btn-primary';
    } else if (statusState === 3) {
      statusBadge.className = 'badge-status badge-green';
      statusBadge.innerHTML = '<span class="status-dot"></span> 🟢 Consulted';
      progressLine.style.width = '100%';
      nodeReferred.className = 'status-step-node completed';
      nodeArrived.className = 'status-step-node completed';
      nodeConsulted.className = 'status-step-node completed';
      toggleBtn.textContent = 'Reset Referral Demo (Referred)';
      toggleBtn.className = 'btn-secondary';
    }
  }

  toggleBtn?.addEventListener('click', () => {
    statusState = (statusState % 3) + 1;
    updateStatusUI();
    const states = ['', 'Referred', 'Arrived at Rural Hospital', 'Consultation Completed'];
    showToast(`Referral REF-1024 updated: ${states[statusState]}`);
  });

  trackBtn?.addEventListener('click', () => {
    const modal = document.getElementById('referralDetailModal');
    openModal(modal);
  });
}

/* ==========================================================================
   6. Feature 4: Care Plan & Follow-Up
   ========================================================================== */
function initCarePlanFeature() {
  const markCompletedBtn = document.getElementById('markFollowupCompletedBtn');
  const rescheduleBtn = document.getElementById('rescheduleFollowupBtn');
  const statusBadge = document.getElementById('carePlanStatusBadge');
  const dueReminderBox = document.getElementById('dueReminderCard');
  let isCompleted = false;

  markCompletedBtn?.addEventListener('click', () => {
    isCompleted = !isCompleted;
    if (isCompleted) {
      statusBadge.className = 'badge-status badge-green';
      statusBadge.innerHTML = '<span class="status-dot"></span> 🟢 Completed';
      markCompletedBtn.textContent = 'Reopen Task (Demo)';
      markCompletedBtn.className = 'btn-secondary';
      dueReminderBox.style.opacity = '0.4';
      showToast(t('toast.flw_completed', '✓ ANC Follow-up marked as COMPLETED for Sita Devi'));
    } else {
      statusBadge.className = 'badge-status badge-yellow';
      statusBadge.innerHTML = '<span class="status-dot"></span> 🟡 Upcoming';
      markCompletedBtn.textContent = 'Mark Completed';
      markCompletedBtn.className = 'btn-primary';
      dueReminderBox.style.opacity = '1';
      showToast(t('toast.flw_reverted', 'ANC Follow-up status reverted to Upcoming'));
    }
  });

  rescheduleBtn?.addEventListener('click', () => {
    showToast(t('toast.next_visit', 'Next visit scheduled for 22 September (Demo)'));
  });

  // Category filter pills
  const catPills = document.querySelectorAll('.cat-pill');
  catPills.forEach(pill => {
    pill.addEventListener('click', () => {
      catPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const cat = pill.dataset.cat;
      showToast(`Filtering Care Plans for: ${cat}`);
    });
  });
}

/* ==========================================================================
   7. Feature 5: Medicine & Diagnostic Availability
   ========================================================================== */
function initMedicineSearchFeature() {
  const searchInput = document.getElementById('medSearchInput');
  const inventoryList = document.getElementById('medInventoryList');
  const quickPills = document.querySelectorAll('.med-quick-pill');

  const medicineDatabase = {
    'paracetamol': [
      { name: 'PHC ABC', dist: '2.5 km away', status: 'Available', badgeClass: 'badge-green', stock: '240 strips' },
      { name: 'PHC XYZ', dist: '5.2 km away', status: 'Out of Stock', badgeClass: 'badge-red', stock: '0 units' },
      { name: 'Rural Hospital', dist: '8.4 km away', status: 'Available', badgeClass: 'badge-green', stock: '850 strips' }
    ],
    'amoxicillin': [
      { name: 'PHC ABC', dist: '2.5 km away', status: 'Available', badgeClass: 'badge-green', stock: '110 boxes' },
      { name: 'PHC XYZ', dist: '5.2 km away', status: 'Available', badgeClass: 'badge-green', stock: '45 boxes' },
      { name: 'Rural Hospital', dist: '8.4 km away', status: 'Available', badgeClass: 'badge-green', stock: '320 boxes' }
    ],
    'ors': [
      { name: 'PHC ABC', dist: '2.5 km away', status: 'Available', badgeClass: 'badge-green', stock: '180 packets' },
      { name: 'PHC XYZ', dist: '5.2 km away', status: 'Available', badgeClass: 'badge-green', stock: '95 packets' },
      { name: 'Rural Hospital', dist: '8.4 km away', status: 'Available', badgeClass: 'badge-green', stock: '500 packets' }
    ],
    'iron': [
      { name: 'PHC ABC', dist: '2.5 km away', status: 'Available', badgeClass: 'badge-green', stock: '400 tablets' },
      { name: 'PHC XYZ', dist: '5.2 km away', status: 'Low Stock', badgeClass: 'badge-yellow', stock: '25 tablets' },
      { name: 'Rural Hospital', dist: '8.4 km away', status: 'Available', badgeClass: 'badge-green', stock: '1,200 tablets' }
    ]
  };

  function renderInventory(query) {
    if (!inventoryList) return;
    const cleanQuery = query.toLowerCase().trim();
    let key = 'paracetamol';
    if (cleanQuery.includes('amox')) key = 'amoxicillin';
    else if (cleanQuery.includes('ors')) key = 'ors';
    else if (cleanQuery.includes('iron') || cleanQuery.includes('folic')) key = 'iron';

    const facilities = medicineDatabase[key] || medicineDatabase['paracetamol'];

    inventoryList.innerHTML = facilities.map(fac => `
      <div class="inventory-row">
        <div class="inv-facility-meta">
          <span class="inv-facility-name">${fac.name}</span>
          <span class="inv-facility-dist">${fac.dist} • Stock: ${fac.stock}</span>
        </div>
        <div style="display:flex; align-items:center; gap:0.5rem;">
          <span class="badge-status ${fac.badgeClass}">
            <span class="status-dot"></span> ${fac.status}
          </span>
          <button class="btn-secondary view-facility-btn" data-facility="${fac.name}" style="padding:0.25rem 0.6rem; font-size:0.75rem;">
            View Facility
          </button>
        </div>
      </div>
    `).join('');

    // Attach click listeners to view facility buttons
    document.querySelectorAll('.view-facility-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const facName = e.target.dataset.facility;
        const modal = document.getElementById('facilityDetailModal');
        document.getElementById('facilityModalName').textContent = facName;
        openModal(modal);
      });
    });
  }

  searchInput?.addEventListener('input', (e) => {
    renderInventory(e.target.value);
  });

  quickPills.forEach(pill => {
    pill.addEventListener('click', () => {
      quickPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const medName = pill.dataset.med;
      if (searchInput) searchInput.value = medName;
      renderInventory(medName);
      showToast(`Showing availability for: ${medName}`);
    });
  });

  // Initial render
  renderInventory('paracetamol');
}

/* ==========================================================================
   8. Section 14: Designed Around the ASHA Worker (Mobile/Tablet Mockup)
   ========================================================================== */
function initAshaTablet() {
  const touchBtns = document.querySelectorAll('.asha-touch-btn');
  touchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      const label = btn.querySelector('.asha-touch-label')?.textContent.trim();
      const modal = document.getElementById('ashaActionModal');
      document.getElementById('ashaActionModalTitle').textContent = `ASHA Action: ${label}`;
      document.getElementById('ashaActionModalDesc').textContent = 
        `Simulating ${label} screen optimized for high-readability rural field data entry and offline-first syncing.`;
      openModal(modal);
    });
  });
}

/* ==========================================================================
   10. Modal Helper Functions
   ========================================================================== */
function initModals() {
  document.querySelectorAll('.modal-close-trigger, .modal-close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (modal) {
        closeModal(modal);
      } else {
        document.querySelectorAll('.modal-overlay').forEach(m => closeModal(m));
      }
    });
  });

  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(m => closeModal(m));
    }
  });

  // Solution Explorer Trigger
  document.getElementById('exploreSolutionBtn')?.addEventListener('click', () => {
    const modal = document.getElementById('solutionOverviewModal');
    openModal(modal);
  });
}

function openModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.remove('active');
  document.body.style.overflow = '';
}

window.openModal = openModal;
window.closeModal = closeModal;

/* ==========================================================================
   11. Toast Notification Utility
   ========================================================================== */
let toastTimeout;
function showToast(message) {
  let toast = document.getElementById('globalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToast';
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <span style="color:var(--color-primary-healthcare); font-size:1.2rem;">✓</span>
    <span class="toast-text">${message}</span>
  `;

  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

/* ==========================================================================
   12. Complaints Page Logic (Submit & Track)
   ========================================================================== */
function initComplaintsPage() {
  const form = document.getElementById('complaintForm');
  const successAlert = document.getElementById('complaintSuccessAlert');
  const confirmedIdBadge = document.getElementById('confirmedComplaintIdBadge');
  const confirmedDesc = document.getElementById('confirmedComplaintDesc');
  const viewInTrackerBtn = document.getElementById('viewInTrackerBtn');
  const submitAnotherBtn = document.getElementById('submitAnotherComplaintBtn');

  // File Upload Handling
  const uploadZone = document.getElementById('compUploadZone');
  const fileInput = document.getElementById('compFileInput');
  const fileList = document.getElementById('compFileList');

  let uploadedFiles = [];

  function renderFileList() {
    if (!fileList) return;
    fileList.innerHTML = uploadedFiles.map((f, idx) => `
      <div class="file-preview-item">
        <span>📎 <strong>${f.name}</strong> (${(f.size / 1024).toFixed(1)} KB)</span>
        <button type="button" class="file-preview-remove" data-idx="${idx}" title="Remove file">&times;</button>
      </div>
    `).join('');

    fileList.querySelectorAll('.file-preview-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.dataset.idx, 10);
        uploadedFiles.splice(idx, 1);
        renderFileList();
      });
    });
  }

  function handleFiles(files) {
    for (let i = 0; i < files.length; i++) {
      uploadedFiles.push(files[i]);
    }
    renderFileList();
    showToast(`Attached: ${files[0].name}`);
  }

  if (uploadZone && fileInput) {
    uploadZone.addEventListener('click', () => fileInput.click());

    uploadZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadZone.classList.add('dragover');
    });

    uploadZone.addEventListener('dragleave', () => {
      uploadZone.classList.remove('dragover');
    });

    uploadZone.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadZone.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files && fileInput.files.length > 0) {
        handleFiles(fileInput.files);
      }
    });
  }

  // 3-Stage Tracking Helper
  function updateTrackerUI(id, name, location, cat, status) {
    const trackInput = document.getElementById('trackIdInput');
    if (trackInput) trackInput.value = id;

    const badge = document.getElementById('trackerCurrentBadge');
    const fillLine = document.getElementById('stepperFillLine');
    const nodeSub = document.getElementById('stepNodeSubmitted');
    const nodeRev = document.getElementById('stepNodeReview');
    const nodeRes = document.getElementById('stepNodeResolved');
    const bubbleSub = document.getElementById('stepBubbleSubmitted');
    const bubbleRev = document.getElementById('stepBubbleReview');
    const bubbleRes = document.getElementById('stepBubbleResolved');
    const subSubmitted = document.getElementById('stepSubSubmitted');
    const subReview = document.getElementById('stepSubReview');
    const subResolved = document.getElementById('stepSubResolved');

    const detailId = document.getElementById('trackDetailId');
    const detailName = document.getElementById('trackDetailName');
    const detailLoc = document.getElementById('trackDetailLocation');
    const detailCat = document.getElementById('trackDetailCat');
    const detailNotes = document.getElementById('trackDetailNotes');
    const detailSLA = document.getElementById('trackDetailSLA');

    if (detailId) detailId.textContent = id;
    if (detailName) detailName.textContent = name;
    if (detailLoc) detailLoc.textContent = location;
    if (detailCat) detailCat.textContent = cat;

    if (status === 'submitted') {
      if (badge) { badge.className = 'badge-status badge-blue'; badge.textContent = 'Submitted'; }
      if (fillLine) fillLine.style.width = '0%';
      if (nodeSub) nodeSub.className = 'stepper-3-node completed';
      if (nodeRev) nodeRev.className = 'stepper-3-node';
      if (nodeRes) nodeRes.className = 'stepper-3-node';
      if (bubbleSub) bubbleSub.innerHTML = '✓';
      if (bubbleRev) bubbleRev.innerHTML = '2';
      if (bubbleRes) bubbleRes.innerHTML = '3';
      if (subSubmitted) subSubmitted.textContent = 'Just Now';
      if (subReview) subReview.textContent = 'Awaiting Review';
      if (subResolved) subResolved.textContent = 'Pending';
      if (detailNotes) detailNotes.textContent = 'Grievance lodged on portal. Verification pending with Taluka Health Office.';
      if (detailSLA) detailSLA.textContent = 'Within 48 Hours';
    } else if (status === 'review') {
      if (badge) { badge.className = 'badge-status badge-yellow'; badge.textContent = 'Under Review'; }
      if (fillLine) fillLine.style.width = '50%';
      if (nodeSub) nodeSub.className = 'stepper-3-node completed';
      if (nodeRev) nodeRev.className = 'stepper-3-node active';
      if (nodeRes) nodeRes.className = 'stepper-3-node';
      if (bubbleSub) bubbleSub.innerHTML = '✓';
      if (bubbleRev) bubbleRev.innerHTML = '2';
      if (bubbleRes) bubbleRes.innerHTML = '3';
      if (subSubmitted) subSubmitted.textContent = '07 Sep 2026';
      if (subReview) subReview.textContent = 'In Progress';
      if (subResolved) subResolved.textContent = 'Pending';
      if (detailNotes) detailNotes.textContent = 'Grievance forwarded to Taluka Health Officer for emergency stock replenishment. ASHA worker Sunita Tai alerted to provide buffer medication packet.';
      if (detailSLA) detailSLA.textContent = 'Target: 24h Remaining';
    } else if (status === 'resolved') {
      if (badge) { badge.className = 'badge-status badge-green'; badge.textContent = 'Resolved'; }
      if (fillLine) fillLine.style.width = '100%';
      if (nodeSub) nodeSub.className = 'stepper-3-node completed';
      if (nodeRev) nodeRev.className = 'stepper-3-node completed';
      if (nodeRes) nodeRes.className = 'stepper-3-node completed';
      if (bubbleSub) bubbleSub.innerHTML = '✓';
      if (bubbleRev) bubbleRev.innerHTML = '✓';
      if (bubbleRes) bubbleRes.innerHTML = '✓';
      if (subSubmitted) subSubmitted.textContent = '02 Sep 2026';
      if (subReview) subReview.textContent = 'Reviewed 03 Sep';
      if (subResolved) subResolved.textContent = 'Resolved 04 Sep';
      if (detailNotes) detailNotes.textContent = 'Full resolution memo issued: PHC ABC Medical Officer scheduled additional Saturday ANC clinic slot. Complainant contacted and confirmed satisfied.';
      if (detailSLA) detailSLA.textContent = 'Completed in 36 Hours';
    }
  }

  // Form Submit
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const fullName = document.getElementById('compFullName')?.value.trim() || 'Citizen';
      const mobile = document.getElementById('compMobile')?.value.trim() || '9876543210';
      const location = document.getElementById('compLocation')?.value.trim() || 'Vadgaon';
      const category = document.getElementById('compCategory')?.value || 'Healthcare Service';

      // Standard requested mock Complaint ID
      const generatedId = 'CMP-1024';

      if (confirmedIdBadge) confirmedIdBadge.textContent = `Complaint ID: ${generatedId}`;
      if (confirmedDesc) {
        confirmedDesc.innerHTML = `Your grievance regarding <strong>${category}</strong> at <strong>${location}</strong> has been registered. An SMS acknowledgment has been dispatched to <strong>+91 ${mobile}</strong>.`;
      }

      form.style.display = 'none';
      if (successAlert) successAlert.style.display = 'block';

      // Update tracker UI to show submitted status
      updateTrackerUI(generatedId, fullName, location, category, 'submitted');

      showToast(`${t('alert.complaint_submitted', '✓ Complaint Submitted Successfully')} (${generatedId})`);
    });
  }

  submitAnotherBtn?.addEventListener('click', () => {
    if (form) {
      form.reset();
      form.style.display = 'block';
    }
    uploadedFiles = [];
    renderFileList();
    if (successAlert) successAlert.style.display = 'none';
  });

  viewInTrackerBtn?.addEventListener('click', () => {
    document.getElementById('trackComplaintSection')?.scrollIntoView({ behavior: 'smooth' });
  });

  // Tracking Search & Sample Buttons
  const trackBtn = document.getElementById('trackSearchBtn');
  const trackInput = document.getElementById('trackIdInput');
  const sampleBtns = document.querySelectorAll('.sample-id-btn');

  trackBtn?.addEventListener('click', () => {
    const q = trackInput?.value.trim().toUpperCase() || 'CMP-1024';
    if (q === 'CMP-2048') {
      updateTrackerUI('CMP-2048', 'Pooja Gaikwad', 'Khed Taluka, Pune', 'Appointment Issue', 'resolved');
    } else if (q === 'CMP-3012') {
      updateTrackerUI('CMP-3012', 'Balasaheb Shinde', 'Vadgaon Circle', 'Diagnostic Service', 'submitted');
    } else {
      updateTrackerUI('CMP-1024', 'Sita Devi / Ramesh S.', 'Vadgaon, Taluka Maval, Pune', 'Medicine Availability', 'review');
    }
    showToast(`Showing status for: ${q}`);
  });

  sampleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const status = btn.dataset.status;
      if (id === 'CMP-2048') {
        updateTrackerUI('CMP-2048', 'Pooja Gaikwad', 'Khed Taluka, Pune', 'Appointment Issue', 'resolved');
      } else if (id === 'CMP-3012') {
        updateTrackerUI('CMP-3012', 'Balasaheb Shinde', 'Vadgaon Circle', 'Diagnostic Service', 'submitted');
      } else {
        updateTrackerUI('CMP-1024', 'Sita Devi / Ramesh S.', 'Vadgaon, Taluka Maval, Pune', 'Medicine Availability', 'review');
      }
      showToast(`Loaded: ${id} (${status.toUpperCase()})`);
    });
  });
}

/* ==========================================================================
   13. Feedback Page Logic (Stars & Submission)
   ========================================================================== */
function initFeedbackPage() {
  const form = document.getElementById('feedbackForm');
  const successAlert = document.getElementById('feedbackSuccessAlert');
  const confirmedRefBadge = document.getElementById('confirmedFeedbackBadge');
  const submitAnotherBtn = document.getElementById('submitAnotherFeedbackBtn');
  const starBtns = document.querySelectorAll('.star-btn');
  const starRatingInput = document.getElementById('selectedStarRating');
  const starLabel = document.getElementById('starRatingLabel');

  const ratingDescriptions = {
    1: '1 Star — Unsatisfactory / Needs Significant Improvement',
    2: '2 Stars — Below Expectations',
    3: '3 Stars — Satisfactory / Average Experience (समाधानकारक)',
    4: '4 Stars — Good Healthcare Experience (चांगला अनुभव)',
    5: '5 Stars — Excellent Service (उत्कृष्ट)'
  };

  function setStarRating(rating) {
    if (starRatingInput) starRatingInput.value = rating;
    starBtns.forEach(btn => {
      const val = parseInt(btn.dataset.value, 10);
      if (val <= rating) {
        btn.classList.add('selected');
      } else {
        btn.classList.remove('selected');
      }
    });
    if (starLabel) {
      starLabel.textContent = ratingDescriptions[rating] || `${rating} Stars`;
    }
  }

  starBtns.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      const hoverVal = parseInt(btn.dataset.value, 10);
      starBtns.forEach(b => {
        const val = parseInt(b.dataset.value, 10);
        if (val <= hoverVal) {
          b.classList.add('hover-active');
        } else {
          b.classList.remove('hover-active');
        }
      });
    });

    btn.addEventListener('mouseleave', () => {
      starBtns.forEach(b => b.classList.remove('hover-active'));
    });

    btn.addEventListener('click', () => {
      const clickedVal = parseInt(btn.dataset.value, 10);
      setStarRating(clickedVal);
    });
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const mockRef = `FB-${Math.floor(1000 + Math.random() * 9000)}`;
      if (confirmedRefBadge) confirmedRefBadge.textContent = `Reference: ${mockRef}`;
      form.style.display = 'none';
      if (successAlert) successAlert.style.display = 'block';
      showToast(t('alert.feedback_thanks', '✓ Thank you for your feedback!'));
    });
  }

  submitAnotherBtn?.addEventListener('click', () => {
    if (form) {
      form.reset();
      setStarRating(5);
      form.style.display = 'block';
    }
    if (successAlert) successAlert.style.display = 'none';
  });
}

/* ==========================================================================
   15. Topbar Quick Role Switcher (Facilitates Hackathon Evaluation)
   ========================================================================== */
function initRoleSwitcher() {
  const topbarRight = document.querySelector('.gov-topbar-right');
  if (!topbarRight || document.getElementById('roleSwitcherWrap')) return;

  const currentPath = window.location.pathname.split('/').filter(Boolean).pop() || 'index.html';
  // Never show role switcher on public Home page
  if (currentPath === 'index.html' || currentPath === '' || currentPath === '/') return;

  const isLoggedIn = localStorage.getItem("loggedIn") === "true" || sessionStorage.getItem("loggedIn") === "true";
  const isDashboardPage = ['patient-dashboard.html', 'asha-dashboard.html', 'doctor-dashboard.html'].includes(currentPath);
  if (!isLoggedIn && !isDashboardPage) return;

  const currentRole = localStorage.getItem("userRole") || (currentPath === 'patient-dashboard.html' ? 'patient' : currentPath === 'doctor-dashboard.html' ? 'doctor' : 'asha');

  function getRoleLabel(role) {
    if (role === 'patient') return t('login.role_patient', 'Patient');
    if (role === 'doctor') return t('login.role_doctor', 'Doctor');
    return t('login.role_asha', 'ASHA Worker');
  }

  const roleDisplay = getRoleLabel(currentRole);
  const roleIcon = currentRole === "patient" ? "👤" : currentRole === "doctor" ? "🩺" : "👩‍⚕️";

  const wrap = document.createElement('div');
  wrap.id = 'roleSwitcherWrap';
  wrap.className = 'gov-role-switcher-wrap';
  wrap.innerHTML = `
    <button type="button" id="roleSwitcherBtn" class="gov-role-switcher-btn" title="Switch Demo Role">
      <span>${roleIcon}</span>
      <span>${t('topbar.role_label', 'Role')}: <strong id="roleSwitcherDisplay">${roleDisplay}</strong></span>
      <span style="font-size: 0.65rem">▼</span>
    </button>
    <div id="roleSwitcherDropdown" class="gov-role-dropdown">
      <div style="font-size: 0.7rem; font-weight: 800; color: #64748b; padding: 0.35rem 0.5rem; text-transform: uppercase;" data-i18n="topbar.switch_role">
        ${t('topbar.switch_role', 'Switch User Role')}
      </div>
      <button type="button" class="gov-role-dropdown-item ${currentRole === 'patient' ? 'active' : ''}" data-switch-role="patient">
        <span>👤</span>
        <div>
          <div data-i18n="login.role_patient">${t('login.role_patient', 'Patient')}</div>
          <div style="font-size: 0.7rem; opacity: 0.8; font-weight: normal;">Sita Devi (Vadgaon)</div>
        </div>
      </button>
      <button type="button" class="gov-role-dropdown-item ${currentRole === 'asha' ? 'active' : ''}" data-switch-role="asha">
        <span>👩‍⚕️</span>
        <div>
          <div data-i18n="login.role_asha">${t('login.role_asha', 'ASHA Worker')}</div>
          <div style="font-size: 0.7rem; opacity: 0.8; font-weight: normal;">Sunita Tai (Frontline)</div>
        </div>
      </button>
      <button type="button" class="gov-role-dropdown-item ${currentRole === 'doctor' ? 'active' : ''}" data-switch-role="doctor">
        <span>🩺</span>
        <div>
          <div data-i18n="login.role_doctor">${t('login.role_doctor', 'Doctor')}</div>
          <div style="font-size: 0.7rem; opacity: 0.8; font-weight: normal;">Dr. Sharma (PHC ABC)</div>
        </div>
      </div>
    </div>
  `;

  window.addEventListener('languageChanged', () => {
    const activeRole = localStorage.getItem("userRole") || sessionStorage.getItem("userRole") || "asha";
    const displayEl = document.getElementById('roleSwitcherDisplay');
    if (displayEl) {
      displayEl.textContent = getRoleLabel(activeRole);
    }
  });

  // Insert before logout button if possible
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn && logoutBtn.parentNode) {
    logoutBtn.parentNode.insertBefore(wrap, logoutBtn);
  } else {
    topbarRight.appendChild(wrap);
  }

  const switcherBtn = document.getElementById('roleSwitcherBtn');
  const dropdown = document.getElementById('roleSwitcherDropdown');

  switcherBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown?.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!wrap.contains(e.target)) {
      dropdown?.classList.remove('open');
    }
  });

  wrap.querySelectorAll('[data-switch-role]').forEach(item => {
    item.addEventListener('click', () => {
      const targetRole = item.getAttribute('data-switch-role');
      let targetPage = "asha-dashboard.html";
      let name = "Sunita Tai";
      let email = "sunita.asha@health.gov.in";
      let regNo = "ASHA-MH-409";

      if (targetRole === "patient") {
        targetPage = "patient-dashboard.html";
        name = "Sita Devi";
        email = "sita.devi@citizen.health.gov.in";
        regNo = "MMC-PT-108";
      } else if (targetRole === "doctor") {
        targetPage = "doctor-dashboard.html";
        name = "Dr. Sharma";
        email = "dr.sharma@phc.org";
        regNo = "MMC-2018-0924";
      }

      const sessionData = {
        authenticated: true,
        name: name,
        email: email,
        role: targetRole === "patient" ? "Patient" : targetRole === "doctor" ? "Doctor" : "ASHA Worker",
        roleKey: targetRole,
        regNo: regNo,
        loginTime: new Date().toLocaleTimeString()
      };

      localStorage.setItem("userRole", targetRole);
      sessionStorage.setItem("userRole", targetRole);
      localStorage.setItem("mmc_user_session", JSON.stringify(sessionData));
      sessionStorage.setItem("mmc_user_session", JSON.stringify(sessionData));

      showToast(`${t('toast.role_switched', 'Role switched successfully.')} (${sessionData.role} - ${name})`);
      setTimeout(() => {
        window.location.href = targetPage;
      }, 200);
    });
  });
}

/* ==========================================================================
   16. Patient Dashboard Interactive Logic (patient-dashboard.html)
   ========================================================================== */
function initPatientDashboard() {
  const isPatientPage = window.location.pathname.endsWith('patient-dashboard.html');
  if (!isPatientPage) return;

  const state = getSharedState();
  if (!state) return;

  // 1. Medicine search in patient dashboard
  const medSearchInput = document.getElementById('patientMedSearchInput');
  const medSearchResults = document.getElementById('patientMedSearchResults');

  function renderPatientMedResults(query) {
    if (!medSearchResults) return;
    const q = (query || '').toLowerCase().trim();
    medSearchResults.innerHTML = '';

    const matched = state.medicines.filter(m => m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q));

    if (matched.length === 0) {
      medSearchResults.innerHTML = `
        <div style="padding: 1rem; text-align: center; color: #64748b; font-size: 0.85rem;">
          No matching medicines found for "${query}". Try searching "Paracetamol", "Iron", or "Calcium".
        </div>
      `;
      return;
    }

    matched.forEach(med => {
      const medBox = document.createElement('div');
      medBox.style.marginBottom = '1.25rem';
      medBox.innerHTML = `
        <div style="font-weight: 800; color: var(--color-primary-darkest); font-size: 0.95rem; margin-bottom: 0.5rem; display: flex; align-items: center; justify-content: space-between;">
          <span>💊 ${med.name}</span>
          <span style="font-size: 0.725rem; font-weight: normal; color: #64748b;">${med.category}</span>
        </div>
        ${med.facilities.map(fac => `
          <div class="med-facility-card ${fac.badgeClass}">
            <div>
              <div style="font-weight: 700; font-size: 0.875rem; color: #1e293b;">${fac.name}</div>
              <div style="font-size: 0.75rem; color: #64748b; margin-top: 0.2rem;">Distance: <strong>${fac.distance}</strong> from Vadgaon</div>
            </div>
            <div style="text-align: right;">
              <span class="triage-badge ${fac.status === 'Available' ? 'triage-badge-normal' : fac.status === 'Low Stock' ? 'triage-badge-priority' : 'triage-badge-high'}">
                ${fac.status} (${fac.stock})
              </span>
            </div>
          </div>
        `).join('')}
      `;
      medSearchResults.appendChild(medBox);
    });
  }

  medSearchInput?.addEventListener('input', (e) => {
    renderPatientMedResults(e.target.value);
  });

  // Render initial default medicine
  renderPatientMedResults('Paracetamol');

  // 2. Patient Book Appointment Modal & Dynamic Appointments Roster
  const bookApptBtn = document.getElementById('patientBookApptBtn');
  const bookApptCard = document.getElementById('patientBookApptCard');
  const bookApptAnotherBtn = document.getElementById('patientBookAnotherBtn');
  const bookApptModal = document.getElementById('patientBookApptModal');
  const bookApptForm = document.getElementById('patientBookApptForm');
  const patientDateInput = document.getElementById('patientApptDate');
  const facilitySelect = document.getElementById('patientApptFacility');
  const docSelect = document.getElementById('patientApptDoctor');

  function openPatientBookModal() {
    if (patientDateInput) {
      const today = new Date().toISOString().split('T')[0];
      patientDateInput.min = today;
      if (!patientDateInput.value || patientDateInput.value < today) {
        patientDateInput.value = today;
      }
    }
    openModal(document.getElementById('patientBookApptModal'));
  }
  window.openPatientBookModal = openPatientBookModal;

  [bookApptBtn, bookApptCard, bookApptAnotherBtn].forEach(el => {
    el?.addEventListener('click', openPatientBookModal);
  });

  // Sync Facility & Doctor selection
  facilitySelect?.addEventListener('change', (e) => {
    const fac = e.target.value;
    if (fac.includes('PHC ABC')) {
      if (docSelect) docSelect.value = 'Dr. Sharma';
    } else if (fac.includes('Rural Hospital')) {
      if (docSelect) docSelect.value = 'Dr. Patil';
    } else if (fac.includes('Sub-Centre')) {
      if (docSelect) docSelect.value = 'Dr. Kulkarni';
    }
  });

  docSelect?.addEventListener('change', (e) => {
    const doc = e.target.value;
    if (doc.includes('Sharma')) {
      if (facilitySelect) facilitySelect.value = 'PHC ABC, Vadgaon Block';
    } else if (doc.includes('Patil')) {
      if (facilitySelect) facilitySelect.value = 'Rural Hospital, Vadgaon';
    } else if (doc.includes('Kulkarni')) {
      if (facilitySelect) facilitySelect.value = 'Sub-Centre Vadgaon';
    }
  });

  // Wire "View My Appointments" card smooth-scroll
  document.getElementById('patientViewApptsCard')?.addEventListener('click', (e) => {
    const sec = document.getElementById('patientAppointmentsSection');
    if (sec) {
      sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  function formatDisplayDate(dateStr) {
    if (!dateStr) return "Today";
    if (dateStr.includes("-") && dateStr.length === 10) {
      const parts = dateStr.split("-");
      const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
      }
    }
    return dateStr;
  }

  function renderPatientAppointments() {
    const currentState = getSharedState() || state;
    const allAppts = currentState.appointments || [];

    // Filter appointments for current patient (Sita Devi / MMC-PT-108)
    const patientAppts = allAppts.filter(a => {
      return (a.patientId && a.patientId.toUpperCase().includes("PT-108")) ||
             (a.patientName && a.patientName.toLowerCase().includes("sita"));
    });

    // 1. Update Active Upcoming Appointment Card
    const apptDocEl = document.getElementById('patientActiveApptDoctor');
    const apptFacEl = document.getElementById('patientActiveApptFacility');
    const apptTimeEl = document.getElementById('patientActiveApptTime');
    const apptTokenEl = document.getElementById('patientActiveApptToken');
    const apptRefEl = document.getElementById('patientActiveApptRefId');
    const countBadge = document.getElementById('patientApptsCountBadge');

    if (patientAppts.length > 0) {
      const activeAppt = patientAppts[0];
      const docName = activeAppt.doctorName || 'Dr. Sharma';
      const facName = activeAppt.facility || 'PHC ABC, Vadgaon Block';
      const formattedDate = formatDisplayDate(activeAppt.date);
      const typeStr = activeAppt.consultType || 'In-Person (OPD)';
      const refId = activeAppt.id || 'APT-1001';

      if (apptDocEl) apptDocEl.textContent = `${docName} • ${facName}`;
      if (apptFacEl) apptFacEl.textContent = `🏥 ${facName}`;
      if (apptTimeEl) apptTimeEl.textContent = `🗓 ${formattedDate} at ${activeAppt.time} (${typeStr})`;
      if (apptTokenEl) apptTokenEl.textContent = activeAppt.token || 'Token #04';
      if (apptRefEl) apptRefEl.textContent = `Ref: ${refId}`;
      if (countBadge) countBadge.textContent = `${patientAppts.length} Active`;
    } else {
      if (apptDocEl) apptDocEl.textContent = t('p_dash.no_appts_found', 'No upcoming appointments scheduled.');
      if (apptTimeEl) apptTimeEl.textContent = 'Please book an appointment with your PHC or Medical Officer.';
      if (apptTokenEl) apptTokenEl.textContent = '—';
      if (apptRefEl) apptRefEl.textContent = '—';
      if (countBadge) countBadge.textContent = '0 Active';
    }

    // 2. Render Roster in patientAppointmentsListBody
    const tbody = document.getElementById('patientAppointmentsListBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (patientAppts.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; padding: 1.5rem; color: #64748b;">
            ${t('p_dash.no_appts_found', 'No upcoming appointments scheduled yet. Book your consultation slot above.')}
          </td>
        </tr>
      `;
      return;
    }

    patientAppts.forEach(appt => {
      const tr = document.createElement('tr');
      const isHigh = appt.priority === 'High';
      if (isHigh) tr.className = 'queue-row-high-priority';

      const pClass = isHigh ? 'triage-badge-high' : appt.priority === 'Priority' ? 'triage-badge-priority' : 'triage-badge-normal';
      const icon = isHigh ? '🔴' : appt.priority === 'Priority' ? '🟡' : '🟢';
      const statusText = appt.status || 'Waiting in OPD';
      const statusBg = (statusText.toLowerCase().includes('consulted') || statusText.toLowerCase().includes('completed'))
        ? 'background: #dcfce7; color: #15803d;'
        : 'background: #fef3c7; color: #b45309;';
      const formattedDate = formatDisplayDate(appt.date);
      const refId = appt.id || 'APT-1001';

      tr.innerHTML = `
        <td>
          <strong style="color: #1e293b;">${appt.doctorName || 'Dr. Sharma'}</strong>
          <div style="font-size: 0.75rem; color: #64748b;">${appt.facility || 'PHC ABC, Vadgaon Block'}</div>
          <div style="font-size: 0.7rem; color: #94a3b8; font-family: monospace;">Ref: ${refId}</div>
        </td>
        <td>
          <div style="font-weight: 600; font-size: 0.85rem; color: #0f172a;">${formattedDate}</div>
          <div style="font-size: 0.75rem; color: #64748b;">Slot: <strong>${appt.time}</strong></div>
        </td>
        <td>
          <div style="font-size: 0.85rem; font-weight: 700; color: var(--color-primary-darkest);">${appt.token}</div>
          <div style="font-size: 0.725rem; color: #64748b;">${appt.consultType || 'In-Person (OPD)'}</div>
        </td>
        <td>
          <span class="triage-badge" style="${statusBg}">
            ${statusText}
          </span>
        </td>
        <td>
          <button type="button" class="btn-hero-secondary btn-check-patient-token" style="padding: 0.25rem 0.65rem; font-size: 0.75rem; color: #185a42; border-color: #cbd5e1;">
            Check Token
          </button>
        </td>
      `;

      tr.querySelector('.btn-check-patient-token')?.addEventListener('click', () => {
        showToast(`${t('toast.token_checked', 'Token checked')}: ${appt.token} (${formattedDate} ${appt.time} with ${appt.doctorName})`);
      });

      tbody.appendChild(tr);
    });
  }

  // Initial render of patient appointments
  renderPatientAppointments();

  bookApptForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const doc = docSelect?.value || 'Dr. Sharma';
    const facility = facilitySelect?.value || (doc.includes("Patil") ? "Rural Hospital, Vadgaon" : doc.includes("Kulkarni") ? "Sub-Centre Vadgaon" : "PHC ABC, Vadgaon Block");
    const date = patientDateInput?.value;
    const time = document.getElementById('patientApptTime')?.value || '10:00 AM';
    const type = document.getElementById('patientApptType')?.value || 'In-Person (OPD)';

    if (!date) {
      showToast(t('alert.select_date', 'Please select a consultation date.'));
      patientDateInput?.focus();
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    if (date < todayStr) {
      showToast('Please select today or a future date for your appointment.');
      patientDateInput?.focus();
      return;
    }

    const token = `Token #${Math.floor(10 + Math.random() * 89)}`;
    const newApptId = `APT-${Math.floor(1000 + Math.random() * 9000)}`;

    const newAppt = {
      id: newApptId,
      patientId: "MMC-PT-108",
      patientName: "Sita Devi",
      doctorName: doc,
      facility: facility,
      date: date,
      time: time,
      consultType: type,
      token: token,
      priority: "High",
      status: "Waiting in OPD"
    };

    if (!Array.isArray(state.appointments)) state.appointments = [];
    state.appointments.unshift(newAppt);
    saveSharedState(state);

    renderPatientAppointments();
    closeModal(document.getElementById('patientBookApptModal'));
    showToast(`${t('alert.appt_confirmed', 'Appointment Confirmed!')} (${doc} • ${token})`);
  });

  // Synchronize across tabs when ASHA or Doctor updates shared state
  window.addEventListener('storage', (e) => {
    if (e.key === 'swasthya_shared_state') {
      const refreshedState = getSharedState();
      if (refreshedState) {
        state.appointments = refreshedState.appointments;
        state.patients = refreshedState.patients;
        renderPatientAppointments();
      }
    }
  });

  // 3. Upload Document Modal & Handler
  const uploadDocBtn = document.getElementById('patientUploadDocBtn');
  const uploadDocModal = document.getElementById('patientUploadDocModal');
  const uploadDocForm = document.getElementById('patientUploadDocForm');

  uploadDocBtn?.addEventListener('click', () => {
    openModal(uploadDocModal);
  });

  uploadDocForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('patientDocTitle')?.value || 'Uploaded Medical Document';
    const type = document.getElementById('patientDocType')?.value || 'Lab Report';

    const newDoc = {
      title: title,
      type: type,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      facility: 'Uploaded by Patient (Citizen Portal)'
    };

    if (state.patients && state.patients[0]) {
      state.patients[0].documents = state.patients[0].documents || [];
      state.patients[0].documents.unshift(newDoc);
      saveSharedState(state);
    }

    closeModal(uploadDocModal);
    showToast(`${t('toast.doc_uploaded', '✓ Document uploaded to health record!')} (${title})`);

    // Prepend to documents grid
    const docGrid = document.getElementById('patientDocsGrid');
    if (docGrid) {
      const card = document.createElement('div');
      card.className = 'field-action-card';
      card.innerHTML = `
        <div class="action-icon-circle">📄</div>
        <div class="action-content">
          <div class="action-title">${title}</div>
          <div class="action-desc">${type} • Just now • Verified</div>
        </div>
        <span class="action-arrow">⬇</span>
      `;
      docGrid.prepend(card);
    }
  });

  // 4. Emergency SOS Trigger
  const sosBtn = document.getElementById('patientSosBtn');
  const sosModal = document.getElementById('patientSosModal');
  sosBtn?.addEventListener('click', () => {
    openModal(sosModal);
  });
}

/* ==========================================================================
   17. ASHA Worker Dashboard Interactive Logic (asha-dashboard.html)
   ========================================================================== */
function initAshaDashboard() {
  const isAshaPage = window.location.pathname.includes("asha-dashboard");
  if (!isAshaPage) return;

  const state = getSharedState();
  if (!state) return;

  // Helper: Synchronize Patient Dropdown Menus in all Modals
  function populatePatientDropdowns() {
    const triageSelect = document.getElementById("triagePatientSelect");
    const bookSelect = document.getElementById("ashaBookPatientSelect");
    const refSelect = document.getElementById("ashaRefPatientSelect");

    const patients = state.patients || [];
    if (patients.length === 0) return;

    [triageSelect, bookSelect, refSelect].forEach(sel => {
      if (!sel) return;
      const currentVal = sel.value;
      sel.innerHTML = "";
      patients.forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.name;
        opt.textContent = `${p.name} (${p.id}) — ${p.village || "Vadgaon"}`;
        sel.appendChild(opt);
      });
      if (currentVal && patients.some(p => p.name === currentVal)) {
        sel.value = currentVal;
      }
    });
  }

  // 1. Village Patient Registry Table & Filters (Feature 1 & Feature 2 Display)
  function renderAshaPatients(searchTerm = "", priorityFilter = "all") {
    const tbody = document.getElementById("ashaPatientsTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";

    const q = searchTerm.toLowerCase().trim();
    const filtered = (state.patients || []).filter(p => {
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || (p.village && p.village.toLowerCase().includes(q));
      const matchPriority = priorityFilter === "all" || p.priority === priorityFilter;
      return matchSearch && matchPriority;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:1.5rem; color:#64748b;">${t("asha_dash.no_patients_found", "No matching patients found in this circle.")}</td></tr>`;
      return;
    }

    filtered.forEach(p => {
      const pClass = p.priority === "High" ? "triage-badge-high" : p.priority === "Priority" ? "triage-badge-priority" : "triage-badge-normal";
      const icon = p.priority === "High" ? "🔴" : p.priority === "Priority" ? "🟡" : "🟢";
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>
          <strong>${p.name}</strong>
          <div style="font-size:0.75rem; color:#64748b;">${p.id}</div>
        </td>
        <td>
          <div style="font-size:0.825rem;">${p.age} yrs • ${p.gender}</div>
          <div style="font-size:0.725rem; color:#64748b;">${p.village || "Vadgaon"}</div>
        </td>
        <td>
          <div style="font-size:0.825rem; max-width:280px; color:#334155;">${p.healthSummary || "Routine monitoring"}</div>
        </td>
        <td>
          <div style="font-size:0.8rem; font-family:monospace; font-weight:600; color:#0f172a;">BP: ${p.vitals ? p.vitals.bp : "120/80"} | SpO2: ${p.vitals ? p.vitals.spo2 : 98}%</div>
        </td>
        <td>
          <span class="triage-badge ${pClass}">${icon} ${p.priority}</span>
        </td>
        <td>
          <div style="display:flex; gap:0.4rem; flex-wrap:wrap;">
            <button type="button" class="btn-hero-secondary btn-screen-patient" data-name="${p.name}" style="padding:0.25rem 0.6rem; font-size:0.75rem; color:#185a42; border-color:#cbd5e1;">Screen</button>
            <button type="button" class="btn-hero-secondary btn-book-for-patient" data-name="${p.name}" style="padding:0.25rem 0.6rem; font-size:0.75rem; color:#185a42; border-color:#cbd5e1;">Book OPD</button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // Wire action buttons inside patient table
    tbody.querySelectorAll(".btn-screen-patient").forEach(b => {
      b.addEventListener("click", () => {
        const pName = b.getAttribute("data-name");
        populatePatientDropdowns();
        const sel = document.getElementById("triagePatientSelect");
        if (sel) {
          sel.value = pName;
        }
        // Pre-fill existing vitals if available
        const p = (state.patients || []).find(x => x.name === pName);
        if (p && p.vitals) {
          if (p.vitals.bp && p.vitals.bp.includes("/")) {
            const [sys, dia] = p.vitals.bp.split("/");
            const sEl = document.getElementById("triageBpSystolic");
            const dEl = document.getElementById("triageBpDiastolic");
            if (sEl) sEl.value = sys;
            if (dEl) dEl.value = dia;
          }
          if (p.vitals.pulse) {
            const pEl = document.getElementById("triagePulse");
            if (pEl) pEl.value = p.vitals.pulse;
          }
          if (p.vitals.spo2) {
            const spEl = document.getElementById("triageSpo2");
            if (spEl) spEl.value = p.vitals.spo2;
          }
        }
        openModal(document.getElementById("ashaRiskAssessModal"));
      });
    });

    tbody.querySelectorAll(".btn-book-for-patient").forEach(b => {
      b.addEventListener("click", () => {
        const pName = b.getAttribute("data-name");
        populatePatientDropdowns();
        const sel = document.getElementById("ashaBookPatientSelect");
        if (sel) {
          sel.value = pName;
        }
        const dateInp = document.getElementById("ashaBookDateInput");
        if (dateInp && !dateInp.value) {
          dateInp.value = new Date().toISOString().split("T")[0];
        }
        openModal(document.getElementById("ashaBookApptModal"));
      });
    });
  }

  // Populate dropdowns & initial patient registry
  populatePatientDropdowns();
  renderAshaPatients();

  const searchInput = document.getElementById("ashaPatientSearchInput");
  const priorityFilter = document.getElementById("ashaPatientPriorityFilter");
  searchInput?.addEventListener("input", () => {
    renderAshaPatients(searchInput.value, priorityFilter ? priorityFilter.value : "all");
  });
  priorityFilter?.addEventListener("change", () => {
    renderAshaPatients(searchInput ? searchInput.value : "", priorityFilter.value);
  });

  // 2. Patient Registration Modal & Submission (Feature 1)
  const regBtn = document.getElementById("ashaRegPatientBtn");
  const regCard = document.getElementById("ashaRegPatientCard");
  const regModal = document.getElementById("ashaRegPatientModal");
  const regForm = document.getElementById("ashaRegPatientForm");

  const openRegModal = () => openModal(regModal);
  regBtn?.addEventListener("click", openRegModal);
  regCard?.addEventListener("click", openRegModal);

  regForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const nameInput = document.getElementById("ashaRegName");
    const ageInput = document.getElementById("ashaRegAge");
    const genderInput = document.getElementById("ashaRegGender");
    const villageInput = document.getElementById("ashaRegVillage");
    const phoneInput = document.getElementById("ashaRegPhone");

    const name = nameInput?.value.trim();
    const age = ageInput?.value.trim();
    const gender = genderInput?.value || "Female";
    const village = villageInput?.value.trim() || "Vadgaon";
    const phone = phoneInput?.value.trim() || "+91 98234 50000";

    if (!name) {
      showToast("Please enter the patient's full name.");
      nameInput?.focus();
      return;
    }
    if (!age || isNaN(parseInt(age, 10)) || parseInt(age, 10) < 1 || parseInt(age, 10) > 120) {
      showToast("Please enter a valid age between 1 and 120.");
      ageInput?.focus();
      return;
    }

    const newId = `MMC-PT-${Math.floor(120 + Math.random() * 880)}`;
    const newPatient = {
      id: newId,
      name: name,
      age: parseInt(age, 10),
      gender: gender,
      village: village,
      phone: phone,
      healthSummary: "Newly registered rural citizen under Vadgaon Sub-Centre",
      vitals: { bp: "120/80", pulse: 76, spo2: 98 },
      priority: "Normal",
      priorityScore: 1,
      symptoms: ["Baseline registration intake"]
    };

    if (!Array.isArray(state.patients)) state.patients = [];
    state.patients.unshift(newPatient);
    saveSharedState(state);

    closeModal(regModal);
    regForm.reset();

    const countEl = document.getElementById("ashaKpiTotalPatients");
    if (countEl) {
      countEl.textContent = (parseInt(countEl.textContent || "148", 10) + 1).toString();
    }

    // Refresh patients table and modal dropdowns
    renderAshaPatients();
    populatePatientDropdowns();

    // Add registration appointment to shared OPD queue
    const regAppt = {
      id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId: newId,
      patientName: name,
      doctorName: "Dr. Sharma",
      facility: "PHC ABC, Vadgaon Block",
      date: new Date().toISOString().split("T")[0],
      time: "11:45 AM",
      consultType: "In-Person (OPD)",
      token: `Token #${Math.floor(10 + Math.random() * 30)}`,
      priority: "Normal",
      status: "Registered"
    };
    if (!Array.isArray(state.appointments)) state.appointments = [];
    state.appointments.unshift(regAppt);
    saveSharedState(state);

    // Refresh patients table, modal dropdowns and OPD queue
    renderAshaPatients();
    populatePatientDropdowns();
    renderAshaQueue();

    showToast(`${t("alert.reg_success", "Registration Successful")} (${name} • ${newId})`);
  });

  // 3. Record Field Vitals / Priority Triage Modal (Feature 2)
  const triageBtn = document.getElementById("ashaRiskAssessBtn");
  const vitalsCard = document.getElementById("ashaRecordVitalsCard");
  const triageModal = document.getElementById("ashaRiskAssessModal");
  const triageForm = document.getElementById("ashaRiskAssessForm");
  const triageResultBox = document.getElementById("ashaTriageResultBox");

  function openVitalsModal() {
    populatePatientDropdowns();
    openModal(triageModal);
    if (triageResultBox) triageResultBox.style.display = "none";
  }

  triageBtn?.addEventListener("click", openVitalsModal);
  vitalsCard?.addEventListener("click", openVitalsModal);
  document.getElementById("ashaRecordVitalsBtn")?.addEventListener("click", openVitalsModal);

  // When patient select changes in vitals form, pre-populate existing vitals
  document.getElementById("triagePatientSelect")?.addEventListener("change", (e) => {
    const pName = e.target.value;
    const p = (state.patients || []).find(x => x.name === pName);
    if (p && p.vitals) {
      if (p.vitals.bp && p.vitals.bp.includes("/")) {
        const [sys, dia] = p.vitals.bp.split("/");
        const sEl = document.getElementById("triageBpSystolic");
        const dEl = document.getElementById("triageBpDiastolic");
        if (sEl) sEl.value = sys;
        if (dEl) dEl.value = dia;
      }
      if (p.vitals.pulse) {
        const pEl = document.getElementById("triagePulse");
        if (pEl) pEl.value = p.vitals.pulse;
      }
      if (p.vitals.spo2) {
        const spEl = document.getElementById("triageSpo2");
        if (spEl) spEl.value = p.vitals.spo2;
      }
    }
  });

  triageForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const patientName = document.getElementById("triagePatientSelect")?.value || "Sita Devi";
    const systolic = parseInt(document.getElementById("triageBpSystolic")?.value || "120", 10);
    const diastolic = parseInt(document.getElementById("triageBpDiastolic")?.value || "80", 10);
    const pulse = parseInt(document.getElementById("triagePulse")?.value || "75", 10);
    const spo2 = parseInt(document.getElementById("triageSpo2")?.value || "98", 10);
    const isPregnant = document.getElementById("triagePregnancy")?.value === "yes";

    // Validate vitals ranges
    if (isNaN(systolic) || systolic < 50 || systolic > 280) {
      showToast("Please enter a valid Systolic BP between 50 and 280 mmHg");
      return;
    }
    if (isNaN(diastolic) || diastolic < 30 || diastolic > 180) {
      showToast("Please enter a valid Diastolic BP between 30 and 180 mmHg");
      return;
    }
    if (isNaN(pulse) || pulse < 30 || pulse > 240) {
      showToast("Please enter a valid Pulse Rate between 30 and 240 bpm");
      return;
    }
    if (isNaN(spo2) || spo2 < 50 || spo2 > 100) {
      showToast("Please enter a valid SpO2 Oxygen percentage between 50% and 100%");
      return;
    }

    let priority = "Normal";
    let priorityClass = "triage-badge-normal";
    let icon = "🟢";
    let score = 1;
    let message = "Normal Risk: Follow standard routine antenatal/wellness schedule.";

    if (systolic >= 140 || diastolic >= 90 || spo2 < 94 || pulse > 110) {
      priority = "High";
      priorityClass = "triage-badge-high";
      icon = "🔴";
      score = 3;
      message = "High Priority — Earlier professional medical evaluation strongly recommended. Immediate consultation flagged.";
    } else if (systolic >= 130 || diastolic >= 85 || (isPregnant && systolic >= 128)) {
      priority = "Priority";
      priorityClass = "triage-badge-priority";
      icon = "🟡";
      score = 2;
      message = "Priority Triage — Clinical review advised within 24-48 hours.";
    }

    // Save vitals & priority to patient in shared state
    const patientObj = (state.patients || []).find(p => p.name === patientName || p.id === patientName);
    if (patientObj) {
      patientObj.vitals = patientObj.vitals || {};
      patientObj.vitals.bp = `${systolic}/${diastolic}`;
      patientObj.vitals.pulse = pulse;
      patientObj.vitals.spo2 = spo2;
      patientObj.priority = priority;
      patientObj.priorityScore = score;
      patientObj.healthSummary = `BP: ${systolic}/${diastolic}, Pulse: ${pulse}, SpO2: ${spo2}% (${priority} Priority)`;
    }
    saveSharedState(state);

    // Re-render patient table with updated vitals & priority
    renderAshaPatients();

    // Close modal & confirm
    closeModal(triageModal);
    showToast(`${t("alert.vitals_saved", "Vitals recorded and synced with PHC Medical Officer.")} (${patientName} • BP: ${systolic}/${diastolic}, SpO2: ${spo2}%)`);
  });

  // 4. Book PHC Appointment Modal Form (Feature 3) & OPD Queue Display
  const bookBtnTrigger = document.getElementById("ashaBookApptBtnTrigger");
  const bookCard = document.getElementById("ashaBookApptCard");
  const bookModal = document.getElementById("ashaBookApptModal");
  const bookForm = document.getElementById("ashaBookApptForm");
  const dateInput = document.getElementById("ashaBookDateInput");

  function formatAshaDate(dateStr) {
    if (!dateStr) return "Today";
    if (dateStr.includes("-") && dateStr.length === 10) {
      const parts = dateStr.split("-");
      const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
      }
    }
    return dateStr;
  }

  function renderAshaQueue() {
    const queueTbody = document.getElementById("ashaQueueTableBody");
    if (!queueTbody) return;
    queueTbody.innerHTML = "";

    const currentState = getSharedState() || state;
    const appts = currentState.appointments || [];
    if (appts.length === 0) {
      queueTbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:1.5rem; color:#64748b;">${t("asha_dash.no_queue_appts", "No scheduled appointments currently in the OPD queue.")}</td></tr>`;
      return;
    }

    appts.forEach(appt => {
      const tr = document.createElement("tr");
      const isHigh = appt.priority === "High";
      if (isHigh) tr.className = "queue-row-high-priority";

      const pClass = isHigh ? "triage-badge-high" : appt.priority === "Priority" ? "triage-badge-priority" : "triage-badge-normal";
      const icon = isHigh ? "🔴" : appt.priority === "Priority" ? "🟡" : "🟢";
      const statusText = appt.status || "Waiting in OPD";
      const isConsulted = statusText.toLowerCase().includes("consulted") || statusText.toLowerCase().includes("completed");
      const statusBg = isConsulted ? "background: #dcfce7; color: #15803d;" : appt.status === "Registered" ? "background: #f1f5f9; color: #475569;" : "background: #fef3c7; color: #b45309;";
      const displayDate = formatAshaDate(appt.date);
      const patId = appt.patientId || "MMC-PT-108";
      const facility = appt.facility || "PHC ABC";

      let actionHtml = "";
      if (appt.status === "Registered") {
        actionHtml = `<button type="button" class="btn-hero-secondary btn-screen-patient" data-name="${appt.patientName}" style="padding: 0.25rem 0.6rem; font-size: 0.75rem; color:#185a42; border-color:#cbd5e1;">Screen</button>`;
      } else if (isHigh) {
        actionHtml = `<button type="button" class="btn-hero-secondary btn-asha-action" style="padding: 0.25rem 0.65rem; font-size: 0.75rem; color: #185a42; border-color: #cbd5e1;">📞 ${t("asha_dash.btn_notify_doc", "Notify Doctor")}</button>`;
      } else if (isConsulted) {
        actionHtml = `<button type="button" class="btn-hero-secondary btn-asha-action" style="padding: 0.25rem 0.65rem; font-size: 0.75rem; color: #185a42; border-color: #cbd5e1;">${t("asha_dash.btn_view_rx", "View Rx")}</button>`;
      } else {
        actionHtml = `<button type="button" class="btn-hero-secondary btn-asha-action" style="padding: 0.25rem 0.65rem; font-size: 0.75rem; color: #185a42; border-color: #cbd5e1;">${t("asha_dash.btn_check_token", "Check Token")}</button>`;
      }

      tr.innerHTML = `
        <td>
          <strong>${appt.patientName}</strong>
          <div style="font-size: 0.725rem; color: #64748b;">${patId} • ${facility}</div>
        </td>
        <td>
          <span class="triage-badge ${pClass}">${icon} ${appt.priority}</span>
        </td>
        <td>
          <div style="font-size:0.85rem; font-weight:600; color:#0f172a;">${displayDate} ${appt.time}</div>
          <div style="font-size:0.75rem; color:#64748b;">${appt.token}</div>
        </td>
        <td>
          <span class="triage-badge" style="${statusBg}">${statusText}</span>
        </td>
        <td>
          ${actionHtml}
        </td>
      `;

      tr.querySelector(".btn-screen-patient")?.addEventListener("click", () => {
        populatePatientDropdowns();
        const sel = document.getElementById("triagePatientSelect");
        if (sel) sel.value = appt.patientName;
        openModal(document.getElementById("ashaRiskAssessModal"));
      });

      tr.querySelector(".btn-asha-action")?.addEventListener("click", () => {
        if (isHigh) {
          showToast(`Calling ${appt.doctorName || "Dr. Sharma"} to notify high-priority arrival (${appt.patientName})`);
        } else if (isConsulted) {
          showToast(t("toast.rx_synced", "Prescription synced to ASHA record"));
        } else {
          showToast(`${t("toast.token_checked", "Token status checked")}: ${appt.token} (${appt.patientName})`);
        }
      });

      queueTbody.appendChild(tr);
    });

    // Update KPI metric count
    const apptsKpi = document.getElementById("ashaKpiTodayAppts") || document.querySelectorAll(".kpi-metric-card .kpi-value")[1];
    if (apptsKpi) {
      apptsKpi.textContent = appts.length.toString();
    }
  }

  // Initial render of OPD queue
  renderAshaQueue();

  function openBookModal() {
    populatePatientDropdowns();
    if (dateInput) {
      const today = new Date().toISOString().split("T")[0];
      dateInput.min = today;
      if (!dateInput.value || dateInput.value < today) {
        dateInput.value = today;
      }
    }
    openModal(bookModal);
  }

  bookBtnTrigger?.addEventListener("click", openBookModal);
  bookCard?.addEventListener("click", openBookModal);
  document.getElementById("ashaBookApptBtn")?.addEventListener("click", openBookModal);

  bookForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const patient = document.getElementById("ashaBookPatientSelect")?.value || "Sita Devi";
    const facility = document.getElementById("ashaBookFacilitySelect")?.value || "PHC ABC — Dr. Sharma";
    const apptDate = dateInput?.value;
    const slot = document.getElementById("ashaBookSlotSelect")?.value || "10:30 AM";

    if (!patient || !facility || !apptDate || !slot) {
      showToast("Please fill in all required appointment fields.");
      return;
    }

    const todayStr = new Date().toISOString().split("T")[0];
    if (apptDate < todayStr) {
      showToast("Please select today or a future date for the appointment.");
      dateInput?.focus();
      return;
    }

    const patientObj = (state.patients || []).find(p => p.name === patient);
    const token = `Token #${Math.floor(10 + Math.random() * 89)}`;
    const newApptId = `APT-${Math.floor(1000 + Math.random() * 9000)}`;

    const newAppt = {
      id: newApptId,
      patientId: patientObj ? patientObj.id : "MMC-PT-108",
      patientName: patient,
      doctorName: facility.includes("Dr. Sharma") ? "Dr. Sharma" : "Visiting Doctor",
      facility: facility,
      date: apptDate,
      time: slot,
      consultType: "In-Person (OPD)",
      token: token,
      priority: patientObj ? patientObj.priority : "Priority",
      status: "Waiting in OPD"
    };

    if (!Array.isArray(state.appointments)) state.appointments = [];
    state.appointments.unshift(newAppt);
    saveSharedState(state);

    closeModal(bookModal);
    renderAshaQueue();

    showToast(`${t("alert.appt_confirmed", "Appointment Confirmed!")} (${patient} • ${slot} • ${token})`);
    if (bookForm && typeof bookForm.reset === 'function') bookForm.reset();
  });

  // 5. Create Referral Modal Form
  const refForm = document.getElementById("ashaCreateReferralForm");
  refForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const patient = document.getElementById("ashaRefPatientSelect")?.value || "Sita Devi";
    const dest = document.getElementById("ashaRefFacilitySelect")?.value || "Rural Hospital";
    const reason = document.getElementById("ashaRefReasonInput")?.value || "Specialist Evaluation";

    closeModal(document.getElementById("ashaCreateReferralModal"));

    const newRefId = `REF-${Math.floor(1025 + Math.random() * 800)}`;
    const refCard = document.querySelector("#ashaReferralsSection .referral-stepper")?.parentElement;
    if (refCard) {
      const idEl = refCard.querySelector("span[style*='font-weight: 800']");
      if (idEl) idEl.textContent = `Referral ID: ${newRefId}`;
      const patEl = refCard.querySelector("div[style*='font-size: 0.85rem']");
      if (patEl) patEl.innerHTML = `<strong>Patient:</strong> ${patient} • <strong>From:</strong> Sub-Centre Vadgaon ➔ <strong>To:</strong> ${dest}`;
      const reasonEl = refCard.querySelector("div[style*='font-size: 0.8rem']");
      if (reasonEl) reasonEl.innerHTML = `<strong>Reason:</strong> ${reason}`;
    }

    // Update KPI
    const refKpi = document.querySelectorAll(".kpi-metric-card .kpi-value")[3];
    if (refKpi) {
      refKpi.textContent = parseInt(refKpi.textContent || "3", 10) + 1;
    }

    showToast(`${t("alert.referral_created", "New referral created and synced.")} (${newRefId})`);
    refForm.reset();
  });

  // 6. Referral 4-Stage Stepper Handler
  const advanceRefBtn = document.getElementById("advanceReferralStepBtn");
  const refStatusBadge = document.getElementById("referralCurrentStatusText");
  const refProgressBar = document.getElementById("referralProgressBarLine");

  const refSteps = [
    { title: "Referred", percent: "12%", desc: "Patient referred from Sub-Centre Vadgaon to Rural Hospital." },
    { title: "Arrived", percent: "42%", desc: "Patient arrived and checked in at Rural Hospital Admissions." },
    { title: "Consulted", percent: "75%", desc: "Consultation and Anomaly Ultrasound completed by Obstetrician." },
    { title: "Completed", percent: "100%", desc: "Discharge slip & counter-referral guidance issued back to ASHA." }
  ];

  let currentRefStepIndex = (state.referrals && state.referrals[0] && state.referrals[0].stepIndex) ? state.referrals[0].stepIndex - 1 : 0;

  function updateStepperUI(idx) {
    const stepNodes = document.querySelectorAll(".referral-stepper .step-node");
    stepNodes.forEach((node, i) => {
      node.classList.remove("active", "completed");
      if (i < idx) {
        node.classList.add("completed");
      } else if (i === idx) {
        node.classList.add("active");
      }
    });

    if (refProgressBar) {
      refProgressBar.style.width = refSteps[idx].percent;
    }
    if (refStatusBadge) {
      refStatusBadge.textContent = refSteps[idx].title;
    }

    const descEl = document.getElementById("referralStepDescription");
    if (descEl) descEl.textContent = refSteps[idx].desc;

    // Save state
    if (state.referrals && state.referrals[0]) {
      state.referrals[0].stepIndex = idx + 1;
      state.referrals[0].status = refSteps[idx].title;
      saveSharedState(state);
    }
  }

  advanceRefBtn?.addEventListener("click", () => {
    currentRefStepIndex = (currentRefStepIndex + 1) % refSteps.length;
    updateStepperUI(currentRefStepIndex);
    showToast(`${t("alert.referral_updated", "Referral status updated.")} (${refSteps[currentRefStepIndex].title})`);
  });

  // 7. Quick Action Cards & SOS / Teleconsultation
  const sosCard = document.getElementById("ashaSosCard");
  sosCard?.addEventListener("click", () => {
    openModal(document.getElementById("ashaEmergencyModal"));
  });
  document.getElementById("ashaSosBtn")?.addEventListener("click", () => {
    openModal(document.getElementById("ashaEmergencyModal"));
  });
  document.getElementById("ashaEmergencyAlertBtn")?.addEventListener("click", () => {
    openModal(document.getElementById("ashaEmergencyModal"));
  });

  const teleCard = document.getElementById("ashaTeleconsultCard");
  teleCard?.addEventListener("click", () => {
    openModal(document.getElementById("ashaTeleconsultModal"));
  });
  document.getElementById("ashaTeleconsultBtn")?.addEventListener("click", () => {
    openModal(document.getElementById("ashaTeleconsultModal"));
  });

  // 8. Follow-Up Manager Tabs & Buttons
  document.querySelectorAll(".asha-flw-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".asha-flw-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const cat = tab.getAttribute("data-flw-cat");
      document.querySelectorAll(".asha-flw-item").forEach(item => {
        if (cat === "all" || item.getAttribute("data-cat") === cat) {
          item.style.display = "flex";
        } else {
          item.style.display = "none";
        }
      });
    });
  });

  document.querySelectorAll(".btn-flw-complete").forEach(btn => {
    btn.addEventListener("click", function () {
      const parent = this.closest(".asha-flw-item");
      if (parent) {
        const badge = parent.querySelector(".triage-badge");
        if (badge) {
          badge.textContent = "Completed ✓";
          badge.className = "triage-badge triage-badge-normal";
        }
        parent.setAttribute("data-cat", "completed");
        this.style.display = "none";
        showToast(t("features.btn_mark_done", "Mark Completed") + " ✓");
      }
    });
  });

  // 9. Medicine Distance Search & Category Filters (Feature 4)
  const ashaMedInput = document.getElementById("ashaMedSearchInput");
  const ashaMedResults = document.getElementById("ashaMedResults");
  const medTriggerBtn = document.getElementById("ashaMedicineAvailabilityBtn") || document.querySelector('a[href="#ashaMedicineSection"]');

  medTriggerBtn?.addEventListener("click", (e) => {
    const section = document.getElementById("ashaMedicineSection");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      if (ashaMedInput) {
        setTimeout(() => ashaMedInput.focus(), 250);
      }
    }
  });

  function renderAshaMed(query) {
    if (!ashaMedResults) return;
    const q = (query || "").toLowerCase().trim();
    ashaMedResults.innerHTML = "";

    const meds = state.medicines || [];
    const matched = (q === "all" || !q)
      ? meds
      : meds.filter(m => m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q));

    if (matched.length === 0) {
      ashaMedResults.innerHTML = `<div style="color: #64748b; font-size: 0.85rem; padding: 0.75rem 0;">No matching medicines found for "${query}". Try searching "Paracetamol", "IFA", "Calcium", or "Amoxicillin".</div>`;
      return;
    }

    matched.forEach(med => {
      const box = document.createElement("div");
      box.style.marginBottom = "1.25rem";
      box.innerHTML = `
        <div style="font-weight: 800; color: #1e293b; font-size: 0.95rem; margin-bottom: 0.5rem;">
          💊 ${med.name} <span style="font-size: 0.725rem; font-weight: normal; color: #64748b;">(${med.category})</span>
        </div>
        ${med.facilities.map(fac => `
          <div class="med-facility-card ${fac.badgeClass}">
            <div>
              <div style="font-weight: 700; font-size: 0.875rem;">${fac.name}</div>
              <div style="font-size: 0.75rem; color: #64748b;">Distance: <strong>${fac.distance}</strong> from Vadgaon</div>
            </div>
            <div>
              <span class="triage-badge ${fac.status === "Available" ? "triage-badge-normal" : fac.status === "Low Stock" ? "triage-badge-priority" : "triage-badge-high"}">
                ${fac.status} (${fac.stock})
              </span>
            </div>
          </div>
        `).join("")}
        <div class="med-travel-savings">
          <span>💡</span> <strong>Travel Impact:</strong> Checking availability in Sub-Centre Vadgaon (0.8 km) saves the patient a 5.2 km trip to PHC XYZ!
        </div>
      `;
      ashaMedResults.appendChild(box);
    });
  }

  ashaMedInput?.addEventListener("input", (e) => {
    document.querySelectorAll(".asha-med-filter-pill").forEach(p => p.classList.remove("active"));
    renderAshaMed(e.target.value);
  });

  // Wire quick filter pills
  document.querySelectorAll(".asha-med-filter-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".asha-med-filter-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      const filter = pill.getAttribute("data-filter");
      if (ashaMedInput) {
        ashaMedInput.value = filter === "all" ? "" : filter;
      }
      renderAshaMed(filter);
    });
  });

  renderAshaMed(ashaMedInput?.value || "Paracetamol");

  // Synchronize across tabs when Patient or Doctor updates shared state
  window.addEventListener("storage", (e) => {
    if (e.key === "swasthya_shared_state") {
      const refreshedState = getSharedState();
      if (refreshedState) {
        state.appointments = refreshedState.appointments;
        state.patients = refreshedState.patients;
        state.medicines = refreshedState.medicines;
        renderAshaPatients();
        populatePatientDropdowns();
        renderAshaQueue();
      }
    }
  });
}

/* ==========================================================================
   18. Doctor Dashboard Interactive Logic (doctor-dashboard.html)
   ========================================================================== */
function initDoctorDashboard() {
  const isDoctorPage = window.location.pathname.endsWith('doctor-dashboard.html');
  if (!isDoctorPage) return;

  const state = getSharedState();
  if (!state) return;

  // 1. Interactive OPD Queue Selection
  const queueRows = document.querySelectorAll('.doctor-queue-row');

  function selectPatientChart(patientId) {
    queueRows.forEach(r => r.classList.remove('queue-row-selected'));
    const targetRow = document.querySelector(`.doctor-queue-row[data-patient-id="${patientId}"]`);
    if (targetRow) targetRow.classList.add('queue-row-selected');

    const patient = state.patients.find(p => p.id === patientId) || state.patients[0];
    if (!patient) return;

    // Update patient chart header
    const nameEl = document.getElementById('chartPatientName');
    const idEl = document.getElementById('chartPatientId');
    const metaEl = document.getElementById('chartPatientMeta');
    const summaryEl = document.getElementById('chartPatientSummary');
    const bpEl = document.getElementById('chartVitalBp');
    const pulseEl = document.getElementById('chartVitalPulse');
    const spo2El = document.getElementById('chartVitalSpo2');
    const hbEl = document.getElementById('chartVitalHb');
    const symptomsEl = document.getElementById('chartSymptomsList');

    if (nameEl) nameEl.textContent = patient.name;
    if (idEl) idEl.textContent = patient.id;
    if (metaEl) metaEl.textContent = `Age: ${patient.age} • ${patient.gender} • Village: ${patient.village} • Priority: ${patient.priority}`;
    if (summaryEl) summaryEl.textContent = patient.healthSummary;
    if (bpEl) bpEl.textContent = patient.vitals.bp || '120/80';
    if (pulseEl) pulseEl.textContent = patient.vitals.pulse || '76';
    if (spo2El) spo2El.textContent = `${patient.vitals.spo2 || 98}%`;
    if (hbEl) hbEl.textContent = `${patient.vitals.hb || 11.5} g/dL`;

    if (symptomsEl && patient.symptoms) {
      symptomsEl.innerHTML = patient.symptoms.map(s => `<li style="margin-bottom:0.25rem;">${s}</li>`).join('');
    }

    showToast(`${t('toast.chart_loaded', 'Clinical chart loaded.')} (${patient.name} - ${patient.id})`);
  }

  queueRows.forEach(row => {
    row.addEventListener('click', () => {
      const pid = row.getAttribute('data-patient-id');
      selectPatientChart(pid);
    });
  });

  // 2. Doctor Action Modals:
  // Action 1: Start Consultation
  const startConsultBtn = document.getElementById('docActionConsultBtn');
  const consultModal = document.getElementById('docConsultModal');
  const consultForm = document.getElementById('docConsultForm');

  startConsultBtn?.addEventListener('click', () => {
    openModal(consultModal);
  });

  consultForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const diagnosis = document.getElementById('docConsultDiagnosis')?.value.trim();
    const notes = document.getElementById('docConsultNotes')?.value.trim();

    closeModal(consultModal);
    showToast(`${t('doc_dash.modal_consult_title', 'Record Clinical Consultation')} ✓ ("${diagnosis}")`);
    
    // Update active patient queue badge
    const activeRow = document.querySelector('.doctor-queue-row.queue-row-selected');
    if (activeRow) {
      const statusCell = activeRow.querySelector('.queue-status-cell');
      if (statusCell) {
        statusCell.innerHTML = '<span class="triage-badge triage-badge-normal">Consulted ✓</span>';
      }
    }
  });

  // Action 2: View Reports
  const viewReportsBtn = document.getElementById('docActionReportsBtn');
  const reportsModal = document.getElementById('docReportsModal');
  viewReportsBtn?.addEventListener('click', () => {
    openModal(reportsModal);
  });

  // Action 3: Add Prescription
  const addRxBtn = document.getElementById('docActionRxBtn');
  const rxModal = document.getElementById('docRxModal');
  const rxForm = document.getElementById('docRxForm');

  addRxBtn?.addEventListener('click', () => {
    openModal(rxModal);
  });

  rxForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const drug = document.getElementById('docRxDrug')?.value.trim();
    const dose = document.getElementById('docRxDose')?.value.trim();
    const duration = document.getElementById('docRxDuration')?.value.trim();

    const newPrescription = {
      drug: drug,
      dosage: dose,
      duration: duration,
      date: 'Today',
      doctor: 'Dr. Sharma'
    };

    if (state.patients && state.patients[0]) {
      state.patients[0].prescriptions = state.patients[0].prescriptions || [];
      state.patients[0].prescriptions.unshift(newPrescription);
      saveSharedState(state);
    }

    closeModal(rxModal);
    showToast(`${t('alert.prescription_saved', 'Prescription recorded and transmitted to dispensary.')} (${drug})`);

    // Update prescription UI list in clinical chart
    const rxList = document.getElementById('chartPrescriptionList');
    if (rxList) {
      const item = document.createElement('div');
      item.style.padding = '0.5rem 0.75rem';
      item.style.background = '#f0fdf4';
      item.style.border = '1px solid #bbf7d0';
      item.style.borderRadius = 'var(--radius-sm)';
      item.style.marginBottom = '0.45rem';
      item.innerHTML = `<strong>${drug}</strong> — ${dose} (${duration}) <span style="font-size:0.7rem; color:#15803d; float:right;">Added Today</span>`;
      rxList.prepend(item);
    }
  });

  // Action 4: Create Referral
  const createRefBtn = document.getElementById('docActionReferralBtn');
  const refModal = document.getElementById('docReferralModal');
  const refForm = document.getElementById('docReferralForm');

  createRefBtn?.addEventListener('click', () => {
    openModal(refModal);
  });

  refForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const toCenter = document.getElementById('docRefFacility')?.value;
    const specialty = document.getElementById('docRefSpecialty')?.value;
    const reason = document.getElementById('docRefReason')?.value;
    const priority = document.getElementById('docRefPriority')?.value || 'High';

    const newRefId = `REF-${Math.floor(2000 + Math.random() * 8000)}`;
    const newReferral = {
      id: newRefId,
      patientId: "MMC-PT-108",
      patientName: "Sita Devi",
      fromFacility: "PHC ABC, Vadgaon Block",
      toFacility: toCenter,
      specialty: specialty,
      reason: reason,
      priority: priority,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: "Referred",
      stepIndex: 1
    };

    state.referrals.unshift(newReferral);
    saveSharedState(state);

    closeModal(refModal);
    showToast(`${t('alert.referral_updated', 'Referral status updated.')} (${newRefId} ➔ ${toCenter})`);
  });

  // Action 5: Create Care Plan
  const carePlanBtn = document.getElementById('docActionCarePlanBtn');
  const carePlanModal = document.getElementById('docCarePlanModal');
  const carePlanForm = document.getElementById('docCarePlanForm');

  carePlanBtn?.addEventListener('click', () => {
    openModal(carePlanModal);
  });

  carePlanForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    closeModal(carePlanModal);
    showToast(t('toast.careplan_synced', '✓ Maternal Care Plan synchronized with ASHA Sunita Tai for frontline monitoring.'));
  });

  // Action 6: Schedule Follow-Up
  const scheduleFlwBtn = document.getElementById('docActionFollowUpBtn');
  const flwModal = document.getElementById('docFollowUpModal');
  const flwForm = document.getElementById('docFollowUpForm');

  scheduleFlwBtn?.addEventListener('click', () => {
    openModal(flwModal);
  });

  flwForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const date = document.getElementById('docFlwDate')?.value || '15 September 2026';
    const notes = document.getElementById('docFlwNotes')?.value || 'ANC Follow-Up';

    const newFlw = {
      id: `FLW-${Math.floor(300 + Math.random() * 700)}`,
      patientName: "Sita Devi",
      patientId: "MMC-PT-108",
      type: notes,
      dueDate: date,
      category: "upcoming",
      status: "Upcoming",
      assignedTo: "Sunita Tai (ASHA)"
    };

    state.followups.unshift(newFlw);
    saveSharedState(state);

    closeModal(flwModal);
    showToast(`${t('toast.flw_scheduled', '✓ Follow-up scheduled. Task assigned to ASHA Worker.')} (${date})`);
  });
}

