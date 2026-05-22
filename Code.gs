/**
 * Exports a Google Doc to PDF and saves it into a target Drive folder.
 *
 * Required POST JSON:
 * {
 *   "secret": "...",
 *   "docId": "Google Doc file ID",
 *   "folderId": "target Drive folder ID",
 *   "fileName": "Service Agreement - Name.pdf"
 * }
 *
 * Configure the shared secret in Apps Script:
 * Project Settings -> Script properties -> PDF_EXPORT_SECRET
 */
function doPost(e) {
  try {
    var payload = JSON.parse((e.postData && e.postData.contents) || "{}");
    var expectedSecret = PropertiesService
      .getScriptProperties()
      .getProperty("PDF_EXPORT_SECRET");

    if (!expectedSecret) {
      return jsonResponse({
        ok: false,
        error: "Missing script property: PDF_EXPORT_SECRET"
      });
    }

    if (payload.secret !== expectedSecret) {
      return jsonResponse({
        ok: false,
        error: "Unauthorized"
      });
    }

    var docId = payload.docId;
    var folderId = payload.folderId;
    var fileName = payload.fileName;

    if (!docId || !folderId || !fileName) {
      return jsonResponse({
        ok: false,
        error: "Missing required field: docId, folderId, or fileName"
      });
    }

    var docFile = DriveApp.getFileById(docId);
    var targetFolder = DriveApp.getFolderById(folderId);
    var normalizedFileName = /\.pdf$/i.test(fileName) ? fileName : fileName + ".pdf";
    var pdfBlob = docFile.getAs(MimeType.PDF).setName(normalizedFileName);
    var pdfFile = targetFolder.createFile(pdfBlob);

    return jsonResponse({
      ok: true,
      pdfFileId: pdfFile.getId(),
      pdfFileName: pdfFile.getName(),
      pdfUrl: pdfFile.getUrl()
    });
  } catch (err) {
    return jsonResponse({
      ok: false,
      error: err && err.message ? err.message : String(err)
    });
  }
}

function jsonResponse(body) {
  return ContentService
    .createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}

