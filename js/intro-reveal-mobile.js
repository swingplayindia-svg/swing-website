(function () {
  var MQ = window.matchMedia("(max-width: 991px)");
  var pollId = null;
  var pollRuns = 0;
  var MAX_POLL_RUNS = 24;

  function revealAllWords(section) {
    section.querySelectorAll("[data-word]").forEach(function (el) {
      el.classList.add("lit");
    });
    section.querySelectorAll("[data-window]").forEach(function (el) {
      el.classList.add("lit");
    });
  }

  function clearIntroScrollTriggers(section) {
    if (!window.ScrollTrigger) return false;

    var killed = false;

    window.ScrollTrigger.getAll().forEach(function (st) {
      var trigger = st.trigger;
      if (!trigger) return;

      var isIntroTrigger =
        trigger === section ||
        section.contains(trigger) ||
        (trigger.classList && trigger.classList.contains("intro_text"));

      if (isIntroTrigger) {
        st.kill(true);
        killed = true;
      }
    });

    if (killed) {
      window.ScrollTrigger.refresh();
    }

    return killed;
  }

  function resetSectionLayout(section) {
    section.style.minHeight = "auto";
    section.style.height = "auto";
  }

  function applyIntroMobileFix() {
    if (!MQ.matches) return;

    var section = document.getElementById("intro-reveal");
    if (!section) return;

    revealAllWords(section);
    clearIntroScrollTriggers(section);
    resetSectionLayout(section);
  }

  window.swingIntroMobileFix = applyIntroMobileFix;

  function patchScrollTriggerOnMobile() {
    if (!MQ.matches || !window.ScrollTrigger || window.ScrollTrigger.__swingIntroPatched) return;

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

    window.ScrollTrigger.__swingIntroPatched = true;
  }

  function stopPolling() {
    if (pollId) {
      window.clearInterval(pollId);
      pollId = null;
    }
    pollRuns = 0;
  }

  function startPolling() {
    if (!MQ.matches) return;
    stopPolling();

    pollId = window.setInterval(function () {
      applyIntroMobileFix();
      pollRuns += 1;
      if (pollRuns >= MAX_POLL_RUNS) {
        stopPolling();
      }
    }, 500);
  }

  function scheduleFixes() {
    applyIntroMobileFix();
    startPolling();
    window.setTimeout(applyIntroMobileFix, 300);
    window.setTimeout(applyIntroMobileFix, 900);
    window.setTimeout(applyIntroMobileFix, 1800);
    window.setTimeout(applyIntroMobileFix, 3500);
  }

  function init() {
    patchScrollTriggerOnMobile();
    scheduleFixes();
    window.addEventListener("load", function () {
      patchScrollTriggerOnMobile();
      scheduleFixes();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  patchScrollTriggerOnMobile();

  if (typeof MQ.addEventListener === "function") {
    MQ.addEventListener("change", function () {
      stopPolling();
      patchScrollTriggerOnMobile();
      applyIntroMobileFix();
      if (MQ.matches) startPolling();
    });
  } else if (typeof MQ.addListener === "function") {
    MQ.addListener(function () {
      stopPolling();
      patchScrollTriggerOnMobile();
      applyIntroMobileFix();
      if (MQ.matches) startPolling();
    });
  }
})();
