import Swiper from "swiper";
import {
  Keyboard,
  Parallax
} from "swiper/modules";
import SplitType from "split-type";
import {
  gsap,
  ScrollTrigger
} from "../core/animation.js";
import { prefersReducedMotion } from "../core/reduced-motion.js";

let revealInitialized = false;
let completeInitialized = false;

function initProtectedVideos() {
  const videos = document.querySelectorAll("[data-protected-video]");

  videos.forEach((video) => {
    video.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });

    video.addEventListener("dragstart", (event) => {
      event.preventDefault();
    });
  });
}

function initHeroEntrance() {
  const title = document.querySelector("[data-hero-title]");
  const media = document.querySelector("[data-hero-media]");
  const mediaInner = document.querySelector("[data-hero-media-inner]");
  const meta = document.querySelectorAll("[data-hero-meta]");

  if (!title || !media || !mediaInner) return;

  if (prefersReducedMotion()) {
    gsap.set(title, {
      opacity: 1
    });

    gsap.set(media, {
      autoAlpha: 1
    });

    gsap.set(meta, {
      autoAlpha: 1
    });

    return;
  }

  const split = new SplitType(title, {
    types: "chars"
  });

  const chars = split.chars;
  const center = (chars.length - 1) / 2;

  gsap.set(media, {
    autoAlpha: 1
  });

  gsap.set(mediaInner, {
    scale: 1.04
  });

  gsap.set(title, {
    opacity: 1,
    scaleX: 1.04,
    transformOrigin: "50% 50%"
  });

  gsap.set(chars, {
    autoAlpha: 0,
    y: 38,
    x: (index) => {
      return (index - center) * 3;
    },
    scaleY: 0.9,
    transformOrigin: "50% 100%"
  });

  gsap.set(meta, {
    autoAlpha: 0,
    y: 12
  });

  gsap.timeline({
    defaults: {
      overwrite: "auto"
    }
  })
    .to(
      mediaInner,
      {
        scale: 1,
        duration: 1.7,
        ease: "power3.out"
      },
      0
    )
    .to(
      title,
      {
        scaleX: 1,
        duration: 1.35,
        ease: "expo.out"
      },
      0.04
    )
    .to(
      chars,
      {
        autoAlpha: 1,
        x: 0,
        y: 0,
        scaleY: 1,
        duration: 1.1,
        stagger: {
          each: 0.04,
          from: "center"
        },
        ease: "power4.out"
      },
      0.08
    )
    .to(
      meta,
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.06,
        ease: "power3.out"
      },
      0.58
    );
}

function initHeroScroll() {
  const hero = document.querySelector("[data-hero]");
  const video = document.querySelector("[data-protected-video]");

  if (!hero || !video || prefersReducedMotion()) return;

  const matchMedia = gsap.matchMedia();

  matchMedia.add("(min-width: 768px)", () => {
    gsap.set(video, {
      scale: 1
    });

    const tween = gsap.to(video, {
      scale: 1.045,
      ease: "none",
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: 0.8
      }
    });

    return () => {
      tween.kill();

      gsap.set(video, {
        clearProps: "transform"
      });
    };
  });
}

