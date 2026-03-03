"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Package, Trash2, Edit2, MessageCircle } from "lucide-react";
import { MOCK_PRODUCTS, type Product } from "@/mock/products.mock";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
  EmptyMedia,
} from "@/components/ui/empty";
import { Badge } from "@/components/ui/badge";
import { ProductModal } from "@/components/product-modal";
import { toast } from "sonner";
import { Modal } from "@/components/modal";

import { useBots } from "@/hooks/use-bots";

export default function MyProductsPage() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const { bots } = useBots();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const handleSaveProduct = (productData: any) => {
    if (productToEdit) {
      setProducts((prev) =>
        prev.map((p) =>
          p._id === productToEdit._id ? { ...p, ...productData } : p,
        ),
      );
      toast.success("Produto atualizado com sucesso!");
    } else {
      const newProduct: Product = {
        _id: Math.random().toString(36).substr(2, 9),
        ...productData,
      };
      setProducts((prev) => [...prev, newProduct]);
      toast.success("Produto cadastrado com sucesso!");
    }
    setProductToEdit(null);
  };

  const getBotName = (botId: string) => {
    const bot = bots.find((b: any) => b._id === botId);
    return bot ? bot.name : "Bot não encontrado";
  };

  const handleEditProduct = (product: Product) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const openDeleteDialog = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      setProducts((prev) => prev.filter((p) => p._id !== productToDelete._id));
      toast.success("Produto excluído com sucesso!");
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Meus Produtos</h1>
        <Button
          onClick={() => {
            setProductToEdit(null);
            setIsModalOpen(true);
          }}
          className="bg-accent hover:bg-accent/90 gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Cadastrar Produto
        </Button>
      </div>

      {products.length === 0 ? (
        <Empty className="mt-12">
          <EmptyMedia variant="icon">
            <Package className="w-6 h-6" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>Nenhum produto cadastrado</EmptyTitle>
            <EmptyDescription>
              Você ainda não possui produtos em sua lista. Comece cadastrando
              seu primeiro produto.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              onClick={() => {
                setProductToEdit(null);
                setIsModalOpen(true);
              }}
              className="bg-accent hover:bg-accent/90 cursor-pointer"
            >
              Cadastrar Produto
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card
              key={product._id}
              className="overflow-hidden border-border hover:border-accent/50 transition flex flex-col"
            >
              <div className="aspect-square relative overflow-hidden bg-secondary flex items-center justify-center">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package className="w-12 h-12 text-muted-foreground/50" />
                )}
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="text-xl line-clamp-1">
                    {product.name}
                  </CardTitle>
                  <Badge
                    variant="secondary"
                    className="bg-accent/10 text-accent"
                  >
                    {product.stock} em estoque
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2 min-h-10">
                  {product.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    {getBotName(product.botId)}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 cursor-pointer"
                      onClick={() => handleEditProduct(product)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                      onClick={() => openDeleteDialog(product)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        initialData={productToEdit}
      />

      <Modal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Tem certeza que deseja excluir este produto?"
        description="Essa ação removerá o produto da sua lista permanentemente."
        confirmText="Excluir"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
