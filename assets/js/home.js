(() => {
  const { escape, href, icon } = window.PORTFOLIO_UI;
  const data = window.PORTFOLIO_DATA;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  reduced.addEventListener('change', () => {
    if (reduced.matches) document.getAnimations().forEach(animation => animation.cancel());
  });
  const animateDetail = element => {
    element.getAnimations().forEach(animation => animation.cancel());
    if (!reduced.matches) element.animate(
      [{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'translateY(0)' }],
      { duration: 520, easing: 'cubic-bezier(.22,1,.36,1)' }
    );
  };
  const intro = document.querySelector('[data-intro]');
  const finishIntro = () => {
    intro.remove();
    document.querySelector('.hero').classList.add('is-ready');
  };
  let seen = false;
  try { seen = sessionStorage.getItem('jay-intro-v3') === 'seen'; sessionStorage.setItem('jay-intro-v3', 'seen'); } catch { /* Storage can be unavailable in private contexts. */ }
  const replayIntro = new URL(location.href).searchParams.get('intro') === '1';
  if ((!seen || replayIntro) && !reduced.matches) {
    intro.classList.add('is-playing');
    intro.addEventListener('animationend', event => {
      if (event.animationName === 'intro-exit') finishIntro();
    });
    setTimeout(finishIntro, 4100);
  } else finishIntro();

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
    const preview = expertise.querySelector('.expertise-preview');
    if (preview.dataset.active !== String(index)) {
      preview.innerHTML = detail(data.expertise[index],index);
      if (preview.dataset.active !== undefined) animateDetail(preview);
      preview.dataset.active = String(index);
    }
    if (!desktop.matches && !document.getElementById('expertise-panel-' + index).hidden) {
      animateDetail(document.getElementById('expertise-panel-' + index));
    }
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
    if (panel.dataset.active === String(index)) return;
    stages.forEach((stage,i) => {
      stage.setAttribute('aria-selected', String(i === index));
      stage.tabIndex = i === index ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', 'workflow-tab-' + index);
    const item = data.workflow[index];
    panel.innerHTML = '<div><span class="eyebrow">0' + (index + 1) + ' / ' + escape(item.title) + '</span><h3>' + escape(item.headline) + '</h3></div><p>' + escape(item.text) + '</p>';
    if (panel.dataset.active !== undefined) animateDetail(panel);
    panel.dataset.active = String(index);
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

})();
