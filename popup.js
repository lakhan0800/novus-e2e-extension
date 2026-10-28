const groupsList = document.getElementById("groups");

async function renderGroups() {
  const { groups = [] } = await chrome.storage.local.get("groups");
  groupsList.innerHTML = "";
  for (const group of groups) {
    const item = document.createElement("li");
    const restore = document.createElement("button");
    restore.className = "restore-group";
    restore.textContent = `Restore ${group.name} (${group.urls.length})`;
    restore.addEventListener("click", () => chrome.runtime.sendMessage({ type: "restore", group }));
    item.appendChild(restore);
    groupsList.appendChild(item);
  }
}

document.getElementById("save-group").addEventListener("click", async () => {
  const name = document.getElementById("group-name").value || "Untitled";
  await chrome.runtime.sendMessage({ type: "save", name });
  await renderGroups();
});

void renderGroups();

const assistantMessages = [];
const assistantList = document.getElementById("assistant-messages");
const assistantForm = document.getElementById("assistant-form");
const assistantInput = document.getElementById("assistant-input");

function renderAssistantMessages() {
  if (!assistantList) return;
  assistantList.innerHTML = "";
  for (const message of assistantMessages) {
    const item = document.createElement("li");
    item.className = `message message-${message.role}`;
    item.textContent = message.content;
    assistantList.appendChild(item);
  }
}

assistantForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const text = assistantInput?.value.trim();
  if (!text) return;
  assistantMessages.push({ role: "user", content: text });
  if (assistantInput) assistantInput.value = "";
  renderAssistantMessages();
  const reply = await chrome.runtime.sendMessage({ type: "assistant", messages: assistantMessages });
  assistantMessages.push({ role: "assistant", content: reply.text });
  renderAssistantMessages();
});
