function configureBrandChanging() {
  const brand = document.getElementById("brandText");
  const hero = document.getElementById("top");
  const stickyBar = document.querySelector("navigation");
  const headerH = stickyBar ? stickyBar.offsetHeight : 0;

  let current = brand.textContent.trim();
  let animating = false;

  function setBrand(text) {
    if (animating || text === current) return;
    animating = true;
    brand.classList.add("is-fading");

    // after fade-out, swap text, then fade-in
    const onEnd = () => {
      brand.removeEventListener("transitionend", onEnd);
      brand.textContent = text;

      // next frame to let layout apply before fading in
      requestAnimationFrame(() => {
        brand.classList.remove("is-fading");
        current = text;

        // unlock when fade-in finishes too
        brand.addEventListener("transitionend", () => { animating = false; }, { once: true });
      });
    };
    brand.addEventListener("transitionend", onEnd, { once: true });
  }

  const io = new IntersectionObserver(([entry]) => {
    setBrand(entry.isIntersecting ? "Home" : "Arthur Guerra");
  }, { threshold: 0.4, rootMargin: `-${headerH}px 0px 0px 0px` });

  io.observe(hero);

  // fallback
  if (!("IntersectionObserver" in window)) {
    const onScroll = () => {
      const r = hero.getBoundingClientRect();
      const visible = r.top < window.innerHeight * 0.6 && r.bottom > headerH;
      setBrand(visible ? "Home" : "Arthur Guerra");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
}

// display current year 
document.getElementById("year").textContent = new Date().getFullYear();
configureBrandChanging();
