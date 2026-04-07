// Main application logic (moved from single-file)
// Runs after DOM loads because this script is included at the end of the document

// --- Authentication / Login Logic ---
document.body.classList.add('app-locked');

window.performLogin = function() {
  const btnText = document.querySelector('.btn-text');
  const btnSpinner = document.querySelector('.btn-spinner');
  const usernameEl = document.getElementById('login-username');
  const passwordEl = document.getElementById('login-password');

  if (!usernameEl || !passwordEl) return;
  const user = usernameEl.value.trim();
  const pass = passwordEl.value.trim();

  if (!user || !pass) {
    // Shake the form visually
    const rightPane = document.querySelector('.login-right-pane');
    if (rightPane) {
      rightPane.style.animation = 'none';
      rightPane.offsetHeight; // reflow
      rightPane.style.animation = 'loginShake 0.4s ease';
    }
    return;
  }

  // Show Loading state
  if (btnText) btnText.style.display = 'none';
  if (btnSpinner) btnSpinner.style.display = 'inline-block';

  setTimeout(() => {
    // Check against real accounts array (must be defined by this point)
    const accountsData = (typeof accounts !== 'undefined') ? accounts : [];
    const matched = accountsData.find(acc => acc.username === user && acc.password === pass);

    // Fallback: admin/1234 always works
    const isHardcodedAdmin = user === 'admin' && pass === '1234';

    if (!matched && !isHardcodedAdmin) {
      // Failed
      if (btnText) btnText.style.display = '';
      if (btnSpinner) btnSpinner.style.display = 'none';
      const rightPane = document.querySelector('.login-right-pane');
      if (rightPane) { rightPane.style.animation = 'loginShake 0.4s ease'; }
      usernameEl.style.borderColor = '#ef4444';
      passwordEl.style.borderColor = '#ef4444';
      setTimeout(() => { usernameEl.style.borderColor = ''; passwordEl.style.borderColor = ''; }, 2000);
      return;
    }

    const role = matched ? matched.role : 'admin';
    const name = matched ? matched.name : 'مسؤول النظام';
    const sessionToken = { user: user, role: role, name: name };
    localStorage.setItem('kushoof:session', JSON.stringify(sessionToken));
    if (typeof currentSession !== 'undefined') currentSession = sessionToken;
    if (typeof applySessionUI === 'function') applySessionUI();

    // Unlock app with smooth fade
    const loginScreen = document.getElementById('login-screen');
    if (loginScreen) {
      loginScreen.style.transition = 'opacity 0.5s ease, visibility 0.5s ease';
      loginScreen.style.opacity = '0';
      loginScreen.style.visibility = 'hidden';
    }
    document.body.classList.remove('app-locked');

    setTimeout(() => {
      if (loginScreen) loginScreen.remove();
      if (typeof showToast === 'function') showToast('✅ أهلاً بك، ' + name, 'success');
      if (typeof renderCharts === 'function') renderCharts();
      if (typeof renderDashboard === 'function') renderDashboard();
    }, 600);
  }, 800);
};

window.demoLogin = function() {
  document.getElementById('login-username').value = 'admin';
  document.getElementById('login-password').value = '1234';
  window.performLogin();
};

// ── Data ──
let loginBanners = [
  {
    title: "الدعم الفني",
    desc: "هل تواجه أي مشكلة في النظام؟<br/>فريق الدعم متاح على مدار الساعة للإجابة على استفساراتك.",
    icon: `<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="50" fill="#dcfce7"/><circle cx="60" cy="60" r="40" fill="#bbf7d0"/><path d="M40 70v-10c0-11 9-20 20-20s20 9 20 20v10M35 70h50v20c0 5-4 10-10 10H45c-6 0-10-5-10-10V70z" fill="#166534"/><circle cx="60" cy="50" r="12" fill="#fff"/></svg>`
  }
];

let systemBranches = [
  { id: 1, name: 'الفرع الرئيسي' },
  { id: 2, name: 'فرع الشمال' },
  { id: 3, name: 'فرع الجنوب' }
];
let currentAdminBranchFilter = null; // null means all branches

let systemAccounts = [
  { id: 1, name: 'أحمد السلمي (أنت)', username: 'admin', role: 'super_admin', branchName: 'الفرع الرئيسي', plan: 'enterprise', created: '2023-01-15', status: 'active' },
  { id: 2, name: 'خالد المحمدي', username: 'khaled2023', role: 'school_admin', branchName: 'الفرع الرئيسي', plan: 'gold', created: '2023-02-10', status: 'active' },
  { id: 3, name: 'سعد العبدالله', username: 'saad_math', role: 'branch_manager', branchName: 'فرع الشمال', plan: 'bronze', created: '2023-05-22', status: 'suspended' },
  { id: 4, name: 'محمد الصالح (مدير)', username: 'm_saleh', role: 'accountant', branchName: 'فرع الجنوب', plan: 'free', created: '2023-08-01', status: 'active' }
];

let students = [
  {id:1,name:'أحمد محمد العمري',num:'001',class:'أ'},
  {id:2,name:'فهد عبدالله الزهراني',num:'002',class:'أ'},
  {id:3,name:'عمر سعد القحطاني',num:'003',class:'أ'},
  {id:4,name:'خالد ناصر الشمري',num:'004',class:'أ'},
  {id:5,name:'يوسف إبراهيم الغامدي',num:'005',class:'أ'},
  {id:6,name:'عبدالرحمن محمد الدوسري',num:'006',class:'أ'},
  {id:7,name:'سلطان علي البقمي',num:'007',class:'أ'},
  {id:8,name:'ماجد حسن العتيبي',num:'008',class:'أ'},
  {id:9,name:'طارق فيصل الحارثي',num:'009',class:'أ'},
  {id:10,name:'نواف سليمان المالكي',num:'010',class:'أ'},
  {id:11,name:'بدر محمد الرشيدي',num:'011',class:'ب'},
  {id:12,name:'عبدالعزيز عمر العجمي',num:'012',class:'ب'},
  {id:13,name:'ريان خالد السبيعي',num:'013',class:'ب'},
  {id:14,name:'وليد أحمد الثبيتي',num:'014',class:'ب'},
  {id:15,name:'حمد عبدالله الجهني',num:'015',class:'ب'},
  {id:16,name:'محمد علي السهلي',num:'016',class:'ب'},
  {id:17,name:'عبدالله فهد الحربي',num:'017',class:'ج'},
  {id:18,name:'سعد نايف المطيري',num:'018',class:'ج'},
  {id:19,name:'تركي راشد العنزي',num:'019',class:'ج'},
  {id:20,name:'فيصل محمد البلوي',num:'020',class:'ج'},
];

let attendance = {}; // {id: 'present'|'absent'|'late'|'excused'|'remote'}
let grades = {}; // {id: {hw,part,exam,act}}
let activityLog = [];
let currentFilter = 'all';
let currentClassFilter = null; // when set, render only students from this class
let studentMeta = {}; // per-student extra data: warnings, points, badges, role
let currentView = 'dashboard';
let systemClasses = ['أ','ب','ج'];
let currentSession = null;
const rolesConfig = {
  admin: {label:'مسؤول النظام', permissions:['manageAccounts','manageStudents','manageAttendance','manageGrades','viewReports'], defaultClasses:0, defaultStudents:0},
  school_manager: {label:'مدير المدرسة', permissions:['manageAttendance','viewReports'], defaultClasses:0, defaultStudents:0},
  supervisor: {label:'مشرف', permissions:['manageAttendance','viewReports'], defaultClasses:0, defaultStudents:0},
  teacher: {label:'معلم', permissions:['manageStudents','manageAttendance','manageGrades','viewReports'], defaultClasses:3, defaultStudents:60},
};
const permissionLabels = {
  manageAccounts:'إدارة الحسابات',
  manageStudents:'إدارة الطلاب',
  manageAttendance:'إدارة الحضور',
  manageGrades:'إدارة الدرجات',
  viewReports:'عرض التقارير',
};
let accounts = [
  {id:1,username:'admin',password:'1234',role:'admin',name:'مسؤول النظام',classesCount:0,studentsCount:0},
  {id:2,username:'teacher1',password:'teach123',role:'teacher',name:'م. أحمد السلمي',classesCount:3,studentsCount:60},
  {id:3,username:'super1',password:'super123',role:'supervisor',name:'م. خالد',classesCount:0,studentsCount:0},
  {id:4,username:'manager1',password:'manage123',role:'school_manager',name:'مدير المدرسة',classesCount:0,studentsCount:0},
];

// initialize grades
students.forEach(s => {
  grades[s.id] = {
    hw: Math.floor(Math.random()*4)+7,
    part: Math.floor(Math.random()*4)+6,
    exam: Math.floor(Math.random()*10)+18,
    act: Math.floor(Math.random()*3)+7,
  };
});

// sample some attendance
const sample = ['present','present','present','present','absent','late','excused'];
students.forEach(s => { attendance[s.id] = sample[Math.floor(Math.random()*sample.length)]; });

// expose some helpers so games/export modules can call them
function initials(name){const p=name.trim().split(' ');return(p[0][0]+(p[1]?p[1][0]:''))?.toUpperCase();}
function statusCls(s){return s==='present'?'p':s==='absent'?'a':s==='late'?'l':s==='excused'?'e':s==='remote'?'r':'';}
function statusLabel(s){return{present:'حاضر',absent:'غائب',late:'متأخر',excused:'مستأذن',remote:'عن بعد'}[s]||'غير محدد';}
function getCounts(){
  const c={present:0,absent:0,late:0,excused:0,remote:0,none:0};
  students.forEach(s=>{const st=attendance[s.id];if(st)c[st]++;else c.none++;});
  return c;
}

