import useSWR from "swr";
import { productApi } from "@/lib/api-client";
import { type Product } from "@/mock/products.mock";

function extractProductsList(payload: any): Product[] {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.products)) return payload.products;
    if (Array.isArray(payload?.data?.products)) return payload.data.products;
    return [];
}

function extractProductItem(payload: any): Product {
    if (!payload) return payload;
    return payload?.data?.product ?? payload?.data ?? payload?.product ?? payload;
}

export function useProducts() {
    const {
        data,
        error,
        isLoading,
        mutate,
    } = useSWR("/products", () => productApi.list(), {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    const products = extractProductsList(data);

    const createProduct = async (data: any) => {
        const response = await productApi.create(data);
        const newProduct = extractProductItem(response);
        mutate((prev: any) => [...extractProductsList(prev), newProduct], false);
        return newProduct;
    };

    const updateProduct = async (id: string, data: any) => {
        const response = await productApi.update(id, data);
        const updated = extractProductItem(response);
        mutate(
            (prev: any) =>
                extractProductsList(prev).map((product: Product) => (product._id === id ? updated : product)),
            false,
        );
        return updated;
    };

    const deleteProduct = async (id: string) => {
        await productApi.delete(id);
        mutate((prev: any) => extractProductsList(prev).filter((product: Product) => product._id !== id), false);
    };

    return {
        products,
        isLoading,
        error,
        createProduct,
        updateProduct,
        deleteProduct,
        mutate,
    };
}
