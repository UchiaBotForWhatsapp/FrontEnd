export interface Product {
    _id: string;
    name: string;
    description: string;
    stock: number;
    price: number;
    botId: string;
    image: string;
}

export const MOCK_PRODUCTS: Product[] = [
    {
        _id: "1",
        name: "Produto Exemplo 1",
        description: "Descrição do produto exemplo 1",
        stock: 10,
        price: 100,
        botId: "bot-1",
        image: "https://via.placeholder.com/150",
    },
    {
        _id: "2",
        name: "Produto Exemplo 2",
        description: "Descrição do produto exemplo 2",
        stock: 5,
        price: 80,
        botId: "bot-2",
        image: "https://via.placeholder.com/150",
    },
];

export const MOCK_BOTS = [
    { _id: "bot-1", name: "Bot de Atendimento" },
    { _id: "bot-2", name: "Bot de Vendas" },
    { _id: "bot-3", name: "Bot de Suporte" },
];
