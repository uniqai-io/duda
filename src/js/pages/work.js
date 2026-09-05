import {
  gsap,
  ScrollTrigger
} from "../core/animation.js";

import { prefersReducedMotion } from "../core/reduced-motion.js";

let revealInitialized = false;
let completeInitialized = false;

/* ================================
   HERO ENTRANCE
================================ */

function initWorkHero() {
  const hero = document.querySelector(
    "[data-work-hero]"
  );

  const lines = hero?.querySelectorAll(
    "[data-work-hero-line]"
  );

  const meta = hero?.querySelectorAll(
    "[data-work-hero-meta]"
  );

  if (
    !hero ||
    !lines?.length
  ) {
    return;
  }

  const selected = lines[0];
  const work = lines[1];

  if (prefersReducedMotion()) {
    gsap.set(lines, {
      xPercent: 0,
      y: 0,
      scale: 1,
      rotationX: 0,
      rotationY: 0,
      autoAlpha: 1,
      letterSpacing: "-0.075em"
    });

    gsap.set(meta, {
      y: 0,
      autoAlpha: 1
    });

    return;
  }

  gsap.set(selected, {
    xPercent: 18,
    y: 45,
    scale: 0.94,
    rotationX: 14,
    rotationY: 5,
    autoAlpha: 0,
    letterSpacing: "-0.11em",
    force3D: true
  });

  gsap.set(work, {
    xPercent: -18,
    y: 45,
    scale: 0.94,
    rotationX: 14,
    rotationY: -5,
    autoAlpha: 0,
    letterSpacing: "-0.11em",
    force3D: true
  });

  gsap.set(meta, {
    y: 14,
    autoAlpha: 0
  });

  const timeline = gsap.timeline({
    defaults: {
      overwrite: "auto"
    }
  });

  timeline.to(
    [selected, work],
    {
      y: 0,
      autoAlpha: 1,
      scale: 1,
      rotationX: 0,
      rotationY: 0,
      duration: 1.65,
      stagger: 0.06,
      ease: "power4.out"
    },
    0
  );

  timeline.to(
    selected,
    {
      xPercent: 0,
      letterSpacing: "-0.075em",
      duration: 1.85,
      ease: "power4.inOut"
    },
    0.08
  );

  timeline.to(
    work,
    {
      xPercent: 0,
      letterSpacing: "-0.075em",
      duration: 1.85,
      ease: "power4.inOut"
    },
    0.08
  );

  timeline.to(
    meta,
    {
      y: 0,
      autoAlpha: 1,
      duration: 1,
      stagger: 0.06,
      ease: "power3.out"
    },
    0.95
  );
}

/* ================================
   HERO SCROLL
================================ */

function initWorkHeroScroll() {
  const hero = document.querySelector(
    "[data-work-hero]"
  );

  const masks = hero?.querySelectorAll(
    ".work-hero__mask"
  );

  if (
    !hero ||
    masks?.length < 2 ||
    prefersReducedMotion()
  ) {
    return;
  }

  const selectedMask = masks[0];
  const workMask = masks[1];

  /*
   * Intro owns the text transforms.
   * Scroll owns only the wrappers.
   * This prevents the first-scroll snap.
   */

  gsap.fromTo(
    selectedMask,
    {
      xPercent: 0
    },
    {
      xPercent: -5,
      ease: "none",
      immediateRender: false,

      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: 2.8
      }
    }
  );

  gsap.fromTo(
    workMask,
    {
      xPercent: 0
    },
    {
      xPercent: 5,
      ease: "none",
      immediateRender: false,

      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: 2.8
      }
    }
  );
}

/* ================================
   BUILD PREVIEW LAYERS
================================ */

function buildPreviewLayers(
  depth,
  items
) {
  depth.replaceChildren();

  return items.map(
    (item, index) => {
      const src =
        item.dataset.preview;

      const layer =
        document.createElement("div");

      const image =
        document.createElement("img");

      layer.className =
        "work-preview__layer";

      image.src = src;
      image.alt = "";
      image.draggable = false;
      image.decoding = "async";

      if (index === 0) {
        image.fetchPriority = "high";
      }

      layer.appendChild(image);
      depth.appendChild(layer);

      return {
        layer,
        image
      };
    }
  );
}

