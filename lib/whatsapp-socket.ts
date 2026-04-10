import { io, type Socket } from "socket.io-client";
import { API_BASE_URL, getAuthToken } from "./api-client";

const DEFAULT_WEBSOCKET_URL = (API_BASE_URL || "http://localhost:3001/api").replace(/\/api\/?$/, "");

let websocket: Socket | null = null;

function getSocketUrl() {
  const override = process.env.NEXT_PUBLIC_WEBSOCKET_URL?.replace(/\/$/, "");
  return override || DEFAULT_WEBSOCKET_URL;
}

export function getWhatsAppSocket() {
  if (websocket) return websocket;

  const token = getAuthToken();

  websocket = io(getSocketUrl(), {
    transports: ["websocket"],
    auth: token ? { token } : undefined,
  });

  websocket.on("connect", () => {
    console.log("Socket connected", websocket?.id);
  });

  websocket.on("connect_error", (error) => {
    console.error("Erro ao conectar no websocket do WhatsApp", error);
  });

  return websocket;
}
