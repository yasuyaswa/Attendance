// ═══ STATE ═══
let Y,M; // current year/month (1-based)
let D={}; // { "YYYY-MM-DD": status }
let pickerDs=null;
const MONTHS=['January','February','March','April','May','June',
              'July','August','September','October','November','December'];

// ═══ INIT ═══
(function(){
  const t=localStorage.getItem('theme');
  if(t){document.documentElement.setAttribute('data-theme',t);updateBtn();}
  const n=new Date();Y=n.getFullYear();M=n.getMonth()+1;
  initSupabase();
})();

function toggleTheme(){
  const nxt=document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark';
  document.documentElement.setAttribute('data-theme',nxt);
  localStorage.setItem('theme',nxt); updateBtn();
}
function updateBtn(){
  document.getElementById('themeBtn').textContent=
    document.documentElement.getAttribute('data-theme')==='dark'?'🌙':'☀️';
}

// ═══ NAV ═══
function changeMonth(d){M+=d;if(M>12){M=1;Y++;}if(M<1){M=12;Y--;}loadAndRender();}
function goToday(){const n=new Date();Y=n.getFullYear();M=n.getMonth()+1;loadAndRender();}

// ═══ LOAD ═══
async function loadAndRender(){
  setLoad(true);
  try{
    if (window.useLocalStorage) {
      // LocalStorage mode
      const stored = localStorage.getItem('attendance_data');
      D = stored ? JSON.parse(stored) : {};
    } else {
      // Supabase mode
      const { data, error } = await supabaseClient
        .from('attendance')
        .select('*');

      if (error) throw error;

      // Convert array to object: { "2026-03-05": "office", ... }
      D = {};
      if (data) {
        data.forEach(record => {
          D[record.date] = record.status;
        });
      }
    }
  }catch(err){
    console.error('Load error:', err);
    showToast('⚠ Failed to load data', true);
    D={};
  }
  setLoad(false);
  render();
}