/* ================================
   WORK PREVIEW
================================ */

function initWorkPreview() {
  const index = document.querySelector(
    "[data-work-index]"
  );

  const preview = index?.querySelector(
    "[data-work-preview]"
  );

  const frame = index?.querySelector(
    "[data-work-preview-frame]"
  );

  const depth = index?.querySelector(
    "[data-work-preview-depth]"
  );

  const items = Array.from(
    index?.querySelectorAll(
      "[data-work-item]"
    ) || []
  );

  if (
    !index ||
    !preview ||
    !frame ||
    !depth ||
    !items.length
  ) {
    return null;
  }

  /* ================================
     IMAGE STACK
  ================================ */

  const previews = buildPreviewLayers(
    depth,
    items
  );

  const layers = previews.map(
    (previewItem) =>
      previewItem.layer
  );

  const images = previews.map(
    (previewItem) =>
      previewItem.image
  );

  gsap.set(layers, {
    autoAlpha: 0,
    zIndex: 1
  });

  gsap.set(images, {
    scale: 1,
    yPercent: 0,
    force3D: true
  });

  gsap.set(layers[0], {
    autoAlpha: 1,
    zIndex: 2
  });

  /* ================================
     3D SETUP
  ================================ */

  gsap.set(preview, {
    perspective: 1500
  });

  gsap.set(frame, {
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    transformOrigin: "50% 50%",
    transformStyle: "preserve-3d",
    force3D: true
  });

  let activeIndex = 0;

  /* ================================
     TILT
  ================================ */

  function getTiltAmount() {
    /*
     * Roughly 10% stronger than before.
     */

    if (window.innerWidth <= 767) {
      return 3;
    }

    if (window.innerWidth <= 1024) {
      return 4;
    }

    return 5;
  }

  function getTiltDirection(item) {
    return item.classList.contains(
      "work-item--left"
    )
      ? -1
      : 1;
  }

  function tiltPreview(
    targetIndex,
    immediate = false
  ) {
    const item =
      items[targetIndex];

    if (!item) return;

    const direction =
      getTiltDirection(item);

    const rotationY =
      direction *
      getTiltAmount();

    const rotationZ =
      direction * 0.22;

    /*
     * Slight X tilt adds depth without
     * turning it into a rotating card.
     */

    const rotationX =
      window.innerWidth <= 767
        ? -0.45
        : -0.7;

    if (immediate) {
      gsap.set(frame, {
        rotationX,
        rotationY,
        rotationZ
      });

      return;
    }

    gsap.to(frame, {
      rotationX,
      rotationY,
      rotationZ,
      duration: 1.65,
      ease: "power3.out",
      overwrite: "auto"
    });
  }

  /* ================================
     INITIAL PROJECT
  ================================ */

  tiltPreview(
    activeIndex,
    true
  );

  /* ================================
     REDUCED MOTION
  ================================ */

  if (prefersReducedMotion()) {
    gsap.set(depth, {
      autoAlpha: 1,
      scale: 1
    });

    gsap.set(frame, {
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0
    });

    function showStaticProject(
      targetIndex
    ) {
      if (
        targetIndex < 0 ||
        targetIndex >=
          previews.length
      ) {
        return;
      }

      activeIndex =
        targetIndex;

      previews.forEach(
        (
          previewItem,
          previewIndex
        ) => {
          gsap.set(
            previewItem.layer,
            {
              autoAlpha:
                previewIndex ===
                targetIndex
                  ? 1
                  : 0,

              zIndex:
                previewIndex ===
                targetIndex
                  ? 2
                  : 1
            }
          );
        }
      );
    }

    return {
      showProject:
        showStaticProject,

      refreshTilt:
        () => {}
    };
  }

  /* ================================
     PREVIEW ENTRANCE
  ================================ */

  gsap.set(depth, {
    autoAlpha: 0,
    scale: 0.975,
    force3D: true
  });

  gsap.to(depth, {
    autoAlpha: 1,
    scale: 1,
    ease: "none",

    scrollTrigger: {
      trigger: index,
      start: "top 88%",
      end: "top 46%",
      scrub: 2
    }
  });

  /* ================================
     SLOW IMAGE FLOAT
  ================================ */

  gsap.fromTo(
    frame,
    {
      yPercent: 1.2
    },
    {
      yPercent: -1.2,
      ease: "none",

      scrollTrigger: {
        trigger: index,
        start: "top bottom",
        end: "bottom top",
        scrub: 3
      }
    }
  );

  /* ================================
     ACTIVATE PROJECT
  ================================ */

  function showProject(
    targetIndex
  ) {
    if (
      targetIndex < 0 ||
      targetIndex >=
        previews.length
    ) {
      return;
    }

    /*
     * Already on this project:
     * just refresh its tilt.
     */

    if (
      targetIndex ===
      activeIndex
    ) {
      tiltPreview(
        targetIndex
      );

      return;
    }

    const previousIndex =
      activeIndex;

    const direction =
      targetIndex >
      previousIndex
        ? 1
        : -1;

    const targetLayer =
      previews[
        targetIndex
      ].layer;

    const targetImage =
      previews[
        targetIndex
      ].image;

    const previousLayer =
      previews[
        previousIndex
      ].layer;

    const previousImage =
      previews[
        previousIndex
      ].image;

    /*
     * Image state changes at the exact
     * same moment the project title pins.
     */

    activeIndex =
      targetIndex;

    gsap.killTweensOf(
      layers
    );

    gsap.killTweensOf(
      images
    );

    /* ================================
       TILT TOWARD ACTIVE TITLE
    ================================ */

    tiltPreview(
      targetIndex
    );

    /* ================================
       LAYER ORDER
    ================================ */

    gsap.set(
      targetLayer,
      {
        zIndex: 3
      }
    );

    gsap.set(
      previousLayer,
      {
        zIndex: 2
      }
    );

    /* ================================
       PREPARE TARGET
    ================================ */

    const currentOpacity =
      Number(
        gsap.getProperty(
          targetLayer,
          "opacity"
        )
      );

    if (
      currentOpacity < 0.1
    ) {
      gsap.set(
        targetImage,
        {
          scale: 1.04,

          yPercent:
            direction > 0
              ? 1
              : -1
        }
      );
    }

    /* ================================
       FADE OTHER IMAGES
    ================================ */

    previews.forEach(
      (
        previewItem,
        previewIndex
      ) => {
        if (
          previewIndex ===
          targetIndex
        ) {
          return;
        }

        gsap.to(
          previewItem.layer,
          {
            autoAlpha: 0,
            duration: 1,
            ease: "power2.out",
            overwrite: true
          }
        );
      }
    );

    /* ================================
       TARGET IMAGE IN
    ================================ */

    gsap.to(
      targetLayer,
      {
        autoAlpha: 1,
        duration: 1.15,
        ease: "power2.out",
        overwrite: true,

        onComplete: () => {
          if (
            activeIndex !==
            targetIndex
          ) {
            return;
          }

          gsap.set(
            targetLayer,
            {
              zIndex: 2
            }
          );

          previews.forEach(
            (
              previewItem,
              previewIndex
            ) => {
              if (
                previewIndex ===
                targetIndex
              ) {
                return;
              }

              gsap.set(
                previewItem.layer,
                {
                  zIndex: 1
                }
              );
            }
          );
        }
      }
    );

    /* ================================
       TARGET IMAGE SETTLE
    ================================ */

    gsap.to(
      targetImage,
      {
        scale: 1,
        yPercent: 0,
        duration: 1.65,
        ease: "power3.out",
        overwrite: true
      }
    );

    /* ================================
       PREVIOUS IMAGE FALL AWAY
    ================================ */

    gsap.to(
      previousImage,
      {
        scale: 0.99,

        yPercent:
          direction > 0
            ? -0.5
            : 0.5,

        duration: 1.1,
        ease: "power2.out",
        overwrite: true
      }
    );
  }

  /* ================================
     REFRESH TILT
  ================================ */

  function refreshTilt() {
    tiltPreview(
      activeIndex,
      true
    );
  }

  return {
    showProject,
    refreshTilt
  };
}

