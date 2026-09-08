import { extractJob } from "./parsers/index.js";

chrome.runtime.onMessage.addListener((message: { type?: string }, _sender: unknown, sendResponse: (value: unknown) => void) => {
  if (message.type === "extract-job") {
    sendResponse(extractJob(document, location.href));
  }
});
