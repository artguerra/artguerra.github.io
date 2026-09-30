function configureBrandChanging() {
  const brand = document.getElementById("brandText");
  const hero = document.getElementById("top");
  const navigation = document.getElementById("navigation");
  if (!brand || !hero) return;

  const navigationHeight = navigation?.offsetHeight || 0;
  let current = brand.textContent.trim();
  let animating = false;

  function setBrand(text) {
    if (animating || text === current) return;

    animating = true;
    brand.classList.add("is-fading");
    brand.addEventListener("transitionend", () => {
      brand.textContent = text;

      requestAnimationFrame(() => {
        brand.classList.remove("is-fading");
        current = text;
        brand.addEventListener("transitionend", () => {
          animating = false;
        }, { once: true });
      });
    }, { once: true });
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(([entry]) => {
      setBrand(entry.isIntersecting ? "Home" : "Arthur Guerra");
    }, {
      threshold: 0.4,
      rootMargin: `-${navigationHeight}px 0px 0px 0px`,
    });

    observer.observe(hero);
    return;
  }

  function updateBrandOnScroll() {
    const bounds = hero.getBoundingClientRect();
    const visible = bounds.top < window.innerHeight * 0.6
      && bounds.bottom > navigationHeight;
    setBrand(visible ? "Home" : "Arthur Guerra");
  }

  window.addEventListener("scroll", updateBrandOnScroll, { passive: true });
  updateBrandOnScroll();
}

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

configureBrandChanging();
