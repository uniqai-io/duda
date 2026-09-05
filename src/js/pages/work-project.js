import {
  gsap,
  ScrollTrigger
} from "../core/animation.js";

import { prefersReducedMotion } from "../core/reduced-motion.js";

let revealInitialized = false;
let completeInitialized = false;

/* ================================
   RESPONSIVE MOTION
================================ */

function isMobile() {
  return window.innerWidth <= 767;
}

/* ================================
   HERO INTRO
================================ */

function initProjectHeroIntro() {
  const hero = document.querySelector(
    "[data-project-hero]"
  );

  const words = hero?.querySelectorAll(
    "[data-project-word]"
  );

  const markObject = hero?.querySelector(
    "[data-project-mark-object]"
  );

  const meta = hero?.querySelectorAll(
    "[data-project-hero-meta]"
  );

  if (
    !hero ||
    words?.length < 2 ||
    !markObject
  ) {
    return;
  }

  const firstWord = words[0];
  const secondWord = words[1];

  if (prefersReducedMotion()) {
    gsap.set(
      [
        words,
        markObject,
        meta
      ],
      {
        clearProps: "all"
      }
    );

    return;
  }

  gsap.set(firstWord, {
    xPercent: () =>
      isMobile()
        ? 6
        : 18,
    y: () =>
      isMobile()
        ? 26
        : 42,
    rotationX: () =>
      isMobile()
        ? 5
        : 9,
    rotationY: () =>
      isMobile()
        ? 6
        : 12,
    autoAlpha: 0,
    letterSpacing: "-0.12em",
    force3D: true
  });

  gsap.set(secondWord, {
    xPercent: () =>
      isMobile()
        ? -6
        : -18,
    y: () =>
      isMobile()
        ? 26
        : 42,
    rotationX: () =>
      isMobile()
        ? 5
        : 9,
    rotationY: () =>
      isMobile()
        ? -6
        : -12,
    autoAlpha: 0,
    letterSpacing: "-0.12em",
    force3D: true
  });

  gsap.set(markObject, {
    scale: () =>
      isMobile()
        ? 0.65
        : 0.45,
    rotationX: () =>
      isMobile()
        ? 12
        : 22,
    rotationY: () =>
      isMobile()
        ? -16
        : -30,
    rotationZ: () =>
      isMobile()
        ? -2
        : -5,
    z: () =>
      isMobile()
        ? -80
        : -180,
    autoAlpha: 0,
    force3D: true
  });

  gsap.set(meta, {
    y: () =>
      isMobile()
        ? 8
        : 12,
    autoAlpha: 0
  });

  const timeline = gsap.timeline({
    defaults: {
      overwrite: "auto"
    }
  });

  timeline.to(
    markObject,
    {
      scale: 1,
      rotationX: 0,
      rotationY: () =>
        isMobile()
          ? -3
          : -7,
      rotationZ: () =>
        isMobile()
          ? -0.25
          : -0.6,
      z: 0,
      autoAlpha: 1,
      duration: 1.85,
      ease: "power4.out"
    },
    0
  );

  timeline.to(
    firstWord,
    {
      xPercent: 0,
      y: 0,
      rotationX: 0,
      rotationY: 0,
      autoAlpha: 1,
      letterSpacing: "-0.08em",
      duration: 1.8,
      ease: "power4.inOut"
    },
    0.12
  );

  timeline.to(
    secondWord,
    {
      xPercent: 0,
      y: 0,
      rotationX: 0,
      rotationY: 0,
      autoAlpha: 1,
      letterSpacing: "-0.08em",
      duration: 1.8,
      ease: "power4.inOut"
    },
    0.2
  );

  timeline.to(
    markObject,
    {
      rotationY: 0,
      rotationZ: 0,
      duration: 1.25,
      ease: "power3.out"
    },
    1
  );

  timeline.to(
    meta,
    {
      y: 0,
      autoAlpha: 1,
      duration: 0.9,
      stagger: 0.05,
      ease: "power3.out"
    },
    0.95
  );
}

/* ================================
   HERO SCROLL
================================ */

