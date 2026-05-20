import { useEffect } from "react";
import { initTelegramWebApp } from "@/lib/telegram-web-app";

/** Runs once when opened inside Telegram (Mini App / Web App). */
export function TelegramBootstrap() {
  useEffect(() => {
    initTelegramWebApp();
  }, []);

  return null;
}
