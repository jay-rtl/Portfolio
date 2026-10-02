(() => {
  const C = window.WORKSPACE_COMPONENTS;
  const { href, escape: e } = window.PORTFOLIO_UI;
  const data = window.PORTFOLIO_DATA;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const home = document.body.hasAttribute('data-home');
  const themeButton = document.querySelector('[data-theme-toggle]');
  const updateThemeButton = () => {
    if (!themeButton) return;
    const light = document.documentElement.dataset.theme === 'light';
    const label = 'Switch to ' + (light ? 'dark' : 'light') + ' mode';
    themeButton.innerHTML = C.icon(light ? 'moon' : 'sun');
    themeButton.setAttribute('aria-label', label);
    themeButton.title = label;
  };
  themeButton?.addEventListener('click', () => window.PORTFOLIO_THEME.toggle());
  addEventListener('portfolio:theme', updateThemeButton);
  updateThemeButton();
  const motion = element => {
    if (!element || reduced.matches) return;
    element.getAnimations().forEach(animation => animation.cancel());
    if (window.gsap) { gsap.killTweensOf(element); gsap.fromTo(element,{opacity:.25,y:10,filter:matchMedia('(min-width:761px)').matches?'blur(3px)':'none'},{opacity:1,y:0,filter:'blur(0px)',duration:.38,ease:'power3.out',clearProps:'opacity,transform,filter'}); }
    else element.animate([{opacity:.3,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{duration:380,easing:'cubic-bezier(.22,1,.36,1)'});
  };
  const aliases = { 'selected-work':'projects',expertise:'services',beyond:'systems','tech-stack':'stack',main:'overview' };
  const views = [...document.querySelectorAll('[data-workspace-view]')];
  const initialTitle = document.title;
  let activeView;
  const selectView = (focus = false) => {
    if (!home) return;
    const hash = location.hash.slice(1);
    const id = aliases[hash] || hash || 'overview';
    const active = views.find(v => v.id === id) || views[0];
    views.forEach(view => { view.hidden = view !== active; });
    document.querySelectorAll('[data-nav]').forEach(link => {
      if (link.dataset.nav === active.id) link.setAttribute('aria-current','page');
      else link.removeAttribute('aria-current');
    });
    const label = C.nav.find(([key]) => key === active.id)?.[1] || 'Overview';
    document.querySelector('[data-current-view]').textContent = label;
    document.title = active.id === 'overview' ? initialTitle : label + ' | Francis Jay D. Rotol';
    if (activeView !== active.id) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      if (activeView) motion(active);
      if (activeView) motion(document.querySelector("[data-current-view]"));
      if (focus) active.querySelector('h1,h2')?.focus({ preventScroll: true });
    }
    activeView = active.id;
  };
  document.documentElement.classList.add('app-enhanced');
  selectView();
  addEventListener('hashchange', () => selectView(true));
  document.addEventListener('click', event => {
    const anchor = event.target.closest('a[href]');
    if (!home || !anchor || event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || anchor.target === '_blank') return;
    const target = new URL(anchor.href);
    if (target.origin === location.origin && target.pathname === location.pathname && target.hash && (views.some(v => '#'+v.id === target.hash) || aliases[target.hash.slice(1)])) {
      event.preventDefault();
      if (location.hash === target.hash) { window.scrollTo({top:0,behavior:reduced.matches?'instant':'smooth'}); selectView(true); }
      else location.hash = target.hash;
    }
  });
  const clocks = document.querySelectorAll('[data-local-time]');
  const dates = document.querySelectorAll('[data-local-date]');
  const updateTime = () => {
    const now = new Date();
    clocks.forEach(clock => {
    clock.dateTime = now.toISOString();
    clock.textContent = new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Manila',hour:'numeric',minute:'2-digit',hour12:true}).format(now);
    });
    dates.forEach(date => { date.textContent = new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Manila',month:'short',day:'numeric',year:'numeric'}).format(now); });
  };
  updateTime();
  setInterval(() => { if (!document.hidden) updateTime(); },60000);
  document.addEventListener('visibilitychange', updateTime);

  const bindTabs = (buttons,select) => buttons.forEach((button,index) => {
    button.addEventListener('click', () => select(index));
    button.addEventListener('keydown', event => {
      let next;
      if (['ArrowRight','ArrowDown'].includes(event.key)) next = (index+1)%buttons.length;
      if (['ArrowLeft','ArrowUp'].includes(event.key)) next = (index-1+buttons.length)%buttons.length;
      if (event.key==='Home') next=0;
      if (event.key==='End') next=buttons.length-1;
      if (next!==undefined) { event.preventDefault(); select(next); buttons[next].focus(); }
    });
  });
  const setTabs = (buttons,index) => buttons.forEach((button,i) => {
    button.setAttribute('aria-selected',String(i===index));
    button.tabIndex = i===index ? 0 : -1;
  });
  const swipe = (element,next,previous) => {
    let start;
    element.addEventListener('touchstart',event => {
      if (event.touches.length!==1 || event.target.closest('a,button,input,select,textarea')) { start=null; return; }
      start={x:event.touches[0].clientX,y:event.touches[0].clientY};
    },{passive:true});
    element.addEventListener('touchend',event => {
      if (!start || !event.changedTouches.length) return;
      const dx=event.changedTouches[0].clientX-start.x,dy=event.changedTouches[0].clientY-start.y;
      if (Math.abs(dx)>65 && Math.abs(dx)>Math.abs(dy)*1.5) (dx<0?next:previous)();
      start=null;
    },{passive:true});
  };
  document.querySelectorAll('[data-flow]').forEach(flow => {
    const buttons=[...flow.querySelectorAll('[role=tab]')];
    const panel=flow.querySelector('[role=tabpanel]');
    let current=0;
    const select = index => {
      setTabs(buttons,index);
      panel.setAttribute('aria-labelledby',buttons[index].id);
      panel.innerHTML='<strong>'+e(C.flowSteps[index].subtitle)+'</strong><p>'+e(C.flowSteps[index].text)+'</p>';
      if (current!==index) motion(panel);
      current=index;
    };
    bindTabs(buttons,select);
    buttons.forEach((button,i) => button.addEventListener('pointerenter',event => {if(event.pointerType==='mouse')select(i);}));
  });
  document.querySelectorAll('[data-explorer]').forEach(explorer => {
    const buttons=[...explorer.querySelectorAll('[data-project-index]')];
    const mobileCards=[...explorer.querySelectorAll('[data-mobile-project-index]')];
    const panel=explorer.querySelector('.explorer-detail');
    const input=explorer.querySelector('input');
    const count=explorer.querySelector('.explorer-count');
    let filter='all',selected=0;
    const available = () => buttons.filter(b=>!b.hidden);
    const select = index => {
      selected=index;
      setTabs(buttons,index);
      panel.setAttribute('aria-labelledby',buttons[index].id);
      panel.innerHTML=C.projectPreview(data.projects[index],index);
      panel.hidden=false;
      motion(panel);
    };
    buttons.forEach((button,index) => {
      button.addEventListener('click',()=>select(index));
      button.addEventListener('keydown',event=>{
        const visible=available();const position=visible.indexOf(button);let next;
        if(['ArrowRight','ArrowDown'].includes(event.key))next=(position+1)%visible.length;
        if(['ArrowLeft','ArrowUp'].includes(event.key))next=(position-1+visible.length)%visible.length;
        if(event.key==='Home')next=0;if(event.key==='End')next=visible.length-1;
        if(next!==undefined){event.preventDefault();visible[next].click();visible[next].focus();}
      });
    });
    const update = () => {
      const term=input.value.trim().toLowerCase();
      buttons.forEach((b,i)=>{const p=data.projects[i];const hidden=!(filter==='all'||p.filters.includes(filter))||!([p.title,p.category,...p.tech].join(' ').toLowerCase().includes(term));b.hidden=hidden;if(mobileCards[i])mobileCards[i].hidden=hidden;});
      const visible=available();
      count.textContent=visible.length?visible.length+' '+(visible.length===1?'project':'projects')+' in the workspace':'No projects found. Try another search or category.';
      if(!visible.length){panel.hidden=true;setTabs(buttons,-1);}
      else if(buttons[selected].hidden || panel.hidden)select(Number(visible[0].dataset.projectIndex));
    };
    input.addEventListener('input',update);
    explorer.querySelectorAll('[data-project-filter]').forEach(button=>button.addEventListener('click',()=>{
      filter=button.dataset.projectFilter;
      explorer.querySelectorAll('[data-project-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
      update();
    }));
    const move = direction => {const visible=available();if(!visible.length)return;const index=visible.indexOf(buttons[selected]);select(Number(visible[(index+direction+visible.length)%visible.length].dataset.projectIndex));};
    swipe(panel,()=>move(1),()=>move(-1));
    const requested=new URLSearchParams(location.search).get('project');
    const index=data.projects.findIndex(p=>p.slug===requested);
    if(index>=0)select(index);
    const orientation=matchMedia('(max-width:760px)');
    const setOrientation=()=>explorer.querySelector('[role=tablist]').setAttribute('aria-orientation',orientation.matches?'horizontal':'vertical');
    setOrientation();orientation.addEventListener('change',setOrientation);
  });
  const stack=document.querySelector('[data-stack-panel]');
  if(stack){
    const buttons=[...stack.querySelectorAll('[role=tab]')],panel=stack.querySelector('[role=tabpanel]');
    bindTabs(buttons,index=>{
      setTabs(buttons,index);const group=data.stack[index];
      panel.setAttribute('aria-labelledby',buttons[index].id);
      panel.innerHTML='<span class="panel-label">'+(group.title==='Exploring'?'CURRENTLY LEARNING':'THE TOOLKIT')+'</span><h3>'+e(group.title)+'</h3>'+C.chips(group.tools)+(group.title==='Exploring'?'<p class="quiet-note">Developing next. These are learning areas, not claimed client delivery experience.</p>':'');
      motion(panel);
    });
  }
  const feedback=document.querySelector('[data-testimonials]');
  if(feedback){
    let index=0;const slides=[...feedback.querySelectorAll('[data-feedback-slide]')],selectors=[...feedback.querySelectorAll('[data-feedback-select]')];
    const select = next => {
      index=(next+slides.length)%slides.length;
      slides.forEach((slide,i)=>{slide.hidden=i!==index;slide.setAttribute('aria-label',(i+1)+' of '+slides.length);slide.setAttribute('aria-roledescription','slide');});
      selectors.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));
      feedback.querySelector('[data-feedback-count]').textContent=String(index+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0');
      motion(slides[index]);
    };
    feedback.querySelector('[data-feedback-prev]').addEventListener('click',()=>select(index-1));
    feedback.querySelector('[data-feedback-next]').addEventListener('click',()=>select(index+1));
    selectors.forEach((button,i)=>button.addEventListener('click',()=>select(i)));
    feedback.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();select(index+(event.key==='ArrowRight'?1:-1));}});
    swipe(feedback,()=>select(index+1),()=>select(index-1));select(0);
  }
  const form=document.querySelector('#contact-form');
  if(form){
    const type=new URLSearchParams(location.search).get('type');
    const map={'Website Design & Development':'Website','WordPress Development':'WordPress Website','Business Systems':'Business System','Automation & Integrations':'Automation','IT & Technical Support':'IT / Technical Support'};
    if(type)form.elements.projectType.value=map[type]||type;
  }

  const dialog=document.querySelector('.command-dialog');
  if(dialog){
    const input=dialog.querySelector('input'),results=dialog.querySelector('[role=listbox]');
    let index=0,filtered=[],trigger;
    const commands=[...C.nav.map(([id,label])=>({label:(id==='overview'?'Go to ':'View ')+label,detail:'Workspace',icon:id,url:home?href('/#'+id):href(C.routes[id])})),
      {label:'Open Resume',detail:'Profile',icon:'resume',url:href('/resume/')},
      {label:'Project pricing',detail:'Planning',icon:'layers',url:href('/pricing/')},
      {label:'Email Francis',detail:'Get in touch',icon:'contact',url:'mailto:'+window.WORKSPACE_DATA.profile.email},
      {label:'GitHub',detail:'External',icon:'github',url:window.WORKSPACE_DATA.profile.github},
      ...data.projects.map(p=>({label:p.title,detail:'Case study',icon:'projects',url:href('/work/'+p.slug+'/')}))];
    if(window.WORKSPACE_DATA.profile.linkedin)commands.push({label:'LinkedIn',detail:'External',icon:'linkedin',url:window.WORKSPACE_DATA.profile.linkedin});
    const matches=(label,term)=>{let i=0;for(const ch of label.toLowerCase())if(ch===term[i])i++;return i===term.length;};
    const setActive = next => {
      index=filtered.length?(next+filtered.length)%filtered.length:0;
      [...results.children].forEach((option,i)=>option.setAttribute('aria-selected',String(i===index)));
      if(filtered.length){input.setAttribute('aria-activedescendant','command-option-'+index);results.children[index].scrollIntoView({block:'nearest'});}
      else input.removeAttribute('aria-activedescendant');
    };
    const render = () => {
      const term=input.value.trim().toLowerCase();
      filtered=commands.filter(c=>!term||matches(c.label,term));
      results.innerHTML=filtered.length?filtered.map((c,i)=>'<div role="option" id="command-option-'+i+'" aria-selected="'+(i===0)+'" data-command-index="'+i+'">'+C.icon(c.icon)+'<span>'+e(c.label)+'</span><small>'+e(c.detail)+'</small></div>').join(''):'<p class="command-empty">No matches. Try “projects”, “resume”, or a client name.</p>';
      dialog.querySelector('[data-command-status]').textContent=filtered.length+' results';setActive(0);
    };
    const close = () => {dialog.close();};
    const open = () => {
      if(dialog.open)return;
      trigger=document.activeElement;input.value='';dialog.showModal();render();input.focus();
    };
    const execute = next => {
      const command=filtered[next];if(!command)return;
      close();
      const url=new URL(command.url,location.href);
      if(url.origin===location.origin&&url.pathname===location.pathname&&url.hash){location.hash=url.hash;selectView(true);}
      else if(url.protocol==='https:'&&url.origin!==location.origin)window.open(url.href,'_blank','noopener,noreferrer');
      else location.href=url.href;
    };
    document.querySelectorAll('[data-open-command]').forEach(button=>button.addEventListener('click',open));
    dialog.querySelector('[data-close-command]').addEventListener('click',close);
    dialog.addEventListener('close',()=>trigger?.focus({preventScroll:true}));
    dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)close();}});
    input.addEventListener('input',render);
    input.addEventListener('keydown',event=>{
      if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();setActive(index+(event.key==='ArrowDown'?1:-1));}
      if(event.key==='Enter'){event.preventDefault();execute(index);}
    });
    results.addEventListener('click',event=>{const option=event.target.closest('[data-command-index]');if(option)execute(Number(option.dataset.commandIndex));});
    addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();dialog.open?close():open();}});
  }
  reduced.addEventListener('change',()=>{if(reduced.matches)document.getAnimations().forEach(a=>a.cancel());});
})();