function initProjectHeroScroll() {
  const hero = document.querySelector(
    "[data-project-hero]"
  );

  const leftRow = hero?.querySelector(
    "[data-project-row-left]"
  );

  const rightRow = hero?.querySelector(
    "[data-project-row-right]"
  );

  const mark = hero?.querySelector(
    "[data-project-mark]"
  );

  const markObject = hero?.querySelector(
    "[data-project-mark-object]"
  );

  if (
    !hero ||
    !leftRow ||
    !rightRow ||
    !mark ||
    !markObject ||
    prefersReducedMotion()
  ) {
    return;
  }

  gsap.fromTo(
    leftRow,
    {
      xPercent: 0
    },
    {
      xPercent: () =>
        isMobile()
          ? -3
          : -9,
      ease: "none",
      immediateRender: false,

      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: 2.7,
        invalidateOnRefresh: true
      }
    }
  );

  gsap.fromTo(
    rightRow,
    {
      xPercent: 0
    },
    {
      xPercent: () =>
        isMobile()
          ? 3
          : 9,
      ease: "none",
      immediateRender: false,

      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: 2.7,
        invalidateOnRefresh: true
      }
    }
  );

  gsap.fromTo(
    mark,
    {
      yPercent: 0,
      scale: 1
    },
    {
      yPercent: () =>
        isMobile()
          ? -3
          : -6,
      scale: () =>
        isMobile()
          ? 1.06
          : 1.12,
      ease: "none",
      immediateRender: false,

      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: 3,
        invalidateOnRefresh: true
      }
    }
  );

  gsap.fromTo(
    markObject,
    {
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0
    },
    {
      rotationX: () =>
        isMobile()
          ? -2.5
          : -5,
      rotationY: () =>
        isMobile()
          ? 11
          : 22,
      rotationZ: () =>
        isMobile()
          ? 0.7
          : 1.5,
      ease: "none",
      immediateRender: false,

      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: 3.1,
        invalidateOnRefresh: true
      }
    }
  );
}

/* ================================
   PROJECT INFO
================================ */

function initProjectInfo() {
  const section = document.querySelector(
    "[data-project-info]"
  );

  const items = section?.querySelectorAll(
    "[data-project-info-item]"
  );

  const copy = section?.querySelector(
    "[data-project-info-copy]"
  );

  if (
    !section ||
    prefersReducedMotion()
  ) {
    return;
  }

  if (items?.length) {
    gsap.fromTo(
      items,
      {
        y: () =>
          isMobile()
            ? 20
            : 30,
        autoAlpha: 0
      },
      {
        y: 0,
        autoAlpha: 1,
        duration: 1.1,
        stagger: 0.08,
        ease: "power4.out",

        scrollTrigger: {
          trigger: section,
          start: "top 78%",
          once: true
        }
      }
    );
  }

  if (copy) {
    gsap.fromTo(
      copy,
      {
        y: () =>
          isMobile()
            ? 45
            : 70,
        rotationX: () =>
          isMobile()
            ? 4
            : 7,
        autoAlpha: 0
      },
      {
        y: 0,
        rotationX: 0,
        autoAlpha: 1,
        ease: "none",

        scrollTrigger: {
          trigger: copy,
          start: "top 94%",
          end: "top 58%",
          scrub: 1.9,
          invalidateOnRefresh: true
        }
      }
    );
  }
}

/* ================================
   INTRO TYPOGRAPHY
================================ */

function initProjectIntro() {
  const section = document.querySelector(
    "[data-project-intro]"
  );

  const lines = section?.querySelectorAll(
    "[data-project-intro-line]"
  );

  if (
    !section ||
    !lines?.length ||
    prefersReducedMotion()
  ) {
    return;
  }

  lines.forEach(
    (line, index) => {
      const direction =
        index === 0
          ? -1
          : index === 2
            ? 1
            : 0;

      gsap.fromTo(
        line,
        {
          xPercent: () =>
            direction *
            (
              isMobile()
                ? 2.5
                : 7
            ),
          y: () =>
            isMobile()
              ? 36
              : 55,
          rotationX: () =>
            isMobile()
              ? 6
              : 10,
          autoAlpha: 0.15
        },
        {
          xPercent: () =>
            direction *
            (
              isMobile()
                ? -0.75
                : -2
            ),
          y: 0,
          rotationX: 0,
          autoAlpha: 1,
          ease: "none",

          scrollTrigger: {
            trigger: line,
            start: "top 92%",
            end: "top 42%",
            scrub: 1.9,
            invalidateOnRefresh: true
          }
        }
      );
    }
  );
}

