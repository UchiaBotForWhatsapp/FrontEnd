"use client"

import { Button } from "@/components/ui/button"

interface WhatsappConnectModalProps {
  open: boolean
  loading?: boolean
  qrCode?: string | null // base64 ou URL
  status?: "waiting" | "connected" | "error"
  onClose: () => void
  onConfirm: () => void
}

export function WhatsappConnectModal({
  open,
  loading,
  qrCode,
  status = "waiting",
  onClose,
  onConfirm,
}: WhatsappConnectModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background rounded-xl shadow-lg w-full max-w-lg p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Conectar WhatsApp</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </div>

        {/* QR Code */}
        <div className="flex justify-center">
          {qrCode ? (
            <img
              src={qrCode}
              alt="QR Code WhatsApp"
              className="w-48 h-48 rounded-lg border border-border bg-white p-2"
            />
          ) : (
            <div className="w-48 h-48 bg-secondary border border-border rounded-lg flex items-center justify-center text-muted-foreground text-sm">
              Gerando QR Code...
            </div>
          )}
        </div>

        {/* Status */}
        {status === "connected" && (
          <p className="text-sm text-green-500 text-center font-medium">
            WhatsApp conectado com sucesso
          </p>
        )}

        {status === "error" && (
          <p className="text-sm text-destructive text-center">
            Erro ao conectar. Gere um novo QR Code.
          </p>
        )}

        {/* Diretrizes */}
        <div className="text-sm text-muted-foreground space-y-2">
          <p>• Abra o WhatsApp no seu telemóvel</p>
          <p>• Vá em <strong>Dispositivos conectados</strong></p>
          <p>• Aponte a câmera para o QR Code</p>
          <p>• Mantenha o telefone conectado à internet</p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            className="bg-accent hover:bg-accent/90"
            onClick={onConfirm}
            disabled={loading || status === "connected"}
          >
            {loading ? "Conectando..." : "Concluir conexão"}
          </Button>
        </div>
      </div>
    </div>
  )
}
