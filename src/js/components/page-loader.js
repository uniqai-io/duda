import { gsap } from "../core/animation.js";
import { prefersReducedMotion } from "../core/reduced-motion.js";

const SELECTORS = {
  loader: "[data-loader]",
  top: "[data-loader-top]",
  bottom: "[data-loader-bottom]",
  content: "[data-loader-content]",
  signature: "[data-loader-signature]",
  base: ".duda-loader__signature-svg--base",
  fill: "[data-loader-fill]",
  label: "[data-loader-label]"
};

function dispatchReveal() {
  window.dispatchEvent(
    new CustomEvent("duda:loader-reveal")
  );
}

function dispatchComplete() {
  window.dispatchEvent(
    new CustomEvent("duda:loader-complete")
  );
}

export function initPageLoader() {
  const docEl = document.documentElement;
  const loader = document.querySelector(SELECTORS.loader);

  if (!loader) {
    docEl.classList.remove("js-preload");
    dispatchReveal();
    dispatchComplete();
    return;
  }

  const top = loader.querySelector(SELECTORS.top);
  const bottom = loader.querySelector(SELECTORS.bottom);
  const content = loader.querySelector(SELECTORS.content);
  const signature = loader.querySelector(SELECTORS.signature);
  const base = loader.querySelector(SELECTORS.base);
  const fill = loader.querySelector(SELECTORS.fill);
  const label = loader.querySelector(SELECTORS.label);

  let completed = false;

  function lockPage() {
    docEl.style.overflow = "hidden";

    if (window.lenis) {
      window.lenis.stop();
    }
  }

  function unlockPage() {
    docEl.style.overflow = "";

    if (window.lenis) {
      window.lenis.start();
    }
  }

  function finish() {
    if (completed) return;

    completed = true;

    unlockPage();

    docEl.classList.remove("js-preload");

    gsap.set(loader, {
      autoAlpha: 0,
      pointerEvents: "none"
    });

    dispatchComplete();
  }

  function showLoaderInstant() {
    gsap.killTweensOf([
      loader,
      top,
      bottom,
      content,
      signature,
      base,
      fill,
      label
    ]);

    gsap.set(loader, {
      autoAlpha: 1,
      pointerEvents: "auto"
    });

    gsap.set([top, bottom], {
      yPercent: 0
    });

    gsap.set(content, {
      autoAlpha: 0,
      y: 0,
      scale: 1
    });

    gsap.set(signature, {
      scale: 1
    });

    gsap.set(fill, {
      clipPath: "inset(0% 100% 0% 0%)"
    });

    gsap.set(label, {
      autoAlpha: 0,
      y: 0
    });
  }

  if (prefersReducedMotion()) {
    dispatchReveal();
    finish();
    return;
  }

  lockPage();

  /* ================================
     INITIAL STATE
  ================================ */
  gsap.set(loader, {
    autoAlpha: 1,
    pointerEvents: "auto"
  });

  gsap.set([top, bottom], {
    yPercent: 0
  });

  gsap.set(content, {
    autoAlpha: 1,
    y: 0,
    scale: 1
  });

  gsap.set(signature, {
    scale: 1.045,
    y: 4,
    force3D: true
  });

  gsap.set(base, {
    autoAlpha: 0
  });

  gsap.set(fill, {
    clipPath: "inset(0% 100% 0% 0%)"
  });

  gsap.set(label, {
    autoAlpha: 0,
    y: 8,
    letterSpacing: "0.32em"
  });

  /* ================================
     MAIN SEQUENCE
  ================================ */
  const timeline = gsap.timeline({
    defaults: {
      overwrite: "auto"
    }
  });

  /*
   * Signature ghost appears first.
   */
  timeline.to(
    base,
    {
      autoAlpha: 1,
      duration: 0.65,
      ease: "sine.out"
    },
    0
  );

  /*
   * Signature subtly settles into position.
   */
  timeline.to(
    signature,
    {
      scale: 1,
      y: 0,
      duration: 1.7,
      ease: "expo.out"
    },
    0
  );

  /*
   * Main DN reveal.
   */
  timeline.to(
    fill,
    {
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 1.55,
      ease: "power4.inOut"
    },
    0.12
  );

  /*
   * Small editorial lockup appears underneath.
   */
  timeline.to(
    label,
    {
      autoAlpha: 1,
      y: 0,
      letterSpacing: "0.24em",
      duration: 0.75,
      ease: "power3.out"
    },
    0.65
  );

  /*
   * Small pause at fully revealed state.
   */
  timeline.to({}, {
    duration: 0.16
  });

  /*
   * Hero animation can begin underneath
   * before the loader is fully gone.
   */
  timeline.add(dispatchReveal);

  /*
   * Signature and lockup disappear together.
   */
  timeline.to(
    content,
    {
      autoAlpha: 0,
      y: -5,
      scale: 0.985,
      duration: 0.5,
      ease: "power3.inOut"
    }
  );

  /*
   * Shutters open while content disappears.
   */
  timeline.to(
    top,
    {
      yPercent: -100,
      duration: 1,
      ease: "expo.inOut"
    },
    "-=0.3"
  );

  timeline.to(
    bottom,
    {
      yPercent: 100,
      duration: 1,
      ease: "expo.inOut"
    },
    "<"
  );

  timeline.add(finish, "-=0.03");

  /* ================================
     PAGE LEAVE
  ================================ */
  window.addEventListener(
    "beforeunload",
    showLoaderInstant,
    { capture: true }
  );

  window.addEventListener(
    "pagehide",
    showLoaderInstant,
    { capture: true }
  );

  /* ================================
     BFCACHE
  ================================ */
  window.addEventListener("pageshow", (event) => {
    if (!event.persisted) return;

    docEl.classList.remove("js-preload");

    unlockPage();

    gsap.set(loader, {
      autoAlpha: 0,
      pointerEvents: "none"
    });
  });
}