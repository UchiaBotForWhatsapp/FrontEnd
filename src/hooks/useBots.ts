import { useState, useEffect } from 'react';

export interface Bot {
  id: string;
  nome: string;
  tipo: 'pessoal' | 'empresarial';
  plano: 'genin' | 'shunin' | 'jounin' | 'hokage';
  status: 'ativo' | 'inativo';
  descricao: string;
  nomeEmpresa?: string;
  descricaoEmpresa?: string;
  instrucoes?: string;
  produtos?: Array<{ nome: string; quantidade: number }>;
  createdAt: string;
}

export const useBots = () => {
  const [bots, setBots] = useState<Bot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load bots from localStorage for MVP
    const savedBots = localStorage.getItem('uchiha_bots');
    if (savedBots) {
      setBots(JSON.parse(savedBots));
    }
    setIsLoading(false);
  }, []);

  const saveBots = (newBots: Bot[]) => {
    setBots(newBots);
    localStorage.setItem('uchiha_bots', JSON.stringify(newBots));
  };

  const createBot = (botData: Omit<Bot, 'id' | 'status' | 'createdAt'>) => {
    const newBot: Bot = {
      ...botData,
      id: Math.random().toString(36).substr(2, 9),
      status: 'inativo',
      createdAt: new Date().toISOString(),
    };
    saveBots([...bots, newBot]);
    return newBot;
  };

  const updateBot = (id: string, botData: Partial<Bot>) => {
    const updatedBots = bots.map((bot) =>
      bot.id === id ? { ...bot, ...botData } : bot
    );
    saveBots(updatedBots);
  };

  const toggleBotStatus = (id: string) => {
    const updatedBots = bots.map((bot) => {
      if (bot.id === id) {
        const newStatus: 'ativo' | 'inativo' = bot.status === 'ativo' ? 'inativo' : 'ativo';
        return { ...bot, status: newStatus };
      }
      return bot;
    });
    saveBots(updatedBots);
  };

  const deleteBot = (id: string) => {
    const updatedBots = bots.filter((bot) => bot.id !== id);
    saveBots(updatedBots);
  };

  const getBot = (id: string) => {
    return bots.find((bot) => bot.id === id);
  };

  return {
    bots,
    isLoading,
    createBot,
    updateBot,
    toggleBotStatus,
    deleteBot,
    getBot,
  };
};