function showToast(msg,type=''){
  const tc=document.getElementById('toast-container');
  const t=document.createElement('div');
  t.className='toast '+(type);
  t.textContent=msg;
  tc.appendChild(t);
  setTimeout(()=>t.remove(),3000);
}

function getCurrentStudentPool(){
  return currentClassFilter ? students.filter(s => String(s.class) === String(currentClassFilter)) : [...students];
}

function toggleGameMenu(){
  const launcher = document.getElementById('game-launcher');
  if(!launcher) return;
  launcher.style.display = launcher.style.display === 'grid' ? 'none' : 'grid';
}

function openGameModal(gameKey){
  const pool = getCurrentStudentPool();
  if(pool.length===0){ showToast('لا يوجد طلاب للاختيار',''); return; }
  const launcher = document.getElementById('game-launcher');
  if(launcher) launcher.style.display='none';
  const titles = {wheel:'العجلة الدوارة',treasure:'بطاقة الكنز',scratch:'بطاقة الخدش',quick:'السحب السريع',train:'القطار السريع'};
  const descriptions = {
    wheel:'اضغط على "دور" في وسط العجلة لبدء الدوران.',
    treasure:'اختر بطاقة وارفع الستار لتكشف الاسم.',
    scratch:'اخدش البطاقة برفق لتظهر النتيجة.',
    quick:'اضغط الزر لاختيار طالب عشوائي.',
    train:'شغل القطار ليتوقف على العربة المختارة.'
  };
  window.currentGame = {type:gameKey,pool};
  document.getElementById('modal-game').setAttribute('data-game', gameKey);
  document.getElementById('game-title').textContent = titles[gameKey] || 'لعبة عشوائية';
  document.getElementById('game-desc').textContent = descriptions[gameKey] || 'اضغط ابدأ لبدء اللعبة.';
  document.getElementById('game-result').textContent = '🎯 مستعد لاختيار الطالب؟';
  document.getElementById('game-result').classList.remove('loading');
  const actionButton = document.getElementById('game-action');
  actionButton.disabled = false;
  actionButton.textContent = gameKey==='wheel' ? 'دور العجلة' : gameKey==='train' ? 'شغل القطار' : gameKey==='quick' ? 'اختر طالب' : 'إعادة اللعبة';
  renderGameScreen(gameKey,pool);
  document.getElementById('modal-game').classList.add('open');
}

function renderGameScreen(gameKey,pool){
  const screen = document.getElementById('game-screen');
  if(!screen) return;
  screen.innerHTML = '';
  if(gameKey==='wheel'){
    const names = pool.slice(0,8);
    const angle = 360 / names.length;
    const colors = ['#0ea5e9','#9333ea','#f97316','#22c55e','#facc15','#ec4899','#3b82f6','#ef4444'];
    const segments = names.map((s,i)=>{
      const rotation = i * angle;
      return `<div class="wheel-segment" style="transform:rotate(${rotation}deg);">
        <div class="segment-fill" style="background:${colors[i%colors.length]};transform:rotate(${angle}deg);"></div>
        <span style="transform:rotate(${angle/2}deg)">${s.name}</span>
      </div>`;
    }).join('');
    screen.innerHTML = `<div class="wheel-wrapper"><div class="wheel-pointer"></div><div class="wheel" id="wheel-spinner">${segments}</div><div class="wheel-center" onclick="startWheelSpin()">دور</div><div id="confetti-container"></div></div>`;
  } else if(gameKey==='treasure'){
    const cards = pool.slice(0,6).map((s,i)=>({name:s.name,id:s.id,idx:i}));
    window.currentGame.cards = cards;
    screen.innerHTML = `<div class="cards-grid" id="treasure-grid">${cards.map(c=>`
      <div class="card-item" data-index="${c.idx}" onclick="flipTreasureCard(this)">
        <div class="card-inner">
          <div class="card-face card-front">?</div>
          <div class="card-face card-back">${c.name}</div>
        </div>
      </div>`).join('')}</div>`;
  } else if(gameKey==='scratch'){
    const choice = pool[Math.floor(Math.random()*pool.length)];
    window.currentGame.scratchChoice = choice;
    screen.innerHTML = `<div class="scratch-card"><div class="scratch-name" id="scratch-name">${choice.name}</div><canvas id="scratch-canvas" class="scratch-canvas"></canvas></div>`;
    setTimeout(setupScratchCanvas, 50);
  } else if(gameKey==='quick'){
    screen.innerHTML = `<div class="quick-draw-screen"><button class="quick-draw-btn" onclick="playGame()">اختر طالب</button><div class="quick-output" id="quick-output">اضغط الزر لبدء السحب</div></div>`;
  } else if(gameKey==='train'){
    const names = pool.slice(0,8);
    window.currentGame.trainNames = names;
    screen.innerHTML = `<div class="train-wrapper"><div class="train-track"><div class="train-rail"></div><div class="train" id="train-anim"><div class="engine">🚂</div>${names.map(n=>`<div class="wagon">${n.name}</div>`).join('')}</div><div class="train-indicator"></div></div></div>`;
  }
}

function playGame(){
  const gameKey = document.getElementById('modal-game').getAttribute('data-game');
  const pool = getCurrentStudentPool();
  if(pool.length===0){ showToast('لا يوجد طلاب للاختيار',''); return; }
  if(gameKey==='wheel'){ /* Wheel starts by clicking center */ return; }
  if(gameKey==='treasure'){ return openGameModal('treasure'); }
  if(gameKey==='scratch'){ return openGameModal('scratch'); }
  if(gameKey==='quick'){ return startQuickDraw(); }
  if(gameKey==='train'){ return startTrain(); }
}

function startWheelSpin(){
  const wheel = document.getElementById('wheel-spinner');
  if(!wheel) return;
  const names = window.currentGame.pool.slice(0,8);
  const angle = 360 / names.length;
  const winnerIndex = Math.floor(Math.random()*names.length);
  const rotation = 360*5 + (360 - (winnerIndex * angle + angle/2));
  const resultBox = document.getElementById('game-result');
  const actionButton = document.getElementById('game-action');
  if(resultBox){ resultBox.classList.remove('winner'); resultBox.classList.add('loading'); resultBox.innerHTML = '<span>دور العجلة...</span>'; }
  if(actionButton) actionButton.disabled = true;
  wheel.classList.add('spinning');
  wheel.style.transform = `rotate(${rotation}deg)`;
  setTimeout(()=>{
    wheel.classList.remove('spinning');
    const winner = names[winnerIndex];
    if(resultBox){ resultBox.classList.remove('loading'); resultBox.classList.add('winner'); resultBox.innerHTML = `<span>${winner.name}</span>`; }
    if(actionButton){ actionButton.textContent = 'إعادة اللعب'; actionButton.disabled = false; }
    launchConfetti();
    setTimeout(() => openStudentModal(winner.id), 1200);
  }, 5000);
}

function launchConfetti(){
  const container = document.getElementById('confetti-container');
  if(!container) return;
  container.innerHTML = '';
  for(let i=0;i<18;i++){
    const div = document.createElement('div');
    div.className = 'confetti-piece show';
    div.style.left = `${Math.random()*80+10}%`;
    div.style.background = i%2===0 ? '#fbbf24' : '#ec4899';
    div.style.transform = `rotate(${Math.random()*360}deg)`;
    div.style.animationDuration = `${900 + Math.random()*400}ms`;
    div.style.animationDelay = `${Math.random()*150}ms`;
    container.appendChild(div);
  }
  setTimeout(()=>{ if(container) container.innerHTML = ''; }, 1500);
}

function flipTreasureCard(card){
  if(card.classList.contains('flipped')) return;
  card.classList.add('flipped');
  const allCards = document.querySelectorAll('.card-item');
  allCards.forEach(c => { if(c !== card) c.classList.add('dimmed'); });
  const index = parseInt(card.dataset.index,10);
  const choice = window.currentGame.cards[index];
  const resultBox = document.getElementById('game-result');
  if(resultBox){ resultBox.classList.add('winner'); resultBox.textContent = choice.name; }
  launchConfetti();
  setTimeout(() => openStudentModal(choice.id), 1200);
}

function setupScratchCanvas(){
  const canvas = document.getElementById('scratch-canvas');
  const nameEl = document.getElementById('scratch-name');
  if(!canvas || !nameEl) return;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * window.devicePixelRatio;
  canvas.height = rect.height * window.devicePixelRatio;
  const ctx = canvas.getContext('2d');
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  ctx.fillStyle = '#64748b';
  ctx.fillRect(0,0,rect.width,rect.height);
  ctx.globalCompositeOperation = 'destination-out';
  let scratching = false;
  const scratch = (x,y)=>{
    ctx.beginPath();
    ctx.arc(x,y,28,0,Math.PI*2);
    ctx.fill();
    const image = ctx.getImageData(0,0,rect.width,rect.height);
    let cleared = 0;
    for(let i=3;i<image.data.length;i+=4){ if(image.data[i]===0) cleared++; }
    if(cleared > image.data.length * 0.18){ 
      canvas.style.opacity='0'; 
      document.getElementById('game-result').classList.add('winner');
      document.getElementById('game-result').textContent = window.currentGame.scratchChoice.name; 
      launchConfetti();
      setTimeout(() => openStudentModal(window.currentGame.scratchChoice.id), 1000);
    }
  };
  const getPos = e => {
    const bounds = canvas.getBoundingClientRect();
    const x = (e.clientX - bounds.left);
    const y = (e.clientY - bounds.top);
    return {x,y};
  };
  canvas.addEventListener('pointerdown', e=>{ scratching=true; const p=getPos(e); scratch(p.x,p.y); });
  canvas.addEventListener('pointermove', e=>{ if(!scratching) return; const p=getPos(e); scratch(p.x,p.y); });
  window.addEventListener('pointerup', ()=>{ scratching=false; });
}

