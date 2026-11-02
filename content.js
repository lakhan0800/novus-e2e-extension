document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    chrome.runtime.sendMessage({ type: "page-hidden", url: location.href });
  }
});
