(function () {
  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
  }

  function init() {
    var popup = document.getElementById("join-popup");
    if (!popup) return;

    var dialog = popup.querySelector(".join-popup__dialog");
    var form = popup.querySelector("#join-popup-form");
    var input = popup.querySelector("#join-email");
    var errorEl = popup.querySelector(".join-popup__error");
    var successEl = popup.querySelector(".join-popup__success");
    var lastFocus = null;

    function showError(message) {
      if (!errorEl) return;
      errorEl.textContent = message;
      errorEl.hidden = !message;
    }

    function openPopup() {
      lastFocus = document.activeElement;
      popup.hidden = false;
      popup.setAttribute("aria-hidden", "false");
      document.body.classList.add("join-popup-open");
      if (form) form.hidden = false;
      if (successEl) successEl.hidden = true;
      showError("");
      if (form) form.reset();
      window.setTimeout(function () {
        if (input) input.focus();
      }, 50);
    }

    function closePopup() {
      popup.hidden = true;
      popup.setAttribute("aria-hidden", "true");
      document.body.classList.remove("join-popup-open");
      showError("");
      if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
    }

    document.querySelectorAll("[data-join-popup]").forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        openPopup();
      });
    });

    popup.querySelectorAll("[data-join-popup-close]").forEach(function (el) {
      el.addEventListener("click", closePopup);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !popup.hidden) closePopup();
    });

    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var email = input ? input.value.trim() : "";
        if (!email) {
          showError("Please enter your email address.");
          if (input) input.focus();
          return;
        }
        if (!isValidEmail(email)) {
          showError("Please enter a valid email address.");
          if (input) input.focus();
          return;
        }

        showError("");
        try {
          var list = JSON.parse(localStorage.getItem("swing-join-emails") || "[]");
          if (list.indexOf(email) === -1) list.push(email);
          localStorage.setItem("swing-join-emails", JSON.stringify(list));
        } catch (err) {
          /* ignore storage errors */
        }

        form.hidden = true;
        if (successEl) successEl.hidden = false;
        window.setTimeout(closePopup, 2400);
      });
    }

    if (dialog) {
      dialog.addEventListener("click", function (e) {
        e.stopPropagation();
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
