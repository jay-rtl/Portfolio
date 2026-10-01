(() => {
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const fine=matchMedia('(hover:hover) and (pointer:fine) and (min-width:761px)');
  const active=new Set();
  const reset=()=>{active.forEach(el=>{el.style.removeProperty('--tilt-x');el.style.removeProperty('--tilt-y');});active.clear();};
  let pendingPointer, pointerFrame;
  const movePointer=()=>{
    pointerFrame=0; const event=pendingPointer;
    if(reduced.matches||!fine.matches||event.pointerType!=='mouse')return;
    const glow=event.target.closest('.intro-panel');
    if(glow){const r=glow.getBoundingClientRect();glow.style.setProperty('--mouse-x',event.clientX-r.left+'px');glow.style.setProperty('--mouse-y',event.clientY-r.top+'px');}
    const button=event.target.closest('.button');
    if(button){const r=button.getBoundingClientRect();button.style.setProperty('--button-x',((event.clientX-r.left)/r.width-.5)*2+'px');button.style.setProperty('--button-y',((event.clientY-r.top)/r.height-.5)*2+'px');}
    const panel=event.target.closest('[data-depth]');if(!panel)return;
    const r=panel.getBoundingClientRect();
    panel.style.setProperty('--tilt-x',((event.clientX-r.left)/r.width-.5)*1.8+'deg');
    panel.style.setProperty('--tilt-y',((event.clientY-r.top)/r.height-.5)*-1.8+'deg');
    active.add(panel);
  };
  document.addEventListener('pointermove',event=>{pendingPointer=event;if(!pointerFrame)pointerFrame=requestAnimationFrame(movePointer);},{passive:true});
  document.addEventListener('pointerout',event=>{
    const panel=event.target.closest('[data-depth]');
    if(panel&&!(event.relatedTarget instanceof Node&&panel.contains(event.relatedTarget))){panel.style.removeProperty('--tilt-x');panel.style.removeProperty('--tilt-y');active.delete(panel);}
  });
  reduced.addEventListener('change',()=>{reset();if(reduced.matches)document.getAnimations().forEach(a=>a.cancel());});
  fine.addEventListener('change',reset);
  addEventListener('blur',reset);
  if(!document.body.hasAttribute('data-home')||reduced.matches)return;
  let seen=false;
  try{seen=sessionStorage.getItem('francis-workspace-v2')==='seen';sessionStorage.setItem('francis-workspace-v2','seen');}catch{/* Content remains available when storage is blocked. */}
  if(seen||location.hash)return;
  const intro=document.createElement('div');intro.className='workspace-boot';intro.setAttribute('aria-hidden','true');
  intro.innerHTML='<strong>FRANCIS / WORKSPACE</strong><span>Websites. Workflows. What comes next.</span>';
  document.body.append(intro);
  // Cosmetic reveal only: no fake loading steps and no interaction lock.
  const animation=intro.animate([{opacity:1},{opacity:0}],{duration:220,delay:600,fill:'forwards'});
  animation.finished.then(()=>intro.remove()).catch(()=>intro.remove());
  setTimeout(()=>intro.remove(),1000);
})();
