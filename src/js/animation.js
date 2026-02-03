import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

gsap.defaults({
  ease: "power2.out",
  duration: 0.9,
});

const root = document.documentElement;
const isRTL = root.dir === "rtl";

const INTRO_KEY = "dar-rashed-intro-seen";

/* DOM REFERENCES */
const introOverlay = document.getElementById("intro-overlay");
const introLogo = document.getElementById("intro-logo");
const header = document.querySelector("header");
const headerLogo = document.getElementById("header-logo");
const navItems = gsap.utils.toArray(".nav-item");

const heroImages = document.querySelectorAll("#default-carousel img");
const heroTitle = document.querySelector(".max-w-2xl h1");
const heroDivider = document.querySelector(".max-w-2xl .w-20");
const heroSubtitle = document.querySelector(".max-w-2xl p");
const heroCtas = document.querySelector(".ctaButton");

const footer = document.getElementById("site-footer");

/* =======================================
   Intro → Header → Hero
======================================= */
function runMasterTimeline() {
  const hasSeenIntro = window.localStorage.getItem(INTRO_KEY) === "1";
  const navOffsetX = isRTL ? 40 : -40;

  const master = gsap.timeline();

  if (!hasSeenIntro && introOverlay && introLogo && headerLogo) {
    // Prepare overlay
    gsap.set(introOverlay, {
      autoAlpha: 1,
      display: "flex",
      pointerEvents: "auto",
    });
    lockScroll();

    // 1) Logo fade + subtle scale-in
    master.fromTo(
      introLogo,
      { autoAlpha: 0, scale: 0.92 },
      {
        autoAlpha: 1,
        scale: 1,
        duration: 0.9,
      },
    );

    // 2) Logo morph into header position, with a short hold before it starts
    const { dx, dy, scale } = getLogoTransform();
    const safeDx = Number.isFinite(dx) ? dx : 0;
    const safeDy = Number.isFinite(dy) ? dy : 0;
    const safeScale = Number.isFinite(scale) && scale > 0 ? scale : 1;

    master.to(
      introLogo,
      {
        x: safeDx,
        y: safeDy,
        scale: safeScale,
        duration: 1.0,
        ease: "power2.inOut",
      },
      "+=0.4",
    );

    // 3) Fade out overlay, unlock scroll, mark intro as seen
    master.to(
      introOverlay,
      {
        autoAlpha: 0,
        duration: 0.8,
        onComplete: () => {
          introOverlay.style.display = "none";
          unlockScroll();
          window.localStorage.setItem(INTRO_KEY, "1");
        },
      },
      ">-0.5",
    );

    // 4) Header fade/slide in (continuous feel from intro)
    master.fromTo(
      header,
      { autoAlpha: 0, y: -24 },
      { autoAlpha: 1, y: 0, duration: 0.8 },
      "headerIntro",
    );

    // Nav items – staggered, direction-aware
    master.from(
      navItems,
      {
        x: navOffsetX,
        autoAlpha: 0,
        duration: 0.7,
        stagger: 0.08,
      },
      "headerIntro+=0.1",
    );
  } else {
    if (header) {
      gsap.set(header, { autoAlpha: 1, y: 0 });
    }
  }

  master.add("hero");

  if (heroImages.length) {
    master.fromTo(
      heroImages,
      { opacity: 0, scale: 1.06 },
      {
        opacity: 1,
        scale: 1,
        duration: 1.4,
        ease: "power1.out",
      },
      "hero",
    );
  }

  if (heroTitle) {
    master.fromTo(
      heroTitle,
      { y: 40, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 1,
      },
      "hero+=0.1",
    );
  }

  const textGroup = [heroDivider, heroSubtitle].filter(Boolean);
  if (textGroup.length) {
    master.fromTo(
      textGroup,
      { y: 28, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.9,
        stagger: 0.15,
      },
      "hero+=0.3",
    );
  }

  if (heroCtas) {
    master.fromTo(
      heroCtas,
      { autoAlpha: 0, scale: 0.95 },
      {
        autoAlpha: 1,
        scale: 1,
        duration: 0.7,
      },
      "hero+=0.7",
    );
  }

  return master;
}

/* =======================================
   SCROLL ANIMATIONS
   - About, activities, news, books, footer
======================================= */
function setupScrollAnimations() {
  // About text – staggered vertical reveal
  gsap.utils.toArray(".about-text").forEach((block) => {
    const children = block.querySelectorAll("span, h2, p, div");
    gsap.from(children, {
      scrollTrigger: {
        trigger: block,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
      y: 30,
      autoAlpha: 0,
      duration: 0.9,
      stagger: 0.12,
    });
  });

  // About media – clip/scale style reveal
  const aboutMedia = document.querySelector(".about-media");
  if (aboutMedia) {
    gsap.fromTo(
      aboutMedia,
      { autoAlpha: 0, scale: 1.04 },
      {
        scrollTrigger: {
          trigger: aboutMedia,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        autoAlpha: 1,
        scale: 1,
        duration: 1,
      },
    );
  }

  // Activities / timeline cards – slight lift + fade
  gsap.utils.toArray(".activity-card").forEach((card) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
      y: 30,
      autoAlpha: 0,
      duration: 0.9,
    });
  });

  // News cards
  gsap.utils.toArray(".news-card").forEach((card, index) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
      y: 26,
      autoAlpha: 0,
      duration: 0.9,
      delay: index * 0.03,
    });
  });

  // Book cards – featured publications
  gsap.utils.toArray(".book-card").forEach((card, index) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
      y: 32,
      autoAlpha: 0,
      duration: 0.9,
      delay: index * 0.04,
    });
  });

  // Footer – simple fade up on scroll
  if (footer) {
    gsap.to(footer, {
      scrollTrigger: {
        trigger: footer,
        start: "top 90%",
        toggleActions: "play none none reverse",
      },
      autoAlpha: 1,
      y: 0,
      duration: 0.8,
    });
  }
}

/* =======================================
   REDUCED MOTION HANDLING
======================================= */
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

window.addEventListener("load", () => {
  if (prefersReducedMotion) {
    // Clear any animation-intended inline state and skip timelines
    if (introOverlay) introOverlay.style.display = "none";
    unlockScroll();
    return;
  }

  runMasterTimeline();
  setupScrollAnimations();
});