function initClientMarquee() {
  const marquee = document.querySelector("[data-client-marquee]");
  const track = document.querySelector("[data-client-track]");

  if (!marquee || !track) return;

  const originalGroup = track.querySelector("[data-client-group]");

  if (!originalGroup) return;

  /*
   * Remove clones if this gets initialized again.
   */
  track.querySelectorAll("[data-client-clone]").forEach((clone) => {
    clone.remove();
  });

  /*
   * We need enough repeated groups so that there is
   * NEVER exposed empty space, even on very wide screens.
   */
  const createClone = () => {
    const clone = originalGroup.cloneNode(true);

    clone.removeAttribute("data-client-group");
    clone.setAttribute("data-client-clone", "");
    clone.setAttribute("aria-hidden", "true");

    clone.querySelectorAll("[aria-label]").forEach((item) => {
      item.removeAttribute("aria-label");
    });

    track.appendChild(clone);

    return clone;
  };

  /*
   * Start with two repetitions.
   */
  createClone();

  /*
   * Keep cloning until we have enough content to:
   *
   * cover the viewport
   * +
   * travel one complete original group
   *
   * This removes the visible empty ending completely.
   */
  const fillTrack = () => {
    const groupWidth = originalGroup.offsetWidth;

    if (!groupWidth) return;

    const requiredWidth =
      marquee.clientWidth +
      groupWidth;

    while (
      track.scrollWidth < requiredWidth
    ) {
      createClone();
    }
  };

  fillTrack();

  if (prefersReducedMotion()) return;

  const groupWidth = originalGroup.offsetWidth;

  /*
   * Exact pixel travel.
   *
   * Once the first complete group has moved away,
   * the next identical group is occupying the exact
   * same position.
   */
  const tween = gsap.fromTo(
    track,
    {
      x: 0
    },
    {
      x: -groupWidth,
      duration: 28,
      repeat: -1,
      ease: "none"
    }
  );

  /*
   * Handle viewport changes without leaving
   * gaps in the marquee.
   */
  let resizeTimer;

  const handleResize = () => {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {
      tween.kill();

      track.querySelectorAll("[data-client-clone]").forEach((clone) => {
        clone.remove();
      });

      initClientMarquee();
    }, 150);
  };

  window.addEventListener(
    "resize",
    handleResize,
    { passive: true }
  );
}

function initSelectedWorkHeading() {
  const section = document.querySelector("[data-selected-work]");
  const heading = section?.querySelector("[data-selected-heading]");
  const title = heading?.querySelector(".home-selected__title");
  const swiperElement = section?.querySelector("[data-selected-swiper]");
  const selected = section?.querySelector("[data-selected-title-left]");
  const work = section?.querySelector("[data-selected-title-right]");

  if (
    !section ||
    !heading ||
    !title ||
    !swiperElement ||
    !selected ||
    !work ||
    prefersReducedMotion()
  ) {
    return;
  }

  const getSelectedTravel = () => {
    return title.clientWidth - selected.offsetWidth;
  };

  const getWorkTravel = () => {
    return title.clientWidth - work.offsetWidth;
  };

  gsap.set([selected, work], {
    x: 0,
    force3D: true
  });

  const matchMedia = gsap.matchMedia();

  /*
   * DESKTOP / TABLET
   * GSAP owns the pin.
   */
  matchMedia.add("(min-width: 768px)", () => {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: heading,
        start: "top 18%",
        endTrigger: swiperElement,
        end: "bottom 10%",
        pin: heading,
        pinSpacing: false,
        scrub: 1.35,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });

    timeline
      .fromTo(
        selected,
        {
          x: 0
        },
        {
          x: () => getSelectedTravel(),
          duration: 1,
          ease: "none"
        },
        0
      )
      .fromTo(
        work,
        {
          x: 0
        },
        {
          x: () => -getWorkTravel(),
          duration: 1,
          ease: "none"
        },
        0
      );

    return () => {
      timeline.scrollTrigger?.kill();
      timeline.kill();

      gsap.set([selected, work], {
        clearProps: "transform"
      });
    };
  });

  /*
   * MOBILE
   *
   * CSS position: sticky owns the sticky behavior.
   * GSAP ONLY owns horizontal text movement.
   *
   * This avoids Safari's pin-release jump.
   */
  matchMedia.add("(max-width: 767px)", () => {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: heading,
        start: "top 16%",
        endTrigger: swiperElement,
        end: "bottom 10%",
        scrub: 1.2,
        invalidateOnRefresh: true
      }
    });

    timeline
      .fromTo(
        selected,
        {
          x: 0
        },
        {
          x: () => getSelectedTravel(),
          duration: 1,
          ease: "none"
        },
        0
      )
      .fromTo(
        work,
        {
          x: 0
        },
        {
          x: () => -getWorkTravel(),
          duration: 1,
          ease: "none"
        },
        0
      );

    return () => {
      timeline.scrollTrigger?.kill();
      timeline.kill();

      gsap.set([selected, work], {
        clearProps: "transform"
      });
    };
  });
}

