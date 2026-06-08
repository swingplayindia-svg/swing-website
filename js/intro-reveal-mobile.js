(function () {
  var MQ = window.matchMedia("(max-width: 991px)");
  var patched = false;
  var applied = false;

  function revealAllWords(section) {
    section.querySelectorAll("[data-word]").forEach(function (el) {
      el.classList.add("lit");
    });
    section.querySelectorAll("[data-window]").forEach(function (el) {
      el.classList.add("lit");
    });
  }

  function clearIntroScrollTriggers(section) {
    if (!window.ScrollTrigger) return;

    window.ScrollTrigger.getAll().forEach(function (st) {
      var trigger = st.trigger;
      if (!trigger) return;

      var isIntroTrigger =
        trigger === section ||
        section.contains(trigger) ||
        (trigger.classList && trigger.classList.contains("intro_text"));

      if (isIntroTrigger) {
        st.kill(true);
      }
    });
  }

  function resetSectionLayout(section) {
    section.style.minHeight = "auto";
    section.style.height = "auto";

    document.querySelectorAll(".pin-spacer").forEach(function (spacer) {
      var pinned = spacer.firstElementChild;
      if (!pinned || pinned !== section) return;
      spacer.style.minHeight = "0";
      spacer.style.height = "auto";
    });
  }

  function patchScrollTriggerOnMobile() {
    if (!MQ.matches || patched || !window.ScrollTrigger) return;

    var section = document.getElementById("intro-reveal");
    if (!section) return;

    var originalCreate = window.ScrollTrigger.create.bind(window.ScrollTrigger);

    window.ScrollTrigger.create = function (vars) {
      var trigger = vars && vars.trigger;

      if (
        trigger &&
        (trigger === section ||
          section.contains(trigger) ||
          (trigger.classList && trigger.classList.contains("intro_text")))
      ) {
        revealAllWords(section);
        resetSectionLayout(section);
        return {
          kill: function () {},
          disable: function () {},
          enable: function () {},
          refresh: function () {},
        };
      }

      return originalCreate(vars);
    };

    patched = true;
  }

  function applyIntroMobileFix() {
    if (!MQ.matches) return;

    var section = document.getElementById("intro-reveal");
    if (!section) return;

    patchScrollTriggerOnMobile();
    revealAllWords(section);
    clearIntroScrollTriggers(section);
    resetSectionLayout(section);
    applied = true;
  }

  window.swingIntroMobileFix = applyIntroMobileFix;

  function init() {
    if (!MQ.matches) return;
    applyIntroMobileFix();
    window.addEventListener("load", applyIntroMobileFix, { once: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  if (typeof MQ.addEventListener === "function") {
    MQ.addEventListener("change", function () {
      applied = false;
      applyIntroMobileFix();
    });
  }
})();
