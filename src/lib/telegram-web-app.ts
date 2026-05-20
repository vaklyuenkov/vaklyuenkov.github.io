/** Site background / header — matches `--background` in index.css */
export const TELEGRAM_THEME_BG = "#0b0614";

export function isTelegramWebApp(): boolean {
  return typeof window !== "undefined" && Boolean(window.Telegram?.WebApp?.initData);
}

function applyViewportHeight(tg: TelegramWebApp): void {
  const h = tg.viewportStableHeight || tg.viewportHeight;
  if (h > 0) {
    document.documentElement.style.setProperty("--tg-viewport-height", `${h}px`);
  }
}

export function initTelegramWebApp(): void {
  const tg = window.Telegram?.WebApp;
  if (!tg) return;

  tg.ready();

  if (!isTelegramWebApp()) return;

  tg.expand();
  tg.setHeaderColor(TELEGRAM_THEME_BG);
  tg.setBackgroundColor(TELEGRAM_THEME_BG);
  applyViewportHeight(tg);

  document.documentElement.classList.add("telegram-webapp");
  document.body.classList.add("telegram-webapp");

  tg.onEvent("viewportChanged", () => applyViewportHeight(tg));
}
