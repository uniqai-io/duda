import {
  gsap,
  ScrollTrigger
} from "../core/animation.js";

import { prefersReducedMotion } from "../core/reduced-motion.js";

let initialized = false;

function initProtectedProfileVideos() {
  const videos = document.querySelectorAll(
    "[data-profile-video]"
  );

  videos.forEach((video) => {
    video.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });

    video.addEventListener("dragstart", (event) => {
      event.preventDefault();
    });
  });
}

function initHero() {
  const hero = document.querySelector(
    "[data-profile-hero]"
  );

  const media = hero?.querySelector(
    "[data-profile-hero-media]"
  );

  const image = hero?.querySelector(
    ".profile-hero__image"
  );

  const lines = hero?.querySelectorAll(
    "[data-profile-hero-line]"
  );

  const meta = hero?.querySelector(
    "[data-profile-hero-meta]"
  );

  if (
    !hero ||
    !media ||
    !image ||
    !lines?.length
  ) {
    return;
  }

  if (prefersReducedMotion()) {
    gsap.set(
      [
        media,
        image,
        lines,
        meta
      ],
      {
        clearProps: "transform,opacity,visibility"
      }
    );

    return;
  }

  /* ================================
     INITIAL STATE
  ================================ */

  gsap.set(media, {
    scale: 1,
    yPercent: 0,
    force3D: true
  });

  gsap.set(image, {
    scale: 1.075,
    force3D: true
  });

  gsap.set(lines, {
    yPercent: 112,
    rotate: 1.2,
    transformOrigin: "0 100%",
    force3D: true
  });

  gsap.set(meta, {
    autoAlpha: 0,
    y: 12
  });

  /* ================================
     HERO INTRO
  ================================ */

  const timeline = gsap.timeline({
    defaults: {
      overwrite: "auto"
    }
  });

  timeline.to(
    image,
    {
      scale: 1,
      duration: 1.9,
      ease: "power4.out"
    },
    0
  );

  timeline.to(
    lines,
    {
      yPercent: 0,
      rotate: 0,
      duration: 1.25,
      stagger: 0.075,
      ease: "power4.out"
    },
    0.08
  );

  timeline.to(
    meta,
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.75,
      ease: "power3.out"
    },
    0.62
  );

  /* ================================
     HERO SCROLL
  ================================ */

  gsap.fromTo(
    media,
    {
      scale: 1,
      yPercent: 0
    },
    {
      scale: 1.075,
      yPercent: 4,
      ease: "none",
      immediateRender: false,

      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: 1.2,
        invalidateOnRefresh: true
      }
    }
  );
}

function initIntro() {
  const section = document.querySelector(
    "[data-profile-intro]"
  );

  const copy = section?.querySelector(
    "[data-profile-copy]"
  );

  const disciplines = section?.querySelectorAll(
    "[data-profile-discipline]"
  );

  if (
    !section ||
    !copy ||
    !disciplines?.length ||
    prefersReducedMotion()
  ) {
    return;
  }

  gsap.fromTo(
    copy,
    {
      autoAlpha: 0,
      y: 36
    },
    {
      autoAlpha: 1,
      y: 0,
      duration: 1.15,
      ease: "power4.out",
      scrollTrigger: {
        trigger: copy,
        start: "top 88%",
        once: true
      }
    }
  );

  disciplines.forEach((line, index) => {
    const from = index === 1
      ? 7
      : -7;

    const to = index === 1
      ? -4
      : 4;

    gsap.fromTo(
      line,
      {
        xPercent: from
      },
      {
        xPercent: to,
        ease: "none",
        scrollTrigger: {
          trigger: line,
          start: "top bottom",
          end: "bottom 20%",
          scrub: 1.35
        }
      }
    );
  });
}

function initDetails() {
  const section = document.querySelector(
    "[data-profile-details]"
  );

  const rows = section?.querySelectorAll(
    "[data-profile-detail]"
  );

  if (
    !section ||
    !rows?.length ||
    prefersReducedMotion()
  ) {
    return;
  }

  rows.forEach((row) => {
    const label = row.querySelector(
      ".profile-details__label"
    );

    const value = row.querySelector(
      ".profile-details__value"
    );

    gsap.fromTo(
      [label, value],
      {
        autoAlpha: 0,
        y: 16
      },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.05,
        ease: "power3.out",
        scrollTrigger: {
          trigger: row,
          start: "top 92%",
          once: true
        }
      }
    );
  });
}

function initFilm() {
  const film = document.querySelector(
    "[data-profile-film]"
  );

  const media = film?.querySelector(
    "[data-profile-media]"
  );

  const inner = film?.querySelector(
    "[data-profile-media-inner]"
  );

  if (
    !film ||
    !media ||
    !inner ||
    prefersReducedMotion()
  ) {
    return;
  }

  gsap.fromTo(
    media,
    {
      y: 150,
      autoAlpha: 0.55,
      clipPath: "inset(10% 0% 10% 0%)"
    },
    {
      y: 0,
      autoAlpha: 1,
      clipPath: "inset(0% 0% 0% 0%)",
      ease: "none",
      scrollTrigger: {
        trigger: film,
        start: "top 95%",
        end: "top 42%",
        scrub: 1.3
      }
    }
  );

  gsap.fromTo(
    inner,
    {
      yPercent: -5,
      scale: 1.07
    },
    {
      yPercent: 5,
      scale: 1.02,
      ease: "none",
      scrollTrigger: {
        trigger: media,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.25
      }
    }
  );
}