function startQuickDraw(){
  const names = window.currentGame.pool;
  const winner = names[Math.floor(Math.random()*names.length)];
  const output = document.getElementById('quick-output');
  const actionButton = document.getElementById('game-action');
  const resultBox = document.getElementById('game-result');
  if(output){ output.classList.remove('winner-highlight'); output.classList.add('animating'); }
  if(actionButton) actionButton.disabled = true;
  if(resultBox){ resultBox.classList.remove('winner'); resultBox.classList.add('loading'); resultBox.textContent = 'جاري السحب...'; }
  
  let ticks = 0;
  const interval = setInterval(()=>{
    if(output) output.textContent = names[Math.floor(Math.random()*names.length)].name;
    ticks++;
    if(ticks > 25){
      clearInterval(interval);
      if(output){ output.classList.remove('animating'); output.classList.add('winner-highlight'); output.textContent = winner.name; }
      if(resultBox){ resultBox.classList.remove('loading'); resultBox.classList.add('winner'); resultBox.textContent = winner.name; }
      if(actionButton){ actionButton.textContent='إعادة اللعبة'; actionButton.disabled = false; }
      launchConfetti();
      setTimeout(() => openStudentModal(winner.id), 1200);
    }
  }, 60);
}

function startTrain(){
  const train = document.getElementById('train-anim');
  const actionButton = document.getElementById('game-action');
  const resultBox = document.getElementById('game-result');
  if(!train || !window.currentGame.trainNames) return;
  const names = window.currentGame.trainNames;
  const selectedIndex = Math.floor(Math.random()*names.length);
  const wagonWidth = train.querySelector('.wagon')?.offsetWidth || 100;
  const centerOffset = document.querySelector('.train-wrapper').offsetWidth / 2 - 70;
  const translate = -selectedIndex * (wagonWidth + 10) + centerOffset;
  
  train.classList.add('moving');
  train.style.transition = 'transform 3.5s cubic-bezier(.22,.61,.36,1)';
  train.style.transform = `translateX(${translate}px)`;
  if(resultBox){ resultBox.classList.remove('winner'); resultBox.classList.add('loading'); resultBox.innerHTML = '<span>انطلق القطار...</span>'; }
  if(actionButton) actionButton.disabled = true;
  
  setTimeout(()=>{
    train.classList.remove('moving');
    const wagons = Array.from(train.querySelectorAll('.wagon'));
    wagons.forEach((w,i)=>{
      if(i===selectedIndex) w.classList.add('selected');
      else w.classList.add('dimmed');
    });
    const winner = names[selectedIndex];
    if(resultBox){ resultBox.classList.remove('loading'); resultBox.classList.add('winner'); resultBox.innerHTML = `<span>${winner.name}</span>`; }
    if(actionButton){ actionButton.textContent='إعادة اللعبة'; actionButton.disabled=false; }
    launchConfetti();
    setTimeout(()=>openStudentModal(winner.id), 1200);
  }, 3600);
}

function selectRandomStudent(){
  const pool = getCurrentStudentPool();
  if(pool.length===0){ showToast('لا يوجد طلاب للاختيار',''); return; }
  const winner = pool[Math.floor(Math.random()*pool.length)];
  openStudentModal(winner.id);
  showToast('🎲 تم اختيار: '+winner.name,'success');
}

function getRoleLabel(role){ return rolesConfig[role]?.label || role; }
function getPermissionLabel(key){ return permissionLabels[key] || key; }
function hasPermission(permission){ return currentSession && rolesConfig[currentSession.role]?.permissions.includes(permission); }
function isAdmin(){
  return currentSession?.role==='admin';
}

function applySessionUI(){
  const addBtn = document.getElementById('add-student-btn');
  if(addBtn){ addBtn.style.display = hasPermission('manageStudents') ? 'inline-flex' : 'none'; }
  const nameEl = document.getElementById('session-user-name');
  const roleEl = document.getElementById('session-user-role');
  if(nameEl) nameEl.textContent = currentSession?.user || 'ضيف';
  if(roleEl) roleEl.textContent = getRoleLabel(currentSession?.role);
  
  const navAccounts = document.getElementById('nav-accounts');
  const navDatabase = document.getElementById('nav-database');
  const bannerCard = document.getElementById('banner-settings-card');
  
  const isAdminUser = hasPermission('manageAccounts') || (currentSession && currentSession.role === 'admin');
  
  if(navAccounts) navAccounts.style.display = isAdminUser ? 'flex' : 'none';
  if(navDatabase) navDatabase.style.display = isAdminUser ? 'flex' : 'none';
  if(bannerCard) bannerCard.style.display = isAdminUser ? 'block' : 'none';
}

// ── Navigation ──
function showView(view) {
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  const el = document.getElementById('view-'+view);
  if(el) el.classList.add('active');
  currentView = view;
  const navMap = {dashboard:0,attendance:1,grades:2,classes:3,reports:4,accounts:5,database:6,settings:7};
  document.querySelectorAll('.nav-item')[navMap[view]]?.classList.add('active');
  const titles = {dashboard:'\u0644\u0648\u062d\u0629 \u0627\u0644\u062a\u062d\u0643\u0645',attendance:'\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0637\u0644\u0627\u0628',grades:'\u0627\u0644\u062a\u0642\u064a\u064a\u0645\u0627\u062a \u0648\u0627\u0644\u062f\u0631\u062c\u0627\u062a',classes:'\u0627\u0644\u0641\u0635\u0648\u0644 \u0648\u0627\u0644\u0637\u0644\u0627\u0628',reports:'\u0627\u0644\u062a\u0642\u0627\u0631\u064a\u0631',accounts:'\u0625\u062f\u0627\u0631\u0629 \u0627\u0644\u062d\u0633\u0627\u0628\u0627\u062a',database:'\u0642\u0627\u0639\u062f\u0629 \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a',settings:'\u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a'};
  const topTitle = document.querySelector('.topbar-title');
  if(topTitle) topTitle.innerHTML = (titles[view]||view)+' <span class="topbar-sub">\u2014 \u0627\u0644\u0641\u0635\u0644 \u0627\u0644\u062f\u0631\u0627\u0633\u064a \u0627\u0644\u0623\u0648\u0644</span>';
  const launcher = document.getElementById('game-launcher');
  if(launcher && view!=='attendance'){ launcher.style.display='none'; }
  if(view==='dashboard') renderDashboard();
  if(view==='attendance') renderStudents();
  if(view==='grades') renderGrades();
  if(view==='classes') renderClasses();
  if(view==='reports') renderReports();
  if(view==='accounts') renderAccountsTable();
  if(view==='database') updateDbStatusUI();
  if(view==='settings') renderSettings();
}

// ── Dashboard ──
function renderDashboard(){
  const c=getCounts();
  const total=students.length;
  document.getElementById('m-present').textContent=c.present;
  document.getElementById('m-absent').textContent=c.absent;
  document.getElementById('m-other').textContent=c.late+c.excused+c.remote;
  document.getElementById('m-total').textContent=total;
  document.getElementById('m-present-pct').textContent='من '+total+' طالب';
  document.getElementById('m-absent-pct').textContent=Math.round(c.absent/total*100)+'%';

  // donut
  const r=50, circ=2*Math.PI*r;
  const pPct=c.present/total, aPct=c.absent/total, oPct=(c.late+c.excused+c.remote)/total;
  document.getElementById('donut-present').setAttribute('stroke-dashoffset',(circ*(1-pPct)).toFixed(1));
  const abOffset=circ*(1-aPct-pPct);
  const abEl=document.getElementById('donut-absent');
  abEl.setAttribute('stroke-dashoffset',(circ*(1-aPct)).toFixed(1));
  abEl.setAttribute('transform',`rotate(${-90+pPct*360} 60 60)`);
  const oEl=document.getElementById('donut-other');
  oEl.setAttribute('stroke-dashoffset',(circ*(1-oPct)).toFixed(1));
  oEl.setAttribute('transform',`rotate(${-90+(pPct+aPct)*360} 60 60)`);
  document.getElementById('donut-center-val').textContent=Math.round(c.present/total*100)+'%';
  document.getElementById('dl-present').textContent=c.present;
  document.getElementById('dl-absent').textContent=c.absent;
  document.getElementById('dl-other').textContent=c.late+c.excused+c.remote;
  document.getElementById('dl-none').textContent=c.none;

  // week chart
  const days=['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','اليوم'];
  const vals=[88,92,85,90,87,Math.round(c.present/total*100)];
  const chart=document.getElementById('week-chart');
  chart.innerHTML=days.map((d,i)=>`
    <div class="bar-col">
      <div class="bar-val">${vals[i]}%</div>
      <div class="bar-fill${i===5?' today':''}" style="height:${vals[i]}px;"></div>
      <div class="bar-lbl">${d}</div>
    </div>`).join('');

  // activity
  const al=document.getElementById('activity-list');
  if(activityLog.length===0){al.innerHTML='<div style="text-align:center;color:var(--gray-400);padding:20px;font-size:13px;">لا توجد نشاطات بعد — ابدأ بتسجيل الحضور</div>';return;}
  al.innerHTML='<div class="activity-list">'+activityLog.slice(-6).reverse().map(a=>`
    <div class="act-item">
      <div class="act-ava" style="background:${a.bg};color:${a.col}">${a.initials}</div>
      <div class="act-info"><div class="act-name">${a.name}</div><div class="act-desc">${a.desc}</div></div>
      <span class="badge ${a.status}">${statusLabel(a.status)}</span>
    </div>`).join('')+'</div>';
}

