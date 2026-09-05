import { gsap } from "../core/animation.js";
import { prefersReducedMotion } from "../core/reduced-motion.js";

export function initMenu() {
  const docEl = document.documentElement;
  const body = document.body;
  const toggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-menu]");
  const menuLabel = document.querySelector("[data-menu-label]");
  const closeLabel = document.querySelector("[data-menu-close-label]");
  const links = menu?.querySelectorAll("[data-menu-link]") || [];
  const meta = menu?.querySelectorAll("[data-menu-meta]") || [];

  if (!toggle || !menu) return;

  let isOpen = false;
  let lockedY = 0;

  gsap.set(menu, {
    autoAlpha: 0,
    pointerEvents: "none"
  });

  gsap.set(links, {
    autoAlpha: 0,
    yPercent: 12
  });

  gsap.set(meta, {
    autoAlpha: 0,
    y: 12
  });

  if (closeLabel) {
    gsap.set(closeLabel, {
      yPercent: 110
    });
  }

  function preventWheel(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  function preventTouchMove(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  function preventKeyboardScroll(event) {
    const scrollKeys = [
      "ArrowUp",
      "ArrowDown",
      "PageUp",
      "PageDown",
      "Home",
      "End",
      " "
    ];

    if (!scrollKeys.includes(event.key)) return;

    event.preventDefault();
  }

  function keepScrollPosition() {
    if (Math.abs(window.scrollY - lockedY) < 1) return;

    window.scrollTo(0, lockedY);
  }

  function lockScroll() {
    lockedY =
      window.scrollY ||
      window.pageYOffset ||
      docEl.scrollTop ||
      0;

    if (window.lenis) {
      window.lenis.scrollTo(lockedY, {
        immediate: true
      });
    }

    window.addEventListener(
      "wheel",
      preventWheel,
      {
        passive: false,
        capture: true
      }
    );

    window.addEventListener(
      "touchmove",
      preventTouchMove,
      {
        passive: false,
        capture: true
      }
    );

    window.addEventListener(
      "keydown",
      preventKeyboardScroll,
      {
        capture: true
      }
    );

    window.addEventListener(
      "scroll",
      keepScrollPosition,
      {
        passive: true
      }
    );
  }

  function unlockScroll() {
    window.removeEventListener(
      "wheel",
      preventWheel,
      true
    );

    window.removeEventListener(
      "touchmove",
      preventTouchMove,
      true
    );

    window.removeEventListener(
      "keydown",
      preventKeyboardScroll,
      true
    );

    window.removeEventListener(
      "scroll",
      keepScrollPosition
    );

    window.scrollTo(0, lockedY);
  }

  function updateToggle(open) {
    toggle.setAttribute(
      "aria-expanded",
      open ? "true" : "false"
    );

    toggle.setAttribute(
      "aria-label",
      open ? "Close menu" : "Open menu"
    );

    menu.setAttribute(
      "aria-hidden",
      open ? "false" : "true"
    );

    if (prefersReducedMotion()) {
      if (menuLabel) {
        gsap.set(menuLabel, {
          yPercent: open ? -110 : 0
        });
      }

      if (closeLabel) {
        gsap.set(closeLabel, {
          yPercent: open ? 0 : 110
        });
      }

      return;
    }

    if (menuLabel) {
      gsap.to(menuLabel, {
        yPercent: open ? -110 : 0,
        duration: 0.4,
        ease: "power3.out",
        overwrite: true
      });
    }

    if (closeLabel) {
      gsap.to(closeLabel, {
        yPercent: open ? 0 : 110,
        duration: 0.4,
        ease: "power3.out",
        overwrite: true
      });
    }
  }

  function resetLinkHover(immediate = false) {
    if (!links.length) return;

    gsap.to(links, {
      x: 0,
      scaleX: 1,
      autoAlpha: 1,
      duration: immediate ? 0 : 0.55,
      ease: "power3.out",
      overwrite: true
    });
  }

  function initLinkHover() {
    if (prefersReducedMotion()) return;

    links.forEach((link) => {
      link.addEventListener("mouseenter", () => {
        if (!isOpen) return;

        links.forEach((otherLink) => {
          if (otherLink === link) {
            gsap.to(otherLink, {
              x: 12,
              scaleX: 1.015,
              autoAlpha: 1,
              duration: 0.55,
              ease: "power3.out",
              overwrite: true
            });

            return;
          }

          gsap.to(otherLink, {
            x: 0,
            scaleX: 1,
            autoAlpha: 0.3,
            duration: 0.45,
            ease: "power2.out",
            overwrite: true
          });
        });
      });

      link.addEventListener("mouseleave", () => {
        if (!isOpen) return;

        resetLinkHover();
      });

      link.addEventListener("focus", () => {
        if (!isOpen) return;

        links.forEach((otherLink) => {
          if (otherLink === link) {
            gsap.to(otherLink, {
              x: 12,
              scaleX: 1.015,
              autoAlpha: 1,
              duration: 0.55,
              ease: "power3.out",
              overwrite: true
            });

            return;
          }

          gsap.to(otherLink, {
            x: 0,
            scaleX: 1,
            autoAlpha: 0.3,
            duration: 0.45,
            ease: "power2.out",
            overwrite: true
          });
        });
      });

      link.addEventListener("blur", () => {
        if (!isOpen) return;

        resetLinkHover();
      });
    });
  }

  function openMenu() {
    if (isOpen) return;

    isOpen = true;

    docEl.classList.add("menu-open");
    body.classList.add("menu-open");

    lockScroll();
    updateToggle(true);

    gsap.set(menu, {
      visibility: "visible",
      pointerEvents: "auto"
    });

    if (prefersReducedMotion()) {
      gsap.set(menu, {
        autoAlpha: 1
      });

      gsap.set(links, {
        autoAlpha: 1,
        x: 0,
        yPercent: 0,
        scaleX: 1
      });

      gsap.set(meta, {
        autoAlpha: 1,
        y: 0
      });

      return;
    }

    gsap.timeline({
      defaults: {
        overwrite: "auto"
      }
    })
      .to(
        menu,
        {
          autoAlpha: 1,
          duration: 0.9,
          ease: "power3.out"
        },
        0
      )
      .to(
        links,
        {
          autoAlpha: 1,
          x: 0,
          yPercent: 0,
          scaleX: 1,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out"
        },
        0.12
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
        0.2
      );
  }

  function closeMenu() {
    if (!isOpen) return;

    isOpen = false;

    updateToggle(false);

    gsap.killTweensOf(links);

    if (prefersReducedMotion()) {
      gsap.set(menu, {
        autoAlpha: 0,
        pointerEvents: "none"
      });

      gsap.set(links, {
        autoAlpha: 0,
        x: 0,
        yPercent: 12,
        scaleX: 1
      });

      gsap.set(meta, {
        autoAlpha: 0,
        y: 12
      });

      docEl.classList.remove("menu-open");
      body.classList.remove("menu-open");

      unlockScroll();

      return;
    }

    gsap.timeline({
      defaults: {
        overwrite: "auto"
      },
      onComplete: () => {
        gsap.set(menu, {
          autoAlpha: 0,
          pointerEvents: "none"
        });

        gsap.set(links, {
          autoAlpha: 0,
          x: 0,
          yPercent: 12,
          scaleX: 1
        });

        gsap.set(meta, {
          autoAlpha: 0,
          y: 12
        });

        docEl.classList.remove("menu-open");
        body.classList.remove("menu-open");

        unlockScroll();
      }
    })
      .to(
        meta,
        {
          autoAlpha: 0,
          y: 6,
          duration: 0.25,
          ease: "power2.in"
        },
        0
      )
      .to(
        links,
        {
          autoAlpha: 0,
          x: 0,
          yPercent: -8,
          scaleX: 1,
          duration: 0.4,
          stagger: {
            each: 0.04,
            from: "end"
          },
          ease: "power3.in"
        },
        0
      )
      .to(
        menu,
        {
          autoAlpha: 0,
          duration: 0.65,
          ease: "power3.inOut"
        },
        0.12
      );
  }

  toggle.addEventListener("click", () => {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  links.forEach((link) => {
    link.addEventListener("click", () => {
      if (!isOpen) return;

      closeMenu();
    });
  });

  window.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      isOpen
    ) {
      closeMenu();
      toggle.focus();
    }
  });

  initLinkHover();
}