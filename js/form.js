(() => {
  "use strict";
  const $ = selector => document.querySelector(selector);
  const form = $("#contact-form");
  if (!form) return;

  const fields = {
    name: $("#user-name"), contact: $("#user-contact"), message: $("#user-message"), teacher: $("#selected-teacher"),
    pace: $("#pref-pace"), style: $("#pref-style"), control: $("#pref-control"), format: $("#pref-format")
  };
  const valueLabels = {
    pace: ["Повільний", "Збалансований", "Інтенсивний"],
    style: ["Стриманий", "Доброзичливий", "Дуже неформальний"],
    control: ["М’який", "Помірний", "Високий"],
    format: ["Більше теорії", "Теорія + практика", "Більше практики"]
  };
  const outputs = { pace: $("#pace-output"), style: $("#style-output"), control: $("#control-output"), format: $("#format-output") };
  Object.keys(valueLabels).forEach(key => fields[key].addEventListener("input", () => outputs[key].textContent = valueLabels[key][Number(fields[key].value) - 1]));

  const draftFields = [fields.name, fields.contact, fields.message, fields.teacher];
  draftFields.forEach(field => {
    const stored = localStorage.getItem(`ka_${field.id}`);
    if (stored !== null) field.value = stored;
    field.addEventListener("input", () => localStorage.setItem(`ka_${field.id}`, field.value));
  });

  const voiceOpen = $("#voice-open");
  const voicePanel = $("#voice-panel");
  const voiceRecord = $("#voice-record");
  const voiceDelete = $("#voice-delete");
  const voicePreview = $("#voice-preview");
  const voiceConfirm = $("#voice-confirm");
  const voiceConfirmWrap = $("#voice-confirm-wrap");
  const voiceStatus = $("#voice-status");
  const voiceTimer = $("#voice-timer");
  let recorder = null;
  let stream = null;
  let chunks = [];
  let recordedBase64 = null;
  let recordedMimeType = null;
  let timerId = null;
  let startedAt = 0;

  voiceOpen.addEventListener("click", () => {
    voicePanel.hidden = !voicePanel.hidden;
    voiceOpen.setAttribute("aria-expanded", String(!voicePanel.hidden));
  });

  function resetVoice() {
    if (recorder?.state === "recording") recorder.stop();
    if (stream) stream.getTracks().forEach(track => track.stop());
    clearInterval(timerId);
    recorder = null; stream = null; chunks = []; recordedBase64 = null; recordedMimeType = null;
    voicePreview.pause(); voicePreview.removeAttribute("src"); voicePreview.hidden = true;
    voiceDelete.hidden = true; voiceConfirmWrap.hidden = true; voiceConfirm.checked = false;
    voiceRecord.textContent = "Почати запис"; voiceStatus.textContent = "Готово до запису"; voiceTimer.textContent = "00:00";
    voicePanel.classList.remove("recording");
  }

  function updateTimer() {
    const seconds = Math.min(60, Math.floor((Date.now() - startedAt) / 1000));
    voiceTimer.textContent = `00:${String(seconds).padStart(2, "0")}`;
    if (seconds >= 60 && recorder?.state === "recording") recorder.stop();
  }

  async function blobToBase64(blob) {
    return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result).split(",")[1]); reader.onerror = reject; reader.readAsDataURL(blob); });
  }

  voiceRecord.addEventListener("click", async () => {
    if (recorder?.state === "recording") { recorder.stop(); return; }
    resetVoice();
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      $("#form-error").textContent = "Цей браузер не підтримує запис. Заявку можна надіслати текстом або лише з контактом.";
      return;
    }
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recorder = new MediaRecorder(stream);
      recorder.addEventListener("dataavailable", event => { if (event.data.size) chunks.push(event.data); });
      recorder.addEventListener("stop", async () => {
        clearInterval(timerId);
        stream?.getTracks().forEach(track => track.stop());
        const blob = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
        recordedMimeType = blob.type;
        recordedBase64 = await blobToBase64(blob);
        voicePreview.src = URL.createObjectURL(blob); voicePreview.hidden = false; voiceDelete.hidden = false; voiceConfirmWrap.hidden = false;
        voiceStatus.textContent = "Запис готовий — прослухайте й підтвердьте"; voiceRecord.textContent = "Перезаписати"; voicePanel.classList.remove("recording");
      });
      recorder.start(); startedAt = Date.now(); timerId = setInterval(updateTimer, 250); updateTimer();
      voicePanel.classList.add("recording"); voiceStatus.textContent = "Записуємо… максимум 60 секунд"; voiceRecord.textContent = "Зупинити";
    } catch (_) { $("#form-error").textContent = "Не вдалося отримати доступ до мікрофона. Дозвольте доступ або надішліть заявку без голосового."; }
  });
  voiceDelete.addEventListener("click", resetVoice);

  const successDialog = $("#success-dialog");
  $("#success-close").addEventListener("click", () => successDialog.close());
  document.querySelectorAll("[data-close-dialog]").forEach(link => link.addEventListener("click", () => successDialog.close()));

  form.addEventListener("submit", async event => {
    event.preventDefault();
    const error = $("#form-error"); error.textContent = "";
    if (!fields.name.value.trim() || !fields.contact.value.trim()) {
      error.textContent = "Вкажіть, будь ласка, ім’я та Telegram або телефон.";
      (!fields.name.value.trim() ? fields.name : fields.contact).focus(); return;
    }
    if (recordedBase64 && !voiceConfirm.checked) { error.textContent = "Підтвердьте додавання голосового або видаліть запис."; voiceConfirm.focus(); return; }

    const selectedGoal = form.querySelector('input[name="goal"]:checked')?.value || "";
    const preferences = {
      pace: valueLabels.pace[Number(fields.pace.value) - 1], style: valueLabels.style[Number(fields.style.value) - 1],
      control: valueLabels.control[Number(fields.control.value) - 1], format: valueLabels.format[Number(fields.format.value) - 1]
    };
    const selectedTeacher = fields.teacher.value || "Довіряю підбір команді";
    const selectedLinkCategory = sessionStorage.getItem("ka_link_category") || "Не вказано";
    const ctaLocation = sessionStorage.getItem("ka_cta_location") || "direct-form";
    const referrer = document.referrer || "direct";
    const hasVoice = Boolean(recordedBase64 && voiceConfirm.checked);
    const submittedAt = new Date().toISOString();
    const attribution = window.KAAnalytics.attribution;
    const details = [
      `Навчальна ціль: ${selectedGoal || "Не вказано"}`,
      `Бажаний викладач: ${selectedTeacher}`,
      `Темп пояснення: ${preferences.pace}`,
      `Стиль комунікації: ${preferences.style}`,
      `Рівень контролю: ${preferences.control}`,
      `Формат пояснення: ${preferences.format}`,
      `Обране посилання: ${selectedLinkCategory}`,
      `Місце CTA: ${ctaLocation}`,
      `Referrer: ${referrer}`,
      `Голосове: ${hasVoice ? "Так" : "Ні"}`,
      `UTM Medium: ${attribution.utm_medium}`,
      `UTM Content: ${attribution.utm_content}`,
      `UTM Term: ${attribution.utm_term}`,
      `Visitor ID: ${window.KAAnalytics.visitorId}`,
      `Session ID: ${window.KAAnalytics.sessionId}`,
      `Timestamp ISO: ${submittedAt}`
    ].join("\n");
    const userMessage = fields.message.value.trim();
    const payload = {
      type: "lead", name: fields.name.value.trim(), contact: fields.contact.value.trim(), message: `${userMessage}${userMessage ? "\n\n" : ""}${details}`,
      audioBase64: recordedBase64 && voiceConfirm.checked ? recordedBase64 : null,
      audioMimeType: recordedBase64 && voiceConfirm.checked ? recordedMimeType : null,
      has_voice: hasVoice, selected_goal: selectedGoal,
      selected_link_category: selectedLinkCategory, selected_teacher: selectedTeacher,
      cta_location: ctaLocation, referrer,
      teacher_preferences: JSON.stringify(preferences),
      pace: preferences.pace, friendliness: preferences.style, academic: preferences.format, control: preferences.control,
      preference_pace: preferences.pace, preference_style: preferences.style, preference_control: preferences.control, preference_format: preferences.format,
      visitor_id: window.KAAnalytics.visitorId, session_id: window.KAAnalytics.sessionId,
      ...attribution, timestamp: submittedAt
    };

    const submit = $("#submit-btn"); const original = submit.innerHTML;
    submit.disabled = true; submit.textContent = "Надсилаємо…";
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);
      let response;
      try {
        response = await fetch(window.KAAnalytics.GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "cors",
          redirect: "follow",
          cache: "no-store",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(payload),
          signal: controller.signal
        });
      } finally {
        clearTimeout(timeoutId);
      }
      const responseText = await response.text();
      let serverResult = null;
      try { serverResult = JSON.parse(responseText); } catch (_) {}
      if (!response.ok || serverResult?.ok !== true) {
        throw new Error(serverResult?.error || `Google Apps Script повернув статус ${response.status}`);
      }
      window.KAAnalytics.track("form_submit_success", { selected_goal: selectedGoal, selected_teacher: fields.teacher.value, has_voice: payload.has_voice });
      if (typeof window.fbq === "function") window.fbq("track", "Lead");
      form.reset(); resetVoice(); draftFields.forEach(field => localStorage.removeItem(`ka_${field.id}`));
      Object.keys(valueLabels).forEach(key => outputs[key].textContent = valueLabels[key][1]);
      successDialog.showModal();
    } catch (_) { error.textContent = "Заявка не була підтверджена сервером. Дані збережено — спробуйте ще раз або напишіть нам у Telegram."; }
    finally { submit.disabled = false; submit.innerHTML = original; }
  });
})();