function initSelectedWorkSwiper() {
  const section = document.querySelector("[data-selected-work]");
  const swiperElement = document.querySelector("[data-selected-swiper]");

  if (!section || !swiperElement) return;

  const reducedMotion = prefersReducedMotion();

  const parallaxImages = swiperElement.querySelectorAll(
    "[data-selected-parallax]"
  );

  parallaxImages.forEach((image) => {
    image.setAttribute(
      "data-swiper-parallax-x",
      reducedMotion ? "0%" : "-8%"
    );
  });

  const swiper = new Swiper(swiperElement, {
    modules: [
      Keyboard,
      Parallax
    ],

    slidesPerView: "auto",
    spaceBetween: 32,

    speed: reducedMotion ? 0 : 1050,

    parallax: {
      enabled: !reducedMotion
    },

    keyboard: {
      enabled: true,
      onlyInViewport: true,
      pageUpDown: false
    },

    grabCursor: !reducedMotion,

    watchSlidesProgress: true,
    watchOverflow: true,

    centeredSlides: false,

    followFinger: true,
    simulateTouch: true,

    touchRatio: 0.82,
    threshold: 3,
    touchAngle: 45,

    resistance: true,
    resistanceRatio: 0.7,

    shortSwipes: true,
    longSwipes: true,
    longSwipesMs: 280,
    longSwipesRatio: 0.22,

    preventClicks: true,
    preventClicksPropagation: true,
    preventInteractionOnTransition: false,

    roundLengths: false,

    lazyPreloadPrevNext: 2,

    breakpoints: {
      0: {
        spaceBetween: 14,
        touchRatio: 0.9
      },

      768: {
        spaceBetween: 22,
        touchRatio: 0.86
      },

      1025: {
        spaceBetween: 32,
        touchRatio: 0.82
      }
    },

    on: {
      init(instance) {
        requestAnimationFrame(() => {
          instance.update();
        });
      },

      resize(instance) {
        requestAnimationFrame(() => {
          instance.update();
        });
      }
    }
  });

  if (!reducedMotion) {
    const headingMeta = section.querySelector(
      ".home-selected__heading .meta"
    );

    if (headingMeta) {
      gsap.fromTo(
        headingMeta,
        {
          autoAlpha: 0,
          y: 16
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 86%",
            once: true
          }
        }
      );
    }

    gsap.fromTo(
  swiperElement,
  {
    autoAlpha: 0,
    y: 24
  },
  {
    autoAlpha: 1,
    y: 0,
    duration: 1.25,
    ease: "power4.out",
    scrollTrigger: {
      trigger: swiperElement,
      start: "top 94%",
      once: true
    }
  }
);
  }

  return swiper;
}

