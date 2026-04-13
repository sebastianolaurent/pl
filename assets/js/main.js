const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const yearTarget = document.getElementById("year");
const fontPicker = document.getElementById("fontPicker");

if (yearTarget) {
  yearTarget.textContent = String(new Date().getFullYear());
}

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if (fontPicker) {
  const storageKey = "pl_font_ui";
  const applyFont = (fontValue) => {
    document.documentElement.style.setProperty("--font-ui", fontValue);
  };

  const savedFont = window.localStorage.getItem(storageKey);
  if (savedFont) {
    fontPicker.value = savedFont;
    applyFont(savedFont);
  } else {
    applyFont(fontPicker.value);
  }

  fontPicker.addEventListener("change", () => {
    const selectedFont = fontPicker.value;
    applyFont(selectedFont);
    window.localStorage.setItem(storageKey, selectedFont);
  });
}

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const heroCarousel = document.querySelector(".hero-carousel");

if (heroCarousel) {
  const slides = Array.from(heroCarousel.querySelectorAll("[data-slide]"));
  const dots = Array.from(heroCarousel.querySelectorAll("[data-carousel-dot]"));
  const prevButton = heroCarousel.querySelector("[data-carousel-prev]");
  const nextButton = heroCarousel.querySelector("[data-carousel-next]");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let activeIndex = 0;
  let autoplayTimer;

  const setActiveSlide = (index) => {
    activeIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeIndex;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });

    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === activeIndex;
      dot.classList.toggle("is-active", isActive);
      if (isActive) {
        dot.setAttribute("aria-current", "true");
      } else {
        dot.removeAttribute("aria-current");
      }
    });
  };

  const stopAutoplay = () => {
    if (autoplayTimer) {
      window.clearInterval(autoplayTimer);
      autoplayTimer = undefined;
    }
  };

  const startAutoplay = () => {
    stopAutoplay();

    if (prefersReducedMotion.matches || slides.length < 2) {
      return;
    }

    autoplayTimer = window.setInterval(() => {
      setActiveSlide(activeIndex + 1);
    }, 5000);
  };

  if (prevButton) {
    prevButton.addEventListener("click", () => {
      setActiveSlide(activeIndex - 1);
      startAutoplay();
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      setActiveSlide(activeIndex + 1);
      startAutoplay();
    });
  }

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const index = Number(dot.dataset.carouselDot);
      if (!Number.isNaN(index)) {
        setActiveSlide(index);
        startAutoplay();
      }
    });
  });

  heroCarousel.addEventListener("mouseenter", stopAutoplay);
  heroCarousel.addEventListener("mouseleave", startAutoplay);
  heroCarousel.addEventListener("focusin", stopAutoplay);
  heroCarousel.addEventListener("focusout", (event) => {
    const nextFocusedElement = event.relatedTarget;
    if (!nextFocusedElement || !heroCarousel.contains(nextFocusedElement)) {
      startAutoplay();
    }
  });

  if (typeof prefersReducedMotion.addEventListener === "function") {
    prefersReducedMotion.addEventListener("change", startAutoplay);
  } else if (typeof prefersReducedMotion.addListener === "function") {
    prefersReducedMotion.addListener(startAutoplay);
  }

  setActiveSlide(0);
  startAutoplay();
}
