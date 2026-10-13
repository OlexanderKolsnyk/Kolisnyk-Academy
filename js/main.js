(() => {
  "use strict";
  const data = window.SITE_DATA;
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
  const icons = {
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7.2v9.6L17 12 9 7.2Z"/><circle cx="12" cy="12" r="9"/></svg>',
    telegram: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 11 15-6-4 14-4-5-3 3v-4l8-5-10 4-2-1Z"/></svg>',
    function: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.5 5.5c-3-2-5 0-5.5 3L8.5 17c-.5 3-2.5 4-4 2M7 11h7M16 10l4 4m0-4-4 4"/></svg>',
    target: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="m14 10 6-6"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/><rect x="3" y="3" width="18" height="18" rx="6"/></svg>',
    people: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2"/><path d="M3 19c.5-4 2.5-6 6-6s5.5 2 6 6M15 14c3 0 5 1.5 5.5 4.5"/></svg>',
    wallet: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7.5h15a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h12"/><path d="M16 12h5v4h-5a2 2 0 0 1 0-4Z"/></svg>'
  };

  function renderLinks() {
    $("#links-grid").innerHTML = data.links.map(item => `
      <a class="link-card${item.accent ? " accent" : ""}" href="${escapeHtml(item.href)}" ${item.href.startsWith("http") ? 'target="_blank" rel="noopener"' : ""} data-link-category="${escapeHtml(item.category)}" ${item.goal ? `data-goal="${escapeHtml(item.goal)}"` : ""}>
        <span class="link-icon" aria-hidden="true">${icons[item.icon] || ""}</span><span class="link-copy"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p></span><span class="link-arrow" aria-hidden="true">↗</span>
      </a>`).join("");
  }

  function renderTeachers() {
    $("#teachers-list").innerHTML = data.teachers.map((teacher, index) => `
      <article class="teacher-card"><div class="teacher-photo"><img src="${teacher.image}" alt="${escapeHtml(teacher.name)} — ${escapeHtml(teacher.subject)}" width="853" height="1280" loading="lazy"></div><div class="teacher-info"><span class="teacher-tag">${escapeHtml(teacher.subject)}</span><h3>${escapeHtml(teacher.name)}</h3><p>${escapeHtml(teacher.trait)}</p><button class="teacher-select" type="button" data-teacher-index="${index}">Хочу заняття →</button></div></article>`).join("");
    const select = $("#selected-teacher");
    data.teachers.forEach(teacher => select.add(new Option(`${teacher.name} — ${teacher.subject}`, teacher.name)));
  }

  function renderLessons() {
    $("#lesson-gallery").innerHTML = data.lessons.map(item => `<figure class="lesson-thumb ${escapeHtml(item.format || "wide")}"><img src="${item.image}" alt="${escapeHtml(item.alt)}" loading="lazy"></figure>`).join("");
  }

  function reviewRow(items, reverse = false) {
    const doubled = [...items, ...items];
    return `<div class="marquee-row${reverse ? " reverse" : ""}">${doubled.map((item, index) => `<figure class="review-card ${index % 4 < 2 ? "review-tall" : "review-wide"}"><img src="${item.image}" alt="${escapeHtml(item.alt)}" loading="lazy"></figure>`).join("")}</div>`;
  }

  function renderReviews() {
    const midpoint = Math.ceil(data.reviews.length / 2);
    $("#reviews-marquee").innerHTML = reviewRow(data.reviews.slice(0, midpoint)) + reviewRow(data.reviews.slice(midpoint), true);
  }

  function renderFree() {
    $("#free-grid").innerHTML = data.free.map(item => `<a class="free-card" href="${item.href}" target="_blank" rel="noopener" data-link-category="${item.category}"><span class="free-media"><img src="${item.image}" alt="" loading="lazy"><span class="free-symbol" aria-hidden="true">${item.symbol}</span></span><span class="free-body"><span class="free-kicker">${escapeHtml(item.kicker)}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p><span class="free-action">Дізнатися більше ↗</span></span></a>`).join("");
  }

  function renderPrices() {
    $("#pricing-list").innerHTML = data.prices.map(item => `<article class="price-card"><div class="price-copy"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p><ul>${item.benefits.map(benefit => `<li>${escapeHtml(benefit)}</li>`).join("")}</ul></div><div class="price-amount"><strong>${escapeHtml(item.price)}</strong><small>${escapeHtml(item.unit)}</small></div></article>`).join("");
  }

  function renderFaq() {
    $("#faq-list").innerHTML = data.faq.map((item, index) => `<article class="faq-item"><h3><button class="faq-question" type="button" aria-expanded="false" aria-controls="faq-answer-${index}">${escapeHtml(item.q)}<span aria-hidden="true">＋</span></button></h3><div class="faq-answer" id="faq-answer-${index}" hidden><p>${escapeHtml(item.a)}</p></div></article>`).join("");
  }

  function setupMenu() {
    const button = $(".menu-button");
    const menu = $("#mobile-menu");
    button.addEventListener("click", () => {
      const open = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!open));
      button.setAttribute("aria-label", open ? "Відкрити меню" : "Закрити меню");
      menu.hidden = open;
    });
    menu.addEventListener("click", event => { if (event.target.matches("a")) { menu.hidden = true; button.setAttribute("aria-expanded", "false"); } });
  }

  function setupFaq() {
    $("#faq-list").addEventListener("click", event => {
      const button = event.target.closest(".faq-question");
      if (!button) return;
      const answer = document.getElementById(button.getAttribute("aria-controls"));
      const expanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!expanded));
      answer.hidden = expanded;
    });
  }

  function setupSelections() {
    document.addEventListener("click", event => {
      const teacherButton = event.target.closest(".teacher-select");
      if (teacherButton) {
        const teacher = data.teachers[Number(teacherButton.dataset.teacherIndex)];
        $("#selected-teacher").value = teacher.name;
        $(".preferences").open = true;
        sessionStorage.setItem("ka_cta_location", `teacher-${teacher.name}`);
        window.KAAnalytics?.track("Teacher Select", { teacher: teacher.name });
        $("#lead-form").scrollIntoView({ behavior: "smooth" });
      }
      const goalLink = event.target.closest("[data-goal]");
      if (goalLink) {
        const radio = document.querySelector(`input[name="goal"][value="${CSS.escape(goalLink.dataset.goal)}"]`);
        if (radio) radio.checked = true;
      }
    });
  }

  renderLinks(); renderTeachers(); renderLessons(); renderReviews(); renderFree(); renderPrices(); renderFaq();
  setupMenu(); setupFaq(); setupSelections();
  $("#current-year").textContent = new Date().getFullYear();
})();
