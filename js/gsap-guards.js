(function () {
  if (!window.gsap) return;

  function isMissingTarget(target) {
    return target == null || target === undefined;
  }

  function noopTween() {
    return {
      kill: function () {},
      pause: function () {},
      play: function () {},
      progress: function () {
        return 0;
      },
    };
  }

  ["to", "from", "fromTo", "set"].forEach(function (method) {
    var original = gsap[method];
    if (typeof original !== "function") return;

    gsap[method] = function (targets) {
      if (isMissingTarget(targets)) {
        return noopTween();
      }
      return original.apply(this, arguments);
    };
  });
})();
