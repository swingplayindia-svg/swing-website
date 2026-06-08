(function () {
  function getApiBase() {
    if (window.SWING_API_BASE) {
      return String(window.SWING_API_BASE).replace(/\/$/, "");
    }

    var meta = document.querySelector('meta[name="swing-api-base"]');
    if (meta && meta.content) {
      return meta.content.replace(/\/$/, "");
    }

    if (
      location.hostname === "localhost" ||
      location.hostname === "127.0.0.1"
    ) {
      return "";
    }

    return "";
  }

  function submitWaitlistEmail(email, source) {
    var base = getApiBase();
    return fetch(base + "/api/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, source: source || "website" }),
    }).then(function (res) {
      return res.json().then(function (data) {
        if (!res.ok || !data.ok) {
          throw new Error(data.error || "Could not join the waitlist.");
        }
        return data;
      });
    });
  }

  window.swingWaitlistApi = {
    getApiBase: getApiBase,
    submitWaitlistEmail: submitWaitlistEmail,
  };
})();
