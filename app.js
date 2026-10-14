(() => {
  const data=window.PORTFOLIO, projects=data.projects||[], root=document.getElementById('app');
  const timeline=[...projects].sort((a,b)=>Number(b.year)-Number(a.year)||Number(b.number)-Number(a.number));
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safe=u=>/^(assets\/|https:\/\/|mailto:)/.test(u||'')?esc(u):'#';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let dark=localStorage.getItem('folio-theme')==='dark',sound=false,audioContext,clockFrame,clockTimer,scrollFrame,galleryAbort,projectKeyHandler,motionCleanup;
  document.body.classList.toggle('dark',dark);
  function route(){
    const parts=location.hash.replace(/^#\/?/,'').split('/').filter(Boolean);
    if(parts[0]==='about')return{page:'about'};
    if(parts[0]==='playground')return{page:'playground'};
    if(parts[0]==='work'&&parts[1]){const project=projects.find(p=>p.id===decodeURIComponent(parts[1]));if(project)return{page:'detail',project}}
    return{page:'work'};
  }
  const image=(p,cls='')=>`<img class="${cls}" src="${safe(p.image)}" alt="${esc(p.title)} · 设计社区视觉参考，作者 ${esc(p.reference?.author||'')}" loading="lazy">`;
  function nav(page){return `<nav class="site-nav" aria-label="主导航"><div class="nav-links"><a href="#/" class="${page==='work'||page==='detail'?'active':''}">作品</a><a href="#/about" class="${page==='about'?'active':''}">关于</a><a href="#/playground" class="${page==='playground'?'active':''}">实验室</a></div>${data.email?`<a class="mail-link" href="mailto:${esc(data.email)}">${esc(data.email)} ↗</a>`:`<span class="mail-link">${esc(data.name)}</span>`}</nav>`}
  function left(page){
    const body=page==='work'||page==='detail'
      ?'<div class="orbit-clock" aria-label="上海时间动态时钟"><canvas id="orbit-canvas" aria-hidden="true"></canvas><time id="clock-time">--:--</time></div>'
      :page==='about'
        ?'<div class="left-message" aria-hidden="true">不止于<br><em>屏幕之间。</em></div>'
        :`<div class="left-playground"><div class="play-kicker mono">九月十五 / 视觉实验</div><h1 class="play-title" aria-label="灵感实验室">${[...'灵感实验室'].map((letter,i)=>`<span aria-hidden="true" style="--letter:${i}">${letter}</span>`).join('')}</h1><p>想法、试验与未完的灵感。<br>为好奇心留一点空间。</p><div class="play-counter" aria-label="8 个视觉片段"><div class="play-digits" aria-hidden="true">${[0,1].map(i=>`<span class="play-digit-window"><span class="play-reel" data-place="${i}">${Array.from({length:10},(_,n)=>`<span>${n}</span>`).join('')}</span></span>`).join('')}</div><div class="play-counter-caption mono">片段 <span id="play-count-label">00</span> / 08</div></div></div>`;
    return `<aside class="panel left-panel"><div class="left-top mono">${esc(data.location)}</div><div class="left-center">${body}</div><div class="left-bottom mono"><button id="theme-toggle" type="button" aria-pressed="${dark}" aria-label="切换颜色"><i class="toggle-mark" aria-hidden="true"></i><span>${dark?'恢复浅色':'切换深色'}</span></button><button id="sound-toggle" type="button" aria-pressed="${sound}" aria-label="${sound?'关闭':'开启'}交互音效">音效：<span class="sound-wave" aria-hidden="true">⌁</span></button></div></aside>`;
  }
  function projectRows(index){
    const start=Math.max(0,Math.min(index-1,timeline.length-3));
    return `<span class="project-rows">${timeline.slice(start,start+3).map(p=>{
      return `<span class="project-row ${p===timeline[index]?'selected':''}"><span class="project-kind">${esc(p.category)}</span><span class="project-rule" aria-hidden="true"></span><span class="project-name">${esc(p.title)}</span><span class="project-date mono">${esc(p.year)}</span></span>`;
    }).join('')}</span>`;
  }
  function work(){
    return `<section class="gallery-intro" aria-label="精选作品集合"><div class="intro-heading mono"><span>精选作品 / 共 ${timeline.length} 项</span><span>${esc(timeline[0]?.year||'')} — ${esc(timeline[timeline.length-1]?.year||'')}</span></div><div class="collage">${timeline.map((p,i)=>`<button class="collage-image collage-${i+1}" data-jump="${i}" type="button" aria-label="展开 ${esc(p.title)} 封面">${image(p)}<span class="collage-caption mono">${esc(p.number)} / ${esc(p.category)} · 视觉参考</span></button>`).join('')}</div><div class="intro-hint mono">向下滚动查看时间线 <span>↓</span></div></section><div class="gallery" role="list" aria-label="按时间倒序的精选作品">${timeline.map((p,i)=>`<section class="gallery-item" role="listitem" data-index="${i}"><button class="gallery-image-link" data-cover="${i}" type="button" aria-label="展开 ${esc(p.title)} 封面，再次点击查看详情">${image(p,'gallery-image')}<span class="cover-credit mono">视觉参考 / ${esc(p.reference?.author||'原作者')}</span><span class="gallery-dim"></span><span class="gallery-overlay"><span class="gallery-index mono">${esc(p.number)} / 0${timeline.length}</span>${projectRows(i)}<span class="gallery-more mono">再次点击查看详情 ↗</span></span></button></section>`).join('')}</div><div class="gallery-end"><span class="mono">精选作品已浏览完毕</span><a href="#/about">了解更多 ↗</a></div><div class="project-rail" aria-hidden="true"><span id="rail-count">00</span><div class="rail-lines">${timeline.map(()=>'<i></i>').join('')}</div><span>0${timeline.length}</span></div><div class="cursor-marker" aria-hidden="true"></div>`;
  }
  function about(){return `<div class="about-content"><h1>${esc(data.aboutTitle).replace('\n','<br>')}</h1><div class="about-row"><span class="mono">简介</span><div>${data.about.map(s=>`<p>${esc(s)}</p>`).join('')}</div></div><div class="about-row"><span class="mono">经历</span><div>${data.experience.map(e=>`<div class="experience"><time>${esc(e.period)}</time><span>${esc(e.label)}</span></div>`).join('')}</div></div><div class="about-row"><span class="mono">擅长领域</span><div class="chips">${data.focus.map(s=>`<span>${esc(s)}</span>`).join('')}</div></div>${data.email||data.social.length?`<div class="about-row"><span class="mono">联系我</span><div>${data.email?`<a class="big-mail" href="mailto:${esc(data.email)}">${esc(data.email)} ↗</a>`:''}<div class="socials">${data.social.map(s=>`<a href="${safe(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)} ↗</a>`).join('')}</div></div></div>`:''}</div>`}
  function playground(){
    const tiles=timeline.flatMap(p=>[{p,src:p.image,kind:'参考',credit:p.reference?.author||'原作者'},{p,src:p.gallery?.[1]?.src||p.image,kind:'示意',credit:'界面示意'}]);
    return `<div class="play-grid" aria-label="设计实验，滚动查看八个视觉片段">${tiles.map((tile,i)=>`<button class="play-tile play-tile-${i%5}" data-preview="${esc(tile.p.id)}" data-shot="${i+1}" data-kind="${tile.kind}" type="button" aria-label="预览 ${esc(tile.p.title)} ${tile.kind==='参考'?'视觉参考':'界面示意'}"><img src="${safe(tile.src)}" alt="" loading="lazy"><span class="mono">片段 ${String(i+1).padStart(2,'0')} / ${esc(tile.p.title)} · ${esc(tile.credit)}</span></button>`).join('')}</div><dialog id="preview-dialog" class="preview-dialog"><button class="close-preview mono" aria-label="关闭预览" type="button">关闭 ×</button><div class="preview-image"></div><div class="preview-caption"></div><a class="preview-source mono" target="_blank" rel="noopener noreferrer">查看原始参考 ↗</a></dialog>`;
  }
  function closeProject(){
    const view=document.getElementById('project-view');if(!view)return;
    if(projectKeyHandler){window.removeEventListener('keydown',projectKeyHandler);projectKeyHandler=null}
    const done=()=>{view.remove();document.body.classList.remove('project-open');if(route().page==='detail')location.hash='#/'};
    if(window.FolioMotion)window.FolioMotion.projectClose(view,done);else done();
  }
  function showProject(p,fromDeepLink=false){
    const previous=document.getElementById('project-view');if(previous)window.FolioMotion?.projectDispose(previous);
    document.getElementById('project-view')?.remove();
    if(projectKeyHandler)window.removeEventListener('keydown',projectKeyHandler);
    const next=timeline[(timeline.indexOf(p)+1)%timeline.length];
    const gallery=(p.gallery?.length?p.gallery:[{src:p.image,layout:'wide',caption:p.title}]);
    const view=document.createElement('div');view.id='project-view';view.className='project-view';view.setAttribute('role','dialog');view.setAttribute('aria-modal','true');view.setAttribute('aria-label',`${p.title} 项目详情`);
    view.innerHTML=`<section class="project-info"><div class="project-info-top mono">项目 ${esc(p.number)} / 0${timeline.length} <span>${esc(p.year)}</span></div><div class="project-info-body"><p class="mono project-kicker">精选作品 / ${esc(p.category)}</p><h1>${esc(p.title)}</h1><p class="project-summary">${esc(p.summary)}</p>${p.reference?`<div class="project-reference"><span class="mono">视觉参考 / 设计社区</span><p>封面为 ${esc(p.reference.author)} 的视觉参考，并非本项目设计交付。</p><a href="${safe(p.reference.url)}" target="_blank" rel="noopener noreferrer">查看原作品 ↗</a></div>`:''}<div class="project-facts"><div><span>年份</span><strong>${esc(p.year)}</strong></div><div><span>类型</span><strong>${esc(p.category)}</strong></div><div><span>职责</span><strong>${esc(p.role||'设计')}</strong></div><div><span>领域</span><strong>${esc(p.sector||'—')}</strong></div></div></div><span class="project-info-foot mono">滚动浏览作品 ↓</span></section><section class="project-media" tabindex="0" aria-label="${esc(p.title)} 项目图片，可滚动"><div class="project-media-inner"><div class="project-media-heading mono"><span>${esc(p.title)} / 图片目录</span><span>${String(gallery.length).padStart(2,'0')} 张图片</span></div><div class="project-image-grid">${gallery.map((item,i)=>`<figure class="project-frame ${item.layout==='pair'?'pair':'wide'}"><img src="${safe(item.src)}" alt="${esc(p.title)} 项目画面 ${i+1}：${esc(item.caption||'')}" loading="${i===0?'eager':'lazy'}"><figcaption class="mono"><span>${String(i+1).padStart(2,'0')} / ${String(gallery.length).padStart(2,'0')}</span>${item.source?`<a href="${safe(item.source)}" target="_blank" rel="noopener noreferrer">${esc(item.caption||'')} ↗</a>`:`<span>${esc(item.caption||'')}</span>`}</figcaption></figure>`).join('')}</div><button class="project-next" type="button" data-next="${esc(next.id)}" aria-label="查看下一个项目 ${esc(next.title)}"><span class="mono">下一个项目 ↗ <b>${esc(next.year)}</b></span><img src="${safe(next.image)}" alt="${esc(next.title)} 项目封面" loading="lazy"><span class="project-next-name">${esc(next.title)}</span><span class="next-credit mono">视觉参考 / ${esc(next.reference?.author||'原作者')}</span></button></div></section><button class="project-close mono" type="button" aria-label="关闭项目详情">×</button>`;
    root.appendChild(view);document.body.classList.add('project-open');
    window.FolioMotion?.projectOpen(view);
    view.querySelector('.project-close').addEventListener('click',closeProject);
    view.querySelector('.project-next').addEventListener('click',()=>showProject(next));
    projectKeyHandler=e=>{if(e.key==='Escape')closeProject()};window.addEventListener('keydown',projectKeyHandler);
    view.querySelector('.project-close').focus({preventScroll:true});
    if(fromDeepLink){const index=timeline.indexOf(p);document.querySelector(`.gallery-item[data-index="${index}"]`)?.classList.add('is-locked')}
  }
  function render(){
    cancelAnimationFrame(clockFrame);cancelAnimationFrame(scrollFrame);clearInterval(clockTimer);
    motionCleanup?.();motionCleanup=null;
    galleryAbort?.abort();galleryAbort=null;
    if(projectKeyHandler){window.removeEventListener('keydown',projectKeyHandler);projectKeyHandler=null}document.body.classList.remove('project-open');
    const current=route(),page=current.page;
    document.title=`${page==='work'?'作品':page==='detail'?current.project.title:page==='about'?'关于':'实验室'} — ${data.name}`;
    root.innerHTML=`<div class="site">${left(page)}<main class="panel right-panel" id="main" tabindex="-1">${nav(page)}${page==='work'||page==='detail'?work():page==='about'?about():playground()}</main></div><div id="page-wipe" aria-hidden="true"></div>`;
    document.getElementById('theme-toggle').addEventListener('click',toggleTheme);
    document.getElementById('sound-toggle').addEventListener('click',toggleSound);
    document.querySelectorAll('a,button').forEach(el=>el.addEventListener('click',ping));
    if(page==='work'||page==='detail')initGallery();
    if(page==='work'||page==='detail')initClock();
    if(page==='playground')initPreviews();
    if(page==='detail')showProject(current.project,true);
    motionCleanup=window.FolioMotion?.init(root,page);
    if(!reduced){const wipe=document.getElementById('page-wipe');wipe.classList.add('wipe-active')}
  }
  function toggleTheme(){dark=!dark;document.body.classList.toggle('dark',dark);localStorage.setItem('folio-theme',dark?'dark':'light');const b=document.getElementById('theme-toggle');b.setAttribute('aria-pressed',String(dark));b.querySelector('span').textContent=`${dark?'恢复浅色':'切换深色'}`}
  function toggleSound(){sound=!sound;const b=document.getElementById('sound-toggle');b.setAttribute('aria-pressed',String(sound));b.setAttribute('aria-label',sound?'关闭交互音效':'开启交互音效');ping()}
  function ping(){if(!sound)return;try{audioContext||=new(window.AudioContext||window.webkitAudioContext)();const o=audioContext.createOscillator(),g=audioContext.createGain();o.type='sine';o.frequency.setValueAtTime(650,audioContext.currentTime);o.frequency.exponentialRampToValueAtTime(420,audioContext.currentTime+.08);g.gain.setValueAtTime(.025,audioContext.currentTime);g.gain.exponentialRampToValueAtTime(.0001,audioContext.currentTime+.09);o.connect(g).connect(audioContext.destination);o.start();o.stop(audioContext.currentTime+.1)}catch(_){}}
  function initClock(){
    const canvas=document.getElementById('orbit-canvas'),time=document.getElementById('clock-time');if(!canvas)return;const ctx=canvas.getContext('2d');
    const update=()=>{time.textContent=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Shanghai',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date())};update();clockTimer=setInterval(update,1000);
    const draw=()=>{
      if(!canvas.isConnected)return;const box=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2),w=box.width,h=box.height;
      if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr)}
      ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
      const cx=w*.5,cy=h*.51,r=Math.min(w,h)*.39,phase=reduced?0:Date.now()/10500,ink=dark?'220,211,204':'80,71,66';
      for(let i=0;i<60;i++){
        const a=i*Math.PI*2/60-Math.PI*.5,x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r;
        const twist=a+.82+Math.sin(phase+i*.06)*.22,sx=cx+Math.cos(twist)*r*.12,sy=cy+Math.sin(twist)*r*.12;
        const bend=a-.55+Math.sin(phase*.72+i*.08)*.16;
        ctx.beginPath();ctx.moveTo(sx,sy);ctx.quadraticCurveTo(cx+Math.cos(bend)*r*.52,cy+Math.sin(bend)*r*.52,x,y);
        ctx.strokeStyle=`rgba(${ink},${i%5===0?.22:.13})`;ctx.lineWidth=.6;ctx.stroke();
        ctx.fillStyle=`rgba(${ink},.63)`;ctx.font='8px "DM Mono",monospace';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(String(i).padStart(2,'0'),cx+Math.cos(a)*(r+15),cy+Math.sin(a)*(r+15));
      }
      const second=new Date().getSeconds(),sa=second*Math.PI*2/60-Math.PI*.5;
      ctx.beginPath();ctx.arc(cx+Math.cos(sa)*(r+29),cy+Math.sin(sa)*(r+29),2.2,0,Math.PI*2);ctx.fillStyle='#f45b2b';ctx.fill();
      if(!reduced)clockFrame=requestAnimationFrame(draw);
    };draw();
  }
  function initGallery(){
    const panel=document.getElementById('main'),items=[...panel.querySelectorAll('.gallery-item')],intro=panel.querySelector('.gallery-intro'),rail=document.getElementById('rail-count'),cursor=panel.querySelector('.cursor-marker');
    galleryAbort=new AbortController();const signal=galleryAbort.signal;
    const update=()=>{
      const mobile=matchMedia('(max-width:650px)').matches,viewport=mobile?window.innerHeight:panel.clientHeight,center=viewport*.5,panelRect=panel.getBoundingClientRect(),introRect=intro.getBoundingClientRect();
      const introTravel=mobile?-introRect.top:panelRect.top-introRect.top;
      intro.style.setProperty('--intro-progress',Math.min(1,Math.max(0,introTravel/Math.max(1,viewport))).toFixed(3));
      let closest=Infinity,active=-1;
      items.forEach((item,i)=>{const r=item.getBoundingClientRect(),mid=(mobile?r.top:r.top-panelRect.top)+r.height/2,distance=Math.abs(mid-center),proximity=Math.max(0,1-distance/(viewport*.65));const focus=proximity*proximity*(3-2*proximity),smallW=Math.min(panel.clientWidth*.46,430),fullH=mobile?r.height:viewport,smallH=Math.min(fullH*.62,570);item.style.setProperty('--focus',focus.toFixed(3));item.style.setProperty('--card-w',`${Math.round(smallW+(panel.clientWidth-smallW)*focus)}px`);item.style.setProperty('--card-h',`${Math.round(smallH+(fullH-smallH)*focus)}px`);item.style.setProperty('--label-opacity',Math.max(0,Math.min(1,(focus-.48)*3)).toFixed(3));if(distance<closest){closest=distance;active=i}});
      const selected=(mobile?introRect.bottom>viewport*.55:panel.scrollTop<intro.offsetHeight*.55)?-1:active;
      items.forEach((item,i)=>item.classList.toggle('is-current',i===selected));rail.textContent=selected<0?'00':String(selected+1).padStart(2,'0');
      document.querySelectorAll('.rail-lines i').forEach((n,i)=>n.classList.toggle('active',i===selected));scrollFrame=0;
    };
    panel.addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(update)},{passive:true,signal});window.addEventListener('resize',update,{signal});
    panel.addEventListener('wheel',()=>items.forEach(item=>item.classList.remove('is-locked')),{passive:true,signal});panel.addEventListener('touchstart',()=>items.forEach(item=>item.classList.remove('is-locked')),{passive:true,signal});
    window.addEventListener('scroll',()=>{if(matchMedia('(max-width:650px)').matches&&!scrollFrame)scrollFrame=requestAnimationFrame(update)},{passive:true,signal});
    if(matchMedia('(hover:hover) and (pointer:fine)').matches){panel.addEventListener('pointermove',e=>{cursor.style.left=`${e.clientX}px`;cursor.style.top=`${e.clientY}px`;cursor.classList.add('visible')},{passive:true,signal});panel.addEventListener('pointerleave',()=>cursor.classList.remove('visible'),{signal})}
    const lock=i=>{items.forEach(item=>item.classList.remove('is-locked'));const item=items[i];if(!item)return;item.classList.add('is-locked');item.querySelector('.gallery-image-link').setAttribute('aria-label',`查看 ${timeline[i].title} 项目详情`);item.scrollIntoView({behavior:reduced?'instant':'smooth',block:'center'});update()};
    panel.querySelectorAll('[data-cover]').forEach(btn=>btn.addEventListener('click',()=>{const i=Number(btn.dataset.cover);if(items[i].classList.contains('is-locked'))showProject(timeline[i]);else lock(i)},{signal}));
    panel.querySelectorAll('[data-jump]').forEach(btn=>btn.addEventListener('click',()=>lock(Number(btn.dataset.jump)),{signal}));
    update();
  }
  function initPreviews(){
    const dialog=document.getElementById('preview-dialog');
    document.querySelectorAll('[data-preview]').forEach(btn=>btn.addEventListener('click',()=>{const p=projects.find(item=>item.id===btn.dataset.preview);if(!p)return;const reference=btn.dataset.kind==='参考',src=btn.querySelector('img').getAttribute('src');dialog.querySelector('.preview-image').innerHTML=`<img src="${safe(src)}" alt="${esc(p.title)} ${reference?'视觉参考':'界面示意'}">`;dialog.querySelector('.preview-caption').textContent=`${p.number} / ${p.title} · ${reference?`视觉参考：${p.reference?.author||'原作者'}`:'本站界面示意'}`;const source=dialog.querySelector('.preview-source');source.hidden=!reference;if(reference)source.href=safe(p.reference?.url);dialog.showModal();window.FolioMotion?.previewOpen(dialog)}));
    dialog.querySelector('.close-preview').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
  }
  window.addEventListener('hashchange',render);render();
  const loader=document.getElementById('intro-loader');
  if(loader){
    if(window.FolioMotion)window.FolioMotion.loader(loader);
    else{const progress=loader.querySelector('.loader-progress'),start=performance.now(),duration=reduced?100:1750;
      const tick=now=>{const t=Math.min(1,(now-start)/duration),eased=1-Math.pow(1-t,2.2);if(progress)progress.textContent=String(Math.round(eased*100)).padStart(3,'0');if(t<1)requestAnimationFrame(tick);else setTimeout(()=>loader.classList.add('is-done'),140)};
      requestAnimationFrame(tick)}
  }
})();
