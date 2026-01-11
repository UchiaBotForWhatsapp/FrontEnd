
const PLANS = {
  genin: {
    id: "genin",
    name: "Genin",
    price: 0,
    description: "Plano gratuito perfeito para começar a criar seus primeiros bots",
    features: ["1 bot", "100 mensagens em 7 dias", "Suporte por email", "Dashboard básico"],
  },
  shunin: {
    id: "shunin",
    name: "Shunin",
    price: 5000,
    description: "Para quem precisa de mais bots e mensagens",
    features: ["3 bots", "1.000 mensagens", "Suporte por email", "Dashboard completo"],
  },
  jounin: {
    id: "jounin",
    name: "Jounin",
    price: 10000,
    description: "Para usuários avançados",
    features: [
      "5 bots",
      "5.000 mensagens",
      "Suporte prioritário",
      "Dashboard completo",
      "Automação básica",
    ],
  },
}

export default PLANS