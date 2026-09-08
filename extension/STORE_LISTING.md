# Chrome Web Store listing

## Name

TraxJob Importer

## Short description

Import job postings into TraxJob, edit the details, and save them to your application tracker.

## Detailed description

TraxJob Importer helps job seekers save job postings while browsing supported job sites. Open a job detail page, review the detected company and role, edit any field, and save the application to your TraxJob account.

Supported sites:

- LinkedIn
- JobStreet
- Glints
- MagangHub
- Kalibrr
- Indeed
- Pintarnya
- Dealls

The extension has one purpose: capture a job posting selected by the user and save it to TraxJob. It does not sell data, show ads, or build browsing profiles.

## Single purpose

Import a user-selected job posting into the user's TraxJob application tracker.

## Permission justification

- \`identity\`: complete the TraxJob login flow securely.
- \`scripting\`: inject the extractor on a supported job page when the content script was not available at page load.
- \`storage\`: keep the authenticated TraxJob session token locally and remove it when the user disconnects.
- Host permissions: read metadata only on supported job-site pages and communicate with the TraxJob API.

## Privacy declarations

Privacy policy: https://traxjob.vercel.app/privacy

The extension handles job-page content, application fields entered by the user, account identity, and authentication information. The data is used only to provide the import and tracking feature and is sent to TraxJob over HTTPS when the user saves an application.

## Reviewer test instructions

1. Open the extension on a supported job detail page.
2. Click **Login to TraxJob**.
3. Sign in with the reviewer account provided in the Chrome Web Store dashboard.
4. Confirm that the preview contains editable Company, Role, Job posting URL, Source, Status, Date applied, Contact link, and Notes fields.
5. Save the application and confirm it appears in the TraxJob dashboard.
6. Save the same URL again and confirm duplicate detection appears.

Before submitting, add the final Web Store extension ID callback to the production EXTENSION_REDIRECT_URLS environment variable.