// ── Attendance ──
function renderStudents(){
  const q=document.getElementById('att-search').value.trim();
  const grid=document.getElementById('students-grid');
  const statusColors={present:{bg:'var(--primary-light)',col:'var(--primary-dark)'},absent:{bg:'var(--red-light)',col:'var(--red)'},late:{bg:'var(--amber-light)',col:'#92400e'},excused:{bg:'var(--blue-light)',col:'#1d4ed8'},remote:{bg:'var(--purple-light)',col:'#6d28d9'}};

  let filtered=students.filter(s=>{
    const matchQ=!q||s.name.includes(q)||s.num.includes(q);
    const st=attendance[s.id];
    const matchF=currentFilter==='all'||(currentFilter==='none'&&!st)||(currentFilter===st);
    const matchClass = !currentClassFilter || String(s.class)===String(currentClassFilter);
    return matchQ&&matchF&&matchClass;
  });

  grid.innerHTML=filtered.map((s,i)=>{
    const st=attendance[s.id];
    const sc=statusCls(st);
    const pills=[
      {k:'present',l:'حاضر',cls:'sp'},
      {k:'absent',l:'غائب',cls:'sa'},
      {k:'late',l:'متأخر',cls:'sl'},
      {k:'excused',l:'مستأذن',cls:'se'},
      {k:'remote',l:'عن بعد',cls:'sr'},
    ];
    return `<div class="student-row${st?' s-'+st:''}" id="sr-${s.id}" onclick="openStudentModal(${s.id})">
      <div class="s-num">${s.num}</div>
      <div class="s-avatar${sc?' '+sc:''}">${initials(s.name)}</div>
      <div class="s-info">
        <div class="s-name">${s.name}</div>
        <div class="s-meta">فصل ${s.class} · ${st?statusLabel(st):'لم يُسجَّل بعد'}</div>
      </div>
      <div class="s-actions">
        ${pills.map(p=>`<button class="s-pill${st===p.k?' '+p.cls:''}" onclick="event.stopPropagation(); setStatus(${s.id},'${p.k}')">${p.l}</button>`).join('')}
      </div>
    </div>`;
  }).join('');

  updateAttStats();
}

function openStudentModal(id){
  const s = students.find(x=>x.id===id); if(!s) return;
  // ensure meta exists
  if(!studentMeta[id]) studentMeta[id] = {warnings:[],points:0,badges:[],role:''};
  const meta = studentMeta[id];
  const modal = document.getElementById('modal-student');
  modal.querySelector('.modal-title').textContent = s.name;
  modal.querySelector('#stu-num').textContent = s.num;
  modal.querySelector('#stu-class').textContent = s.class;
  // grades
  const g = grades[id] || {hw:0,part:0,exam:0,act:0};
  modal.querySelector('#stu-grades').innerHTML = `الواجب: ${g.hw} · المشاركة: ${g.part} · الاختبار: ${g.exam} · النشاط: ${g.act}`;
  modal.querySelector('#stu-warnings').innerHTML = meta.warnings.map(w=>`<div>- ${w}</div>`).join('') || '<div style="color:var(--gray-400)">لا توجد تحذيرات</div>';
  modal.querySelector('#stu-points').textContent = meta.points;
  modal.querySelector('#stu-badges').innerHTML = meta.badges.map(b=>`<span class="badge present" style="margin-left:6px">${b}</span>`).join('') || '<div style="color:var(--gray-400)">لا توجد وسام</div>';
  modal.querySelector('#stu-role').textContent = meta.role || 'بدون دور';
  modal.setAttribute('data-stu-id', id);
  modal.classList.add('open');
}

function closeStudentModal(){ document.getElementById('modal-student').classList.remove('open'); }

function addWarning(){ const modal=document.getElementById('modal-student'); const id=+modal.getAttribute('data-stu-id'); const txt=modal.querySelector('#new-warning').value.trim(); if(!txt) return showToast('أدخل نص التحذير'); if(!studentMeta[id]) studentMeta[id]={warnings:[],points:0,badges:[],role:''}; studentMeta[id].warnings.push(txt); modal.querySelector('#new-warning').value=''; openStudentModal(id); showToast('تم إضافة تحذير'); }

function addPoints(){ const modal=document.getElementById('modal-student'); const id=+modal.getAttribute('data-stu-id'); const val=parseInt(modal.querySelector('#add-points').value)||0; if(!studentMeta[id]) studentMeta[id]={warnings:[],points:0,badges:[],role:''}; studentMeta[id].points+=val; modal.querySelector('#add-points').value=''; openStudentModal(id); showToast('تم إضافة نقاط'); }

function addBadge(){ const modal=document.getElementById('modal-student'); const id=+modal.getAttribute('data-stu-id'); const txt=modal.querySelector('#new-badge').value.trim(); if(!txt) return showToast('أدخل اسم الوسام'); if(!studentMeta[id]) studentMeta[id]={warnings:[],points:0,badges:[],role:''}; studentMeta[id].badges.push(txt); modal.querySelector('#new-badge').value=''; openStudentModal(id); showToast('تم إضافة وسام'); }

function setRole(){ const modal=document.getElementById('modal-student'); const id=+modal.getAttribute('data-stu-id'); const val=modal.querySelector('#set-role').value.trim(); if(!studentMeta[id]) studentMeta[id]={warnings:[],points:0,badges:[],role:''}; studentMeta[id].role=val; openStudentModal(id); showToast('تم تعيين الدور'); }

function setStatus(id,status){
  const prev=attendance[id];
  attendance[id]=prev===status?null:status;
  const s=students.find(x=>x.id===id);
  if(s&&attendance[id]){
    const colors={present:{bg:'var(--primary-light)',col:'var(--primary-dark)'},absent:{bg:'var(--red-light)',col:'var(--red)'},late:{bg:'var(--amber-light)',col:'#92400e'},excused:{bg:'var(--blue-light)',col:'#1d4ed8'},remote:{bg:'var(--purple-light)',col:'#6d28d9'}};
    const c=colors[attendance[id]]||{bg:'var(--gray-100)',col:'var(--gray-500)'};
    activityLog.push({name:s.name,initials:initials(s.name),status:attendance[id],desc:'تم تسجيل '+statusLabel(attendance[id]),bg:c.bg,col:c.col,time:new Date().toLocaleTimeString('ar')});
  }
  renderStudents();
}

function setFilter(f,el,statKey){
  currentFilter=f;
  if(el){document.querySelectorAll('.ftab').forEach(t=>t.classList.remove('active'));el.classList.add('active');}
  document.querySelectorAll('.att-stat').forEach(s=>s.classList.remove('active-filter'));
  if(statKey)document.getElementById('as-'+statKey)?.classList.add('active-filter');
  renderStudents();
}

function markAll(status){
  students.forEach(s=>{ attendance[s.id]=status; });
  showToast('تم تحضير جميع الطلاب ✓','success');
  renderStudents();
}

function clearAll(){
  students.forEach(s=>{ attendance[s.id]=null; });
  showToast('تم مسح جميع البيانات');
  renderStudents();
}

function updateAttStats(){
  const c=getCounts();
  document.getElementById('as-n-present').textContent=c.present;
  document.getElementById('as-n-absent').textContent=c.absent;
  document.getElementById('as-n-late').textContent=c.late;
  document.getElementById('as-n-excused').textContent=c.excused;
  document.getElementById('as-n-remote').textContent=c.remote;
  const done=students.length-c.none;
  const pct=Math.round(done/students.length*100);
  document.getElementById('att-progress').style.width=pct+'%';
  document.getElementById('att-progress-label').textContent=done+' من '+students.length+' طالب تم تسجيلهم ('+pct+'%)';
}

function saveAttendance(){
  const c=getCounts();
  if(c.none>0){showToast('⚠️ '+c.none+' طلاب لم يُسجَّلوا بعد','');return;}
  showToast('✅ تم حفظ الكشف بنجاح','success');
  if(currentView==='attendance') setTimeout(()=>renderDashboard(),200);
}

function renderSettings(){
  const list = document.getElementById('accounts-list');
  if(hasPermission('manageAccounts')){
    renderUserAccounts();
    document.getElementById('account-settings-card').style.display='block';
    document.getElementById('account-settings-placeholder').style.display='none';
  } else {
    document.getElementById('account-settings-card').style.display='none';
    document.getElementById('account-settings-placeholder').style.display='block';
    if(list) list.innerHTML='';
  }
}

function renderUserAccounts(){
  const list = document.getElementById('accounts-list');
  if(!list) return;
  if(accounts.length===0){
    list.innerHTML = '<div style="color:var(--gray-400);font-size:13px;">لا توجد حسابات بعد.</div>';
    return;
  }
  list.innerHTML = accounts.map(a=>`
    <div style="padding:12px 0;border-bottom:1px solid var(--gray-100);">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;">
        <div>
          <div style="font-weight:700;">${a.name}</div>
          <div style="font-size:12px;color:var(--gray-500);">@${a.username} · ${getRoleLabel(a.role)}</div>
        </div>
        ${hasPermission('manageAccounts') ? `<button class="tb-btn" style="padding:6px 10px;font-size:12px;min-width:92px;" onclick="removeAccount(${a.id})">حذف</button>` : ''}
      </div>
      <div style="margin-top:8px;font-size:13px;color:var(--gray-600);">
        الفصول: ${a.classesCount} · الطلاب: ${a.studentsCount} · صلاحيات: ${rolesConfig[a.role].permissions.map(getPermissionLabel).join(', ')}
      </div>
    </div>
  `).join('');
}

function openAddAccountModal(){
  if(!hasPermission('manageAccounts')){ showToast('هذه الميزة محجوزة لمسؤول النظام فقط',''); return; }
  document.getElementById('account-username').value='';
  document.getElementById('account-password').value='';
  document.getElementById('account-name').value='';
  document.getElementById('account-role').value='teacher';
  document.getElementById('account-classes').value='0';
  document.getElementById('account-students').value='0';
  updateAccountRolePermissions();
  openModal('addAccount');
}