/* ================================
   PROJECT TITLES + PIN
================================ */

function initProjectTitles(
  previewController
) {
  const items = Array.from(
    document.querySelectorAll(
      "[data-work-item]"
    )
  );

  if (!items.length) return;

  const reducedMotion =
    prefersReducedMotion();

  items.forEach(
    (item, index) => {
      const title =
        item.querySelector(
          "[data-work-title]"
        );

      const top =
        item.querySelector(
          ".work-item__top"
        );

      if (!title) return;

      const direction =
        item.classList.contains(
          "work-item--left"
        )
          ? -1
          : 1;

      /* ================================
         REDUCED MOTION
      ================================ */

      if (reducedMotion) {
        ScrollTrigger.create({
          trigger: item,
          start: "center center",

          onEnter: () => {
            previewController
              ?.showProject(
                index
              );
          },

          onEnterBack: () => {
            previewController
              ?.showProject(
                index
              );
          }
        });

        return;
      }

      /* ================================
         TITLE DRIFT
         DESKTOP / TABLET ONLY
      ================================ */

      gsap.fromTo(
        title,
        {
          xPercent: () =>
            window.innerWidth <=
            767
              ? 0
              : direction * 2.5
        },
        {
          xPercent: () =>
            window.innerWidth <=
            767
              ? 0
              : direction * -2.5,

          ease: "none",

          scrollTrigger: {
            trigger: item,
            start: "top bottom",
            end: "bottom top",
            scrub: 2.5,
            invalidateOnRefresh: true
          }
        }
      );

      /* ================================
         MASTER PIN
         TITLE + IMAGE + TILT SYNC
      ================================ */

      ScrollTrigger.create({
        trigger: item,

        start:
          "center center",

        end:
          "bottom center",

        pin: title,
        pinSpacing: false,
        anticipatePin: 1,
        invalidateOnRefresh: true,

        onEnter: () => {
          previewController
            ?.showProject(
              index
            );
        },

        onEnterBack: () => {
          previewController
            ?.showProject(
              index
            );
        }
      });

      /* ================================
         PROJECT META
      ================================ */

      if (top) {
        gsap.fromTo(
          top,
          {
            autoAlpha: 0,
            y: 12
          },
          {
            autoAlpha: 1,
            y: 0,
            ease: "none",

            scrollTrigger: {
              trigger: item,

              start: () =>
                window.innerWidth <=
                767
                  ? "top 72%"
                  : "top 80%",

              end: () =>
                window.innerWidth <=
                767
                  ? "center 54%"
                  : "center 55%",

              scrub: 2,
              invalidateOnRefresh: true
            }
          }
        );
      }
    }
  );
}

