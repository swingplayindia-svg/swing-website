(function () {
  var MQ = window.matchMedia("(max-width: 991px)");

  function revealAllWords(section) {
    section.querySelectorAll("[data-word]").forEach(function (el) {
      el.classList.add("lit");
    });
    section.querySelectorAll("[data-window]").forEach(function (el) {
      el.classList.add("lit");
    });
  }

  function clearIntroPinScroll(section) {
    if (!window.ScrollTrigger) return;
    window.ScrollTrigger.getAll().forEach(function (st) {
      var trigger = st.trigger;
      if (!trigger) return;
      if (trigger === section || section.contains(trigger)) {
        st.kill(true);
      }
    });
    window.ScrollTrigger.refresh();
  }

  function applyIntroMobileFix() {
    var section = document.getElementById("intro-reveal");
    if (!section) return;

    if (!MQ.matches) return;

    revealAllWords(section);
    clearIntroPinScroll(section);

    section.style.minHeight = "auto";
    section.style.height = "auto";
  }

  function runAfterLoad() {
    applyIntroMobileFix();
    window.setTimeout(applyIntroMobileFix, 400);
    window.setTimeout(applyIntroMobileFix, 1200);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runAfterLoad);
  } else {
    runAfterLoad();
  }

  if (typeof MQ.addEventListener === "function") {
    MQ.addEventListener("change", applyIntroMobileFix);
  } else if (typeof MQ.addListener === "function") {
    MQ.addListener(applyIntroMobileFix);
  }
})();
