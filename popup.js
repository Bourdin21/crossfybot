/* popup.js — Crossfy Bot */
const btn        = document.getElementById("start-bot");
const statusDot  = document.getElementById("status-dot");
const statusText = document.getElementById("status-text");

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('start-bot').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });


  if (!tab?.url?.includes("app.crossfyapp.com")) {
    statusDot.className  = "dot";
    statusDot.style.background = "var(--red)";
    statusText.textContent = "Abrí crossfyapp.com primero";
    btn.classList.add("injected");
    btn.textContent = "✕ URL incorrecta";
    return;
  }
  try {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const script = document.createElement('script');
        script.src = chrome.runtime.getURL('bot.js');
        script.onload = function () {
          this.remove(); // elimina el tag para evitar dejar basura
        };
        (document.head || document.documentElement).appendChild(script);
      }
    });

    // Feedback: éxito
    statusDot.className    = "dot ready";
    statusText.textContent = "Bot inyectado";
    btn.classList.add("injected");
    btn.textContent = "✓ ACTIVO EN PÁGINA";

  } catch (e) {
    statusDot.className  = "dot";
    statusDot.style.background = "var(--red)";
    statusText.textContent = "Error al inyectar";
    btn.textContent = "✕ ERROR";
    console.error("[Crossfy Bot]", e);
  }

  });
});