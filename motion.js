/* Site motion is kept separate from content and routing. GSAP files are vendored in assets/vendor. */
window.FolioMotion = (() => {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger) return null;
  gsap.registerPlugin(ScrollTrigger);
  document.body.classList.add('motion-ready');

  const noMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const query = (scope, selector) => [...scope.querySelectorAll(selector)];
  let counterRolled = false;

  function rollPlay(root, value) {
    const label = root.querySelector('#play-count-label');
    const digits = String(value).padStart(2, '0');
    if (!label || label.textContent === digits) return;
    label.textContent = digits;
    query(root, '.play-reel').forEach((reel, index) => {
      gsap.to(reel, { y: `-${digits[index]}em`, duration: noMotion() || counterRolled ? 0 : .85, ease: 'back.out(1.15)', overwrite: true });
    });
    counterRolled = true;
  }

  function loader(element) {
    if (!element) return;
    const number = element.querySelector('.loader-progress');
    if (noMotion()) {
      if (number) number.textContent = '100';
      element.classList.add('is-done');
      return;
    }
    const state = { value: 0 };
    const outlines = query(element, '.cat-outline, .cat-feet');
    outlines.forEach(path => { const length = path.getTotalLength(); gsap.set(path, { strokeDasharray: length, strokeDashoffset: length }); });
    gsap.set(query(element, '.cat-eye'), { scaleY: 0, transformOrigin: 'center center' });
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .from(query(element, '.loader-eyebrow, .loader-cat, .loader-word, .loader-bottom'), {
        y: 22, autoAlpha: 0, stagger: .13, duration: .65
      }, 0)
      .to(outlines, { strokeDashoffset: 0, duration: .92, stagger: .12, ease: 'power2.inOut' }, .18)
      .to(query(element, '.cat-eye'), { scaleY: 1, duration: .2, stagger: .08, ease: 'back.out(2)' }, .95)
      .to(element.querySelector('.loader-cat'), { y: -5, duration: .65, repeat: 1, yoyo: true, ease: 'sine.inOut' }, .86)
      .to(state, {
        value: 100, duration: 1.45, ease: 'power2.out',
        onUpdate: () => { if (number) number.textContent = String(Math.round(state.value)).padStart(3, '0'); }
      }, 0)
      .to(element, {
        yPercent: -102, duration: .85, ease: 'power4.inOut',
        onComplete: () => { element.classList.add('is-done'); gsap.set(element, { clearProps: 'transform' }); }
      }, 1.55);
  }

  function init(root, page) {
    const panel = root.querySelector('#main');
    const reduced = noMotion();
    const cleanups = [];
    const context = gsap.context(() => {
      if (reduced) { if (page === 'playground') rollPlay(root, query(root, '.play-tile').length); return; }
      const loaderActive = document.getElementById('intro-loader')?.classList.contains('is-done') === false;
      const entrance = gsap.timeline({ delay: loaderActive ? 2.25 : .06, defaults: { ease: 'power3.out' } });
      entrance.from(query(root, '.nav-links a, .mail-link'), { y: -18, autoAlpha: 0, stagger: .065, duration: .55 });
      entrance.from(query(root, '.left-top, .left-bottom button'), { y: 14, autoAlpha: 0, stagger: .09, duration: .5 }, '<+.12');
      query(root, '.nav-links a, .left-bottom button, .gallery-end a, .close-preview, .preview-source').forEach(target => {
        const enter = () => gsap.to(target, { y: -3, duration: .22, ease: 'power2.out', overwrite: true });
        const leave = () => gsap.to(target, { y: 0, duration: .3, ease: 'power2.out', overwrite: true });
        target.addEventListener('pointerenter', enter);
        target.addEventListener('pointerleave', leave);
        target.addEventListener('focus', enter);
        target.addEventListener('blur', leave);
        cleanups.push(() => { target.removeEventListener('pointerenter', enter); target.removeEventListener('pointerleave', leave); target.removeEventListener('focus', enter); target.removeEventListener('blur', leave); });
      });

      if (page === 'work' || page === 'detail') {
        entrance.from(query(root, '.orbit-clock'), { scale: .93, autoAlpha: 0, duration: .8 }, '<');
        entrance.from(query(root, '.intro-heading span, .intro-hint'), { y: 15, autoAlpha: 0, stagger: .08, duration: .65 }, '<');
        entrance.from(query(root, '.collage-image img'), { scale: 1.12, autoAlpha: 0, stagger: .07, duration: .75 }, '<+.08');
        query(root, '.collage-image').forEach(card => {
          const enter = () => gsap.to(card.querySelector('img'), { scale: 1.08, duration: .45, ease: 'power2.out', overwrite: true });
          const leave = () => gsap.to(card.querySelector('img'), { scale: 1, duration: .6, ease: 'power2.out', overwrite: true });
          card.addEventListener('pointerenter', enter); card.addEventListener('pointerleave', leave);
          cleanups.push(() => { card.removeEventListener('pointerenter', enter); card.removeEventListener('pointerleave', leave); });
        });
      } else if (page === 'about') {
        entrance.from(query(root, '.left-message, .about-content h1'), { y: 32, autoAlpha: 0, stagger: .1, duration: .85 }, '<');
      } else {
        const copy = root.querySelector('.play-copy');
        const letters = query(copy, '.copy-char');
        entrance.from(query(root, '.play-kicker, .play-counter-caption'), { y: 20, autoAlpha: 0, stagger: .11, duration: .7 }, '<');
        entrance.from(query(root, '.play-title span'), { yPercent: 120, rotation: 4, autoAlpha: 0, stagger: .048, duration: .78 }, '<+.08');
        entrance.from(query(root, '.play-counter'), { scale: .85, autoAlpha: 0, duration: .72 }, '<+.12');
        entrance.fromTo(letters, { autoAlpha: 0, y: 13, rotation: -4 }, {
          autoAlpha: 1, y: 0, rotation: 0, duration: .52, stagger: .055, ease: 'back.out(1.8)'
        }, '<+.16');
        entrance.fromTo(copy.querySelector('.copy-cursor'), { autoAlpha: 0 }, { autoAlpha: 1, duration: .12, repeat: 5, yoyo: true }, '<');
        entrance.fromTo(letters, { backgroundPosition: '100% 50%' }, {
          backgroundPosition: '0% 50%', duration: .85, stagger: .016, ease: 'power1.inOut'
        }, '>-0.12');
        entrance.call(() => rollPlay(root, query(root, '.play-tile').length), null, '<-.3');
        let hoverTween;
        const replay = () => {
          hoverTween?.kill();
          hoverTween = gsap.timeline()
            .to(copy, { autoAlpha: 1, y: 0, duration: .25 })
            .fromTo(letters, { y: 8, backgroundPosition: '100% 50%' }, {
              y: 0, backgroundPosition: '0% 50%', duration: .65, stagger: .014, ease: 'back.out(1.7)'
            }, 0);
        };
        copy.addEventListener('pointerenter', replay);
        cleanups.push(() => { copy.removeEventListener('pointerenter', replay); hoverTween?.kill(); });
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
        const tiles = query(root, '.play-tile');
        tiles.forEach(tile => {
          const image = tile.querySelector('img');
          const grow = () => gsap.to(image, { scale: 1.06, duration: .4, ease: 'power2.out', overwrite: 'auto' });
          const shrink = () => gsap.to(image, { scale: 1, duration: .5, ease: 'power2.out', overwrite: 'auto' });
          tile.addEventListener('pointerenter', grow); tile.addEventListener('pointerleave', shrink);
          tile.addEventListener('focus', grow); tile.addEventListener('blur', shrink);
          cleanups.push(() => { tile.removeEventListener('pointerenter', grow); tile.removeEventListener('pointerleave', shrink); tile.removeEventListener('focus', grow); tile.removeEventListener('blur', shrink); });
          gsap.fromTo(tile, { scale: .72, y: 40, opacity: .62, transformOrigin: 'center center' }, {
            scale: 1, y: 0, opacity: 1, ease: 'none',
            scrollTrigger: { ...scroll(tile, 'top 98%', 'top 40%'), scrub: .55 }
          });
          gsap.fromTo(image, { yPercent: 7 }, { yPercent: -5, ease: 'none', scrollTrigger: { ...scroll(tile, 'top bottom', 'bottom top'), scrub: .7 } });
        });
        const copy = root.querySelector('.play-copy');
        if (tiles[6] && !conditions.mobile) gsap.to(copy, {
          autoAlpha: 0, y: -20, ease: 'none',
          scrollTrigger: { ...scroll(tiles[6], 'top 58%', 'top 12%'), scrub: .4 }
        });
        ScrollTrigger.refresh();
        return;
      }
      ScrollTrigger.refresh();
    });

    return () => { cleanups.forEach(cleanup => cleanup()); media.revert(); context.revert(); };
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
    const media = view.querySelector('.project-media');
    query(view, '.project-frame').forEach(frame => {
      gsap.fromTo(frame.querySelector('img'), { scale: 1.06 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: frame, scroller: matchMedia('(max-width: 650px)').matches ? view : media, start: 'top bottom', end: 'bottom top', scrub: .6 } });
    });
    gsap.from(query(view, '.project-reference, .project-info-foot, .project-media-heading'), { y: 15, autoAlpha: 0, stagger: .1, duration: .55, delay: .3, ease: 'power2.out' });
  }

  function projectClose(view, done) {
    if (noMotion()) { done(); return; }
    projectDispose(view);
    gsap.to(view, { y: 22, autoAlpha: 0, duration: .28, ease: 'power2.in', onComplete: done });
  }

  function projectDispose(view) {
    ScrollTrigger.getAll().filter(trigger => view.contains(trigger.trigger)).forEach(trigger => trigger.kill());
  }

  function previewOpen(dialog) {
    if (noMotion()) return;
    gsap.fromTo(dialog, { y: 24, scale: .96, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: .42, ease: 'power3.out' });
    gsap.from(query(dialog, '.preview-image img, .preview-caption, .preview-source'), { y: 18, autoAlpha: 0, stagger: .07, duration: .5, delay: .1, ease: 'power2.out' });
  }

  return { loader, init, projectOpen, projectClose, projectDispose, previewOpen };
})();
