(() => {
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const home=document.body.hasAttribute('data-hero-home');
  const {href}=window.PORTFOLIO_UI;
  const gsap=window.gsap;
  const trigger=window.ScrollTrigger;
  if(gsap&&trigger)gsap.registerPlugin(trigger);
  let context;
  const animate=()=>{
    context?.revert();
    if(!gsap||reduced.matches)return;
    context=gsap.context(()=>{
      if(home&&!location.hash&&!matchMedia('(max-width:760px)').matches) {
        gsap.fromTo('.hero-name-line>span',{yPercent:112},{yPercent:0,duration:1.25,ease:'power4.out',stagger:.16,delay:.1,clearProps:'transform'});
        gsap.fromTo('.hero-intro,.hero-statement,.hero-actions,.hero-facts',{y:22,opacity:.45},{y:0,opacity:1,duration:.9,ease:'power3.out',stagger:.12,delay:.3,clearProps:'transform,opacity'});
        gsap.fromTo('.hero-showcase',{x:45,rotationY:-24,rotationX:12},{x:0,rotationY:-14,rotationX:7,duration:1.4,delay:.3,ease:'power3.out'});
      }
      if(!trigger)return;
      document.querySelectorAll('.workspace-heading,.service-module,.biography,.founder-note,.stack-catalog article,.profile-timeline li,.case-section,.feedback-panel,.ticket-form').forEach((el,index)=>{
        gsap.fromTo(el,{clipPath:'inset(0 0 15% 0)',y:32},{clipPath:'inset(0 0 0% 0)',y:0,duration:.9,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 92%',once:true},clearProps:'clipPath,transform',delay:index%2*.04});
      });
    });
  };
  animate();reduced.addEventListener('change',animate);
  const showcase=document.querySelector('[data-hero-showcase]');
  if(showcase) {
    const projects=window.PORTFOLIO_DATA.projects;
    const featured=['acerbox-builds','davis-pest-solutions','ihelp-friendship'].map(slug=>projects.find(p=>p.slug===slug));
    let index=0;
    const select=direction=>{
      index=(index+direction+featured.length)%featured.length;const p=featured[index];
      const image=showcase.querySelector('[data-hero-project-image]');image.src=href('/'+p.image);image.alt=p.imageAlt || p.title+' website screenshot';
      showcase.querySelector('[data-hero-project-thumb]').srcset=href('/img/'+p.slug+'-hero.webp');
      showcase.querySelector('[data-hero-project-title]').textContent=p.title;
      showcase.querySelector('[data-hero-project-category]').textContent=p.category.split(' · ').slice(0,2).join(' / ');
      showcase.querySelector('[data-hero-project-number]').textContent=String(projects.indexOf(p)+1).padStart(2,'0');
      showcase.querySelector('[data-hero-project-status]').textContent=p.title;
      showcase.querySelectorAll('[data-hero-project-link]').forEach(link=>{link.href=href('/work/'+p.slug+'/');});
      if(gsap&&!reduced.matches)gsap.fromTo(image,{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)',duration:.7,ease:'power3.inOut',clearProps:'clipPath'});
    };
    showcase.querySelector('[data-hero-prev]').addEventListener('click',()=>select(-1));
    showcase.querySelector('[data-hero-next]').addEventListener('click',()=>select(1));
  }
  const sidebar=document.querySelector('.app-sidebar');
  const layout=document.querySelector('.app-layout');
  const toggle=document.querySelector('.sidebar-toggle');
  const mobile=matchMedia('(max-width:760px)');
  const syncMenu=()=>{
    const open=mobile.matches&&!layout.classList.contains('sidebar-collapsed');
    document.body.classList.toggle('mobile-menu-open',open);
    if(mobile.matches) {
      document.querySelector('main').inert=open;
      document.querySelector('.obsidian-footer').inert=open;
      document.querySelector('.mobile-navigation').inert=open;
    } else {
      document.querySelector('main').inert=false;
      document.querySelector('.obsidian-footer').inert=false;
      document.querySelector('.mobile-navigation').inert=false;
    }
  };
  new MutationObserver(syncMenu).observe(layout,{attributes:true,attributeFilter:['class']});syncMenu();mobile.addEventListener('change',syncMenu);
  document.addEventListener('keydown',event=>{
    if(event.key!=='Tab'||!mobile.matches||layout.classList.contains('sidebar-collapsed'))return;
    const items=[toggle,...sidebar.querySelectorAll('a,button')].filter(el=>el.getClientRects().length);
    if(event.shiftKey&&document.activeElement===items[0]){event.preventDefault();items.at(-1).focus();}
    else if(!event.shiftKey&&document.activeElement===items.at(-1)){event.preventDefault();items[0].focus();}
  });
  const host=document.querySelector('[data-hero-canvas-host]');
  if(host) {
    let instance,loading=false;
    const load=async()=>{
      if(loading||instance||reduced.matches)return;
      loading=true;
      try {
        const module=await import(href('/assets/vendor/obsidian-scene.min.js?v=43'));
        // Finish the readable HTML entrance before compiling WebGL materials.
        await new Promise(resolve=>setTimeout(resolve,location.hash?150:1850));
        if(reduced.matches)return;
        instance=module.mountScene(host);
      } catch {host.dataset.scene='fallback';}
      finally {loading=false;}
    };
    const watcher=new IntersectionObserver(entries=>{if(entries[0].isIntersecting)load();},{rootMargin:'120px'});watcher.observe(host);
    reduced.addEventListener('change',()=>{
      if(reduced.matches){instance?.dispose();instance=null;host.dataset.scene='reduced';}
      else load();
    });
    addEventListener('pagehide',()=>{instance?.dispose();instance=null;},{once:true});
  }
})();
