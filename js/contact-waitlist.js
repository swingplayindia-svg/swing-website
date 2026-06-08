(function () {
  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
  }

  function init() {
    var form = document.getElementById("contact-waitlist-form");
    if (!form) return;

    var input = form.querySelector("#contact-waitlist-email");
    var errorEl = form.querySelector(".contact-waitlist__error");
    var successEl = form.querySelector(".contact-waitlist__success");
    var submitBtn = form.querySelector(".contact-waitlist__submit");

    function showError(message) {
      if (!errorEl) return;
      errorEl.textContent = message;
      errorEl.hidden = !message;
    }

    function setSubmitting(isSubmitting) {
      if (!submitBtn) return;
      submitBtn.disabled = isSubmitting;
      submitBtn.textContent = isSubmitting ? "Joining..." : "Join waitlist";
    }

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
      if (!window.swingWaitlistApi) {
        showError("Waitlist service is unavailable. Please try again later.");
        return;
      }

      showError("");
      if (successEl) successEl.hidden = true;
      setSubmitting(true);

      window.swingWaitlistApi
        .submitWaitlistEmail(email, "contact-page")
        .then(function (data) {
          if (successEl) {
            successEl.textContent =
              data.message || "Thanks — you're on the waitlist. Check your inbox.";
            successEl.hidden = false;
          }
          form.reset();
        })
        .catch(function (err) {
          showError(err.message || "Could not join the waitlist.");
        })
        .finally(function () {
          setSubmitting(false);
        });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
