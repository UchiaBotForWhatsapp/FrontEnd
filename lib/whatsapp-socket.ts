import { io, type Socket } from "socket.io-client";
import { getAuthToken } from "./api-client";

let websocket: Socket | null = null;

function getSocketUrl(): string | null {
  const url = process.env.NEXT_PUBLIC_WEBSOCKET_URL?.trim().replace(/\/$/, "");
  return url || null;
}

export function getWhatsAppSocket(): Socket | null {
  if (websocket) return websocket;

  const socketUrl = getSocketUrl();
  if (!socketUrl) return null;

  const token = getAuthToken();

  websocket = io(socketUrl, {
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
