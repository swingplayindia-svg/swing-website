(function () {
  var MOBILE_MQ = window.matchMedia("(max-width: 991px)");
  var activeSection = null;
  var stopAutoplayFn = null;

  function disableSlaterDesktopTabs(section) {
    if (!MOBILE_MQ.matches) return;
    var wrapper = section.querySelector('[data-tabs="wrapper"]');
    if (!wrapper || wrapper.dataset.swingMobileTabs === "true") return;
    wrapper.removeAttribute("data-tabs");
    wrapper.dataset.swingMobileTabs = "true";

    section.querySelectorAll('[data-tabs="visual-item"]').forEach(function (item) {
      item.style.removeProperty("opacity");
      item.style.removeProperty("visibility");
      item.style.removeProperty("autoAlpha");
    });
  }

  function getHeadingText(link) {
    var heading = link.querySelector(".content-item__heading");
    return heading ? heading.textContent.trim() : "";
  }

  function warmVideo(video, eager) {
    if (!video || !video.src) return;
    video.preload = eager ? "auto" : "metadata";
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    if (video.readyState < 2) {
      try {
        video.load();
      } catch (e) {}
    }
  }

  function warmImage(img) {
    if (!img) return;
    img.loading = "eager";
    img.decoding = "async";
    if (img.complete) return;
    var src = img.getAttribute("src");
    if (src) {
      var probe = new Image();
      probe.src = src;
    }
  }

  function preloadGamesMedia(section) {
    var videos = section.querySelectorAll("video");
    videos.forEach(function (video, index) {
      warmVideo(video, index === 0);
    });
    section.querySelectorAll(".game_icon img").forEach(warmImage);
    section.querySelectorAll(".u-feature-media").forEach(warmImage);
  }

  function resetProgressBars(tabLinks) {
    tabLinks.forEach(function (link) {
      var bar = link.querySelector('[data-tabs="item-progress"]');
      if (!bar) return;
      bar.style.transition = "none";
      bar.style.transform = "scale3d(0, 1, 1)";
    });
  }

  function animateProgress(bar, durationMs) {
    if (!bar) return;
    bar.style.transition = "none";
    bar.style.transform = "scale3d(0, 1, 1)";
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        bar.style.transition = "transform " + durationMs + "ms linear";
        bar.style.transform = "scale3d(1, 1, 1)";
      });
    });
  }

  function initGamesTabs() {
    var section = document.getElementById("games");
    if (!section) return;

    disableSlaterDesktopTabs(section);

    if (stopAutoplayFn) {
      stopAutoplayFn();
      stopAutoplayFn = null;
    }

    var wrapper = section.querySelector('[data-tabs="wrapper"]');
    var tabLinks = section.querySelectorAll('[data-tabs="content-item"]');
    var visuals = section.querySelectorAll('[data-tabs="visual-item"]');
    var mobileTitle = document.getElementById("games-mobile-title");
    if (!wrapper || !tabLinks.length || !visuals.length) return;

    var autoplayEnabled = wrapper.getAttribute("data-tabs-autoplay") === "true";
    var slideDuration = parseInt(wrapper.getAttribute("data-tabs-autoplay-duration"), 10);
    if (!slideDuration || slideDuration < 1000) slideDuration = 5000;

    preloadGamesMedia(section);

    var currentIndex = 0;
    var autoplayTimer = null;
    var sectionObserver = null;

    function stopAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    function setActive(index) {
      currentIndex = index;

      tabLinks.forEach(function (link, i) {
        link.classList.toggle("active", i === index);
        link.setAttribute("aria-selected", i === index ? "true" : "false");
      });

      resetProgressBars(tabLinks);
      animateProgress(
        tabLinks[index].querySelector('[data-tabs="item-progress"]'),
        slideDuration
      );

      if (MOBILE_MQ.matches && mobileTitle) {
        mobileTitle.textContent = getHeadingText(tabLinks[index]) || "";
      } else if (mobileTitle) {
        mobileTitle.textContent = "";
      }

      visuals.forEach(function (item, i) {
        var visible = i === index;
        item.setAttribute("data-tab-status", visible ? "is-visible" : "is-not-visible");

        var video = item.querySelector("video");
        var img = item.querySelector(".u-feature-media");

        if (visible) {
          warmVideo(video, true);
          warmImage(img);
          if (video) {
            video.currentTime = 0;
            video.play().catch(function () {});
          }
        } else {
          warmVideo(video, false);
          if (video) {
            video.pause();
            video.currentTime = 0;
          }
        }
      });
    }

    function advanceTab() {
      var next = (currentIndex + 1) % tabLinks.length;
      setActive(next);
    }

    function startAutoplay() {
      stopAutoplay();
      if (!autoplayEnabled) return;
      autoplayTimer = setInterval(advanceTab, slideDuration);
    }

    function restartAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    tabLinks.forEach(function (link, i) {
      if (link.classList.contains("active")) currentIndex = i;
    });
    setActive(currentIndex);

    tabLinks.forEach(function (link, index) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        setActive(index);
        restartAutoplay();
      });
    });

    if ("IntersectionObserver" in window) {
      sectionObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              preloadGamesMedia(section);
              startAutoplay();
            } else {
              stopAutoplay();
            }
          });
        },
        { threshold: 0.2 }
      );
      sectionObserver.observe(section);
    } else {
      startAutoplay();
    }

    activeSection = section;
    stopAutoplayFn = function () {
      stopAutoplay();
      if (sectionObserver) {
        sectionObserver.disconnect();
        sectionObserver = null;
      }
    };
  }

  function onViewportChange() {
    initGamesTabs();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      var section = document.getElementById("games");
      if (section) disableSlaterDesktopTabs(section);
      initGamesTabs();
    });
  } else {
    var section = document.getElementById("games");
    if (section) disableSlaterDesktopTabs(section);
    initGamesTabs();
  }

  if (typeof MOBILE_MQ.addEventListener === "function") {
    MOBILE_MQ.addEventListener("change", onViewportChange);
  } else if (typeof MOBILE_MQ.addListener === "function") {
    MOBILE_MQ.addListener(onViewportChange);
  }
})();
