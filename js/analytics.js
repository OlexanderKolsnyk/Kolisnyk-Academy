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

  function createId(prefix) {
    return `${prefix}-${crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`}`;
  }
  function persistentId(storage, key, prefix) {
    let value = storage.getItem(key);
    if (!value) { value = createId(prefix); storage.setItem(key, value); }
    return value;
  }
  const visitorId = persistentId(localStorage, "ka_visitor_id", "visitor");
  const sessionId = persistentId(sessionStorage, "ka_analytics_session_id", "session");
  function nextSequence() {
    const value = Number(sessionStorage.getItem("ka_analytics_sequence") || "0") + 1;
    sessionStorage.setItem("ka_analytics_sequence", String(value));
    return value;
  }
  function isoWeek(date) {
    const current = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    current.setUTCDate(current.getUTCDate() + 4 - (current.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(current.getUTCFullYear(), 0, 1));
    const week = Math.ceil((((current - yearStart) / 86400000) + 1) / 7);
    return `${current.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
  }
  function cleanText(value, max = 240) {
    return String(value || "").replace(/\s+/g, " ").trim().slice(0, max);
  }
  function post(payload) {
    const body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      try { if (navigator.sendBeacon(GOOGLE_SCRIPT_URL, new Blob([body], { type: "text/plain" }))) return; } catch (_) {}
    }
    fetch(GOOGLE_SCRIPT_URL, { method: "POST", mode: "no-cors", keepalive: true, headers: { "Content-Type": "text/plain" }, body }).catch(() => {});
  }
  function track(event, details = {}) {
    const now = new Date();
    const common = {
      site: "kolisnyk_academy",
      visitor_id: visitorId,
      session_id: sessionId,
      sequence: nextSequence(),
      client_timestamp: now.toISOString(),
      week_key: isoWeek(now),
      page: `${location.pathname}${location.search}${location.hash}`.slice(0, 500),
      referrer: document.referrer || "direct"
    };
    post({ type: "analytics", event, details: { ...common, ...details }, ...common, ...attribution });
  }

  window.KAAnalytics = { GOOGLE_SCRIPT_URL, attribution, visitorId, sessionId, track, post };
  window.addEventListener("load", () => track("page_view", { title: document.title }));

  document.addEventListener("click", event => {
    const control = event.target.closest("a,button");
    if (!control || control.disabled || control.getAttribute("aria-disabled") === "true") return;
    const ctaLocation = control.dataset.ctaLocation || "";
    const linkCategory = control.dataset.linkCategory || "";
    if (ctaLocation) sessionStorage.setItem("ka_cta_location", ctaLocation);
    if (linkCategory) sessionStorage.setItem("ka_link_category", linkCategory);
    const isLink = control.tagName === "A";
    track(isLink ? "link_click" : "button_click", {
      control_type: isLink ? "link" : "button",
      element_id: control.id || "",
      element_classes: cleanText(control.className),
      text: cleanText(control.getAttribute("aria-label") || control.textContent),
      href: isLink ? String(control.href || "").slice(0, 700) : "",
      cta_location: ctaLocation,
      link_category: linkCategory
    });
  });
})();