function updateAccountRolePermissions(){
  const role = document.getElementById('account-role').value;
  const perms = rolesConfig[role]?.permissions || [];
  document.getElementById('account-permissions').innerHTML = perms.length ? perms.map(p=>`<div>• ${getPermissionLabel(p)}</div>`).join('') : '<div style="color:var(--gray-500);">لا توجد صلاحيات.</div>';
}

function addAccount(){
  const username = document.getElementById('account-username').value.trim();
  const password = document.getElementById('account-password').value.trim();
  const name = document.getElementById('account-name').value.trim();
  const role = document.getElementById('account-role').value;
  const classesCount = parseInt(document.getElementById('account-classes').value,10) || 0;
  const studentsCount = parseInt(document.getElementById('account-students').value,10) || 0;
  if(!username||!password||!name){ showToast('يرجى ملء جميع الحقول المطلوبة',''); return; }
  if(accounts.some(a=>a.username===username)){ showToast('اسم المستخدم موجود بالفعل',''); return; }
  const newId = accounts.length?Math.max(...accounts.map(a=>a.id))+1:1;
  accounts.push({id:newId,username,password,role,name,classesCount,studentsCount});
  saveAll();
  closeModal('addAccount');
  showToast('✅ تم إضافة الحساب بنجاح','success');
  renderSettings();
}

function removeAccount(id){
  if(!hasPermission('manageAccounts')){ showToast('هذه الميزة محجوزة لمسؤول النظام فقط',''); return; }
  const account = accounts.find(a=>a.id===id);
  if(!account){ return; }
  if(account.username==='admin'){ showToast('لا يمكن حذف حساب المسؤول الرئيسي',''); return; }
  accounts = accounts.filter(a=>a.id!==id);
  saveAll();
  renderSettings();
  showToast('تم حذف الحساب','success');
}

// ── Grades ──
function renderGrades(){
  const tbody=document.getElementById('grades-body');
  tbody.innerHTML=students.map((s,i)=>{
    const g=grades[s.id]||{hw:0,part:0,exam:0,act:0};
    const total=g.hw+g.part+g.exam+g.act;
    const lvl=total>=54?['ممتاز','gl-a']:total>=42?['جيد جداً','gl-b']:total>=30?['جيد','gl-c']:['يحتاج متابعة','gl-d'];
    return `<tr>
      <td>${s.num}</td><td style="font-weight:500;">${s.name}</td>
      <td><input class="grade-input" type="number" min="0" max="10" value="${g.hw}" onchange="updateGrade(${s.id},'hw',this.value)"></td>
      <td><input class="grade-input" type="number" min="0" max="10" value="${g.part}" onchange="updateGrade(${s.id},'part',this.value)"></td>
      <td><input class="grade-input" type="number" min="0" max="30" value="${g.exam}" onchange="updateGrade(${s.id},'exam',this.value)"></td>
      <td><input class="grade-input" type="number" min="0" max="10" value="${g.act}" onchange="updateGrade(${s.id},'act',this.value)"></td>
      <td class="grade-total">${total}</td>
      <td><span class="grade-level ${lvl[1]}">${lvl[0]}</span></td>
    </tr>`;
  }).join('');
}

function updateGrade(id,field,val){
  if(!grades[id])grades[id]={hw:0,part:0,exam:0,act:0};
  grades[id][field]=Math.max(0,parseInt(val)||0);
  renderGrades();
}

function saveGrades(){showToast('✅ تم حفظ الدرجات','success');}
// call Export module to perform CSV/Excel export
function exportGrades(){
  if(window.Export && typeof window.Export.exportGrades==='function'){
    const csv = window.Export.buildGradesCSV(students, grades);
    window.Export.downloadCSV('grades.csv', csv);
    showToast('📊 تم تصدير الدرجات','success');
  } else {
    showToast('خطأ: وحدة التصدير غير متاحة','');
  }
}

// ── Classes ──
function renderClasses(){
  const grid=document.getElementById('classes-grid');
  let html = systemClasses.map(cls=>{
    const classStudents=students.filter(s=>s.class===cls);
    const present=classStudents.filter(s=>attendance[s.id]==='present').length;
    return `<div class="class-card" onclick="filterByClass('${cls}')">
      <div class="class-grade">الثالث متوسط</div>
      <div class="class-name">فصل ${cls}</div>
      <div class="class-meta">
        <div class="cm-item"><div class="cm-num">${classStudents.length}</div><div class="cm-lbl">طالب</div></div>
        <div class="cm-item"><div class="cm-num" style="color:var(--primary)">${present}</div><div class="cm-lbl">حاضر</div></div>
        <div class="cm-item"><div class="cm-num" style="color:var(--red)">${classStudents.filter(s=>attendance[s.id]==='absent').length}</div><div class="cm-lbl">غائب</div></div>
      </div>
    </div>`;
  }).join('');
  if(hasPermission('manageStudents')){
    html += '<button class="class-add-btn" onclick="openModal(\'addClass\')"><div class="plus-circle">+</div><span>إضافة فصل جديد</span></button>';
  }
  grid.innerHTML = html;
  
  // Update the select options for students and others
  document.querySelectorAll('#new-class, #report-filter-class').forEach(el => {
    if(el) {
      if(el.id === 'report-filter-class') {
         el.innerHTML = '<option value="all">الجميع</option>' + systemClasses.map(c => `<option value="${c}">فصل ${c}</option>`).join('');
      } else {
         el.innerHTML = systemClasses.map(c => `<option value="${c}">فصل ${c}</option>`).join('');
      }
    }
  });
}

function addClass() {
  const clsName = document.getElementById('new-class-name').value.trim();
  if(!clsName){ showToast('⚠️ الرجاء إدخال اسم الفصل', ''); return; }
  if(systemClasses.includes(clsName)){ showToast('⚠️ عذراً، هذا الفصل موجود مسبقاً', ''); return; }
  systemClasses.push(clsName);
  document.getElementById('new-class-name').value = '';
  closeModal('addClass');
  renderClasses();
  showToast('✅ تمت إضافة الفصل بنجاح', 'success');
}

function filterByClass(cls){
  showView('attendance');
  currentFilter='all';
  currentClassFilter = cls; // set class filter
  document.getElementById('att-search').value='';
  renderStudents();
}

// ── Reports ──
window.TriggerReportUpdate = function() {
  if (window.currentReportType) {
    window.loadReportPreview(window.currentReportType);
  }
};

