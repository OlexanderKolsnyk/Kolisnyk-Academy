(() => {
  "use strict";
  const data = window.SITE_DATA;
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));

  function renderLinks() {
    $("#links-grid").innerHTML = data.links.map(item => `
      <a class="link-card${item.accent ? " accent" : ""}" href="${escapeHtml(item.href)}" ${item.href.startsWith("http") ? 'target="_blank" rel="noopener"' : ""} data-link-category="${escapeHtml(item.category)}" ${item.goal ? `data-goal="${escapeHtml(item.goal)}"` : ""}>
        <span class="link-icon" aria-hidden="true">${item.icon}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p><span class="link-arrow" aria-hidden="true">↗</span>
      </a>`).join("");
  }

  function renderTeachers() {
    $("#teachers-list").innerHTML = data.teachers.map((teacher, index) => `
      <article class="teacher-card"><div class="teacher-photo"><img src="${teacher.image}" alt="${escapeHtml(teacher.name)} — ${escapeHtml(teacher.subject)}" width="853" height="1280" loading="lazy"></div><div class="teacher-info"><span class="teacher-tag">${escapeHtml(teacher.subject)}</span><h3>${escapeHtml(teacher.name)}</h3><p>${escapeHtml(teacher.trait)}</p><button class="teacher-select" type="button" data-teacher-index="${index}">Хочу заняття →</button></div></article>`).join("");
    const select = $("#selected-teacher");
    data.teachers.forEach(teacher => select.add(new Option(`${teacher.name} — ${teacher.subject}`, teacher.name)));
  }

  function renderLessons() {
    $("#lesson-gallery").innerHTML = data.lessons.map(item => `<figure class="lesson-thumb"><img src="${item.image}" alt="${escapeHtml(item.alt)}" loading="lazy"></figure>`).join("");
  }

  function reviewRow(items, reverse = false) {
    const doubled = [...items, ...items];
    return `<div class="marquee-row${reverse ? " reverse" : ""}">${doubled.map(item => `<figure class="review-card"><img src="${item.image}" alt="${escapeHtml(item.alt)}" loading="lazy"></figure>`).join("")}</div>`;
  }

  function renderReviews() {
    const midpoint = Math.ceil(data.reviews.length / 2);
    $("#reviews-marquee").innerHTML = reviewRow(data.reviews.slice(0, midpoint)) + reviewRow(data.reviews.slice(midpoint), true);
  }

  function renderFree() {
    $("#free-grid").innerHTML = data.free.map(item => `<a class="free-card" href="${item.href}" target="_blank" rel="noopener" data-link-category="${item.category}"><span class="free-kicker">${escapeHtml(item.kicker)}</span><span class="free-symbol" aria-hidden="true">${item.symbol}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p><span>Спробувати ↗</span></a>`).join("");
  }

  function renderPrices() {
    $("#pricing-list").innerHTML = data.prices.map(item => `<article class="price-card"><div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p></div><div class="price-amount"><strong>${escapeHtml(item.price)}</strong><small>${escapeHtml(item.unit)}</small></div></article>`).join("");
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
