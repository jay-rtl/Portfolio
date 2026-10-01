(() => {
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const fine=matchMedia('(hover:hover) and (pointer:fine) and (min-width:761px)');
  const gsap=window.gsap;
  const descriptions=[
    'Customer: the person looking for information, a service, or a reservation.',
    'Website: a clear, accessible entry point that turns interest into an enquiry.',
    'Booking / lead: collect the request and check the details needed for the next step.',
    'Admin dashboard: give the team a shared view of bookings, customers, and responsibilities.',
    'Payment tracking: connect payment records and booking status where the project requires it.',
    'Operations: help staff act on the information and carry out the service.'
  ];
  document.querySelectorAll('[data-architecture]').forEach(map=>{
    const nodes=[...map.querySelectorAll('button')];
    const select=i=>{map.classList.add('has-selection');nodes.forEach((n,j)=>n.classList.toggle('is-related',Math.abs(i-j)<=1));map.nextElementSibling.textContent=descriptions[i];};
    nodes.forEach((node,i)=>{node.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')select(i);});node.addEventListener('focus',()=>select(i));node.addEventListener('click',()=>select(i));node.addEventListener('keydown',event=>{const offset=['ArrowRight','ArrowDown'].includes(event.key)?1:['ArrowLeft','ArrowUp'].includes(event.key)?-1:0;if(offset){event.preventDefault();nodes[(i+offset+nodes.length)%nodes.length].focus();}});});
    map.addEventListener('pointerleave',()=>{if(!map.contains(document.activeElement))map.classList.remove('has-selection');});
    map.addEventListener('focusout',event=>{if(!map.contains(event.relatedTarget))map.classList.remove('has-selection');});
  });
  document.querySelectorAll('.stack-catalog').forEach(catalog=>{
    const select=selected=>{catalog.classList.toggle('has-selection',!!selected);catalog.querySelectorAll('article').forEach(card=>card.classList.toggle('is-related',card===selected));};
    catalog.querySelectorAll('article').forEach(card=>{card.addEventListener('pointerenter',()=>select(card));card.addEventListener('focus',()=>select(card));});
    catalog.addEventListener('pointerleave',()=>select(catalog.contains(document.activeElement)?document.activeElement.closest('article'):null));
    catalog.addEventListener('focusout',event=>{if(!catalog.contains(event.relatedTarget))select(null);});
  });
  const toggle=document.querySelector('.sidebar-toggle'),layout=document.querySelector('.app-layout');
  const tablet=matchMedia('(min-width:761px) and (max-width:1100px)');
  const setCollapsed=value=>{layout?.classList.toggle('sidebar-collapsed',value);toggle?.setAttribute('aria-expanded',String(!value));};
  toggle?.addEventListener('click',()=>setCollapsed(!layout.classList.contains('sidebar-collapsed')));
  tablet.addEventListener('change',()=>setCollapsed(false));
  const seen=new WeakSet(),loops=new Map();
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    const el=entry.target;
    if(entry.isIntersecting&&!seen.has(el)){
      seen.add(el);
      if(gsap&&!reduced.matches&&fine.matches)gsap.fromTo(el,{opacity:.35,y:12},{opacity:1,y:0,duration:.55,delay:Math.min([...el.parentElement.children].indexOf(el)*.025,.1),ease:'power3.out',clearProps:'transform,opacity'});
    }
    const loop=loops.get(el);if(loop){if(entry.isIntersecting&&fine.matches&&!reduced.matches&&!document.hidden)loop.resume();else loop.pause();}
  }),{threshold:.08});
  document.querySelectorAll('.glass-panel,.dashboard-metrics article').forEach(el=>observer.observe(el));
  if(gsap&&fine.matches){
    document.querySelectorAll('.system-scene,.availability-graphic').forEach(scene=>{
      const loop=gsap.timeline({repeat:-1,yoyo:true,paused:true});
      loop.to(scene.querySelectorAll('.scene-node,.orbit-label'),{y:-4,duration:4.5,ease:'sine.inOut',stagger:.3},0);
      loops.set(scene,loop);observer.observe(scene);
    });
  }
  document.querySelectorAll('[data-testimonials]').forEach(panel=>{
    let start;
    panel.addEventListener('pointerdown',event=>{if(event.pointerType==='mouse'&&event.button===0&&!event.target.closest('a,button'))start={x:event.clientX,y:event.clientY};});
    panel.addEventListener('pointerup',event=>{if(!start)return;const dx=event.clientX-start.x,dy=event.clientY-start.y;start=null;if(Math.abs(dx)>70&&Math.abs(dx)>Math.abs(dy)){getSelection()?.removeAllRanges();panel.querySelector(dx<0?'[data-feedback-next]':'[data-feedback-prev]').click();}});
    panel.addEventListener('pointerleave',()=>{start=null;});panel.addEventListener('pointercancel',()=>{start=null;});
  });
  const syncMotion=()=>{
    document.documentElement.classList.toggle('motion-paused',document.hidden||reduced.matches);
    loops.forEach((loop,el)=>{const r=el.getBoundingClientRect();if(fine.matches&&!reduced.matches&&!document.hidden&&el.getClientRects().length&&r.bottom>0&&r.top<innerHeight)loop.resume();else loop.pause();});
    if(reduced.matches&&gsap){gsap.globalTimeline.getChildren().filter(t=>!t.repeat()).forEach(t=>t.progress(1));loops.forEach((loop,el)=>{loop.pause(0);gsap.set(el.querySelectorAll('.scene-node,.orbit-label'),{clearProps:'transform'});});}
  };
  syncMotion();fine.addEventListener('change',syncMotion);reduced.addEventListener('change',syncMotion);document.addEventListener('visibilitychange',syncMotion);addEventListener('hashchange',syncMotion);
  let scrollFrame;
  const timeline=()=>{scrollFrame=0;document.querySelectorAll('.profile-timeline').forEach(el=>{if(!el.getClientRects().length)return;const r=el.getBoundingClientRect();el.style.setProperty('--timeline-progress',reduced.matches?1:Math.max(0,Math.min(1,(innerHeight*.8-r.top)/r.height)));});};
  addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(timeline);},{passive:true});addEventListener('hashchange',timeline);timeline();
  // A small parallax response on the scene only; pointer work is batched per frame.
  let pointerFrame,event;
  document.querySelector('.intro-panel')?.addEventListener('pointermove',e=>{if(reduced.matches||!fine.matches)return;event=e;if(pointerFrame)return;pointerFrame=requestAnimationFrame(()=>{pointerFrame=0;const scene=document.querySelector('.system-scene');if(!scene)return;const r=scene.getBoundingClientRect();gsap?.to(scene,{x:Math.max(-2,Math.min(2,(event.clientX-r.left-r.width/2)/100)),duration:.5,ease:'power3.out'});});},{passive:true});
})();
