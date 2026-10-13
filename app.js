(() => {
  const data=window.PORTFOLIO, projects=data.projects||[], root=document.getElementById('app');
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safe=u=>/^(assets\/|https:\/\/|mailto:)/.test(u||'')?esc(u):'#';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let dark=localStorage.getItem('folio-theme')==='dark',sound=false,audioContext,clockFrame,clockTimer,scrollFrame;
  document.body.classList.toggle('dark',dark);
  function route(){
    const parts=location.hash.replace(/^#\/?/,'').split('/').filter(Boolean);
    if(parts[0]==='about')return{page:'about'};
    if(parts[0]==='playground')return{page:'playground'};
    if(parts[0]==='work'&&parts[1]){const project=projects.find(p=>p.id===decodeURIComponent(parts[1]));if(project)return{page:'detail',project}}
    return{page:'work'};
  }
  const image=(p,cls='')=>`<img class="${cls}" src="${safe(p.image)}" alt="${esc(p.title)} 项目封面" loading="lazy">`;
  function nav(page){return `<nav class="site-nav" aria-label="主导航"><div class="nav-links"><a href="#/" class="${page==='work'||page==='detail'?'active':''}">WORK</a><a href="#/about" class="${page==='about'?'active':''}">ABOUT</a><a href="#/playground" class="${page==='playground'?'active':''}">PLAYGROUND</a></div>${data.email?`<a class="mail-link" href="mailto:${esc(data.email)}">${esc(data.email)} ↗</a>`:`<span class="mail-link">${esc(data.name)}</span>`}</nav>`}
  function left(page){
    const body=page==='work'||page==='detail'
      ?'<div class="orbit-clock" aria-label="上海时间动态时钟"><canvas id="orbit-canvas" aria-hidden="true"></canvas><time id="clock-time">--:--</time></div>'
      :page==='about'
        ?'<div class="left-message" aria-hidden="true">Beyond<br><em>the screen.</em></div>'
        :`<div class="left-playground"><h1>Playground</h1><p>想法、试验与未完的灵感。<br>为好奇心留一点空间。</p><span>08<small> / EXPLORATIONS</small></span></div>`;
    return `<aside class="panel left-panel"><div class="left-top mono">${esc(data.location)}</div><div class="left-center">${body}</div><div class="left-bottom mono"><button id="theme-toggle" type="button" aria-pressed="${dark}" aria-label="切换颜色"><i class="toggle-mark" aria-hidden="true"></i><span>${dark?'NORMAL':'INVERT'} COLOR</span></button><button id="sound-toggle" type="button" aria-pressed="${sound}" aria-label="${sound?'关闭':'开启'}交互音效">SOUND: <span class="sound-wave" aria-hidden="true">⌁</span></button></div></aside>`;
  }
  function work(){
    const order=[projects[0],projects[2],projects[3],projects[1]];
    return `<section class="gallery-intro" aria-label="作品预览"><div class="collage" aria-hidden="true">${order.map((p,i)=>`<div class="collage-image collage-${i+1}">${image(p)}</div>`).join('')}</div><div class="intro-hint mono">SCROLL TO EXPLORE <span>↓</span></div></section><div class="gallery" role="list" aria-label="精选作品">${projects.map((p,i)=>`<section class="gallery-item" role="listitem" data-index="${i}"><a class="gallery-image-link" href="#/work/${encodeURIComponent(p.id)}" aria-label="查看 ${esc(p.title)} 项目详情">${image(p,'gallery-image')}<span class="gallery-dim"></span><span class="gallery-overlay"><span class="gallery-number mono">${esc(p.number)}</span><span class="gallery-category">${esc(p.category)}</span><span class="gallery-title">${esc(p.title)}</span><span class="gallery-year mono">${esc(p.year)}</span><span class="gallery-more mono">SEE DETAILS ↗</span></span></a></section>`).join('')}</div><div class="gallery-end"><span class="mono">END OF SELECTED WORK</span><a href="#/about">GET TO KNOW ME ↗</a></div><div class="project-rail" aria-hidden="true"><span id="rail-count">00</span><div class="rail-lines">${projects.map(()=>'<i></i>').join('')}</div><span>0${projects.length}</span></div>`;
  }
  function about(){return `<div class="about-content"><h1>${esc(data.aboutTitle).replace('\n','<br>')}</h1><div class="about-row"><span class="mono">INFO</span><div>${data.about.map(s=>`<p>${esc(s)}</p>`).join('')}</div></div><div class="about-row"><span class="mono">EXPERIENCES</span><div>${data.experience.map(e=>`<div class="experience"><time>${esc(e.period)}</time><span>${esc(e.label)}</span></div>`).join('')}</div></div><div class="about-row"><span class="mono">CAPABILITIES</span><div class="chips">${data.focus.map(s=>`<span>${esc(s)}</span>`).join('')}</div></div>${data.email||data.social.length?`<div class="about-row"><span class="mono">LET'S TALK</span><div>${data.email?`<a class="big-mail" href="mailto:${esc(data.email)}">${esc(data.email)} ↗</a>`:''}<div class="socials">${data.social.map(s=>`<a href="${safe(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)} ↗</a>`).join('')}</div></div></div>`:''}</div>`}
  function playground(){const tiles=[projects[2],projects[0],projects[1],projects[3],projects[0],projects[2],projects[3],projects[1]];return `<div class="play-grid" aria-label="设计实验">${tiles.map((p,i)=>`<button class="play-tile play-tile-${i%5}" data-preview="${esc(p.id)}" type="button" aria-label="预览 ${esc(p.title)}">${image(p)}<span class="mono">0${i+1} / ${esc(p.category)}</span></button>`).join('')}</div><dialog id="preview-dialog" class="preview-dialog"><button class="close-preview mono" aria-label="关闭预览" type="button">CLOSE ×</button><div class="preview-image"></div><div class="preview-caption"></div></dialog>`}
  function detail(p){const next=projects[(projects.indexOf(p)+1)%projects.length];return `<article class="detail-content"><a class="back-link mono" href="#/">← BACK TO WORK</a><span class="mono detail-index">PROJECT ${esc(p.number)} / ${esc(p.year)}</span><h1>${esc(p.title)}</h1><p class="detail-summary">${esc(p.summary)}</p><div class="detail-hero">${image(p)}</div><div class="about-row"><span class="mono">PROJECT TYPE</span><p>${esc(p.category)}</p></div><div class="about-row"><span class="mono">EXPLORATION</span><div><p>${esc(p.summary)}</p><div class="chips">${p.tags.map(t=>`<span>${esc(t)}</span>`).join('')}</div></div></div><div class="about-row"><span class="mono">NOTE</span><p>这是可编辑的作品集示例。你可以在 content.js 中替换项目背景、过程、成果和封面图片。</p></div><div class="detail-next"><a href="#/">← ALL WORK</a><a href="#/work/${encodeURIComponent(next.id)}">NEXT PROJECT ↗</a></div></article>`}
  function render(){
    cancelAnimationFrame(clockFrame);cancelAnimationFrame(scrollFrame);clearInterval(clockTimer);
    const current=route(),page=current.page;
    document.title=`${page==='work'?'作品':page==='detail'?current.project.title:page==='about'?'关于':'实验室'} — ${data.name}`;
    root.innerHTML=`<div class="site">${left(page)}<main class="panel right-panel" id="main" tabindex="-1">${nav(page)}${page==='work'?work():page==='about'?about():page==='playground'?playground():detail(current.project)}</main></div><div id="page-wipe" aria-hidden="true"></div>`;
    document.getElementById('theme-toggle').addEventListener('click',toggleTheme);
    document.getElementById('sound-toggle').addEventListener('click',toggleSound);
    document.querySelectorAll('a,button').forEach(el=>el.addEventListener('click',ping));
    if(page==='work')initGallery();
    if(page==='work'||page==='detail')initClock();
    if(page==='playground')initPreviews();
    if(!reduced){const wipe=document.getElementById('page-wipe');wipe.classList.add('wipe-active')}
  }
  function toggleTheme(){dark=!dark;document.body.classList.toggle('dark',dark);localStorage.setItem('folio-theme',dark?'dark':'light');const b=document.getElementById('theme-toggle');b.setAttribute('aria-pressed',String(dark));b.querySelector('span').textContent=`${dark?'NORMAL':'INVERT'} COLOR`}
  function toggleSound(){sound=!sound;const b=document.getElementById('sound-toggle');b.setAttribute('aria-pressed',String(sound));b.setAttribute('aria-label',sound?'关闭交互音效':'开启交互音效');ping()}
  function ping(){if(!sound)return;try{audioContext||=new(window.AudioContext||window.webkitAudioContext)();const o=audioContext.createOscillator(),g=audioContext.createGain();o.type='sine';o.frequency.setValueAtTime(650,audioContext.currentTime);o.frequency.exponentialRampToValueAtTime(420,audioContext.currentTime+.08);g.gain.setValueAtTime(.025,audioContext.currentTime);g.gain.exponentialRampToValueAtTime(.0001,audioContext.currentTime+.09);o.connect(g).connect(audioContext.destination);o.start();o.stop(audioContext.currentTime+.1)}catch(_){}}
  function initClock(){
    const canvas=document.getElementById('orbit-canvas'),time=document.getElementById('clock-time');if(!canvas)return;const ctx=canvas.getContext('2d');
    const update=()=>{time.textContent=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Shanghai',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date())};update();clockTimer=setInterval(update,1000);
    const draw=()=>{
      if(!canvas.isConnected)return;const box=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2),w=box.width,h=box.height;
      if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr)}
      ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
      const cx=w*.5,cy=h*.51,r=Math.min(w,h)*.4,phase=reduced?0:Date.now()/55000,ink=dark?'221,213,206':'82,73,67';
      for(let i=0;i<60;i++){
        const a=i*Math.PI*2/60-Math.PI*.5+phase,x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r,q=a+.48+Math.sin(phase*1.6+i*.09)*.075;
        ctx.beginPath();ctx.moveTo(cx,cy);ctx.bezierCurveTo(cx+Math.cos(q)*r*.23,cy+Math.sin(q)*r*.28,cx+Math.cos(a-.55)*r*.66,cy+Math.sin(a-.55)*r*.74,x,y);
        ctx.strokeStyle=`rgba(${ink},${i%5===0?.31:.16})`;ctx.lineWidth=.65;ctx.stroke();
        ctx.fillStyle=i===new Date().getSeconds()?'#f05a24':`rgba(${ink},.62)`;ctx.font='9px "DM Mono",monospace';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(String(i).padStart(2,'0'),cx+Math.cos(a)*(r+14),cy+Math.sin(a)*(r+14));
      }
      if(!reduced)clockFrame=requestAnimationFrame(draw);
    };draw();
  }
  function initGallery(){
    const panel=document.getElementById('main'),items=[...panel.querySelectorAll('.gallery-item')],intro=panel.querySelector('.gallery-intro'),rail=document.getElementById('rail-count');
    const update=()=>{
      const viewport=panel.clientHeight,center=viewport*.5,panelRect=panel.getBoundingClientRect(),introRect=intro.getBoundingClientRect();
      intro.style.setProperty('--intro-progress',Math.min(1,Math.max(0,(panelRect.top-introRect.top)/Math.max(1,viewport))).toFixed(3));
      let closest=Infinity,active=-1;
      items.forEach((item,i)=>{const r=item.getBoundingClientRect(),mid=r.top-panelRect.top+r.height/2,distance=Math.abs(mid-center),proximity=Math.max(0,1-distance/(viewport*.95));item.style.setProperty('--focus',proximity.toFixed(3));if(distance<closest){closest=distance;active=i}});
      const selected=panel.scrollTop<viewport*.6?-1:active;
      items.forEach((item,i)=>item.classList.toggle('is-current',i===selected));rail.textContent=selected<0?'00':String(selected+1).padStart(2,'0');
      document.querySelectorAll('.rail-lines i').forEach((n,i)=>n.classList.toggle('active',i===selected));scrollFrame=0;
    };
    panel.addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(update)},{passive:true});window.addEventListener('resize',update,{once:true});update();
  }
  function initPreviews(){
    const dialog=document.getElementById('preview-dialog');
    document.querySelectorAll('[data-preview]').forEach(btn=>btn.addEventListener('click',()=>{const p=projects.find(item=>item.id===btn.dataset.preview);if(!p)return;dialog.querySelector('.preview-image').innerHTML=image(p);dialog.querySelector('.preview-caption').textContent=`${p.number} / ${p.title}`;dialog.showModal()}));
    dialog.querySelector('.close-preview').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
  }
  window.addEventListener('hashchange',render);render();
  const loader=document.getElementById('intro-loader');if(loader)setTimeout(()=>loader.classList.add('is-done'),reduced?0:900);
})();