function initStoryRail() {
  const story = document.querySelector(
    "[data-profile-story]"
  );

  const left = story?.querySelector(
    "[data-profile-rail-left]"
  );

  const right = story?.querySelector(
    "[data-profile-rail-right]"
  );

  if (
    !story ||
    !left ||
    !right ||
    prefersReducedMotion()
  ) {
    return;
  }

  gsap.set(left, {
    yPercent: 55,
    autoAlpha: 0.05,
    force3D: true
  });

  gsap.set(right, {
    yPercent: -55,
    autoAlpha: 0.05,
    force3D: true
  });

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: story,
      start: "top 82%",
      end: "bottom 18%",
      scrub: 1.6,
      invalidateOnRefresh: true
    }
  });

  timeline.to(
    left,
    {
      yPercent: 0,
      autoAlpha: 0.65,
      duration: 1,
      ease: "none"
    },
    0
  );

  timeline.to(
    right,
    {
      yPercent: 0,
      autoAlpha: 0.65,
      duration: 1,
      ease: "none"
    },
    0
  );

  timeline.to(
    left,
    {
      yPercent: -55,
      autoAlpha: 0.05,
      duration: 1,
      ease: "none"
    },
    1
  );

  timeline.to(
    right,
    {
      yPercent: 55,
      autoAlpha: 0.05,
      duration: 1,
      ease: "none"
    },
    1
  );
}

function initStoryItems() {
  const items = document.querySelectorAll(
    "[data-profile-story-item]"
  );

  if (
    !items.length ||
    prefersReducedMotion()
  ) {
    return;
  }

  items.forEach((item, index) => {
    const media = item.querySelector(
      "[data-profile-media]"
    );

    const inner = item.querySelector(
      "[data-profile-media-inner]"
    );

    if (!media || !inner) return;

    /*
     * EVERY PHOTO USES THE SAME
     * VERTICAL MOTION / REVEAL SYSTEM.
     *
     * X changes only slightly to stop
     * the sequence feeling mechanically identical.
     */

    const direction = index % 2 === 0
      ? -1
      : 1;

    gsap.fromTo(
      item,
      {
        y: 170,
        x: 24 * direction,
        autoAlpha: 0.35
      },
      {
        y: 0,
        x: 0,
        autoAlpha: 1,
        ease: "none",
        scrollTrigger: {
          trigger: item,
          start: "top 100%",
          end: "top 48%",
          scrub: 1.35
        }
      }
    );

    /*
     * FRAME REVEAL
     */

    gsap.fromTo(
      media,
      {
        clipPath: "inset(12% 0% 12% 0%)"
      },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        ease: "none",
        scrollTrigger: {
          trigger: item,
          start: "top 96%",
          end: "top 52%",
          scrub: 1.2
        }
      }
    );

    /*
     * INTERNAL IMAGE PARALLAX
     */

    gsap.fromTo(
      inner,
      {
        yPercent: -5,
        scale: 1.07
      },
      {
        yPercent: 5,
        scale: 1.02,
        ease: "none",
        scrollTrigger: {
          trigger: media,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.3
        }
      }
    );
  });
}

function initVideoPlayback() {
  const videos = document.querySelectorAll(
    "[data-profile-video]"
  );

  if (!videos.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;

        if (entry.isIntersecting) {
          const promise = video.play();

          if (promise) {
            promise.catch(() => {});
          }
        } else {
          video.pause();
        }
      });
    },
    {
      threshold: 0.15
    }
  );

  videos.forEach((video) => {
    observer.observe(video);

    video.addEventListener(
      "loadedmetadata",
      () => {
        ScrollTrigger.refresh();
      },
      {
        once: true
      }
    );
  });
}

function initBooking() {
  const section = document.querySelector(
    "[data-profile-booking]"
  );

  const object = section?.querySelector(
    "[data-profile-booking-object]"
  );

  const words = section?.querySelectorAll(
    "[data-profile-booking-word]"
  );

  if (
    !section ||
    !object ||
    !words?.length ||
    prefersReducedMotion()
  ) {
    return;
  }

  gsap.set(object, {
    rotationX: 26,
    rotationY: -34,
    z: -260,
    scale: 0.86,
    transformPerspective: 1600,
    force3D: true
  });

  gsap.set(words, {
    autoAlpha: 0,
    y: 90,
    rotationX: 55,
    transformOrigin: "50% 100%",
    force3D: true
  });

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 82%",
      end: "bottom 18%",
      scrub: 1.5,
      invalidateOnRefresh: true
    }
  });

  timeline.to(
    words,
    {
      autoAlpha: 1,
      y: 0,
      rotationX: 0,
      stagger: 0.08,
      duration: 0.65,
      ease: "none"
    },
    0
  );

  timeline.to(
    object,
    {
      rotationX: 0,
      rotationY: 0,
      z: 0,
      scale: 1,
      duration: 0.9,
      ease: "none"
    },
    0
  );

  timeline.to(
    object,
    {
      rotationX: -12,
      rotationY: 38,
      z: 130,
      scale: 1.07,
      duration: 0.9,
      ease: "none"
    },
    0.9
  );

  timeline.to(
    words,
    {
      z: (index) => index * 28,
      duration: 0.9,
      ease: "none"
    },
    0.9
  );
}

function initProfilePage() {
  if (initialized) return;

  initialized = true;

  initProtectedProfileVideos();
  initHero();
  initIntro();
  initDetails();
  initFilm();
  initStoryRail();
  initStoryItems();
  initVideoPlayback();
  initBooking();

  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
  });
}

if (
  document.documentElement.classList.contains(
    "js-preload"
  )
) {
  window.addEventListener(
    "duda:loader-reveal",
    initProfilePage,
    {
      once: true
    }
  );
} else {
  initProfilePage();
}