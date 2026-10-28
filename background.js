chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "save") {
    chrome.tabs.query({ currentWindow: true }).then(async (tabs) => {
      const { groups = [] } = await chrome.storage.local.get("groups");
      groups.push({ name: message.name, urls: tabs.map((tab) => tab.url) });
      await chrome.storage.local.set({ groups });
      sendResponse({ ok: true });
    });
    return true;
  }
  if (message.type === "restore") {
    for (const url of message.group.urls) chrome.tabs.create({ url });
  }
  if (message.type === "assistant") {
    const last = message.messages?.at(-1)?.content ?? "";
    sendResponse({
      text: `Tabkeeper AI: I can help organize tabs. You asked: ${last}`,
    });
    return true;
  }
  return false;
});
