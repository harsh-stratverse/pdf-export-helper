# PDF Export Helper

Small Google Apps Script web app used by the Make onboarding scenario.

It receives a generated Google Doc ID, exports the document as a PDF, saves the PDF into the contractor's Drive folder, and returns the created PDF file metadata to Make.

## Request

`POST` JSON:

```json
{
  "secret": "shared-secret-from-script-properties",
  "docId": "generated-google-doc-id",
  "folderId": "target-drive-folder-id",
  "fileName": "Service Agreement - Harsh Chauhan.pdf"
}
```

## Response

Success:

```json
{
  "ok": true,
  "pdfFileId": "...",
  "pdfFileName": "Service Agreement - Harsh Chauhan.pdf",
  "pdfUrl": "https://drive.google.com/..."
}
```

Failure:

```json
{
  "ok": false,
  "error": "..."
}
```

## Deployment

1. Create a Google Apps Script project.
2. Add `Code.gs`.
3. Add the manifest values from `appsscript.json` if you are using clasp/manual manifest editing.
4. In Apps Script, open **Project Settings**.
5. Add script property:

   ```text
   PDF_EXPORT_SECRET = your-long-random-secret
   ```

6. Deploy as **Web app**:
   - Execute as: `Me`
   - Who has access: `Anyone` or the narrowest option Make can access
7. Copy the web app URL into the Make HTTP module.

## Make Module

Use `HTTP > Make a request` after Google Docs placeholder replacement:

- Method: `POST`
- URL: Apps Script web app URL
- Body type: raw JSON

Example body:

```json
{
  "secret": "your-long-random-secret",
  "docId": "{{service_agreement_file_id}}",
  "folderId": "{{stratverse_contractor_folder_id}}",
  "fileName": "Service Agreement - {{contractor_name}}.pdf"
}
```

## Notes

- Do not commit real secrets.
- The script runs as the deploying Google account, so that account must have access to the generated Google Doc and target Drive folder.
- Apps Script web apps do not provide normal HTTP status-code control through `ContentService`; check the `ok` boolean in the JSON response.

