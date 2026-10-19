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
        submittedAt
      ]);

      return ContentService.createTextOutput(JSON.stringify({ ok: true, row: targetRow }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (data.type === "analytics") {
      var analyticsSheet = spreadsheet.getSheetByName("Analytics");
      if (!analyticsSheet) analyticsSheet = spreadsheet.insertSheet("Analytics");
      analyticsSheet.appendRow([
        data.timestamp || new Date().toISOString(),
        data.event || "",
        JSON.stringify(data.details || {}),
        data.utm_source || "direct",
        data.utm_medium || "none"
      ]);
      return ContentService.createTextOutput(JSON.stringify({ ok: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    throw new Error("Unsupported request type");
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