// ═══ RENDER ═══
function render(){
  document.getElementById('monthLabel').textContent=`${MONTHS[M-1]} ${Y}`;
  const now=new Date(); const todayStr=ds(now.getFullYear(),now.getMonth()+1,now.getDate());
  const firstDow=new Date(Y,M-1,1).getDay();
  const dim=new Date(Y,M,0).getDate();
  const rows=Math.ceil((firstDow+dim)/7);
  const grid=document.getElementById('calGrid');
  grid.style.gridTemplateRows=`repeat(${rows},1fr)`;
  let h='';
  for(let i=0;i<firstDow;i++) h+=`<div class="cal-cell empty"></div>`;
  for(let d=1;d<=dim;d++){
    const date=ds(Y,M,d);
    const dow=new Date(Y,M-1,d).getDay();
    const wk=dow===0||dow===6;
    const td=date===todayStr;
    const st=wk?'':(D[date]||'');
    let cls='cal-cell';
    if(wk) cls+=' wknd-cell';
    if(td) cls+=' today';
    if(st) cls+=' '+stClass(st);
    h+=`<div class="${cls}" ${wk?'':` onclick="openPicker('${date}',this,event)"`}>
      ${halfBgH(st)}
      <div class="day-num">${d}</div>
      ${tagH(st,wk)}
      ${hdayH(st)}</div>`;
  }
  grid.innerHTML=h;
  stats(dim);
}
function ds(y,m,d){return `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;}
function stClass(s){
  if(s==='office') return 's-office';
  if(s==='wfh')    return 's-wfh';
  if(s==='leave')  return 's-leave';
  if(s.startsWith('holiday')) return 's-hday';
  if(s==='half-am-leave-office') return 's-ham-office';
  if(s==='half-am-leave-wfh')    return 's-ham-wfh';
  if(s==='half-pm-leave-office') return 's-hpm-office';
  if(s==='half-pm-leave-wfh')    return 's-hpm-wfh';
  return '';
}
function tagH(s,wk){
  if(wk)              return `<span class="ctag ct-wknd">Weekend</span>`;
  if(!s)              return '';
  if(s==='office')    return `<span class="ctag ct-office">Office</span>`;
  if(s==='wfh')       return `<span class="ctag ct-wfh">Work from Home</span>`;
  if(s==='leave')     return `<span class="ctag ct-leave">Leave</span>`;
  if(s.startsWith('holiday')) return `<span class="ctag ct-hday">Holiday</span>`;
  if(s==='half-am-leave-office') return `<span class="ctag ct-leave">½ Leave</span><div class="half-spacer"></div><span class="ctag ct-office">Office</span>`;
  if(s==='half-am-leave-wfh')    return `<span class="ctag ct-leave">½ Leave</span><div class="half-spacer"></div><span class="ctag ct-wfh">Work from Home</span>`;
  if(s==='half-pm-leave-office') return `<span class="ctag ct-office">Office</span><div class="half-spacer"></div><span class="ctag ct-leave">½ Leave</span>`;
  if(s==='half-pm-leave-wfh')    return `<span class="ctag ct-wfh">Work from Home</span><div class="half-spacer"></div><span class="ctag ct-leave">½ Leave</span>`;
  return '';
}
function hdayH(s){
  if(!s||!s.startsWith('holiday:')) return '';
  const nm=decodeURIComponent(s.split(':').slice(1).join(':'));
  return `<div class="hday-name">🎌 ${nm}</div>`;
}
function halfBgH(s){ return ''; }

// ═══ STATS + PASS/FAIL ═══
function stats(dim){
  const now=new Date();
  const isCurrentMonth=(Y===now.getFullYear()&&M===now.getMonth()+1);
  const cutoff=isCurrentMonth?now.getDate():dim;

  let work=0,off=0,wfh=0,lv=0,hd=0;       // up to cutoff (today)
  let wAll=0,oAll=0,hAll=0,lAll=0,hdAll=0; // full month
  const hdNames=[];                          // for tooltip

  for(let d=1;d<=dim;d++){
    const dow=new Date(Y,M-1,d).getDay();
    if(dow===0||dow===6) continue;
    wAll++;
    const s=D[ds(Y,M,d)]||'';
    if(s==='office')      oAll+=1;
    else if(s==='wfh')    hAll+=1;
    else if(s==='leave')  lAll+=1;
    else if(s.startsWith('holiday')){
      hdAll+=1;
      const nm=decodeURIComponent(s.split(':').slice(1).join(':'));
      if(nm) hdNames.push({d,nm});
    }
    else if(s==='half-am-leave-office'||s==='half-pm-leave-office'){oAll+=.5;lAll+=.5;}
    else if(s==='half-am-leave-wfh'  ||s==='half-pm-leave-wfh')   {hAll+=.5;lAll+=.5;}
    if(d>cutoff) continue;
    // up-to-today bucket
    work++;
    if(s==='office')         off+=1;
    else if(s==='wfh')       wfh+=1;
    else if(s==='leave')     lv+=1;
    else if(s.startsWith('holiday')) hd+=1;
    else if(s==='half-am-leave-office'||s==='half-pm-leave-office'){off+=.5;lv+=.5;}
    else if(s==='half-am-leave-wfh'  ||s==='half-pm-leave-wfh')   {wfh+=.5;lv+=.5;}
  }

  // display stats — full month
  const unmarked=Math.max(0,Math.round(wAll-oAll-hAll-Math.ceil(lAll)-hdAll));
  document.getElementById('spW').textContent=wAll;
  document.getElementById('spO').textContent=fmt(oAll);
  document.getElementById('spH').textContent=fmt(hAll);
  document.getElementById('spL').textContent=fmt(lAll);
  document.getElementById('spHD').textContent=hdAll;
  document.getElementById('spU').textContent=unmarked;

  // holiday tooltip — fixed-position to escape overflow:hidden parents
  const tip=document.getElementById('hdTip');
  if(tip){
    tip.innerHTML=hdNames.length===0
      ? `<span class="hday-tip-empty">No holidays marked</span>`
      : hdNames.map(({d,nm})=>{
          const lbl=new Date(Y,M-1,d).toLocaleDateString(undefined,{month:'short',day:'numeric'});
          return `<div class="hday-tip-row">🎌 <span>${lbl} — ${nm}</span></div>`;
        }).join('');
  }

  // ── PASS / FAIL ──
  // Current month → judge only days 1..today: eff = adjusted working days up to today
  // Past/future   → judge full month:          eff = full adjusted working days
  let eff, passOff;
  if(isCurrentMonth){
    eff     = Math.max(0, work - hd - lv);
    passOff = off;
  } else {
    eff     = Math.max(0, wAll - hdAll - lAll);
    passOff = oAll;
  }
  const tgt  = eff * 0.6;
  const pass = eff > 0 && passOff >= tgt;
  const pct  = eff > 0 ? Math.round(passOff / eff * 100) : 0;

  // "need N more" is toward full-month 60% target
  const effFull = Math.max(0, wAll - hdAll - lAll);
  const tgtFull = effFull * 0.6;
  const need    = Math.max(0, Math.ceil(tgtFull - passOff));

  const badge=document.getElementById('pfBadge');
  const sub=document.getElementById('pfSub');
  const bar=document.getElementById('pfBar');
  const card=document.getElementById('pfCard');
  badge.className='pf-badge '+(pass?'pass':'fail');
  badge.innerHTML=pass?'✓ PASS':'✗ FAIL';

  if(eff<=0)
    sub.textContent='No working days to evaluate';
  else if(pass && isCurrentMonth)
    sub.textContent=`${fmt(passOff)}/${fmt(eff)} days office so far (≥60% ✓)`;
  else if(pass)
    sub.textContent=`${fmt(passOff)}/${fmt(eff)} office days — target met ✓`;
  else if(isCurrentMonth)
    sub.textContent=`${fmt(passOff)}/${fmt(eff)} days so far — need ${need} more this month`;
  else
    sub.textContent=`${fmt(passOff)}/${fmt(eff)} office days — needed ${fmt(Math.ceil(tgt))} (${pct}%)`;

  card.style.borderColor=pass?'var(--c-pass)':'var(--c-fail)';
  bar.style.width=Math.min(100, tgt>0 ? passOff/tgt*100 : 0)+'%';
  bar.style.background=pass?'linear-gradient(90deg,var(--c-wfh),var(--c-pass))':'linear-gradient(90deg,var(--c-fail),#f97316)';
}
function fmt(n){return n%1===0?n:n.toFixed(1);}

// holiday pill hover — uses fixed positioning to escape overflow:hidden
(function(){
  function initHdPillHover(){
    const pill=document.getElementById('hdPill');
    const tip =document.getElementById('hdTip');
    if(!pill||!tip) return;
    pill.addEventListener('mouseenter',()=>{
      const r=pill.getBoundingClientRect();
      tip.style.top =(r.bottom+8)+'px';
      tip.style.left=(r.left+r.width/2)+'px';
      tip.style.transform='translateX(-50%)';
      tip.classList.add('show');
    });
    pill.addEventListener('mouseleave',()=>tip.classList.remove('show'));
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initHdPillHover);
  else initHdPillHover();
})();

// ═══ PICKER ═══
function openPicker(date,cell,evt){
  evt.stopPropagation(); pickerDs=date;
  const [y,m,d]=date.split('-');
  document.getElementById('phDate').textContent=
    new Date(+y,+m-1,+d).toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric',year:'numeric'});
  // reset panels
  document.getElementById('hdayWrap').classList.remove('show');
  document.getElementById('hpAM').classList.remove('show');
  document.getElementById('hpPM').classList.remove('show');
  document.getElementById('hdayName').value='';
  // highlight
  const cur=D[date]||'';
  document.querySelectorAll('.opt').forEach(e=>e.classList.remove('active'));
  if(cur==='office')  document.querySelector('.opt-office').classList.add('active');
  else if(cur==='wfh')   document.querySelector('.opt-wfh').classList.add('active');
  else if(cur==='leave') document.querySelector('.opt-leave').classList.add('active');
  else if(cur.startsWith('holiday')){
    document.querySelector('.opt-holiday').classList.add('active');
    document.getElementById('hdayWrap').classList.add('show');
    document.getElementById('hdayName').value=decodeURIComponent(cur.split(':').slice(1).join(':'));
  }
  // position
  const pk=document.getElementById('picker');
  const r=cell.getBoundingClientRect();
  const pw=278,ph=500;
  let left=r.left+r.width/2-pw/2,top=r.bottom+8;
  if(left<8) left=8;
  if(left+pw>window.innerWidth-8) left=window.innerWidth-pw-8;
  if(top+ph>window.innerHeight-8) top=Math.max(8,r.top-ph-8);
  pk.style.left=left+'px'; pk.style.top=top+'px';
  document.getElementById('overlay').classList.add('open');
  requestAnimationFrame(()=>pk.classList.add('visible'));
}
function closePicker(){
  document.getElementById('picker').classList.remove('visible');
  document.getElementById('overlay').classList.remove('open');
  setTimeout(()=>{pickerDs=null;},200);
}
function toggleHdayInput(){
  const w=document.getElementById('hdayWrap');
  const s=w.classList.toggle('show');
  document.getElementById('hpAM').classList.remove('show');
  document.getElementById('hpPM').classList.remove('show');
  if(s) setTimeout(()=>document.getElementById('hdayName').focus(),50);
}
function toggleHalf(h){
  const am=document.getElementById('hpAM'),pm=document.getElementById('hpPM');
  document.getElementById('hdayWrap').classList.remove('show');
  if(h==='am'){am.classList.toggle('show');pm.classList.remove('show');}
  else        {pm.classList.toggle('show');am.classList.remove('show');}
}
function saveHday(){
  const nm=document.getElementById('hdayName').value.trim();
  if(!nm){document.getElementById('hdayName').focus();return;}
  setStatus('holiday:'+encodeURIComponent(nm));
}

async function setStatus(status){
  if(!pickerDs) return;
  const date=pickerDs; closePicker();
  setLoad(true);

  try{
    if (window.useLocalStorage) {
      // LocalStorage mode
      if(status){
        D[date] = status;
      } else {
        delete D[date];
      }
      localStorage.setItem('attendance_data', JSON.stringify(D));
    } else {
      // Supabase mode
      if(status){
        // Insert or update
        const { data: existing } = await supabaseClient
          .from('attendance')
          .select('id')
          .eq('date', date)
          .single();

        if(existing){
          // Update existing
          await supabaseClient
            .from('attendance')
            .update({ status })
            .eq('date', date);
        } else {
          // Insert new
          await supabaseClient
            .from('attendance')
            .insert({ date, status });
        }
      } else {
        // Delete
        await supabaseClient
          .from('attendance')
          .delete()
          .eq('date', date);
      }
    }

    // Update local display
    render(); showToast(toastMsg(status));
  }catch(err){
    console.error('❌ Save error:', err);
    showToast('⚠ Failed to save',true);
  }
  setLoad(false);
}
function toastMsg(s){
  if(!s)                         return '✓ Day cleared';
  if(s==='office')               return '🏢 Office — full day';
  if(s==='wfh')                  return '🏠 Work From Home — full day';
  if(s==='leave')                return '🏖 Full Day Leave';
  if(s.startsWith('holiday'))    return `🎌 Holiday: ${decodeURIComponent(s.split(':').slice(1).join(':'))}`;
  if(s==='half-am-leave-office') return '🌅 AM Leave + PM Office';
  if(s==='half-am-leave-wfh')    return '🌅 AM Leave + PM WFH';
  if(s==='half-pm-leave-office') return '🌆 AM Office + PM Leave';
  if(s==='half-pm-leave-wfh')    return '🌆 AM WFH + PM Leave';
  return '✓ Saved';
}

// ═══ HELPERS ═══
function setLoad(on){document.getElementById('loadingVeil').classList.toggle('show',on);}
let toastT;
function showToast(msg,err){
  const el=document.getElementById('toast');
  el.textContent=msg; el.style.borderColor=err?'var(--c-fail)':'var(--border)';
  el.classList.add('show'); clearTimeout(toastT);
  toastT=setTimeout(()=>el.classList.remove('show'),2500);
}

// ═══ ABOUT PANEL ═══
let aboutLoaded=false;
function toggleAbout(){
  const overlay=document.getElementById('aboutOverlay');
  const modal=document.getElementById('aboutModal');
  const isOpen=overlay.classList.toggle('open');
  modal.classList.toggle('visible',isOpen);
  if(isOpen && !aboutLoaded){
    fetch('./README.md').then(r=>r.text()).then(t=>{
      document.getElementById('aboutContent').textContent=t;
      aboutLoaded=true;
    }).catch(()=>{
      document.getElementById('aboutContent').textContent='Unable to load documentation.';
    });
  }
}

// ═══ LOCALSTORAGE FALLBACK ═══
function initLocalStorage() {
  console.log('💾 Initializing localStorage fallback...');
  // Load any existing data
  loadAndRender();
}
