function switchTab(name){document.querySelectorAll('.tab-content').forEach(t=>t.classList.remove('visible'));document.getElementById('tab-'+name).classList.add('visible');}
function setActive(el){document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));el.classList.add('active');}
function toggleOpt(el){el.classList.toggle('on');}

async function runGuard(){
  const promptEl=document.getElementById('promptInput');
  const prompt=promptEl.value.trim();
  if(!prompt){promptEl.placeholder='⚠ Enter a prompt first!';return;}

  const area=document.getElementById('outputArea');
  const bar=document.getElementById('progressBar');
  const logEl=document.getElementById('outputLog');
  const status=document.getElementById('outputStatus');
  const btn=document.getElementById('generateBtn');
  const options={};
  document.querySelectorAll('.prompt-opt').forEach(el=>{options[el.dataset.opt]=el.classList.contains('on');});

  area.classList.add('visible');
  logEl.textContent='';
  bar.style.width='15%';
  status.innerHTML='<span class="spin">⟳</span> Running Gaurd...';
  btn.disabled=true;

  try{
    const res=await fetch('/generate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt,options})});
    bar.style.width='70%';
    const data=await res.json();
    if(!res.ok){
      const setupText=data.setup ? `\n\n${data.setup}` : '';
      throw new Error((data.error||'Generation failed') + setupText);
    }
    logEl.textContent=data.script;
    status.textContent='Complete';
    bar.style.width='100%';
  }catch(err){
    status.textContent='Error';
    logEl.textContent=`❌ ${err.message}`;
    bar.style.width='0%';
  }finally{btn.disabled=false;}
}