/* ================================
   EDITORIAL MEDIA
================================ */

function initProjectEditorial() {
  const items = document.querySelectorAll(
    "[data-project-media]"
  );

  if (
    !items.length ||
    prefersReducedMotion()
  ) {
    return;
  }

  items.forEach(
    (item) => {
      const media = item.querySelector(
        ".project-editorial__media"
      );

      const inner = item.querySelector(
        "[data-project-media-inner]"
      );

      if (
        !media ||
        !inner
      ) {
        return;
      }

      const direction =
        item.dataset.direction === "left"
          ? -1
          : 1;

      gsap.fromTo(
        media,
        {
          y: () =>
            isMobile()
              ? 70
              : 110,
          rotationY: () =>
            direction *
            (
              isMobile()
                ? 4.5
                : 8
            ),
          rotationZ: () =>
            direction *
            (
              isMobile()
                ? 0.45
                : 0.9
            ),
          scale: () =>
            isMobile()
              ? 0.97
              : 0.94,
          autoAlpha: 0.35
        },
        {
          y: 0,
          rotationY: () =>
            direction *
            (
              isMobile()
                ? -2
                : -4
            ),
          rotationZ: () =>
            direction *
            (
              isMobile()
                ? -0.1
                : -0.2
            ),
          scale: 1,
          autoAlpha: 1,
          ease: "none",

          scrollTrigger: {
            trigger: item,
            start: "top 95%",
            end: "center 52%",
            scrub: 2.1,
            invalidateOnRefresh: true
          }
        }
      );

      gsap.fromTo(
        inner,
        {
          yPercent: () =>
            isMobile()
              ? -3
              : -5,
          scale: () =>
            isMobile()
              ? 1.05
              : 1.08
        },
        {
          yPercent: () =>
            isMobile()
              ? 3
              : 5,
          scale: () =>
            isMobile()
              ? 1.015
              : 1.02,
          ease: "none",

          scrollTrigger: {
            trigger: media,
            start: "top bottom",
            end: "bottom top",
            scrub: 2.3,
            invalidateOnRefresh: true
          }
        }
      );
    }
  );
}

/* ================================
   FEATURE IMAGE
================================ */

function initProjectFeature() {
  const section = document.querySelector(
    "[data-project-feature]"
  );

  const media = section?.querySelector(
    "[data-project-feature-media]"
  );

  const inner = section?.querySelector(
    "[data-project-feature-inner]"
  );

  const word = section?.querySelector(
    "[data-project-feature-word]"
  );

  if (
    !section ||
    !media ||
    !inner ||
    prefersReducedMotion()
  ) {
    return;
  }

  gsap.fromTo(
    media,
    {
      scale: () =>
        isMobile()
          ? 0.92
          : 0.84,
      rotationX: () =>
        isMobile()
          ? 2.5
          : 5,
      rotationY: () =>
        isMobile()
          ? -3
          : -6
    },
    {
      scale: 1,
      rotationX: 0,
      rotationY: 0,
      ease: "none",

      scrollTrigger: {
        trigger: section,
        start: "top 90%",
        end: "center 48%",
        scrub: 2.3,
        invalidateOnRefresh: true
      }
    }
  );

  gsap.fromTo(
    inner,
    {
      scale: () =>
        isMobile()
          ? 1.06
          : 1.1,
      yPercent: () =>
        isMobile()
          ? -2.5
          : -4
    },
    {
      scale: () =>
        isMobile()
          ? 1.015
          : 1.02,
      yPercent: () =>
        isMobile()
          ? 2.5
          : 4,
      ease: "none",

      scrollTrigger: {
        trigger: media,
        start: "top bottom",
        end: "bottom top",
        scrub: 2.5,
        invalidateOnRefresh: true
      }
    }
  );

  if (word) {
    gsap.fromTo(
      word,
      {
        xPercent: () =>
          isMobile()
            ? -1
            : -6
      },
      {
        xPercent: () =>
          isMobile()
            ? 1.5
            : 8,
        ease: "none",

        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 2.6,
          invalidateOnRefresh: true
        }
      }
    );
  }
}