window.loadReportPreview = function(type, element) {
  window.currentReportType = type;
  if(element) {
    document.querySelectorAll('.rs-item').forEach(el => el.classList.remove('active'));
    element.classList.add('active');
  } else {
    // try to find default active element for this type
    const defaultEl = document.querySelector('.rs-item[onclick*="'+type+'"]');
    if(defaultEl) {
      document.querySelectorAll('.rs-item').forEach(el => el.classList.remove('active'));
      defaultEl.classList.add('active');
    }
  }

  const printArea = document.getElementById('a4-print-area');
  if(!printArea) return;

  // 1. Filtering process
  const filterGrade = document.getElementById('report-filter-grade')?.value || 'all';
  const filterClass = document.getElementById('report-filter-class')?.value || 'all';
  
  let filteredStudents = students;
  if(filterClass !== 'all') {
    filteredStudents = filteredStudents.filter(s => s.class === filterClass);
  }

  // 2. Pagination Math
  const itemsPerPage = 18; // Optimal rows per A4 page
  const pagesCount = Math.max(1, Math.ceil(filteredStudents.length / itemsPerPage));
  const dateStr = new Date().toLocaleDateString('ar-SA');
  
  let finalHtml = '';

  for (let pageIdx = 0; pageIdx < pagesCount; pageIdx++) {
    const startObj = pageIdx * itemsPerPage;
    const chunk = filteredStudents.slice(startObj, startObj + itemsPerPage);
    
    let pageHtml = `
      <div class="a4-page">
        <div class="a4-header">
          <div>
            <h2>المملكة العربية السعودية</h2>
            <p>وزارة التعليم</p>
            <p>إدارة التعليم</p>
            <p>المدرسة: ${filterGrade !== 'all' ? filterGrade : '___________________'}</p>
            ${filterClass !== 'all' ? `<p>الفصل: ${filterClass}</p>` : ''}
          </div>
          <div style="text-align:left;">
            <p>تاريخ الإصدار: ${dateStr}</p>
            <p>رقم التقرير: ${Math.floor(Math.random()*10000)}</p>
            <p style="font-weight:bold;color:#475569;margin-top:8px;">الصفحة: ${pageIdx + 1} / ${pagesCount}</p>
          </div>
        </div>
    `;

    if(type === 'attendance') {
      pageHtml += `<div class="a4-title">تقرير الحضور الشهري</div>
                   <table class="a4-table">
                     <thead><tr><th>الرقم</th><th>اسم الطالب</th><th>الفصل</th><th>حالة الحضور</th></tr></thead>
                     <tbody>
                       ${chunk.map(s => {
                         let st = attendance[s.id];
                         let label = st==='present'?'حاضر':st==='absent'?'<span style="color:#dc2626;font-weight:bold;">غائب</span>':st==='late'?'متأخر':st==='excused'?'مستأذن':'غير مسجل';
                         return `<tr><td>${s.num}</td><td>${s.name}</td><td>${s.class}</td><td>${label}</td></tr>`;
                       }).join('')}
                     </tbody>
                   </table>`;
    } else if(type === 'grades') {
      pageHtml += `<div class="a4-title">كشف الدرجات الشامل للطلاب</div>
                   <table class="a4-table">
                     <thead><tr><th>الرقم</th><th>اسم الطالب</th><th>الفصل</th><th>واجب(10)</th><th>مشاركة(10)</th><th>اختبار(30)</th><th>نشاط(10)</th><th>المجموع(60)</th></tr></thead>
                     <tbody>
                       ${chunk.map(s => {
                         const g=grades[s.id]||{hw:0,part:0,exam:0,act:0};
                         const total = g.hw+g.part+g.exam+g.act;
                         const style = total < 30 ? 'background:#fee2e2;color:#991b1b;font-weight:bold;' : '';
                         return `<tr style="${style}"><td>${s.num}</td><td>${s.name}</td><td>${s.class}</td><td>${g.hw}</td><td>${g.part}</td><td>${g.exam}</td><td>${g.act}</td><td>${total}</td></tr>`;
                       }).join('')}
                     </tbody>
                   </table>`;
    } else if(type === 'absences') {
      const absenteesChunk = chunk.filter(s => attendance[s.id] === 'absent');
      pageHtml += `<div class="a4-title" style="color:#b91c1c;">إشعار تحذير غياب</div>`;
      
      if(pageIdx === 0) {
        pageHtml += `<p style="margin-bottom:20px; text-align:justify; font-size:16px;">المكرم ولي أمر الطالب، يفيدكم مكتب شؤون الطلاب بالمدرسة بأنه بناءً على سجلات الحضور والغياب، تبين غياب الطلاب المذكورين أدناه دون عذر مقبول. نأمل منكم المتابعة.</p>`;
      }
      
      pageHtml += `<table class="a4-table" style="margin-bottom:40px;">
                     <thead><tr><th>الرقم</th><th>اسم الطالب</th><th>الفصل</th><th>ملاحظات النظام</th></tr></thead>
                     <tbody>
                       ${absenteesChunk.map(s => `<tr><td>${s.num}</td><td>${s.name}</td><td>${s.class}</td><td style="color:#dc2626;font-weight:bold;">تجاوز الحد المسموح</td></tr>`).join('')}
                     </tbody>
                   </table>`;
                   
      if(filteredStudents.filter(s => attendance[s.id] === 'absent').length === 0 && pageIdx === 0) {
        pageHtml += `<p style="text-align:center;color:#166534;font-weight:bold;margin:40px;font-size:18px;">لا يوجد طلاب غائبين بدون عذر في الوقت الحالي ✅</p>`;
      }
    } else if(type === 'class_level') {
       if (pageIdx === 0) {
         let tot = filteredStudents.length;
         let pr = filteredStudents.filter(s => attendance[s.id] === 'present').length;
         let ab = filteredStudents.filter(s => attendance[s.id] === 'absent').length;
         pageHtml += `<div class="a4-title">ملخص أداء الفصل العام</div>
                  <div style="display:flex; justify-content:space-around; margin-bottom:30px; text-align:center; gap:10px;">
                    <div style="flex:1; padding:20px; border:1px solid #94a3b8; background:#f8fafc; border-radius:4px;">
                        <h3 style="margin-bottom:10px;font-size:16px;">إجمالي المحددين</h3><p style="font-size:28px; font-weight:bold;">${tot}</p>
                    </div>
                    <div style="flex:1; padding:20px; border:1px solid #94a3b8; background:#dcfce7; border-radius:4px;">
                        <h3 style="margin-bottom:10px;font-size:16px;">معدل الحضور</h3><p style="font-size:28px; font-weight:bold; color:#166534;">${Math.round((pr/tot)*100)||0}%</p>
                    </div>
                    <div style="flex:1; padding:20px; border:1px solid #94a3b8; background:#fee2e2; border-radius:4px;">
                        <h3 style="margin-bottom:10px;font-size:16px;">نسبة الغياب</h3><p style="font-size:28px; font-weight:bold; color:#991b1b;">${Math.round((ab/tot)*100)||0}%</p>
                    </div>
                  </div>
                  <p style="text-align:justify; line-height:1.8; font-size:15px;">يعتبر مستوى انضباط الطلاب ضمن المعدلات الموضحة أعلاه، ونوصي بالتركيز على الطلاب الذين تتكرر غياباتهم لضمان عدم تأثر مستواهم الدراسي. يتم قياس مستوى الفصل بناءً على التفاعل اليومي ونتائج التقييم المستمر.</p>`;
       } else {
         pageHtml += `<div class="a4-title">تابع أداء الفصل - ملاحظات إضافية</div><p style="text-align:center;">تم إرفاق السجلات الإضافية.</p>`;
       }
    }

    pageHtml += `
        <div class="a4-signatures">
          <div><p>توقيع المعلم</p><div class="sig-line"></div></div>
          <div><p>اعتماد مدير المدرسة</p><div class="sig-line"></div></div>
        </div>
      </div>
    `;
    
    finalHtml += pageHtml;
  }

  printArea.innerHTML = finalHtml || `<div class="a4-page"><p style="text-align:center;padding:50px;">لا يوجد بيانات للعرض</p></div>`;
};

// Expose legacy generateReport pointer gracefully
window.generateReport = function(type){
  window.loadReportPreview(type);
};

function renderReports(){
  window.loadReportPreview('attendance', document.querySelector('.rs-item'));
}

// ── Modal ──
function openModal(id){
  if(id==='addStudent' && !hasPermission('manageStudents')){
    showToast('هذه الميزة محجوزة للمستخدمين المخولين','');
    return;
  }
  const modal = document.getElementById(id.startsWith('modal-') ? id : 'modal-'+id);
  if(modal) modal.classList.add('open');
  if(id==='addStudent') document.getElementById('new-num').value=String(students.length+1).padStart(3,'0');
}
function closeModal(id){
  const modal = document.getElementById(id.startsWith('modal-') ? id : 'modal-'+id);
  if(modal) modal.classList.remove('open');
  if(id==='modal-game' || id==='game'){ const launcher = document.getElementById('game-launcher'); if(launcher) launcher.style.display='grid'; }
}

let studentFormMode = 'single';
window.toggleStudentMode = function(mode) {
  studentFormMode = mode;
  document.getElementById('tab-single').classList.toggle('active', mode === 'single');
  document.getElementById('tab-multi').classList.toggle('active', mode === 'multi');
  document.getElementById('add-student-single').style.display = mode === 'single' ? 'block' : 'none';
  document.getElementById('add-student-multi').style.display = mode === 'multi' ? 'block' : 'none';
};

function addStudent(){
  if(!isAdmin()){ showToast('هذه الميزة محجوزة لمسؤول النظام فقط',''); return; }
  const cls=document.getElementById('new-class').value.slice(-1);
  let addedCount = 0;
  let newStudentsForCloud = [];
  
  if(studentFormMode === 'single') {
    const fn=document.getElementById('new-fname').value.trim();
    const ln=document.getElementById('new-lname').value.trim();
    if(!fn||!ln){showToast('⚠️ الرجاء إدخال الاسم كاملاً','');return;}
    const newId=students.length?Math.max(...students.map(s=>s.id))+1:1;
    const newStudent = {id:newId,name:fn+' '+ln,num:String(students.length+1).padStart(3,'0'),class:cls};
    students.push(newStudent);
    grades[newId]={hw:0,part:0,exam:0,act:0};
    newStudentsForCloud.push({name: newStudent.name, num: newStudent.num, class: cls});
    addedCount = 1;
    document.getElementById('new-fname').value='';
    document.getElementById('new-lname').value='';
  } else {
    const list = document.getElementById('new-students-list').value.split('\n');
    list.forEach(name => {
      const trimmed = name.trim();
      if(trimmed) {
        const newId=students.length?Math.max(...students.map(s=>s.id))+1:1;
        const newStudent = {id:newId,name:trimmed,num:String(students.length+1).padStart(3,'0'),class:cls};
        students.push(newStudent);
        grades[newId]={hw:0,part:0,exam:0,act:0};
        newStudentsForCloud.push({name: trimmed, num: newStudent.num, class: cls});
        addedCount++;
      }
    });
    if(addedCount === 0) { showToast('⚠️ الرجاء إدخال اسم طالب واحد على الأقل', ''); return; }
    document.getElementById('new-students-list').value='';
  }

  // حفظ الطلاب في Supabase (سحابياً)
  if(window.addStudentsToSupabase && newStudentsForCloud.length > 0) {
    window.addStudentsToSupabase(newStudentsForCloud);
  }

  closeModal('addStudent');
  if(addedCount > 1) {
    showToast(`✅ تمت إضافة ${addedCount} طلاب بنجاح`, 'success');
  } else {
    showToast('✅ تمت إضافة الطالب بنجاح', 'success');
  }
  
  if(currentView==='attendance')renderStudents();
  if(currentView==='classes')renderClasses();
  if(currentView==='grades')renderGrades();
}

// close modal on overlay click
document.querySelectorAll('.modal-overlay').forEach(o=>o.addEventListener('click',function(e){if(e.target===this)this.classList.remove('open');}));

// ── Init ──
// persistence: load/save using localStorage + Supabase
function saveAll(){
  // حفظ محلي دائماً
  try{ localStorage.setItem('kushoof:data', JSON.stringify({students,attendance,grades,studentMeta,accounts})); }catch(e){/* ignore */}
  // حفظ سحابي إن وُجد اتصال
  if(window.isSupabaseConnected && window.isSupabaseConnected()) {
    if(window.saveAttendanceToSupabase) window.saveAttendanceToSupabase(attendance);
    if(window.saveGradesToSupabase) window.saveGradesToSupabase(grades);
  }
}

