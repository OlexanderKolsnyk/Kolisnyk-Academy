function firstEmptyRow_(sheet, columnCount) {
  var lastRow = Math.max(sheet.getLastRow(), 1);
  if (lastRow > 1) {
    var rows = sheet.getRange(2, 1, lastRow - 1, columnCount).getDisplayValues();
    for (var index = 0; index < rows.length; index += 1) {
      var isEmpty = rows[index].every(function (cell) {
        return String(cell).trim() === "";
      });
      if (isEmpty) return index + 2;
    }
  }
  return lastRow + 1;
}

function writeToFirstEmptyRow_(sheet, values) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var targetRow = firstEmptyRow_(sheet, values.length);
    sheet.getRange(targetRow, 1, 1, values.length).setValues([values]);
    SpreadsheetApp.flush();
    return targetRow;
  } finally {
    lock.releaseLock();
  }
}

function doPost(e) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  try {
    var data = JSON.parse(e.postData.contents);

    if (data.type === "lead") {
      var leadSheet = spreadsheet.getSheetByName("Leads");
      if (!leadSheet) leadSheet = spreadsheet.insertSheet("Leads");
      ensureLeadAnalyticsHeaders_(leadSheet);

      var finalMessage = data.message || "";
      if (data.audioBase64) {
        var decodedAudio = Utilities.base64Decode(data.audioBase64);
        var blob = Utilities.newBlob(
          decodedAudio,
          data.audioMimeType || "audio/webm",
          "Voice_" + (data.name || "lead") + "_" + new Date().getTime() + ".webm"
        );
        var file = DriveApp.createFile(blob);
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        finalMessage += (finalMessage ? "\n\n" : "") + "🎤 Аудіозапис: " + file.getUrl();
      }

      var submittedAt = data.timestamp || new Date().toISOString();
      var targetRow = writeToFirstEmptyRow_(leadSheet, [
        submittedAt,
        data.name || "",
        data.contact || "",
        finalMessage,
        data.preference_pace || data.pace || "",
        data.preference_style || data.friendliness || "",
        data.preference_format || data.academic || "",
        data.preference_control || data.control || "",
        data.utm_source || "direct",
        data.utm_campaign || "none",
        data.selected_goal || "",
        data.selected_teacher || "",
        data.selected_link_category || "",
        data.cta_location || "",
        data.referrer || "direct",
        data.has_voice ? "Так" : "Ні",
        data.utm_medium || "none",
        data.utm_content || "none",
        data.utm_term || "none",
        submittedAt,
        data.visitor_id || "",
        data.session_id || ""
      ]);

      return ContentService.createTextOutput(JSON.stringify({ ok: true, row: targetRow }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (data.type === "analytics") {
      var analyticsSheetName = data.site === "pnmt" ? "PNMT Analytics" : "Analytics";
      var analyticsSheet = spreadsheet.getSheetByName(analyticsSheetName);
      if (!analyticsSheet) analyticsSheet = spreadsheet.insertSheet(analyticsSheetName);
      var analyticsHeaders = [
        "ServerTimestamp","ClientTimestamp","WeekKey","Site","Event","ControlType",
        "ElementID","Text","Href","Page","Referrer","VisitorID","SessionID","Sequence",
        "RegistrationID","Details","UTMSource","UTMMedium","UTMCampaign","UTMContent","UTMTerm"
      ];
      ensureAnalyticsHeaders_(analyticsSheet, analyticsHeaders);
      var details = data.details || {};
      writeToFirstEmptyRow_(analyticsSheet, [
        new Date(), data.client_timestamp || data.timestamp || new Date().toISOString(),
        data.week_key || "", data.site || "kolisnyk_academy", data.event || "",
        details.control_type || data.control_type || "", details.element_id || data.element_id || "",
        details.text || data.text || "", details.href || data.href || "", data.page || details.page || "",
        data.referrer || details.referrer || "", data.visitor_id || details.visitor_id || "",
        data.session_id || details.session_id || "", data.sequence || details.sequence || "",
        data.registration_id || "", JSON.stringify(details), data.utm_source || "direct",
        data.utm_medium || "none", data.utm_campaign || "none", data.utm_content || "none",
        data.utm_term || "none"
      ]);
      updateAnalyticsWeekly_(spreadsheet, data, details);
      return ContentService.createTextOutput(JSON.stringify({ ok: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    throw new Error("Unsupported request type");
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function ensureAnalyticsHeaders_(sheet, headers) {
  if (sheet.getLastRow() === 0 || !sheet.getRange(1, 1).getValue()) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
    return;
  }
  var first = String(sheet.getRange(1, 1).getDisplayValue() || "");
  if (first !== headers[0]) {
    sheet.insertRowBefore(1);
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
  sheet.setFrozenRows(1);
}

function ensureLeadAnalyticsHeaders_(sheet) {
  var headers = sheet.getRange(1, 21, 1, 2).getDisplayValues()[0];
  if (!headers[0]) sheet.getRange(1, 21).setValue("VisitorID");
  if (!headers[1]) sheet.getRange(1, 22).setValue("SessionID");
  sheet.setFrozenRows(1);
}

function updateAnalyticsWeekly_(spreadsheet, data, details) {
  var sheet = spreadsheet.getSheetByName("Analytics Weekly");
  if (!sheet) sheet = spreadsheet.insertSheet("Analytics Weekly");
  var headers = ["WeekKey","Site","Event","Control","Count","LastTimestamp"];
  ensureAnalyticsHeaders_(sheet, headers);
  var weekKey = data.week_key || "unknown";
  var site = data.site || "kolisnyk_academy";
  var eventName = data.event || "unknown";
  var control = details.text || data.text || details.href || data.href || details.target || "unknown";
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      var rows = sheet.getRange(2, 1, lastRow - 1, 6).getValues();
      for (var index = 0; index < rows.length; index += 1) {
        if (String(rows[index][0]) === String(weekKey) &&
            String(rows[index][1]) === String(site) &&
            String(rows[index][2]) === String(eventName) &&
            String(rows[index][3]) === String(control)) {
          sheet.getRange(index + 2, 5, 1, 2).setValues([[
            Number(rows[index][4] || 0) + 1,
            new Date()
          ]]);
          return;
        }
      }
    }
    var targetRow = firstEmptyRow_(sheet, headers.length);
    sheet.getRange(targetRow, 1, 1, headers.length).setValues([[
      weekKey, site, eventName, control, 1, new Date()
    ]]);
  } finally {
    lock.releaseLock();
  }
}
