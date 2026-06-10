// Tailwind Theme Configuration Extensions
tailwind.config = {
  theme: {
    extend: {
      colors: {
        dark: '#09090b',
        surface: '#18181b',
        primary: '#ec4899',
        accent: '#06b6d4',
        highlight: '#10b981'
      }
    }
  }
};

// Games Database Object
const games = [
  { id: 'ml', name: 'Mobile Legends', icon:'ML.png', denoms: [{label:'86 Diamonds',price:19000},{label:'172 Diamonds',price:38000},{label:'257 Diamonds',price:57000},{label:'344 Diamonds',price:76000},{label:'514 Diamonds',price:114000},{label:'706 Diamonds',price:152000}]},
  { id: 'ff', name: 'Free Fire', icon: 'FF.png', denoms: [{label:'70 Diamonds',price:15000},{label:'140 Diamonds',price:29000},{label:'355 Diamonds',price:69000},{label:'720 Diamonds',price:139000},{label:'1450 Diamonds',price:279000}]},
  { id: 'gi', name: 'Genshin Impact', icon: 'GI.png', denoms: [{label:'60 Genesis',price:16000},{label:'300+30 Genesis',price:79000},{label:'980+110 Genesis',price:249000},{label:'1980+260 Genesis',price:479000}]},
  { id: 'pubg', name: 'PUBG Mobile', icon: 'Pubgm.png', denoms: [{label:'60 UC',price:15000},{label:'325 UC',price:75000},{label:'660 UC',price:149000},{label:'1800 UC',price:379000}]},
  { id: 'vu', name: 'Valorant', icon: 'valo.png', denoms: [{label:'125 VP',price:15000},{label:'420 VP',price:50000},{label:'700 VP',price:80000},{label:'1375 VP',price:150000}]},
  { id: 'hsr', name: 'Honkai: Star Rail', icon: 'HK.png', denoms: [{label:'60 Oneiric',price:16000},{label:'300+30 Oneiric',price:79000},{label:'980+110 Oneiric',price:249000}]},
  { id: 'cod', name: 'Call of Duty Mobile', icon: 'cod.png', denoms: [{label:'80 CP',price:15000},{label:'400 CP',price:75000},{label:'800 CP',price:149000}]},
  { id: 'roblox', name: 'Roblox', icon: 'roblox.png', denoms: [{label:'80 Robux',price:15000},{label:'400 Robux',price:69000},{label:'800 Robux',price:135000},{label:'1700 Robux',price:269000}]},
  { id: 'aov', name: 'Honor of Kings', icon: 'hok.png', denoms: [{label:'90 Token',price:15000},{label:'230 Token',price:38000},{label:'470 Token',price:76000}]},
  { id: 'lol', name: 'League of Legends', icon: 'lol.png', denoms: [{label:'125 Wild Cores',price:15000},{label:'420 Wild Cores',price:50000},{label:'700 Wild Cores',price:80000}]}
];

let selectedGame = null;
let selectedDenom = null;
let currentPaymentMethod = null;
let orders = [];

// Render games catalog
function renderGames(filter = '') {
  const grid = document.getElementById('games-grid');
  const filtered = games.filter(g => g.name.toLowerCase().includes(filter.toLowerCase()));
  
  grid.innerHTML = filtered.map((g, i) => {
    // Cek apakah icon menggunakan format gambar (png, jpg, jpeg, svg)
    const isImage = g.icon.match(/\.(jpeg|jpg|gif|png|svg)$/i);
    const iconDisplay = isImage 
      ? `<img src="${g.icon}" alt="${g.name}" class="w-12 h-12 mx-auto object-contain mb-2 rounded-lg">`
      : `<div class="text-3xl mb-2">${g.icon}</div>`;

    return `
      <div class="game-card cursor-pointer bg-surface border border-indigo-800/30 rounded-xl p-4 text-center hover:border-primary hover:shadow-lg hover:shadow-primary/10 transition fade-in" style="animation-delay:${i*50}ms" onclick="selectGame('${g.id}')">
        ${iconDisplay}
        <p class="text-xs font-medium truncate">${g.name}</p>
      </div>
    `;
  }).join('');
  lucide.createIcons();
}   

