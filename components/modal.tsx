"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  onConfirm: () => Promise<void>;
}

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirmar",
  onConfirm,
}: ModalProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95%] max-w-md rounded-xl p-6">
        <DialogHeader className="text-center space-y-3">
          <DialogTitle className="text-destructive text-xl font-bold">
            {title}
          </DialogTitle>
          <DialogDescription className="text-base">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6">
          <Button
            className="cursor-pointer w-full sm:w-auto"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            className="cursor-pointer w-full sm:w-auto"
            variant="destructive"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? <Spinner className="size-4" /> : confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
