import Lenis from "lenis";
import {
  gsap,
  ScrollTrigger
} from "./animation.js";
import { prefersReducedMotion } from "./reduced-motion.js";

let tickerCallback = null;

export function initSmoothScroll() {
  if (window.lenis) return window.lenis;
  if (prefersReducedMotion()) return null;

  const lenis = new Lenis({
    lerp: 0.1,
    smoothWheel: true,
    syncTouch: false,
    anchors: true,
    autoResize: true
  });

  window.lenis = lenis;

  lenis.on("scroll", ScrollTrigger.update);

  tickerCallback = (time) => {
    lenis.raf(time * 1000);
  };

  gsap.ticker.add(tickerCallback);
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

export function destroySmoothScroll() {
  if (!window.lenis) return;

  if (tickerCallback) {
    gsap.ticker.remove(tickerCallback);
    tickerCallback = null;
  }

  window.lenis.destroy();
  window.lenis = null;
}