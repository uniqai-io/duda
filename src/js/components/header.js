import { gsap } from "../core/animation.js";
import { prefersReducedMotion } from "../core/reduced-motion.js";

export function initHeader() {
  const header = document.querySelector("[data-header]");

  if (!header) return;

  function revealHeader() {
    if (prefersReducedMotion()) {
      gsap.set(header, {
        autoAlpha: 1,
        y: 0
      });

      return;
    }

    gsap.fromTo(
      header,
      {
        autoAlpha: 0,
        y: -10
      },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.85,
        ease: "power3.out",
        clearProps: "transform"
      }
    );
  }

  if (
    document.documentElement.classList.contains("js-preload")
  ) {
    window.addEventListener(
      "duda:loader-reveal",
      revealHeader,
      { once: true }
    );
  } else {
    revealHeader();
  }
}