function filterGames(val) { 
  renderGames(val); 
}

function selectGame(id) {
  selectedGame = games.find(g => g.id === id);
  selectedDenom = null;
  currentPaymentMethod = null;
  
  document.getElementById('games-grid').classList.add('hidden');
  document.getElementById('order-panel').classList.remove('hidden');
  
  // === BAGIAN YANG DIPERBAIKI (MENGGUNAKAN TAG IMG) ===
  const iconContainer = document.getElementById('order-game-icon');
  const isImage = selectedGame.icon.match(/\.(jpeg|jpg|gif|png|svg)$/i);
  
  if (isImage) {
    iconContainer.innerHTML = `<img src="${selectedGame.icon}" alt="${selectedGame.name}" class="w-full h-full object-cover">`;
  } else {
    iconContainer.innerHTML = `<div class="text-3xl">${selectedGame.icon}</div>`;
  }
  // ====================================================
  
  document.getElementById('order-game-title').textContent = selectedGame.name;
  document.getElementById('order-error').classList.add('hidden');
  
  renderDenoms();
  lucide.createIcons();
}

function renderDenoms() {
  const grid = document.getElementById('denom-grid');
  grid.innerHTML = selectedGame.denoms.map((d, i) => `
    <button onclick="selectDenom(${i})" class="denom-btn bg-dark border border-indigo-800/40 rounded-lg p-3 text-left hover:border-primary transition ${selectedDenom === i ? 'selected' : ''}">
      <p class="text-xs font-medium">${d.label}</p>
      <p class="text-primary font-bold text-sm mt-1">Rp ${d.price.toLocaleString('id-ID')}</p>
    </button>
  `).join('');
}

function selectDenom(i) { 
  selectedDenom = i; 
  renderDenoms(); 
}

function selectPayment(method) {
  currentPaymentMethod = method;
  document.querySelectorAll('.payment-btn').forEach(btn => {
    const isSelected = btn.dataset.method === method;
    btn.classList.toggle('border-primary', isSelected);
    btn.classList.toggle('bg-primary/10', isSelected);
  });
}

// Order panel management
function closeOrder() {
  document.getElementById('order-panel').classList.add('hidden');
  document.getElementById('games-grid').classList.remove('hidden');
  selectedGame = null;
}

function submitOrder() {
  const userId = document.getElementById('user-id-input').value.trim();
  const errEl = document.getElementById('order-error');
  
  if (!userId) { errEl.textContent = 'Masukkan User ID!'; errEl.classList.remove('hidden'); return; }
  if (selectedDenom === null) { errEl.textContent = 'Pilih nominal!'; errEl.classList.remove('hidden'); return; }
  if (!currentPaymentMethod) { errEl.textContent = 'Pilih metode pembayaran!'; errEl.classList.remove('hidden'); return; }
  errEl.classList.add('hidden');

  const orderId = 'YPS' + Date.now().toString(36).toUpperCase();
  const order = {
    id: orderId,
    game: selectedGame.name,
    icon: selectedGame.icon,
    denom: selectedGame.denoms[selectedDenom].label,
    price: selectedGame.denoms[selectedDenom].price,
    userId,
    payment: currentPaymentMethod,
    time: new Date().toLocaleString('id-ID')
  };
  orders.unshift(order);

  document.getElementById('modal-order-id').textContent = orderId;
  document.getElementById('success-modal').classList.remove('hidden');
  document.getElementById('user-id-input').value = '';
  closeOrder();
}

function closeModal() { 
  document.getElementById('success-modal').classList.add('hidden'); 
}

function showSection(s) {
  document.getElementById('section-home').classList.toggle('hidden', s !== 'home');
  document.getElementById('section-orders').classList.toggle('hidden', s !== 'orders');
  if (s === 'orders') renderOrders();
}

