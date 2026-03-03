"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Package, Trash2, Edit2, MessageCircle } from "lucide-react";
import { type Product } from "@/mock/products.mock";
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
import { Sidebar } from "@/components/sidebar";

import { useBots } from "@/hooks/use-bots";
import { useProducts } from "@/hooks/use-products";
import { Spinner } from "@/components/ui/spinner";

export default function MyProductsPage() {
  const [hasMounted, setHasMounted] = useState(false);
  const { products, isLoading, createProduct, updateProduct, deleteProduct } =
    useProducts();
  const { bots } = useBots();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleSaveProduct = async (productData: any) => {
    try {
      if (productToEdit) {
        await updateProduct(productToEdit._id, productData);
        toast.success("Produto atualizado com sucesso!");
      } else {
        await createProduct(productData);
        toast.success("Produto cadastrado com sucesso!");
      }
    } catch (error) {
      toast.error("Ocorreu um erro ao salvar o produto.");
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
      try {
        await deleteProduct(productToDelete._id);
        toast.success("Produto excluído com sucesso!");
      } catch (error) {
        toast.error("Ocorreu um erro ao excluir o produto.");
      }
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  if (!hasMounted || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6 pt-16 md:pt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Meus Produtos
            </h1>
            <Button
              onClick={() => {
                setProductToEdit(null);
                setIsModalOpen(true);
              }}
              className="bg-accent hover:bg-accent/90 gap-2 cursor-pointer w-full sm:w-auto text-sm sm:text-base h-10 sm:h-auto"
            >
              <Plus className="w-4 h-4" />
              Cadastrar Produto
            </Button>
          </div>

          {products.length === 0 ? (
            <Empty className="mt-8 sm:mt-12">
              <EmptyMedia variant="icon">
                <Package className="w-6 h-6" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>Nenhum produto cadastrado</EmptyTitle>
                <EmptyDescription>
                  Você ainda não possui produtos em sua lista. Comece
                  cadastrando seu primeiro produto.
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
              {products.map((product) => (
                <Card
                  key={product._id}
                  className="overflow-hidden border-border hover:border-accent/50 transition flex flex-col group"
                >
                  <div className="aspect-video relative overflow-hidden bg-secondary flex items-center justify-center shrink-0">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <Package className="w-12 h-12 text-muted-foreground/30" />
                    )}
                  </div>
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start gap-2">
                      <CardTitle className="text-lg font-bold line-clamp-1">
                        {product.name}
                      </CardTitle>
                      <Badge
                        variant="secondary"
                        className="bg-accent/10 text-accent text-[10px] px-1.5 shrink-0"
                      >
                        {product.stock} un.
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2 text-xs min-h-10">
                      {product.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 mt-auto">
                    <div className="flex items-center justify-between pt-3 border-t border-border/50">
                      <span className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1.5 truncate pr-2">
                        <MessageCircle className="w-3 h-3 text-accent shrink-0" />
                        <span className="truncate">
                          {getBotName(product.botId)}
                        </span>
                      </span>
                      <div className="flex gap-1 sm:gap-2 shrink-0">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 cursor-pointer hover:bg-accent/10 hover:text-accent"
                          onClick={() => handleEditProduct(product)}
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive hover:text-white hover:bg-destructive cursor-pointer transition-colors"
                          onClick={() => openDeleteDialog(product)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
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
      </main>
    </div>
  );
}