function initProfile() {
  const section = document.querySelector("[data-profile]");
  const stage = document.querySelector("[data-profile-stage]");
  const prism = document.querySelector("[data-profile-prism]");
  const duda = document.querySelector("[data-profile-duda]");
  const negrao = document.querySelector("[data-profile-negrao]");
  const bottom = document.querySelector("[data-profile-bottom]");
  const mediaInners = prism?.querySelectorAll(
    "[data-profile-media-inner]"
  ) || [];
  const overlays = prism?.querySelectorAll(
    "[data-profile-overlay]"
  ) || [];
  const views = prism?.querySelectorAll(
    "[data-profile-view]"
  ) || [];

  if (
    !section ||
    !stage ||
    !prism ||
    !duda ||
    !negrao
  ) {
    return;
  }

  function updatePrismDepth() {
    const depth = prism.offsetWidth / 2;

    prism.style.setProperty(
      "--profile-depth",
      `${depth}px`
    );
  }

  updatePrismDepth();

  const resizeObserver = new ResizeObserver(() => {
    updatePrismDepth();
  });

  resizeObserver.observe(prism);

  if (prefersReducedMotion()) {
    gsap.set(prism, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      z: 0
    });

    gsap.set([duda, negrao], {
      autoAlpha: 1,
      x: 0
    });

    return;
  }

  gsap.set(stage, {
    perspective: 1800,
    perspectiveOrigin: "50% 50%"
  });

  gsap.set(prism, {
    rotateY: 0,
    rotateX: 3,
    scale: 0.9,
    z: -120,
    transformStyle: "preserve-3d",
    transformOrigin: "50% 50%",
    force3D: true
  });

  gsap.set([duda, negrao], {
    force3D: true
  });

  const edge = 100;

  const getLeftOutside = (element) => {
    return (
      -element.offsetLeft -
      element.offsetWidth -
      edge
    );
  };

  const getRightOutside = (element) => {
    return (
      window.innerWidth -
      element.offsetLeft +
      edge
    );
  };

  const getDudaHeroX = () => {
    const prismRect = prism.getBoundingClientRect();

    return (
      prismRect.left -
      duda.offsetLeft -
      duda.offsetWidth +
      prismRect.width * 0.22
    );
  };

  const getNegraoHeroX = () => {
    const prismRect = prism.getBoundingClientRect();

    return (
      prismRect.right -
      negrao.offsetLeft -
      prismRect.width * 0.22
    );
  };

  /*
   * Longer because we're now showing
   * FOUR actual faces.
   */
  const scrollDistance = () => {
    return window.innerWidth <= 767
      ? window.innerHeight * 2.8
      : window.innerHeight * 3.8;
  };

  /*
   * --------------------------------
   * MASTER PINNED EXPERIENCE
   * --------------------------------
   */

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: stage,
      start: "top top",
      end: () => `+=${scrollDistance()}`,
      pin: true,
      scrub: 1.6,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onRefreshInit: updatePrismDepth
    }
  });

  /*
   * --------------------------------
   * 3D PRISM
   *
   * FACE 01  0°
   * FACE 02 -90°
   * FACE 03 -180°
   * FACE 04 -270°
   * --------------------------------
   */

  timeline.to(
    prism,
    {
      rotateY: -90,
      rotateX: 1,
      scale: 0.98,
      z: 20,
      duration: 1,
      ease: "none"
    },
    0
  );

  timeline.to(
    prism,
    {
      rotateY: -180,
      rotateX: 0,
      scale: 1,
      z: 70,
      duration: 1,
      ease: "none"
    },
    1
  );

  timeline.to(
    prism,
    {
      rotateY: -270,
      rotateX: -3,
      scale: 0.9,
      z: -120,
      duration: 1,
      ease: "none"
    },
    2
  );

  /*
   * --------------------------------
   * DUDA
   *
   * Left → composition → full right.
   * --------------------------------
   */

  timeline.fromTo(
    duda,
    {
      x: () => getLeftOutside(duda),
      autoAlpha: 0
    },
    {
      x: () => getDudaHeroX(),
      autoAlpha: 1,
      duration: 1.25,
      ease: "none"
    },
    0
  );

  timeline.to(
    duda,
    {
      x: () => getRightOutside(duda),
      autoAlpha: 0,
      duration: 1.75,
      ease: "none"
    },
    1.25
  );

  /*
   * --------------------------------
   * NEGRÃO
   *
   * Right → composition → full left.
   * --------------------------------
   */

  timeline.fromTo(
    negrao,
    {
      x: () => getRightOutside(negrao),
      autoAlpha: 0
    },
    {
      x: () => getNegraoHeroX(),
      autoAlpha: 1,
      duration: 1.25,
      ease: "none"
    },
    0
  );

  timeline.to(
    negrao,
    {
      x: () => getLeftOutside(negrao),
      autoAlpha: 0,
      duration: 1.75,
      ease: "none"
    },
    1.25
  );

  /*
   * --------------------------------
   * IMAGE BREATHING
   *
   * Hover owns media-inner scale later,
   * so we don't animate the same property here.
   * --------------------------------
   */

  const images = prism.querySelectorAll(
    ".home-profile__image"
  );

  timeline.fromTo(
    images,
    {
      yPercent: -3
    },
    {
      yPercent: 3,
      duration: 3,
      ease: "none"
    },
    0
  );

  /*
   * --------------------------------
   * HOVER
   * --------------------------------
   */

  const canHover = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches;

  function showProfileHover() {
    gsap.to(overlays, {
      autoAlpha: 1,
      duration: 0.5,
      ease: "power2.out",
      overwrite: true
    });

    gsap.to(views, {
      autoAlpha: 1,
      yPercent: -10,
      duration: 0.6,
      ease: "power3.out",
      overwrite: true
    });

    gsap.to(mediaInners, {
      scale: 1.035,
      duration: 0.9,
      ease: "power3.out",
      overwrite: true
    });
  }

  function hideProfileHover() {
    gsap.to(overlays, {
      autoAlpha: 0,
      duration: 0.45,
      ease: "power2.out",
      overwrite: true
    });

    gsap.to(views, {
      autoAlpha: 0,
      yPercent: 0,
      duration: 0.45,
      ease: "power3.out",
      overwrite: true
    });

    gsap.to(mediaInners, {
      scale: 1,
      duration: 0.8,
      ease: "power3.out",
      overwrite: true
    });
  }

  if (canHover) {
    prism.addEventListener(
      "mouseenter",
      showProfileHover
    );

    prism.addEventListener(
      "mouseleave",
      hideProfileHover
    );
  }

  prism.addEventListener(
    "focus",
    showProfileHover
  );

  prism.addEventListener(
    "blur",
    hideProfileHover
  );

  /*
   * --------------------------------
   * HEADER
   * --------------------------------
   */

  const headerItems = section.querySelectorAll(
    ".home-profile__header > *"
  );

  if (headerItems.length) {
    gsap.fromTo(
      headerItems,
      {
        autoAlpha: 0,
        y: 14
      },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 90%",
          once: true
        }
      }
    );
  }

  /*
   * --------------------------------
   * BOTTOM INFO
   * --------------------------------
   */

  if (bottom) {
    const bottomItems = bottom.querySelectorAll(
      ".home-profile__disciplines, .home-profile__bottom-link"
    );

    gsap.fromTo(
      bottomItems,
      {
        autoAlpha: 0,
        y: 28
      },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: bottom,
          start: "top 90%",
          once: true
        }
      }
    );
  }
}

function initWorkIndex() {
  if (prefersReducedMotion()) return;

  const projects = document.querySelectorAll(
    "[data-index-project]"
  );

  projects.forEach((project, index) => {
    gsap.fromTo(
      project,
      {
        autoAlpha: 0,
        y: 24
      },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        delay: index * 0.025,
        ease: "power3.out",
        scrollTrigger: {
          trigger: project,
          start: "top 92%",
          once: true
        }
      }
    );
  });
}

function startRevealPhase() {
  if (revealInitialized) return;

  revealInitialized = true;

  initProtectedVideos();
  initHeroEntrance();
}

function startCompletePhase() {
  if (completeInitialized) return;

  completeInitialized = true;

  initHeroScroll();
  initClientMarquee();
  initSelectedWorkHeading();
  initSelectedWorkSwiper();
  initWorkIndex();

  /*
   * THIS WAS MISSING.
   */
  initProfile();

  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
  });
}

if (
  document.documentElement.classList.contains("js-preload")
) {
  window.addEventListener(
    "duda:loader-reveal",
    startRevealPhase,
    { once: true }
  );

  window.addEventListener(
    "duda:loader-complete",
    startCompletePhase,
    { once: true }
  );
} else {
  startRevealPhase();
  startCompletePhase();
}