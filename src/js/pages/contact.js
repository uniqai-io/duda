import {
  gsap,
  ScrollTrigger
} from "../core/animation.js";

import { prefersReducedMotion } from "../core/reduced-motion.js";

let initialized = false;

/* ================================
   HERO
================================ */
function initContactHero() {
  const hero = document.querySelector(
    "[data-contact-hero]"
  );

  const stage = hero?.querySelector(
    "[data-contact-stage]"
  );

  const book = hero?.querySelector(
    "[data-contact-book]"
  );

  const duda = hero?.querySelector(
    "[data-contact-duda]"
  );

  const meta = hero?.querySelectorAll(
    "[data-contact-hero-meta]"
  );

  if (
    !hero ||
    !stage ||
    !book ||
    !duda
  ) {
    return;
  }

  if (prefersReducedMotion()) {
    gsap.set([book, duda, meta], {
      clearProps: "all"
    });

    return;
  }

  gsap.set(book, {
    yPercent: 115,
    rotationX: 35,
    transformOrigin: "0 100%",
    force3D: true
  });

  gsap.set(duda, {
    yPercent: 115,
    rotationX: 35,
    transformOrigin: "100% 100%",
    force3D: true
  });

  gsap.set(meta, {
    autoAlpha: 0,
    y: 12
  });

  const entrance = gsap.timeline();

  entrance.to(
    [book, duda],
    {
      yPercent: 0,
      rotationX: 0,
      duration: 1.3,
      stagger: 0.08,
      ease: "power4.out"
    },
    0
  );

  entrance.to(
    meta,
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.75,
      stagger: 0.05,
      ease: "power3.out"
    },
    0.55
  );

  const scroll = gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.5,
      invalidateOnRefresh: true
    }
  });

  scroll.to(
    book,
    {
      xPercent: -24,
      rotationY: 24,
      rotationX: -7,
      z: -160,
      autoAlpha: 0.18,
      ease: "none"
    },
    0
  );

  scroll.to(
    duda,
    {
      xPercent: 24,
      rotationY: -24,
      rotationX: 7,
      z: -160,
      autoAlpha: 0.18,
      ease: "none"
    },
    0
  );

  scroll.to(
    meta,
    {
      autoAlpha: 0,
      y: -20,
      ease: "none"
    },
    0
  );
}

/* ================================
   STATEMENT
================================ */
function initContactStatement() {
  const statement = document.querySelector(
    "[data-contact-statement]"
  );

  if (
    !statement ||
    prefersReducedMotion()
  ) {
    return;
  }

  gsap.fromTo(
    statement,
    {
      y: 50,
      autoAlpha: 0
    },
    {
      y: 0,
      autoAlpha: 1,
      duration: 1.2,
      ease: "power4.out",
      scrollTrigger: {
        trigger: statement,
        start: "top 86%",
        once: true
      }
    }
  );
}