/* ================================
   NEXT PROJECT
================================ */

function initProjectEnd() {
  const section = document.querySelector(
    "[data-project-end]"
  );

  const link = section?.querySelector(
    "[data-project-end-link]"
  );

  const object = section?.querySelector(
    "[data-project-end-object]"
  );

  const word = section?.querySelector(
    "[data-project-end-word]"
  );

  const allWork = section?.querySelector(
    "[data-project-all-work]"
  );

  const allWorkLine = section?.querySelector(
    "[data-project-all-work-line]"
  );

  if (
    !section ||
    !link ||
    !object ||
    !word
  ) {
    return;
  }

  if (prefersReducedMotion()) {
    gsap.set(
      [
        object,
        word,
        allWork,
        allWorkLine
      ],
      {
        clearProps: "transform,opacity"
      }
    );

    return;
  }

  gsap.set(object, {
    transformOrigin: "50% 50%",
    force3D: true
  });

  gsap.set(word, {
    transformOrigin: "50% 50%",
    force3D: true
  });

  /* ================================
     NEXT PROJECT SCROLL
  ================================ */

  const scrollTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 92%",
      end: "bottom top",
      scrub: 2.4,
      invalidateOnRefresh: true
    }
  });

  scrollTimeline.fromTo(
    object,
    {
      y: () =>
        isMobile()
          ? 34
          : 55,
      scale: () =>
        isMobile()
          ? 0.96
          : 0.92,
      rotationX: () =>
        isMobile()
          ? 8
          : 16,
      rotationY: () =>
        isMobile()
          ? -3.5
          : -7,
      rotationZ: () =>
        isMobile()
          ? -0.1
          : -0.25,
      autoAlpha: 0.2
    },
    {
      y: 0,
      scale: 1,
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      autoAlpha: 1,
      duration: 0.58,
      ease: "none"
    }
  );

  scrollTimeline.to(
    object,
    {
      y: () =>
        isMobile()
          ? -8
          : -16,
      scale: () =>
        isMobile()
          ? 1.015
          : 1.03,
      rotationX: () =>
        isMobile()
          ? -0.75
          : -1.5,
      rotationY: () =>
        isMobile()
          ? 2.5
          : 5,
      rotationZ: () =>
        isMobile()
          ? 0.07
          : 0.15,
      duration: 0.42,
      ease: "none"
    }
  );

  /* ================================
     ALL WORK REVEAL
  ================================ */

  if (allWork) {
    gsap.fromTo(
      allWork,
      {
        y: 18,
        autoAlpha: 0
      },
      {
        y: 0,
        autoAlpha: 1,
        duration: 1,
        ease: "power3.out",

        scrollTrigger: {
          trigger: allWork,
          start: "top 96%",
          once: true
        }
      }
    );
  }

  if (allWorkLine) {
    gsap.fromTo(
      allWorkLine,
      {
        scaleX: 0
      },
      {
        scaleX: 0.3,
        duration: 1,
        ease: "power4.out",

        scrollTrigger: {
          trigger: allWork,
          start: "top 96%",
          once: true
        }
      }
    );
  }

  /* ================================
     DESKTOP INTERACTION
  ================================ */

  const canHover = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches;

  if (!canHover) return;

  gsap.set(link, {
    perspective: 1600
  });

  const rotateXTo = gsap.quickTo(
    word,
    "rotationX",
    {
      duration: 0.85,
      ease: "power3.out"
    }
  );

  const rotateYTo = gsap.quickTo(
    word,
    "rotationY",
    {
      duration: 0.85,
      ease: "power3.out"
    }
  );

  const xTo = gsap.quickTo(
    word,
    "x",
    {
      duration: 0.9,
      ease: "power3.out"
    }
  );

  const yTo = gsap.quickTo(
    word,
    "y",
    {
      duration: 0.9,
      ease: "power3.out"
    }
  );

  const scaleTo = gsap.quickTo(
    word,
    "scale",
    {
      duration: 0.85,
      ease: "power3.out"
    }
  );

  link.addEventListener(
    "pointermove",
    (event) => {
      const rect =
        link.getBoundingClientRect();

      const normalizedX =
        (
          event.clientX -
          rect.left
        ) /
          rect.width -
        0.5;

      const normalizedY =
        (
          event.clientY -
          rect.top
        ) /
          rect.height -
        0.5;

      rotateYTo(
        normalizedX * 10
      );

      rotateXTo(
        normalizedY * -6
      );

      xTo(
        normalizedX * 20
      );

      yTo(
        normalizedY * 10
      );

      scaleTo(1.025);
    }
  );

  link.addEventListener(
    "pointerleave",
    () => {
      rotateXTo(0);
      rotateYTo(0);
      xTo(0);
      yTo(0);
      scaleTo(1);
    }
  );

  /* ================================
     ALL WORK INTERACTION
  ================================ */

  if (
    allWork &&
    allWorkLine
  ) {
    const allWorkXTo = gsap.quickTo(
      allWork,
      "x",
      {
        duration: 0.7,
        ease: "power3.out"
      }
    );

    const allWorkYTo = gsap.quickTo(
      allWork,
      "y",
      {
        duration: 0.7,
        ease: "power3.out"
      }
    );

    allWork.addEventListener(
      "pointermove",
      (event) => {
        const rect =
          allWork.getBoundingClientRect();

        const normalizedX =
          (
            event.clientX -
            rect.left
          ) /
            rect.width -
          0.5;

        const normalizedY =
          (
            event.clientY -
            rect.top
          ) /
            rect.height -
          0.5;

        allWorkXTo(
          normalizedX * 10
        );

        allWorkYTo(
          normalizedY * 5
        );
      }
    );

    allWork.addEventListener(
      "pointerenter",
      () => {
        gsap.to(
          allWorkLine,
          {
            scaleX: 1,
            duration: 0.65,
            ease: "power3.out"
          }
        );

        gsap.to(
          ".project-next__all-work-label",
          {
            letterSpacing: "0.2em",
            duration: 0.65,
            ease: "power3.out"
          }
        );
      }
    );

    allWork.addEventListener(
      "pointerleave",
      () => {
        allWorkXTo(0);
        allWorkYTo(0);

        gsap.to(
          allWorkLine,
          {
            scaleX: 0.3,
            duration: 0.65,
            ease: "power3.out"
          }
        );

        gsap.to(
          ".project-next__all-work-label",
          {
            letterSpacing: "0.14em",
            duration: 0.65,
            ease: "power3.out"
          }
        );
      }
    );
  }
}

/* ================================
   REVEAL PHASE
================================ */

function startRevealPhase() {
  if (revealInitialized) return;

  revealInitialized = true;

  initProjectHeroIntro();
}

/* ================================
   COMPLETE PHASE
================================ */

function startCompletePhase() {
  if (completeInitialized) return;

  completeInitialized = true;

  initProjectHeroScroll();
  initProjectInfo();
  initProjectIntro();
  initProjectEditorial();
  initProjectFeature();
  initProjectEnd();

  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
  });
}

/* ================================
   INITIALIZE
================================ */

if (
  document.documentElement.classList.contains(
    "js-preload"
  )
) {
  window.addEventListener(
    "duda:loader-reveal",
    startRevealPhase,
    {
      once: true
    }
  );

  window.addEventListener(
    "duda:loader-complete",
    startCompletePhase,
    {
      once: true
    }
  );
} else {
  startRevealPhase();
  startCompletePhase();
}