window.onload = async function() {
  const dateEl = document.getElementById('today-date');
  if(dateEl) dateEl.textContent = new Date().toLocaleDateString('ar-SA',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
  
  // محاولة جلب البيانات من Supabase
  if(window.loadDataFromSupabase) {
      await window.loadDataFromSupabase();
  }
  
  // تطبيق الجلسة المحفوظة
  applySessionUI();
  renderDashboard();
  
  // تحديث حالة قاعدة البيانات في الإعدادات
  setTimeout(updateDbStatusUI, 1500);
};

// ══ إدارة قاعدة البيانات (Settings) ══
function updateDbStatusUI() {
  const badge = document.getElementById('db-status-badge');
  const dot = document.getElementById('db-status-dot');
  const statusText = document.getElementById('db-status-text');
  const statusSub = document.getElementById('db-status-sub');
  if (!badge) return; // not on settings page

  const connected = window.isSupabaseConnected && window.isSupabaseConnected();
  
  if (connected) {
    badge.style.background = '#e8faf4'; badge.style.color = '#0ea472'; badge.textContent = '● متصل';
    dot.style.background = '#0ea472'; dot.style.boxShadow = '0 0 8px #0ea47280';
    statusText.textContent = 'متصل بقاعدة البيانات بنجاح';
    statusSub.textContent = 'Supabase PostgreSQL — الحالة: نشط';
  } else {
    badge.style.background = '#fffbeb'; badge.style.color = '#f59e0b'; badge.textContent = '● محلي';
    dot.style.background = '#f59e0b'; dot.style.boxShadow = '0 0 8px #f59e0b80';
    statusText.textContent = 'يعمل بالتخزين المحلي (localStorage)';
    statusSub.textContent = 'سيتم الاتصال تلقائياً عند الرفع على GitHub Pages';
  }

  // إحصائيات البيانات
  const countStudents = document.getElementById('db-count-students');
  const countAccounts = document.getElementById('db-count-accounts');
  const countAttendance = document.getElementById('db-count-attendance');
  const storageText = document.getElementById('db-storage-text');
  const storageBar = document.getElementById('db-storage-bar');

  if (countStudents) countStudents.textContent = students.length;
  if (countAccounts) countAccounts.textContent = accounts.length;
  if (countAttendance) countAttendance.textContent = Object.keys(attendance).length;

  // تقدير حجم البيانات (تقريبي)
  const dataStr = JSON.stringify({ students, attendance, grades, accounts });
  const sizeKB = Math.round(new Blob([dataStr]).size / 1024);
  const sizeMB = (sizeKB / 1024).toFixed(2);
  const maxMB = 500;
  const pct = Math.min((sizeKB / 1024 / maxMB) * 100, 100);

  if (storageText) storageText.textContent = `${sizeMB} MB / ${maxMB} MB`;
  if (storageBar) storageBar.style.width = Math.max(pct, 1) + '%';
}

window.testSupabaseConnection = async function() {
  showToast('جارٍ اختبار الاتصال...', '');
  
  const url = document.getElementById('db-url').value.trim();
  const key = document.getElementById('db-key').value.trim();
  
  if (!url || !key) {
    showToast('⚠️ يرجى إدخال رابط المشروع والمفتاح', '');
    return;
  }

  try {
    const testClient = window.supabase.createClient(url, key);
    const { data, error } = await testClient.from('branches').select('id').limit(1);
    
    if (error) throw error;
    
    showToast('✅ تم الاتصال بنجاح! قاعدة البيانات تعمل.', 'success');
    
    // تحديث الحالة
    const badge = document.getElementById('db-status-badge');
    const dot = document.getElementById('db-status-dot');
    const statusText = document.getElementById('db-status-text');
    const statusSub = document.getElementById('db-status-sub');
    badge.style.background = '#e8faf4'; badge.style.color = '#0ea472'; badge.textContent = '● متصل';
    dot.style.background = '#0ea472'; dot.style.boxShadow = '0 0 8px #0ea47280';
    statusText.textContent = 'متصل بقاعدة البيانات بنجاح';
    statusSub.textContent = 'تم التحقق — الاتصال فعّال';
    
  } catch(err) {
    console.error('فشل اختبار الاتصال:', err);
    showToast('❌ فشل الاتصال: ' + (err.message || 'تحقق من البيانات'), '');
    
    const badge = document.getElementById('db-status-badge');
    const dot = document.getElementById('db-status-dot');
    const statusText = document.getElementById('db-status-text');
    badge.style.background = '#fef2f2'; badge.style.color = '#ef4444'; badge.textContent = '● فشل';
    dot.style.background = '#ef4444'; dot.style.boxShadow = '0 0 8px #ef444480';
    statusText.textContent = 'فشل الاتصال — تحقق من البيانات';
  }
};

window.saveDbSettings = function() {
  const url = document.getElementById('db-url').value.trim();
  const key = document.getElementById('db-key').value.trim();
  localStorage.setItem('kushoof:db-url', url);
  localStorage.setItem('kushoof:db-key', key);
  showToast('💾 تم حفظ بيانات الربط محلياً', 'success');
};

function login(){
  const u=document.getElementById('login-username').value.trim();
  const p=document.getElementById('login-password').value.trim();
  if(!u){ showToast('أدخل اسم المستخدم'); return; }
  const account = accounts.find(acc=>acc.username===u && acc.password===p);
  if(account){
    const sess={user:account.username,role:account.role};
    currentSession = sess;
    localStorage.setItem('kushoof:session', JSON.stringify(sess));
    document.getElementById('login-overlay').style.display='none';
    applySessionUI();
    showToast('مرحباً، '+account.name,'success');
    renderDashboard();
    return;
  }
  showToast('بيانات غير صحيحة');
}

function demoLogin(){
  const sess={user:'admin',role:'admin'};
  currentSession = sess;
  localStorage.setItem('kushoof:session', JSON.stringify(sess));
  document.getElementById('login-overlay').style.display='none';
  applySessionUI();
  showToast('تم الدخول كتجربة','success');
  renderDashboard();
}

function logout(){
  localStorage.removeItem('kushoof:session');
  const overlay = document.getElementById('login-overlay');
  if(overlay) {
    overlay.style.display='flex';
    showToast('تم تسجيل الخروج');
  } else {
    showToast('تم تسجيل الخروج..');
    setTimeout(() => { window.location.reload(); }, 800);
  }
}

function toggleSidebar(){
  const sb = document.getElementById('sidebar'); if(!sb) return;
  sb.classList.toggle('open');
}

// enhance some save points to persist
const origSaveAttendance = saveAttendance;
saveAttendance = function(){ origSaveAttendance(); saveAll(); };

const origSaveGrades = saveGrades;
saveGrades = function(){ origSaveGrades(); saveAll(); };

const origAddStudent = addStudent;
addStudent = function(){ origAddStudent(); saveAll(); };

const origAddWarning = addWarning;
addWarning = function(){ origAddWarning(); saveAll(); };

const origAddPoints = addPoints;
addPoints = function(){ origAddPoints(); saveAll(); };

const origAddBadge = addBadge;
addBadge = function(){ origAddBadge(); saveAll(); };

const origSetRole = setRole;
setRole = function(){ origSetRole(); saveAll(); };

// load from DB/localStorage if exists
try{
  let loaded = window.DBConnector && window.DBConnector.load && window.DBConnector.load();
  if(!loaded){
    loaded = JSON.parse(localStorage.getItem('kushoof:data')||'null');
  }
  if(loaded){
    if(loaded.students) students = loaded.students;
    if(loaded.attendance) attendance = loaded.attendance;
    if(loaded.grades) grades = loaded.grades;
    if(loaded.studentMeta) studentMeta = loaded.studentMeta;
    if(loaded.accounts) accounts = loaded.accounts;
  }
}catch(e){console.error('load error',e);} 

// session check: show login overlay if no session
const session = (function(){ try{return JSON.parse(localStorage.getItem('kushoof:session')); }catch(e){return null;} })();
currentSession = session;
applySessionUI();
if(session){ 
  // already logged in (mock) - unlock
  const loginScreen = document.getElementById('login-screen');
  if(loginScreen) loginScreen.style.display='none';
  document.body.classList.remove('app-locked');
}

document.getElementById('today-date').textContent=new Date().toLocaleDateString('ar-SA',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
renderDashboard();

// --- Admin Banner Settings Logic ---
let slideInterval;

function initializeLoginBanners() {
  const wrapper = document.querySelector('.login-carousel-wrapper');
  if(!wrapper) return;
  wrapper.innerHTML = '';
  
  if(loginBanners.length === 0) {
    // Default fallback
    wrapper.innerHTML = `<div class="l-slide"><h3>أهلاً بك</h3><p>مرحباً بك في نظام كشوف</p></div>`;
    return;
  }

  // Populate slides
  loginBanners.forEach(banner => {
    wrapper.innerHTML += `
      <div class="l-slide">
        <div class="svg-graphic">${banner.icon || ''}</div>
        <h3>${banner.title}</h3>
        <p>${banner.desc}</p>
      </div>
    `;
  });

  // Carousel Animation
  if(loginBanners.length > 1) {
    let currentSlide = 0;
    if(slideInterval) clearInterval(slideInterval);
    slideInterval = setInterval(() => {
      currentSlide = (currentSlide + 1) % loginBanners.length;
      wrapper.style.transform = `translateX(${currentSlide * 100}%)`; 
    }, 4000);
  } else {
    wrapper.style.transform = `translateX(0)`;
  }
}

function renderAdminBanners() {
  const blist = document.getElementById('banners-list');
  if(!blist) return;
  blist.innerHTML = '';
  
  if(loginBanners.length === 0) {
    blist.innerHTML = '<div style="color:var(--gray-400);font-size:12px;text-align:center;">لا يوجد إعلانات حالياً</div>';
  }

  loginBanners.forEach((b, i) => {
    blist.innerHTML += `
      <div style="background:#f8fafc;border:1px solid #e2e8f0;padding:12px;border-radius:8px;display:flex;justify-content:space-between;align-items:center;">
        <div>
          <div style="font-weight:700;font-size:14px;color:var(--gray-800)">${b.title}</div>
          <div style="font-size:12px;color:var(--gray-500);margin-top:4px">${b.desc.substring(0,40)}...</div>
        </div>
        <button class="tb-btn" style="color:var(--red);border-color:#fecaca;background:#fff" onclick="removeBanner(${i})">حذف</button>
      </div>
    `;
  });
}

window.renderAddBannerForm = function() {
  const newTitle = prompt("أدخل عنوان الإعلان (مثال: الأخبار العاجلة)");
  if(!newTitle) return;
  const newDesc = prompt("أدخل تفاصيل الإعلان");
  if(!newDesc) return;
  
  loginBanners.push({
    title: newTitle,
    desc: newDesc,
    icon: `<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="50" fill="#e0f2fe"/><circle cx="60" cy="60" r="40" fill="#bae6fd"/><path d="M60 30v60M30 60h60" stroke="#0284c7" stroke-width="10" stroke-linecap="round"/></svg>`
  });
  renderAdminBanners();
};

window.removeBanner = function(index) {
  if(confirm("هل أنت متأكد من حذف هذا الإعلان؟")) {
    loginBanners.splice(index, 1);
    renderAdminBanners();
  }
};

window.toggleSidebar = function() {
  document.getElementById('sidebar').classList.toggle('open');
  const overlay = document.getElementById('mobile-overlay');
  if(overlay) overlay.classList.toggle('active');
};

// Initializes the Banners properly on page load
document.addEventListener("DOMContentLoaded", () => {
   initializeLoginBanners();
   renderAdminBanners();
});

// --- Accounts Management Feature ---
window.renderBranches = function() {
  const grid = document.getElementById('branches-grid');
  const select = document.getElementById('new-acc-branch');
  if(!grid) return;
  
  grid.innerHTML = '';
  if(select) select.innerHTML = '';
  
  // All Branches card
  const allCount = systemAccounts.length;
  grid.innerHTML += `<div class="class-card" style="border-color:${currentAdminBranchFilter===null?'var(--primary)':'var(--gray-200)'};background:${currentAdminBranchFilter===null?'var(--primary-light)':'#fff'};" onclick="filterAccountsByBranch(null)">
    <div class="class-name">كافة الفروع</div>
    <div class="class-meta">
      <div class="cm-item"><div class="cm-num" style="color:var(--gray-800)">${allCount}</div><div class="cm-lbl">إجمالي المستخدمين</div></div>
    </div>
  </div>`;
  
  systemBranches.forEach(b => {
    const bUsers = systemAccounts.filter(a => a.branchName === b.name);
    const isSelected = currentAdminBranchFilter === b.name;
    grid.innerHTML += `<div class="class-card" style="border-color:${isSelected?'var(--primary)':'var(--gray-200)'};background:${isSelected?'var(--primary-light)':'#fff'};" onclick="filterAccountsByBranch('${b.name}')">
      <div class="class-name">${b.name}</div>
      <div class="class-meta">
        <div class="cm-item"><div class="cm-num" style="color:var(--primary)">${bUsers.length}</div><div class="cm-lbl">مستخدم</div></div>
      </div>
    </div>`;
    
    if(select) {
      select.innerHTML += `<option value="${b.id}">${b.name}</option>`;
    }
  });
};

window.filterAccountsByBranch = function(branchName) {
  currentAdminBranchFilter = branchName;
  document.getElementById('current-branch-title').innerText = branchName ? 'مستخدمي (' + branchName + ')' : 'جميع المستخدمين في كافة الفروع';
  renderBranches();
  renderAccountsTable();
};

window.submitAddBranch = function() {
  const name = document.getElementById('new-branch-name').value.trim();
  if(!name) { if(window.showToast) showToast('الرجاء إدخال اسم الفرع', ''); return; }
  systemBranches.push({ id: Date.now(), name: name });
  document.getElementById('new-branch-name').value = '';
  closeModal('addBranch');
  renderBranches();
  if(window.showToast) showToast('تم إضافة الفرع بنجاح', 'success');
};

window.renderAccountsTable = function() {
  const tbody = document.getElementById('accounts-tbody');
  if(!tbody) return;
  tbody.innerHTML = '';
  
  if(document.getElementById('branches-grid').innerHTML.trim() === '') renderBranches();
  
  const filteredAccounts = currentAdminBranchFilter ? systemAccounts.filter(a => a.branchName === currentAdminBranchFilter) : systemAccounts;
  
  const adminsCount = systemAccounts.filter(a => ['super_admin', 'school_admin'].includes(a.role)).length;
  document.getElementById('acc-total').innerText = systemAccounts.length;
  document.getElementById('acc-admins').innerText = adminsCount;

  filteredAccounts.forEach((acc) => {
    const isSuspended = acc.status === 'suspended';
    const index = systemAccounts.findIndex(a => a.id === acc.id);
    
    tbody.innerHTML += `
      <tr style="opacity: ${isSuspended ? '0.6' : '1'}">
        <td style="padding:15px;display:flex;align-items:center;gap:12px;">
          <div style="width:40px;height:40px;border-radius:50%;background:#e2e8f0;display:flex;justify-content:center;align-items:center;font-weight:700;color:var(--gray-600)">${acc.name.charAt(0)}</div>
          <div>
            <div style="font-weight:700;color:var(--gray-900);font-size:14px;">${acc.name}</div>
            <div style="font-size:12px;color:var(--gray-500);font-family:monospace;margin-top:2px;">@${acc.username}</div>
          </div>
        </td>
        <td style="font-size:13px;color:var(--gray-700)">
          ${acc.branchName || 'الفرع الرئيسي'}
        </td>
        <td>
          <select class="form-input" style="padding:6px;font-size:12px;width:auto;min-width:110px;height:auto;" onchange="updateAccountRole(${index}, this.value)">
            <option value="super_admin" ${acc.role==='super_admin'?'selected':''}>مدير النظام</option>
            <option value="school_admin" ${acc.role==='school_admin'?'selected':''}>مدير مدرسة</option>
            <option value="branch_manager" ${acc.role==='branch_manager'?'selected':''}>مدير فرع</option>
            <option value="accountant" ${acc.role==='accountant'?'selected':''}>محاسب</option>
            <option value="staff" ${acc.role==='staff'?'selected':''}>موظف</option>
          </select>
        </td>
        <td>
          <select class="form-input" style="padding:6px;font-size:12px;width:auto;min-width:110px;height:auto;" onchange="updateAccountPlan(${index}, this.value)">
            <option value="free" ${acc.plan==='free'?'selected':''}>مجانية</option>
            <option value="bronze" ${acc.plan==='bronze'?'selected':''}>برونزية</option>
            <option value="gold" ${acc.plan==='gold'?'selected':''}>ذهبية</option>
            <option value="enterprise" ${acc.plan==='enterprise'?'selected':''}>مؤسسية</option>
          </select>
        </td>
        <td style="font-size:13px;color:var(--gray-600);">${acc.created}</td>
        <td>
          <label class="toggle">
            <input type="checkbox" ${!isSuspended ? 'checked' : ''} onchange="toggleAccountStatus(${index})">
            <span class="slider"></span>
          </label>
        </td>
        <td style="text-align:left;">
          <div style="display:flex;justify-content:flex-end;gap:8px;">
            <button class="tb-btn" style="min-height:32px;font-size:12px;padding:4px 10px;background:#f8fafc;" onclick="alert('حالت إعادة تعيين كلمة المرور جاهزة للبرمجة الخلفية')">المرور</button>
            <button class="tb-btn" style="min-height:32px;font-size:12px;padding:4px 10px;background:#fef2f2;color:#ef4444;border-color:#fecaca;" onclick="deleteAccount(${index})">حذف</button>
          </div>
        </td>
      </tr>
    `;
  });
};

window.toggleAccountStatus = function(index) {
  systemAccounts[index].status = systemAccounts[index].status === 'active' ? 'suspended' : 'active';
  renderAccountsTable();
  if(window.showToast) showToast('تم تحديث حالة الحساب', 'success');
};

window.updateAccountRole = function(index, newRole) {
  systemAccounts[index].role = newRole;
  renderAccountsTable();
  if(window.showToast) showToast('تم تحديث صلاحية الحساب', 'success');
};

window.updateAccountPlan = function(index, newPlan) {
  systemAccounts[index].plan = newPlan;
  renderAccountsTable();
  if(window.showToast) showToast('تم تحديث خطة الاشتراك', 'success');
};

window.deleteAccount = function(index) {
  if(confirm("هل أنت متأكد من رغبتك بحذف المستخدم " + systemAccounts[index].name + " بشكل نهائي؟")) {
    systemAccounts.splice(index, 1);
    renderAccountsTable();
    if(window.showToast) showToast('تم حذف الحساب بنجاح', '');
  }
};

window.submitAddAccount = function() {
  const name = document.getElementById('new-acc-name').value;
  const username = document.getElementById('new-acc-user').value;
  const role = document.getElementById('new-acc-role').value;
  const branchSelect = document.getElementById('new-acc-branch');
  const branchName = branchSelect ? branchSelect.options[branchSelect.selectedIndex].text : 'الفرع الرئيسي';
  const plan = document.getElementById('new-acc-plan') ? document.getElementById('new-acc-plan').value : 'free';
  
  if(!name || !username) {
    if(window.showToast) showToast('يرجى تعبئة الحقول الأساسية', '');
    return;
  }
  
  systemAccounts.unshift({
    id: Date.now(),
    name: name,
    username: username,
    role: role,
    branchName: branchName,
    plan: plan,
    created: new Date().toISOString().split('T')[0],
    status: 'active'
  });
  
  document.getElementById('new-acc-name').value = '';
  document.getElementById('new-acc-user').value = '';
  
  closeModal('addAccount');
  renderAccountsTable();
  if(window.showToast) showToast('تم إنشاء الحساب بنجاح!', 'success');
};
