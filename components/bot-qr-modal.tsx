"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCcw,
  Smartphone,
  Scan,
} from "lucide-react";
import { botApi } from "@/lib/api-client";
import { toast } from "sonner";

interface BotQrModalProps {
  botId: string;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type ConnectionStatus =
  | "idle"
  | "loading"
  | "waiting"
  | "scanning"
  | "connected"
  | "error"
  | "active";

export function BotQrModal({
  botId,
  open,
  onClose,
  onSuccess,
}: BotQrModalProps) {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const pollingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isFetchingRef = useRef(false);

  const fetchQrCode = useCallback(
    async (isAuto = false) => {
      if (isFetchingRef.current) return;

      isFetchingRef.current = true;
      if (!isAuto) setStatus("loading");
      setError(null);

      try {
        const response = await botApi.getQrCode(botId);

        if (response.active) {
          setStatus("active");
          setQrCode(null);
          setMessage(response.message || "Bot já está conectado");
          stopPolling();
          if (onSuccess) onSuccess();
        } else if (response.qr) {
          setQrCode(response.qr);
          setStatus("waiting");
          setMessage(response.message || "QR code gerado");
        } else {
          setStatus("error");
          setError("Não foi possível gerar o QR Code.");
        }
      } catch (err: any) {
        toast.error("Erro ao buscar QR Code");
        setStatus("error");
        setError(
          "Ocorreu um erro ao carregar o QR Code. Por favor, tente novamente.",
        );
      } finally {
        isFetchingRef.current = false;
      }
    },
    [botId],
  );

  const startPolling = useCallback(() => {
    stopPolling();
    pollingTimerRef.current = setInterval(() => {
      fetchQrCode(true);
    }, 20000);
  }, [fetchQrCode]);

  const stopPolling = () => {
    if (pollingTimerRef.current) {
      clearInterval(pollingTimerRef.current);
      pollingTimerRef.current = null;
    }
  };

  useEffect(() => {
    if (open && botId) {
      fetchQrCode();
      startPolling();
    } else {
      stopPolling();
      setTimeout(() => {
        setQrCode(null);
        setStatus("idle");
        setError(null);
        setMessage(null);
      }, 300);
    }

    return () => stopPolling();
  }, [open, botId, fetchQrCode, startPolling]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="relative p-4 sm:p-6 border-b border-border bg-linear-to-r from-accent/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="size-8 sm:size-10 bg-accent/20 rounded-full flex items-center justify-center">
              <Smartphone className="size-4 sm:size-5 text-accent" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold">
                Conectar WhatsApp
              </h2>
              <p className="text-[11px] sm:text-sm text-muted-foreground">
                Siga as instruções para ativar o bot
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 sm:top-6 right-4 sm:right-6 p-1.5 sm:p-2 rounded-full hover:bg-secondary text-muted-foreground transition-colors"
          >
            <X className="size-4 sm:size-5" />
          </button>
        </div>

        <div className="p-4 sm:p-8 space-y-4 sm:space-y-6">
          <div className="relative flex justify-center items-center h-56 sm:h-64 w-full bg-secondary/50 rounded-xl border border-dashed border-border group">
            {status === "loading" && (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="size-8 sm:size-10 text-accent animate-spin" />
                <p className="text-xs sm:text-sm font-medium animate-pulse">
                  Gerando QR Code...
                </p>
              </div>
            )}

            {status === "error" && (
              <div className="flex flex-col items-center gap-3 text-center px-4 sm:px-6">
                <AlertCircle className="size-8 sm:size-10 text-destructive" />
                <p className="text-xs sm:text-sm font-medium text-destructive">
                  {error}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => fetchQrCode()}
                  className="mt-2 gap-2 h-8 text-xs sm:h-9 sm:text-sm"
                >
                  <RefreshCcw className="size-3 sm:size-4" /> Tentar novamente
                </Button>
              </div>
            )}

            {status === "active" && (
              <div className="flex flex-col items-center gap-3 sm:gap-4 text-center px-4 sm:px-6">
                <div className="size-12 sm:size-16 bg-green-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="size-8 sm:size-10 text-green-500" />
                </div>
                <div>
                  <p className="text-base sm:text-lg font-bold text-green-500">
                    Conectado!
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {message}
                  </p>
                </div>
                <Button
                  className="bg-accent hover:bg-accent/90 w-full h-8 text-xs sm:h-10 sm:text-sm"
                  onClick={onClose}
                >
                  Concluir
                </Button>
              </div>
            )}

            {qrCode && status === "waiting" && (
              <div className="relative p-1.5 sm:p-2 bg-white rounded-lg shadow-inner animate-in zoom-in-90 duration-500">
                <img
                  src={qrCode}
                  alt="WhatsApp QR Code"
                  className="w-40 h-40 sm:w-56 sm:h-56 object-contain"
                />
                <div className="absolute inset-0 border-2 border-accent/20 rounded-lg pointer-events-none"></div>
              </div>
            )}
          </div>

          {(status === "waiting" || status === "loading") && (
            <div className="space-y-4">
              <div className="text-[11px] sm:text-sm text-muted-foreground space-y-2.5 sm:space-y-3 p-3 sm:p-4 bg-secondary/30 rounded-lg border border-border">
                <div className="flex gap-2 sm:gap-3">
                  <div className="flex-none size-4 sm:size-5 rounded-full bg-accent/20 text-accent text-[9px] sm:text-[10px] font-bold flex items-center justify-center mt-0.5">
                    1
                  </div>
                  <p>
                    Abra o <strong>WhatsApp</strong> no celular.
                  </p>
                </div>
                <div className="flex gap-2 sm:gap-3">
                  <div className="flex-none size-4 sm:size-5 rounded-full bg-accent/20 text-accent text-[9px] sm:text-[10px] font-bold flex items-center justify-center mt-0.5">
                    2
                  </div>
                  <p>
                    Vá em <strong>Configurações</strong> e{" "}
                    <strong>Aparelhos Conectados</strong>.
                  </p>
                </div>
                <div className="flex gap-2 sm:gap-3">
                  <div className="flex-none size-4 sm:size-5 rounded-full bg-accent/20 text-accent text-[9px] sm:text-[10px] font-bold flex items-center justify-center mt-0.5">
                    3
                  </div>
                  <p>Aponte a câmera para esta tela.</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[10px] sm:text-xs text-muted-foreground justify-center text-center">
                <Scan className="size-3 flex-none" />
                <span>Atualização automática a cada 20s.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
