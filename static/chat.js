// Keeps track of the whole conversation so we can send it to the backend
// on every request (the Claude API itself has no memory between calls).
const conversation = [];

const messagesEl = document.getElementById("messages");
const formEl = document.getElementById("chat-form");
const inputEl = document.getElementById("user-input");
const sendButtonEl = document.getElementById("send-button");

inputEl.addEventListener("input", () => {
  sendButtonEl.disabled = inputEl.value.trim().length === 0;
});

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Converts markdown-style **bold** into <b> tags. Runs on already-escaped
// HTML so this can't be used to inject arbitrary markup.
function formatMarkdown(text) {
  return escapeHtml(text).replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
}

function addMessageToPage(role, text) {
  const div = document.createElement("div");
  div.className = `message ${role}`;
  div.innerHTML = formatMarkdown(text);
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

formEl.addEventListener("submit", async (event) => {
  event.preventDefault();

  const userText = inputEl.value.trim();
  if (!userText) return;

  // Show the user's message right away and clear the input box.
  addMessageToPage("user", userText);
  conversation.push({ role: "user", content: userText });
  inputEl.value = "";
  sendButtonEl.disabled = true;

  try {
    const response = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: conversation }),
    });

    const data = await response.json();

    addMessageToPage("assistant", data.reply);
    conversation.push({ role: "assistant", content: data.reply });
  } catch (error) {
    addMessageToPage("assistant", "Oops, something went wrong. Try again!");
    console.error(error);
  }
});
