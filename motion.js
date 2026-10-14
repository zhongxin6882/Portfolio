/* Site motion is kept separate from content and routing. GSAP files are vendored in assets/vendor. */
window.FolioMotion = (() => {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger) return null;
  gsap.registerPlugin(ScrollTrigger);
  document.body.classList.add('motion-ready');

  const noMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const query = (scope, selector) => [...scope.querySelectorAll(selector)];

  function loader(element) {
    if (!element) return;
    const number = element.querySelector('.loader-progress');
    if (noMotion()) {
      if (number) number.textContent = '100';
      element.classList.add('is-done');
      return;
    }
    const state = { value: 0 };
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .from(query(element, '.loader-eyebrow, .loader-cat, .loader-word'), {
        y: 22, autoAlpha: 0, stagger: .13, duration: .65
      }, 0)
      .to(state, {
        value: 100, duration: 1.45, ease: 'power2.out',
        onUpdate: () => { if (number) number.textContent = String(Math.round(state.value)).padStart(3, '0'); }
      }, 0)
      .to(element, {
        yPercent: -102, duration: .85, ease: 'power4.inOut',
        onComplete: () => { element.classList.add('is-done'); gsap.set(element, { clearProps: 'transform' }); }
      }, 1.55);
  }

  function count(value, label) {
    const digits = String(Math.max(0, Math.min(99, value))).padStart(2, '0');
    if (label) label.textContent = digits;
    document.querySelectorAll('.count-reel').forEach((reel, index) => {
      const digit = Number(digits[index]);
      const opening = document.getElementById('intro-loader')?.classList.contains('is-done') === false;
      gsap.to(reel, { y: `-${digit}em`, duration: noMotion() ? 0 : .7, delay: opening && !noMotion() ? 2.3 : 0, ease: 'power3.inOut', overwrite: true });
    });
  }

  function init(root, page) {
    const panel = root.querySelector('#main');
    const reduced = noMotion();
    const context = gsap.context(() => {
      if (reduced) return;
      const loaderActive = document.getElementById('intro-loader')?.classList.contains('is-done') === false;
      const entrance = gsap.timeline({ delay: loaderActive ? 2.25 : .06, defaults: { ease: 'power3.out' } });
      entrance.from(query(root, '.nav-links a, .mail-link'), { y: -18, autoAlpha: 0, stagger: .065, duration: .55 });
      entrance.from(query(root, '.left-top, .left-bottom button'), { y: 14, autoAlpha: 0, stagger: .09, duration: .5 }, '<+.12');

      if (page === 'work' || page === 'detail') {
        entrance.from(query(root, '.work-eyebrow, .work-copy p'), { y: 18, autoAlpha: 0, stagger: .12, duration: .7 }, '<');
        entrance.from(query(root, '.work-title span'), { yPercent: 110, autoAlpha: 0, stagger: .075, duration: .8 }, '<+.08');
        entrance.from(query(root, '.work-left .orbit-clock, .work-count'), { y: 30, autoAlpha: 0, stagger: .1, duration: .75 }, '<+.13');
        entrance.from(query(root, '.intro-heading span, .intro-hint'), { y: 15, autoAlpha: 0, stagger: .08, duration: .65 }, '<');
        entrance.from(query(root, '.mosaic-card img'), { scale: 1.16, autoAlpha: 0, stagger: .06, duration: .85 }, '<+.08');
      } else if (page === 'about') {
        entrance.from(query(root, '.left-message, .about-content h1'), { y: 32, autoAlpha: 0, stagger: .1, duration: .85 }, '<');
      } else {
        entrance.from(query(root, '.left-playground > *'), { y: 24, autoAlpha: 0, stagger: .08, duration: .75 }, '<');
      }
    }, root);

    const media = gsap.matchMedia();
    media.add({
      desktop: '(min-width: 651px)',
      mobile: '(max-width: 650px)',
      motion: '(prefers-reduced-motion: no-preference)'
    }, ({ conditions }) => {
      if (!conditions.motion) return;
      const scroller = conditions.mobile ? window : panel;
      const scroll = (trigger, start = 'top 85%', end = 'bottom 15%') =>
        ({ trigger, scroller, start, end });

      if (page === 'work' || page === 'detail') {
        const intro = root.querySelector('.gallery-intro');
        const cards = query(root, '.mosaic-card');
        if (intro && cards.length) {
          const offsets = [-125, -235, -80, -115, -260, -180, -320, -95];
          gsap.to(cards, {
            y: index => offsets[index] || -110,
            ease: 'none',
            scrollTrigger: { ...scroll(intro, 'top top', 'bottom bottom'), scrub: .65 }
          });
        }
        query(root, '.gallery-item').forEach(item => {
          const image = item.querySelector('.gallery-image');
          if (image) gsap.fromTo(image, { scale: 1.1, yPercent: 4 }, {
            scale: 1.01, yPercent: -4, ease: 'none',
            scrollTrigger: { ...scroll(item, 'top bottom', 'bottom top'), scrub: .6 }
          });
          const rows = query(item, '.project-row');
          if (rows.length) gsap.from(rows, {
            y: 18, autoAlpha: 0, stagger: .07, duration: .55, ease: 'power2.out',
            scrollTrigger: { ...scroll(item, 'top 60%'), toggleActions: 'play none none reverse' }
          });
        });
      }
      if (page === 'about') {
        query(root, '.about-row').forEach(row => {
          gsap.from(query(row, ':scope > *'), {
            y: 25, autoAlpha: 0, stagger: .1, duration: .7, ease: 'power3.out',
            scrollTrigger: { ...scroll(row), toggleActions: 'play none none none' }
          });
        });
      }
      if (page === 'playground') {
        query(root, '.play-tile').forEach(tile => {
          gsap.from(tile, {
            y: 35, autoAlpha: 0, duration: .65, ease: 'power3.out',
            scrollTrigger: { ...scroll(tile), toggleActions: 'play none none none' }
          });
        });
      }
      ScrollTrigger.refresh();
    });

    return () => { media.revert(); context.revert(); };
  }

  function projectOpen(view) {
    if (noMotion()) return;
    gsap.fromTo(view, { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .55, ease: 'power3.out' });
    gsap.from(query(view, '.project-kicker, .project-info h1, .project-summary, .project-facts > div'), {
      y: 22, autoAlpha: 0, stagger: .065, duration: .65, delay: .14, ease: 'power3.out'
    });
    gsap.from(query(view, '.project-frame'), {
      y: 30, autoAlpha: 0, stagger: .1, duration: .7, delay: .2, ease: 'power3.out'
    });
  }

  function projectClose(view, done) {
    if (noMotion()) { done(); return; }
    gsap.to(view, { y: 22, autoAlpha: 0, duration: .28, ease: 'power2.in', onComplete: done });
  }

  return { loader, count, init, projectOpen, projectClose };
})();
