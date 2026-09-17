(() => {
  const { escape, href, icon } = window.PORTFOLIO_UI;
  const data = window.PORTFOLIO_DATA;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const intro = document.querySelector('[data-intro]');
  let seen = false;
  try { seen = sessionStorage.getItem('jay-intro-v3') === 'seen'; sessionStorage.setItem('jay-intro-v3', 'seen'); } catch { /* Storage can be unavailable in private contexts. */ }
  const replayIntro = new URL(location.href).searchParams.get('intro') === '1';
  if ((!seen || replayIntro) && !reduced.matches) {
    intro.classList.add('is-playing');
    intro.addEventListener('animationend', event => {
      if (event.animationName === 'intro-exit') intro.remove();
    });
    setTimeout(() => intro.remove(), 4100);
  } else intro.remove();

  const expertise = document.querySelector('[data-expertise]');
  const detail = (item, index) =>
    '<span class="eyebrow">0' + (index + 1) + ' / ' + escape(item.title) + '</span><h3>' + escape(item.headline) + '</h3><p>' + escape(item.description) + '</p>' +
    '<ul class="capability-list">' + item.capabilities.map(value => '<li>' + escape(value) + '</li>').join('') + '</ul>' +
    '<a class="text-link" href="' + href(item.link) + '">Explore this work ' + icon() + '</a>';
  expertise.innerHTML = '<div class="expertise-list">' + data.expertise.map((item, index) =>
    '<div class="expertise-item"><h3 class="sr-only">' + escape(item.title) + '</h3><button class="expertise-trigger" type="button" id="expertise-trigger-' + index +
    '" aria-expanded="' + (index === 0) + '" aria-controls="expertise-panel-' + index + '"><span>0' + (index + 1) + '</span><strong>' + escape(item.title) +
    '</strong>' + icon('plus') + '</button><div class="expertise-panel" id="expertise-panel-' + index + '" role="region" aria-labelledby="expertise-trigger-' + index +
    '"' + (index ? ' hidden' : '') + '>' + detail(item,index) + '</div></div>').join('') +
    '</div><div class="expertise-preview" aria-live="polite">' + detail(data.expertise[0],0) + '</div>';
  const triggers = [...expertise.querySelectorAll('.expertise-trigger')];
  const desktop = matchMedia('(min-width: 801px)');
  const selectExpertise = (index, toggle = false) => {
    const wasOpen = triggers[index].getAttribute('aria-expanded') === 'true';
    triggers.forEach((trigger, i) => {
      const open = i === index && !(toggle && wasOpen);
      trigger.setAttribute('aria-expanded', String(open));
      document.getElementById('expertise-panel-' + i).hidden = !open;
      trigger.setAttribute('aria-controls', desktop.matches ? 'expertise-preview' : 'expertise-panel-' + i);
    });
    expertise.querySelector('.expertise-preview').innerHTML = detail(data.expertise[index],index);
  };
  expertise.querySelector('.expertise-preview').id = 'expertise-preview';
  triggers.forEach((trigger,index) => {
    trigger.addEventListener('click', () => selectExpertise(index, !desktop.matches));
    trigger.addEventListener('pointerenter', event => {
      if (desktop.matches && event.pointerType === 'mouse') selectExpertise(index);
    });
    trigger.addEventListener('focus', () => { if (desktop.matches) selectExpertise(index); });
  });
  desktop.addEventListener('change', () => selectExpertise(0));
  selectExpertise(0);

  const workflow = document.querySelector('[data-workflow]');
  const tabs = workflow.querySelector('.workflow-tabs');
  const panel = workflow.querySelector('.workflow-detail');
  panel.id = 'workflow-detail';
  tabs.innerHTML = data.workflow.map((item,index) => '<button class="workflow-stage" id="workflow-tab-' + index +
    '" type="button" role="tab" aria-selected="' + (index === 0) + '" tabindex="' + (index === 0 ? 0 : -1) +
    '" aria-controls="workflow-detail"><span>0' + (index + 1) + '</span><strong>' + escape(item.title) + '</strong></button>').join('');
  const stages = [...tabs.children];
  const selectStage = index => {
    stages.forEach((stage,i) => {
      stage.setAttribute('aria-selected', String(i === index));
      stage.tabIndex = i === index ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', 'workflow-tab-' + index);
    const item = data.workflow[index];
    panel.innerHTML = '<div><span class="eyebrow">0' + (index + 1) + ' / ' + escape(item.title) + '</span><h3>' + escape(item.headline) + '</h3></div><p>' + escape(item.text) + '</p>';
  };
  stages.forEach((stage,index) => {
    stage.addEventListener('click', () => selectStage(index));
    stage.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % stages.length;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index + stages.length - 1) % stages.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = stages.length - 1;
      if (next !== undefined) { event.preventDefault(); selectStage(next); stages[next].focus(); }
    });
  });
  selectStage(0);
  document.querySelector('[data-stack]').innerHTML = data.stack.map(item =>
    '<article><h3>' + escape(item.title) + '</h3><div class="stack-tools">' + item.tools.map(tool => '<span>' + escape(tool) + '</span>').join('') + '</div></article>').join('');

  const cursor = document.querySelector('[data-cursor]');
  const fine = matchMedia('(min-width: 801px) and (hover: hover) and (pointer: fine)');
  let cursorFrame = 0;
  addEventListener('pointermove', event => {
    if (!fine.matches || reduced.matches || event.pointerType !== 'mouse') return;
    if (cursorFrame) cancelAnimationFrame(cursorFrame);
    cursorFrame = requestAnimationFrame(() => {
      cursor.classList.add('is-on');
      cursor.style.transform = 'translate(' + event.clientX + 'px,' + event.clientY + 'px)';
    });
  }, { passive: true });
  document.addEventListener('pointerover', event => {
    if (!fine.matches || reduced.matches || event.pointerType !== 'mouse') return;
    const target = event.target.closest('a, button');
    cursor.classList.toggle('is-expanded', !!target);
    cursor.innerHTML = target?.dataset.cursorLabel ? escape(target.dataset.cursorLabel) : target?.target === '_blank' ? icon() : '';
  });
  document.addEventListener('pointerleave', () => cursor.classList.remove('is-on'));
  const disableCursor = () => { if (!fine.matches || reduced.matches) cursor.classList.remove('is-on'); };
  fine.addEventListener('change', disableCursor);
  reduced.addEventListener('change', disableCursor);

  const canvas = document.querySelector('[data-hero-map]');
  const context = canvas.getContext('2d');
  if (!context) return;
  let width = 0, height = 0, offset = 0, frame = 0;
  // Architectural lines hint at connected workflows; redraw only on interaction.
  const draw = () => {
    frame = 0;
    context.clearRect(0,0,width,height);
    if (width < 700) return;
    const x = width * .8 + offset;
    const top = height * .11;
    context.strokeStyle = '#353a3344';
    context.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
      context.beginPath();
      context.moveTo(x + i * 44, top);
      context.lineTo(x + i * 44, height * .53);
      context.lineTo(width * .52 + i * 44, height * .53);
      context.lineTo(width * .52 + i * 44, height * .85);
      context.stroke();
    }
    context.fillStyle = '#c0daa26b';
    context.fillRect(x - 2, top - 2, 4, 4);
    context.fillRect(width * .52 + 130, height * .85 - 2, 4, 4);
  };
  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    width = rect.width; height = rect.height;
    const ratio = Math.min(devicePixelRatio || 1,2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio,0,0,ratio,0,0);
    draw();
  };
  new ResizeObserver(resize).observe(canvas);
  canvas.parentElement.addEventListener('pointermove', event => {
    if (reduced.matches || !fine.matches || event.pointerType !== 'mouse') return;
    offset = (event.clientX / innerWidth - .5) * 12;
    if (!frame) frame = requestAnimationFrame(draw);
  }, { passive: true });
  reduced.addEventListener('change', () => { offset = 0; draw(); });
})();