/* ================================
   SYNC PROJECT AFTER REFRESH
================================ */

function syncProjectToViewport(
  previewController
) {
  if (!previewController) return;

  const items = Array.from(
    document.querySelectorAll(
      "[data-work-item]"
    )
  );

  if (!items.length) return;

  const viewportCenter =
    window.innerHeight * 0.5;

  let closestIndex = 0;
  let closestDistance =
    Infinity;

  items.forEach(
    (item, index) => {
      const rect =
        item.getBoundingClientRect();

      const itemCenter =
        rect.top +
        rect.height * 0.5;

      const distance =
        Math.abs(
          itemCenter -
          viewportCenter
        );

      if (
        distance <
        closestDistance
      ) {
        closestDistance =
          distance;

        closestIndex =
          index;
      }
    }
  );

  previewController.showProject(
    closestIndex
  );

  previewController.refreshTilt();
}

/* ================================
   PHASES
================================ */

function startRevealPhase() {
  if (
    revealInitialized
  ) {
    return;
  }

  revealInitialized = true;

  initWorkHero();
}

function startCompletePhase() {
  if (
    completeInitialized
  ) {
    return;
  }

  completeInitialized = true;

  initWorkHeroScroll();

  const previewController =
    initWorkPreview();

  initProjectTitles(
    previewController
  );

  requestAnimationFrame(
    () => {
      ScrollTrigger.refresh();

      syncProjectToViewport(
        previewController
      );
    }
  );

  ScrollTrigger.addEventListener(
    "refresh",
    () => {
      previewController
        ?.refreshTilt();
    }
  );
}

/* ================================
   INITIALIZE
================================ */

if (
  document.documentElement
    .classList
    .contains(
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