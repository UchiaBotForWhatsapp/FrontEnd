"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBots } from "@/hooks/use-bots";
import { ImagePlus, X, AlertCircle } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: any) => void;
  initialData?: any;
}

export function ProductModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: ProductModalProps) {
  const { bots, isLoading: isLoadingBots } = useBots();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    stock: 0,
    price: 0,
    botId: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const imageObjectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        stock: initialData.stock || 0,
        price: initialData.price || 0,
        botId: initialData.botId || "",
      });
      setImagePreview(initialData.image || "");
      setImage(null);
    } else if (isOpen) {
      resetForm();
    }
  }, [initialData, isOpen]);

  useEffect(() => {
    return () => {
      if (imageObjectUrlRef.current) {
        URL.revokeObjectURL(imageObjectUrlRef.current);
      }
    };
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Nome do produto é obrigatório";
    if (!formData.description.trim())
      newErrors.description = "Descrição é obrigatória";
    if (formData.stock < 0) newErrors.stock = "Estoque não pode ser negativo";
    if (formData.price < 0) newErrors.price = "Preço não pode ser negativo";
    if (!formData.botId) newErrors.botId = "Selecione um Bot";
    if (!imagePreview) newErrors.image = "Foto do produto é obrigatória";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        image: "Apenas imagens são permitidas",
      }));
      return;
    }

    if (imageObjectUrlRef.current) {
      URL.revokeObjectURL(imageObjectUrlRef.current);
      imageObjectUrlRef.current = null;
    }

    setImage(file);
    const previewUrl = URL.createObjectURL(file);
    imageObjectUrlRef.current = previewUrl;
    setImagePreview(previewUrl);

    setErrors((prev) => {
      const { image: _image, ...rest } = prev;
      return rest;
    });
  };

  const removeImage = () => {
    if (imageObjectUrlRef.current) {
      URL.revokeObjectURL(imageObjectUrlRef.current);
      imageObjectUrlRef.current = null;
    }
    setImage(null);
    setImagePreview("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const form = new FormData();
      form.append("name", formData.name.trim());
      form.append("description", formData.description.trim());
      form.append("stock", String(formData.stock));
      form.append("price", String(formData.price));
      form.append("botId", formData.botId);
      if (image) form.append("image", image);

      await onSave(form);
      resetForm();
      onClose();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      stock: 0,
      price: 0,
      botId: "",
    });
    setImage(null);
    setImagePreview("");
    setErrors({});
  };

  const hasImage = Boolean(imagePreview || image);
  const isFormValid =
    formData.name &&
    formData.description &&
    formData.botId &&
    hasImage &&
    formData.stock >= 0 &&
    formData.price >= 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Cadastrar Produto
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="product-name">Nome do Produto</Label>
            <Input
              id="product-name"
              placeholder="Ex: Camiseta Básica"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="product-description">Descrição</Label>
            <Textarea
              id="product-description"
              placeholder="Descreva detalhes do produto..."
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className={errors.description ? "border-destructive" : ""}
            />
            {errors.description && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="product-stock">Estoque</Label>
              <Input
                id="product-stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stock: parseInt(e.target.value) || 0,
                  })
                }
                className={errors.stock ? "border-destructive" : ""}
              />
              {errors.stock && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.stock}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="product-price">Preço</Label>
              <Input
                id="product-price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: parseFloat(e.target.value) || 0,
                  })
                }
                className={errors.price ? "border-destructive" : ""}
              />
              {errors.price && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.price}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="product-bot">Bot Vinculado</Label>
            <Select
              value={formData.botId}
              onValueChange={(value) =>
                setFormData({ ...formData, botId: value })
              }
            >
              <SelectTrigger
                className={errors.botId ? "border-destructive w-full" : "w-full"}
              >
                <SelectValue
                  placeholder={
                    isLoadingBots ? "Carregando bots..." : "Selecione um Bot"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {isLoadingBots ? (
                  <div className="p-2 flex items-center justify-center">
                    <Spinner className="size-4" />
                  </div>
                ) : bots.length === 0 ? (
                  <div className="p-2 text-sm text-center text-muted-foreground">
                    Nenhum bot encontrado
                  </div>
                ) : (
                  bots.map((bot: any) => (
                    <SelectItem key={bot._id} value={bot._id}>
                      {bot.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {errors.botId && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.botId}
              </p>
            )}
            {bots.length === 0 && !isLoadingBots && (
              <p className="text-xs text-amber-500">
                Cadastre um bot primeiro para vincular produtos.
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Label>Foto do Produto</Label>
            {!imagePreview ? (
              <div
                className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-secondary/50 transition ${errors.image ? "border-destructive bg-destructive/5" : "border-border"}`}
                onClick={() =>
                  document.getElementById("product-image")?.click()
                }
              >
                <ImagePlus className="w-10 h-10 text-muted-foreground" />
                <span className="text-sm text-muted-foreground font-medium">
                  Clique para fazer upload
                </span>
                <span className="text-xs text-muted-foreground/60">
                  Apenas imagens
                </span>
                <input
                  id="product-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
            ) : (
              <div className="relative rounded-lg overflow-hidden border border-border aspect-video bg-secondary">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full hover:bg-black/80 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            {errors.image && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.image}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || !isFormValid || bots.length === 0}
              className="bg-accent hover:bg-accent/90 cursor-pointer"
            >
              {loading ? <Spinner className="mr-2 h-4 w-4" /> : null}
              {loading ? "Salvando..." : "Salvar Produto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
