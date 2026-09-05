import { gsap } from "../core/animation.js";
import { prefersReducedMotion } from "../core/reduced-motion.js";

function init404() {
  const page = document.querySelector("[data-404]");
  if (!page) return;

  const video = page.querySelector("[data-404-video]");
  const media = page.querySelector("[data-404-media]");
  const code = page.querySelector("[data-404-code]");
  const digits = page.querySelectorAll("[data-404-digit]");
  const meta = page.querySelectorAll("[data-404-meta]");
  const button = page.querySelector("[data-404-button]");
  const buttonArrow = page.querySelector("[data-404-button-arrow]");
  const buttonLine = page.querySelector("[data-404-button-line]");

  if (video) {
    const playPromise = video.play();

    if (playPromise?.catch) {
      playPromise.catch(() => {});
    }
  }

  if (prefersReducedMotion()) {
    gsap.set(
      [
        video,
        media,
        code,
        digits,
        meta,
        button,
        buttonArrow,
        buttonLine
      ],
      {
        clearProps: "transform,opacity,visibility"
      }
    );

    return;
  }

  initEntrance({
    video,
    digits,
    meta,
    button,
    buttonLine
  });

  initPointerMotion({
    page,
    video,
    code
  });

  initButtonMotion({
    button,
    buttonArrow,
    buttonLine
  });
}

function initEntrance({
  video,
  digits,
  meta,
  button,
  buttonLine
}) {
  gsap.set(video, {
    autoAlpha: 0,
    scale: 1.12,
    force3D: true
  });

  gsap.set(digits, {
    autoAlpha: 0,
    yPercent: 48,
    rotateX: -22,
    transformOrigin: "50% 100%",
    force3D: true
  });

  gsap.set(meta, {
    autoAlpha: 0,
    y: 14
  });

  gsap.set(button, {
    autoAlpha: 0,
    y: 16
  });

  gsap.set(buttonLine, {
    scaleX: 0,
    transformOrigin: "left center"
  });

  const timeline = gsap.timeline({
    defaults: {
      overwrite: "auto"
    }
  });

  timeline.to(
    video,
    {
      autoAlpha: 1,
      scale: 1.06,
      duration: 1.8,
      ease: "power3.out"
    },
    0
  );

  timeline.to(
    digits,
    {
      autoAlpha: 1,
      yPercent: 0,
      rotateX: 0,
      duration: 1.35,
      stagger: 0.08,
      ease: "power4.out"
    },
    0.12
  );

  timeline.to(
    meta,
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.06,
      ease: "power3.out"
    },
    0.58
  );

  timeline.to(
    button,
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.85,
      ease: "power3.out"
    },
    0.72
  );

  timeline.to(
    buttonLine,
    {
      scaleX: 0.28,
      duration: 0.8,
      ease: "power3.out"
    },
    0.82
  );
}

function initPointerMotion({
  page,
  video,
  code
}) {
  if (!video || !code) return;

  const pointerQuery = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  );

  if (!pointerQuery.matches) return;

  const videoX = gsap.quickTo(video, "xPercent", {
    duration: 1.2,
    ease: "power3.out"
  });

  const videoY = gsap.quickTo(video, "yPercent", {
    duration: 1.2,
    ease: "power3.out"
  });

  const codeX = gsap.quickTo(code, "x", {
    duration: 1,
    ease: "power3.out"
  });

  const codeY = gsap.quickTo(code, "y", {
    duration: 1,
    ease: "power3.out"
  });

  const handlePointerMove = (event) => {
    const x = event.clientX / window.innerWidth - 0.5;
    const y = event.clientY / window.innerHeight - 0.5;

    videoX(x * -1.8);
    videoY(y * -1.4);

    codeX(x * 14);
    codeY(y * 10);
  };

  const resetPointer = () => {
    videoX(0);
    videoY(0);

    codeX(0);
    codeY(0);
  };

  page.addEventListener("pointermove", handlePointerMove);
  page.addEventListener("pointerleave", resetPointer);
}

function initButtonMotion({
  button,
  buttonArrow,
  buttonLine
}) {
  if (!button || !buttonArrow || !buttonLine) return;

  const pointerQuery = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  );

  if (!pointerQuery.matches) return;

  button.addEventListener("mouseenter", () => {
    gsap.to(buttonLine, {
      scaleX: 1,
      duration: 0.55,
      ease: "power3.out",
      overwrite: "auto"
    });

    gsap.to(buttonArrow, {
      x: 4,
      y: -4,
      duration: 0.45,
      ease: "power3.out",
      overwrite: "auto"
    });
  });

  button.addEventListener("mouseleave", () => {
    gsap.to(buttonLine, {
      scaleX: 0.28,
      duration: 0.55,
      ease: "power3.out",
      overwrite: "auto"
    });

    gsap.to(buttonArrow, {
      x: 0,
      y: 0,
      duration: 0.45,
      ease: "power3.out",
      overwrite: "auto"
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init404, {
    once: true
  });
} else {
  init404();
}