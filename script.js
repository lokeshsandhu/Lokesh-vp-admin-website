const VOTE_START = new Date("2026-03-09T00:00:00-08:00");
const VOTE_END = new Date("2026-03-13T17:00:00-08:00");

function maybeLoadFigmaCaptureScript() {
  if (!window.location.hash.includes("figmacapture=")) return;
  if (document.querySelector('script[data-figma-capture="true"]')) return;

  const script = document.createElement("script");
  script.src = "https://mcp.figma.com/mcp/html-to-design/capture.js";
  script.async = true;
  script.dataset.figmaCapture = "true";
  document.head.appendChild(script);
}

function formatDuration(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function updateCountdown() {
  const label = document.querySelector('[data-js="countdown-label"]');
  const value = document.querySelector('[data-js="countdown-value"]');
  const sub = document.querySelector('[data-js="countdown-sub"]');
  if (!label || !value || !sub) return;

  const now = new Date();

  if (now < VOTE_START) {
    label.textContent = "Voting starts in";
    value.textContent = formatDuration(VOTE_START - now);
    sub.textContent = "March 9, 2026";
    return;
  }

  if (now >= VOTE_START && now <= VOTE_END) {
    label.textContent = "Voting ends in";
    value.textContent = formatDuration(VOTE_END - now);
    sub.textContent = "March 13, 2026 (5:00 PM)";
    return;
  }

  label.textContent = "Voting has ended";
  value.textContent = "Thank you for voting";
  sub.textContent = "March 9–13, 2026";
}

function setupGalleryLightbox() {
  const gallery = document.querySelector('[data-js="gallery"]');
  const dialog = document.querySelector('[data-js="lightbox"]');
  const img = document.querySelector('[data-js="lightbox-img"]');
  const closeBtn = document.querySelector('[data-js="lightbox-close"]');
  if (!gallery || !dialog || !img || !closeBtn) return;

  gallery.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target.closest("button[data-full]") : null;
    if (!target) return;
    const full = target.getAttribute("data-full");
    const preview = target.querySelector("img");
    if (!full || !preview) return;

    img.src = full;
    img.alt = preview.alt || "Campaign material";

    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "true");
    closeBtn.focus();
  });

  function close() {
    if (dialog.open) dialog.close();
  }

  closeBtn.addEventListener("click", close);
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) close();
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });
}

updateCountdown();
setInterval(updateCountdown, 30_000);
setupGalleryLightbox();
maybeLoadFigmaCaptureScript();