/* ================================
   FORM ROWS
================================ */
function initContactRows() {
  const rows = document.querySelectorAll(
    "[data-contact-row]"
  );

  if (
    !rows.length ||
    prefersReducedMotion()
  ) {
    return;
  }

  rows.forEach((row, index) => {
    gsap.fromTo(
      row,
      {
        y: 34,
        autoAlpha: 0
      },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.95,
        delay: index * 0.03,
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

/* ================================
   SUBMIT MOTION
================================ */
function initContactSubmit() {
  const submit = document.querySelector(
    "[data-contact-submit]"
  );

  const text = submit?.querySelector(
    "[data-contact-submit-text]"
  );

  if (
    !submit ||
    !text ||
    prefersReducedMotion()
  ) {
    return;
  }

  gsap.fromTo(
    text,
    {
      y: 45,
      autoAlpha: 0,
      rotationX: 28
    },
    {
      y: 0,
      autoAlpha: 1,
      rotationX: 0,
      duration: 1.1,
      ease: "power4.out",
      scrollTrigger: {
        trigger: submit,
        start: "top 88%",
        once: true
      }
    }
  );

  const mediaQuery = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  );

  if (!mediaQuery.matches) return;

  submit.addEventListener(
    "mousemove",
    (event) => {
      if (submit.disabled) return;

      const bounds =
        submit.getBoundingClientRect();

      const x =
        event.clientX -
        bounds.left -
        bounds.width / 2;

      const y =
        event.clientY -
        bounds.top -
        bounds.height / 2;

      gsap.to(text, {
        x: x * 0.045,
        y: y * 0.08,
        rotationY: x * 0.006,
        rotationX: -y * 0.006,
        duration: 0.5,
        ease: "power3.out",
        overwrite: true
      });
    }
  );

  submit.addEventListener(
    "mouseleave",
    () => {
      gsap.to(text, {
        x: 0,
        y: 0,
        rotationX: 0,
        rotationY: 0,
        duration: 0.8,
        ease: "power4.out",
        overwrite: true
      });
    }
  );
}

/* ================================
   SOCIAL LINKS
================================ */
function initSocialLinks() {
  const links = document.querySelectorAll(
    "[data-contact-social]"
  );

  if (
    !links.length ||
    prefersReducedMotion()
  ) {
    return;
  }

  links.forEach((link) => {
    gsap.fromTo(
      link,
      {
        x: -30,
        autoAlpha: 0
      },
      {
        x: 0,
        autoAlpha: 1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: link,
          start: "top 92%",
          once: true
        }
      }
    );
  });
}

/* ================================
   FORM SUBMISSION
================================ */
function initFormBehaviour() {
  const form = document.querySelector(
    "[data-contact-form]"
  );

  const submit = form?.querySelector(
    "[data-contact-submit]"
  );

  const submitText = form?.querySelector(
    "[data-contact-submit-text]"
  );

  const submitMeta = form?.querySelector(
    ".contact-submit__meta"
  );

  const status = form?.querySelector(
    "[data-contact-status]"
  );

  if (
    !form ||
    !submit ||
    !submitText
  ) {
    return;
  }

  const defaultText =
    submitText.textContent.trim();

  const defaultMeta =
    submitMeta?.textContent.trim() || "";

  let submitting = false;

  const setState = (
    text,
    message = "",
    meta = defaultMeta
  ) => {
    submitText.textContent = text;

    if (submitMeta) {
      submitMeta.textContent = meta;
    }

    if (status) {
      status.textContent = message;
    }
  };

  form.addEventListener(
    "submit",
    async (event) => {
      event.preventDefault();

      if (submitting) return;

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      submitting = true;

      submit.disabled = true;
      submit.setAttribute(
        "aria-busy",
        "true"
      );

      gsap.to(submitText, {
        x: 0,
        y: 0,
        rotationX: 0,
        rotationY: 0,
        duration: 0.4,
        ease: "power3.out",
        overwrite: true
      });

      setState(
        "Sending",
        "",
        "Sending enquiry"
      );

      try {
        const formData =
          new FormData(form);

        const payload =
          Object.fromEntries(
            formData.entries()
          );

        const response = await fetch(
          "/api/contact",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
              Accept:
                "application/json"
            },
            body: JSON.stringify(
              payload
            )
          }
        );

        let result = {};

        try {
          result =
            await response.json();
        } catch {
          result = {};
        }

        if (!response.ok) {
          throw new Error(
            result.message ||
            `Request failed with status ${response.status}`
          );
        }

        if (
          result.success === false
        ) {
          throw new Error(
            result.message ||
            "Unable to send enquiry."
          );
        }

        form.reset();

        setState(
          "Enquiry Sent",
          "Thank you. Your enquiry has been sent.",
          "Message received"
        );

        gsap.fromTo(
          submitText,
          {
            y: 12,
            autoAlpha: 0
          },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.65,
            ease: "power3.out",
            overwrite: true
          }
        );

        window.setTimeout(
          () => {
            setState(
              defaultText,
              "",
              defaultMeta
            );
          },
          4000
        );
      } catch (error) {
        console.error(
          "Contact form error:",
          error
        );

        setState(
          "Try Again",
          error.message ||
            "Something went wrong. Please try again.",
          "Unable to send"
        );

        gsap.fromTo(
          submitText,
          {
            y: 10,
            autoAlpha: 0
          },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.55,
            ease: "power3.out",
            overwrite: true
          }
        );

        window.setTimeout(
          () => {
            submitText.textContent =
              defaultText;

            if (submitMeta) {
              submitMeta.textContent =
                defaultMeta;
            }
          },
          4000
        );
      } finally {
        submitting = false;

        submit.disabled = false;

        submit.removeAttribute(
          "aria-busy"
        );
      }
    }
  );
}

/* ================================
   PAGE INIT
================================ */
function initContactPage() {
  if (initialized) return;

  initialized = true;

  initContactHero();
  initContactStatement();
  initContactRows();
  initContactSubmit();
  initSocialLinks();
  initFormBehaviour();

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
    initContactPage,
    {
      once: true
    }
  );
} else {
  initContactPage();
}