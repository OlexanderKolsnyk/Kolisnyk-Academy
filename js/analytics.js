(() => {
  "use strict";
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw4sVRam4j1jR6TAq7AgqKHczS7NFXvvdI6iFjin1Pu0gS0E5HSGZ_4VHiGMeetojlIUA/exec";
  const params = new URLSearchParams(location.search);
  const stored = JSON.parse(sessionStorage.getItem("ka_attribution") || "{}");
  const attribution = {
    utm_source: params.get("utm_source") || stored.utm_source || "direct",
    utm_medium: params.get("utm_medium") || stored.utm_medium || "none",
    utm_campaign: params.get("utm_campaign") || stored.utm_campaign || "none",
    utm_content: params.get("utm_content") || stored.utm_content || "none",
    utm_term: params.get("utm_term") || stored.utm_term || "none"
  };
  sessionStorage.setItem("ka_attribution", JSON.stringify(attribution));

  function post(payload) {
    const body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      try { navigator.sendBeacon(GOOGLE_SCRIPT_URL, new Blob([body], { type: "text/plain" })); return; } catch (_) {}
    }
    fetch(GOOGLE_SCRIPT_URL, { method: "POST", mode: "no-cors", keepalive: true, headers: { "Content-Type": "text/plain" }, body }).catch(() => {});
  }

  function track(event, details = {}) {
    post({ type: "analytics", event, details, ...attribution, page: location.pathname, referrer: document.referrer || "direct", timestamp: new Date().toISOString() });
  }

  window.KAAnalytics = { GOOGLE_SCRIPT_URL, attribution, track, post };
  window.addEventListener("load", () => track("Page View", { title: document.title }));

  document.addEventListener("click", (event) => {
    const cta = event.target.closest(".js-lead-cta");
    if (cta) {
      const locationName = cta.dataset.ctaLocation || "unknown";
      sessionStorage.setItem("ka_cta_location", locationName);
      track("CTA Click", { location: locationName });
    }
    const link = event.target.closest("[data-link-category]");
    if (link) {
      sessionStorage.setItem("ka_link_category", link.dataset.linkCategory);
      track("Link Click", { category: link.dataset.linkCategory, href: link.href });
    }
  });
})();
