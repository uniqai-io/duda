import { initSmoothScroll } from "./core/smooth-scroll.js";
import { initHeader } from "./components/header.js";
import { initMenu } from "./components/menu.js";
import { initPageLoader } from "./components/page-loader.js";

function initGlobal() {
  initSmoothScroll();
  initHeader();
  initMenu();
  initPageLoader();
}

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    initGlobal,
    { once: true }
  );
} else {
  initGlobal();
}