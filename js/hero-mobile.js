(function () {
  var MQ = window.matchMedia("(max-width: 991px)");

  function resetHeroParallaxTransforms() {
    document.querySelectorAll(".hero_wrap [data-parallax=\"trigger\"]").forEach(function (el) {
      var target = el.querySelector("[data-parallax=\"target\"]") || el;
      target.style.transform = "none";
    });

    document.querySelectorAll(".hero_wrap [data-slideshow=\"parallax\"]").forEach(function (el) {
      el.style.transform = "none";
    });
  }

  function clearHeroScrollTriggers() {
    if (!window.ScrollTrigger) return;

    window.ScrollTrigger.getAll().forEach(function (st) {
      var trigger = st.trigger;
      if (!trigger || !trigger.closest) return;

      if (trigger.closest(".hero_wrap")) {
        st.kill(true);
      }
    });
  }

  function applyHeroMobileFix() {
    if (!MQ.matches) return;

    clearHeroScrollTriggers();
    resetHeroParallaxTransforms();

    if (window.gsap) {
      gsap.set(".hero_wrap [data-parallax=\"trigger\"], .hero_wrap [data-slideshow=\"parallax\"]", {
        clearProps: "transform",
      });
    }
  }

  window.swingHeroMobileFix = applyHeroMobileFix;

  function init() {
    if (!MQ.matches) return;
    applyHeroMobileFix();
    window.addEventListener("load", applyHeroMobileFix, { once: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  if (typeof MQ.addEventListener === "function") {
    MQ.addEventListener("change", applyHeroMobileFix);
  }
})();
