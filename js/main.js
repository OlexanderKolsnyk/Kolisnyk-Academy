(() => {
  "use strict";
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  if (location.hash) history.replaceState(null, "", `${location.pathname}${location.search}`);
  window.scrollTo(0, 0);
  window.addEventListener("pageshow", () => requestAnimationFrame(() => window.scrollTo(0, 0)));

  const data = window.SITE_DATA;
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
  const icons = {
    tiktok: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 4v10.2a4.8 4.8 0 1 1-4.1-4.7v3.2a1.8 1.8 0 1 0 1.1 1.7V4h3Z"/><path d="M15 4c.5 2.6 2 4.2 5 4.7v3.1c-2-.1-3.7-.8-5-2"/></svg>',
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7.2v9.6L17 12 9 7.2Z"/><circle cx="12" cy="12" r="9"/></svg>',
    telegram: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 11 15-6-4 14-4-5-3 3v-4l8-5-10 4-2-1Z"/></svg>',
    function: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.5 5.5c-3-2-5 0-5.5 3L8.5 17c-.5 3-2.5 4-4 2M7 11h7M16 10l4 4m0-4-4 4"/></svg>',
    target: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="m14 10 6-6"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/><rect x="3" y="3" width="18" height="18" rx="6"/></svg>',
    people: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2"/><path d="M3 19c.5-4 2.5-6 6-6s5.5 2 6 6M15 14c3 0 5 1.5 5.5 4.5"/></svg>',
    wallet: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7.5h15a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h12"/><path d="M16 12h5v4h-5a2 2 0 0 1 0-4Z"/></svg>',
    book: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5c3-1 5.5-.5 8 1.5v12c-2.5-2-5-2.5-8-1.5v-12Zm16 0c-3-1-5.5-.5-8 1.5v12c2.5-2 5-2.5 8-1.5v-12Z"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="18" height="12" rx="4"/><path d="m10 9 5 3-5 3V9Z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.5"/><circle cx="17.5" cy="6.5" r=".7" fill="currentColor"/></svg>',
    threads: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.5 8.5c-1-2-2.8-3-5-3-4 0-6.5 2.8-6.5 6.8 0 4.1 2.5 6.7 6.3 6.7 3.4 0 5.7-1.7 5.7-4.3 0-2.1-1.6-3.5-4.1-3.5-2.3 0-3.8 1-3.8 2.6 0 1.4 1.2 2.3 2.8 2.3 2.7 0 4.6-2.2 4.6-5.2 0-3.4-1.7-5.6-4.8-5.6"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 21v-8h2.8l.5-3h-3.3V8.2c0-.9.3-1.7 1.8-1.7H17V3.8c-.6-.1-1.4-.2-2.4-.2-2.5 0-4.1 1.5-4.1 4.3V10H8v3h2.5v8h3Z" fill="currentColor"/></svg>',
    viber: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4.5c4-2 10-1.5 13 1.5 2.5 2.5 2.8 7.5.7 10.3-1.9 2.4-5.1 3.2-8.2 2.7L6 21l.8-3.8C3.8 14.4 2.8 7.7 5 4.5Z"/><path d="M8 8c.5 3.5 2.5 5.5 6 6m-5.5-6.5 1.5 2-1 1c.7 1.3 1.7 2.3 3 3l1-1 2 1.5"/></svg>'
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

  function interleaveReviews(images, texts, format) {
    const mixed = [];
    const length = Math.max(images.length, texts.length);
    for (let index = 0; index < length; index += 1) {
      if (images[index]) mixed.push(images[index]);
      if (texts[index]) mixed.push({ ...texts[index], format, textReview: true });
    }
    return mixed;
  }

  function reviewCard(item, format) {
    if (item.textReview) return `<blockquote class="review-card review-${format} review-text"><p>${escapeHtml(item.text)}</p><cite>${escapeHtml(item.name)}</cite></blockquote>`;
    return `<figure class="review-card review-${format}"><img src="${item.image}" alt="${escapeHtml(item.alt)}" loading="lazy"></figure>`;
  }

  function reviewRow(items, format, reverse = false) {
    const doubled = [...items, ...items];
    return `<div class="marquee-row review-row-${format}${reverse ? " reverse" : ""}">${doubled.map(item => reviewCard(item, format)).join("")}</div>`;
  }

  function renderReviews() {
    const wide = data.reviews.filter(item => item.format === "wide");
    const tall = data.reviews.filter(item => item.format !== "wide");
    const wideTexts = data.textReviews.filter((_, index) => index % 2 === 0);
    const tallTexts = data.textReviews.filter((_, index) => index % 2 !== 0);
    $("#reviews-marquee").innerHTML = reviewRow(interleaveReviews(wide, wideTexts, "wide"), "wide") + reviewRow(interleaveReviews(tall, tallTexts, "tall"), "tall", true);
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

  function setupTopLinks() {
    document.querySelectorAll('.brand[href="#top"]').forEach(link => {
      link.addEventListener("click", event => {
        event.preventDefault();
        history.replaceState(null, "", `${location.pathname}${location.search}`);
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

        const menu = $("#mobile-menu");
        const button = $(".menu-button");
        if (menu && button) {
          menu.hidden = true;
          button.setAttribute("aria-expanded", "false");
          button.setAttribute("aria-label", "Відкрити меню");
        }
      });
    });
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
  setupMenu(); setupTopLinks(); setupFaq(); setupSelections();
  $("#current-year").textContent = new Date().getFullYear();
})();