function renderOrders() {
  const list = document.getElementById('orders-list');
  document.getElementById('no-orders').classList.toggle('hidden', orders.length > 0);
  
  list.innerHTML = orders.map(o => `
    <div class="bg-surface border border-indigo-800/30 rounded-xl p-4 flex items-center gap-3">
      <div class="text-2xl">${o.icon}</div>
      <div class="flex-1 min-w-0">
        <p class="font-medium text-sm">${o.game} - ${o.denom}</p>
        <p class="text-xs text-gray-400">ID: ${o.userId} • ${o.time}</p>
      </div>
      <div class="text-right">
        <p class="text-primary font-bold text-sm">Rp ${o.price.toLocaleString('id-ID')}</p>
        <span class="text-[10px] bg-highlight/20 text-highlight px-2 py-0.5 rounded-full">Sukses</span>
      </div>
    </div>
  `).join('');
}

// Initial Run
renderGames();
lucide.createIcons();

// Element SDK Integration Block
const defaultConfig = {
  store_name: 'yuyopshop',
  hero_tagline: 'Top Up Game Cepat & Murah ⚡',
  promo_text: '🔥 PROMO! Diskon 10% untuk semua produk!',
  background_color: '#0f0a2e',
  surface_color: '#1e1b4b',
  text_color: '#ffffff',
  primary_color: '#6366f1',
  accent_color: '#34d399',
  font_family: 'Outfit',
  font_size: 16
};

window.elementSdk.init({
  defaultConfig,
  onConfigChange: async (config) => {
    const c = { ...defaultConfig, ...config };
    document.getElementById('store-name').textContent = c.store_name;
    document.getElementById('hero-tagline').textContent = c.hero_tagline;
    document.getElementById('promo-banner').textContent = c.promo_text;
    document.body.style.backgroundColor = c.background_color;
    document.body.style.color = c.text_color;
    document.body.style.fontFamily = `${c.font_family}, Outfit, sans-serif`;
    document.body.style.fontSize = c.font_size + 'px';
  },
  mapToCapabilities: (config) => {
    const c = { ...defaultConfig, ...config };
    return {
      recolorables: [
        { get: () => c.background_color, set: (v) => { c.background_color = v; window.elementSdk.setConfig({ background_color: v }); }},
        { get: () => c.surface_color, set: (v) => { c.surface_color = v; window.elementSdk.setConfig({ surface_color: v }); }},
        { get: () => c.text_color, set: (v) => { c.text_color = v; window.elementSdk.setConfig({ text_color: v }); }},
        { get: () => c.primary_color, set: (v) => { c.primary_color = v; window.elementSdk.setConfig({ primary_color: v }); }},
        { get: () => c.accent_color, set: (v) => { c.accent_color = v; window.elementSdk.setConfig({ accent_color: v }); }}
      ],
      borderables: [],
      fontEditable: { get: () => c.font_family, set: (v) => { c.font_family = v; window.elementSdk.setConfig({ font_family: v }); }},
      fontSizeable: { get: () => c.font_size, set: (v) => { c.font_size = v; window.elementSdk.setConfig({ font_size: v }); }}
    };
  },
  mapToEditPanelValues: (config) => {
    const c = { ...defaultConfig, ...config };
    return new Map([
      ['store_name', c.store_name],
      ['hero_tagline', c.hero_tagline],
      ['promo_text', c.promo_text]
    ]);
  }
});

// Cloudflare anti-bot payload injector
(function(){
  function c(){
    var b=a.contentDocument||a.contentWindow.document;
    if(b){
      var d=b.createElement('script');
      d.innerHTML="window.__CF$cv$params={r:'a08c90795b9ff8e0',t:'MTc4MDk3MDY1Mw=='};var a=document.createElement('script');a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";
      b.getElementsByTagName('head')[0].appendChild(d);
    }s
  }
  if(document.body){
    var a=document.createElement('iframe');
    a.height=1; a.width=1; a.style.position='absolute'; a.style.top=0; a.style.left=0; a.style.border='none'; a.style.visibility='hidden';
    document.body.appendChild(a);
    if('loading'!==document.readyState)c();
    else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);
    else{
      var e=document.onreadystatechange||function(){};
      document.onreadystatechange=function(b){
        e(b);
        'loading'!==document.readyState&&(document.onreadystatechange=e,c());
      };
    }
  }
})();

