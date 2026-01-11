"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, MessageCircle, Zap, BarChart3 } from "lucide-react"
import { useState } from "react"

export default function Landing() {
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null)

  const PLANS = [
    {
      id: "genin",
      name: "Genin",
      subtitle: "Plano Gratuito",
      description: "Acesso inicial, uso limitado, foco em experimentação",
      features: ["1 bot", "100 mensagens/mês", "Suporte por email", "Dashboard básico"],
    },
    {
      id: "chunin",
      name: "Chunin",
      subtitle: "Plano Iniciante",
      description: "Pequenas empresas e criadores pessoais",
      features: ["5 bots", "10.000 mensagens/mês", "Suporte prioritário", "Analytics completo", "Automações avançadas"],
    },
    {
      id: "jonin",
      name: "Jonin",
      subtitle: "Plano Profissional",
      description: "Usuários de alto uso e negócios em crescimento",
      features: ["50 bots", "500.000 mensagens/mês", "Suporte 24/7", "API completa", "Webhooks avançados"],
      popular: true,
    },
    {
      id: "hokage",
      name: "Hokage",
      subtitle: "Plano Enterprise",
      description: "Power users e empresas em escala",
      features: [
        "Bots ilimitados",
        "Mensagens ilimitadas",
        "Suporte dedicado 24/7",
        "API completa",
        "Integrações customizadas",
      ],
    },
  ]

  const handleWhatsAppTest = () => {
    window.open("https://wa.me/5511999999999", "_blank")
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-accent-foreground font-bold text-sm">UB</span>
            </div>
            <span className="font-bold text-lg">Uchiha Bot</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm hover:text-accent transition">
              Recursos
            </Link>
            <Link href="#exemplo" className="text-sm hover:text-accent transition">
              Exemplo
            </Link>
            <Link href="#pricing" className="text-sm hover:text-accent transition">
              Preços
            </Link>
            <Link href="/login" className="text-sm hover:text-accent transition">
              Login
            </Link>
          </nav>
          <Link href="/register">
            <Button size="sm" className="bg-accent hover:bg-accent/90 text-white">
              Começar Grátis
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container px-4 py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            Gerencie seus <span className="text-accent">Bots WhatsApp</span> com Facilidade
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 text-balance">
            Crie e gerencie bots WhatsApp profissionais sem precisar de código. Ideal para pequenas empresas e
            empreendedores.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-white">
                Criar Conta Grátis
              </Button>
            </Link>
            <Button size="lg" variant="outline" onClick={handleWhatsAppTest}>
              <MessageCircle className="w-4 h-4 mr-2" />
              Testar Bot no WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container px-4 py-20 border-t border-border">
        <h2 className="text-3xl font-bold mb-12 text-center">Recursos Principais</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            {
              icon: MessageCircle,
              title: "Fácil de Usar",
              description: "Interface intuitiva para criar e gerenciar bots",
            },
            { icon: Zap, title: "Múltiplos Bots", description: "Gerencie vários bots em uma única plataforma" },
            { icon: BarChart3, title: "Análises", description: "Acompanhe o desempenho e estatísticas de seus bots" },
            { icon: Check, title: "Suporte 24/7", description: "Equipe pronta para ajudar no seu sucesso" },
          ].map((feature, i) => {
            const Icon = feature.icon
            return (
              <div key={i} className="p-6 rounded-lg border border-border bg-card hover:border-accent/50 transition">
                <Icon className="w-8 h-8 text-accent mb-3" />
                <h3 className="font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Example Section - WhatsApp Chat Layout */}
      <section id="exemplo" className="container px-4 py-20 border-t border-border">
        <h2 className="text-3xl font-bold mb-12 text-center">Como Funciona</h2>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-bold">
                  1
                </span>
                Criar seu Bot
              </h3>
              <p className="text-muted-foreground">Defina o nome, tipo e comportamento do seu bot em minutos</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-bold">
                  2
                </span>
                Configurar Respostas
              </h3>
              <p className="text-muted-foreground">Crie fluxos de conversação personalizados com IA</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-bold">
                  3
                </span>
                Conectar ao WhatsApp
              </h3>
              <p className="text-muted-foreground">Integre seu bot e comece a atender clientes automaticamente</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg">
            {/* WhatsApp-like header */}
            <div className="bg-muted p-4 border-b border-border flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-sm">
                UB
              </div>
              <div>
                <h4 className="font-semibold text-sm">Uchiha Bot Support</h4>
                <p className="text-xs text-muted-foreground">online</p>
              </div>
            </div>

            {/* Chat messages */}
            <div className="p-4 space-y-4 h-80 overflow-y-auto bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><defs><pattern id=%22grid%22 width=%2220%22 height=%2220%22 patternUnits=%22userSpaceOnUse%22><path d=%22M 20 0 L 0 0 0 20%22 fill=%22none%22 stroke=%22rgba(255,255,255,0.02)%22 strokeWidth=%220.5%22/></pattern></defs><rect width=%22100%22 height=%22100%22 fill=%22currentColor%22/><rect width=%22100%22 height=%22100%22 fill=%22url(%23grid)%22/></svg>')]">
              <div className="flex justify-start">
                <div className="max-w-xs bg-muted rounded-3xl rounded-bl-none p-3">
                  <p className="text-sm">Olá! 👋 Como posso ajudar você hoje?</p>
                </div>
              </div>

              <div className="flex justify-end">
                <div className="max-w-xs bg-accent rounded-3xl rounded-br-none p-3 text-accent-foreground">
                  <p className="text-sm">Preciso saber o horário de funcionamento</p>
                </div>
              </div>

              <div className="flex justify-start">
                <div className="max-w-xs bg-muted rounded-3xl rounded-bl-none p-3">
                  <p className="text-sm">Funcionamos das 8h às 18h, seg-sex 📅</p>
                </div>
              </div>

              <div className="flex justify-end">
                <div className="max-w-xs bg-accent rounded-3xl rounded-br-none p-3 text-accent-foreground">
                  <p className="text-sm">Obrigado! Vocês têm suporte por chat?</p>
                </div>
              </div>

              <div className="flex justify-start">
                <div className="max-w-xs bg-muted rounded-3xl rounded-bl-none p-3">
                  <p className="text-sm">Sim! Suporte 24/7 para todos os clientes 🎉</p>
                </div>
              </div>
            </div>

            {/* WhatsApp-like input */}
            <div className="bg-card border-t border-border p-4 flex gap-2">
              <input
                type="text"
                placeholder="Digite sua mensagem..."
                className="flex-1 bg-muted rounded-full px-4 py-2 text-sm border border-border outline-none text-foreground placeholder:text-muted-foreground"
                disabled
              />
              <button className="bg-accent text-accent-foreground rounded-full p-2 hover:bg-accent/90 transition">
                <MessageCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container px-4 py-20 border-t border-border">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Escolha Seu Plano</h2>
          <p className="text-muted-foreground">Comece grátis e escale conforme necessário</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {PLANS.map((plan) => (
            <Card
              key={plan.id}
              className={`relative flex flex-col transition-all duration-300 ${
                plan.popular
                  ? "border-2 border-accent scale-105 md:scale-110"
                  : "border border-border hover:border-accent/50"
              }`}
              onMouseEnter={() => setHoveredPlan(plan.id)}
              onMouseLeave={() => setHoveredPlan(null)}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground">
                  Popular
                </Badge>
              )}
              <div className="p-6 border-b border-border">
                <h3 className="font-bold text-2xl mb-1">{plan.name}</h3>
                <p className="text-accent text-sm font-semibold mb-2">{plan.subtitle}</p>
                <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <ul className="space-y-3 mb-6 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <Check className="w-5 h-5 text-accent flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full ${plan.popular ? "bg-accent hover:bg-accent/90 text-white" : ""}`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  Solicitar Preço
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Todos os planos incluem 30 dias de teste grátis. Sem cartão de crédito necessário.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container px-4 py-20 border-t border-border">
        <div className="bg-card border border-accent/30 rounded-lg p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para Começar?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Junte-se a milhares de empresas que já estão automatizando seu atendimento com Uchiha Bot
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-white">
                Criar Conta Grátis
              </Button>
            </Link>
            <Button size="lg" variant="outline" onClick={handleWhatsAppTest}>
              <MessageCircle className="w-4 h-4 mr-2" />
              Testar Agora
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-12">
        <div className="container px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-lg bg-accent flex items-center justify-center">
                  <span className="text-accent-foreground font-bold text-xs">UB</span>
                </div>
                <span className="font-bold">Uchiha Bot</span>
              </div>
              <p className="text-sm text-muted-foreground">Plataforma inteligente de automação WhatsApp</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Produto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#features" className="hover:text-accent transition">
                    Recursos
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-accent transition">
                    Preços
                  </Link>
                </li>
                <li>
                  <Link href="#exemplo" className="hover:text-accent transition">
                    Exemplo
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-accent transition">
                    Sobre
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition">
                    Contato
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-accent transition">
                    Privacidade
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition">
                    Termos
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>© 2026 Uchiha Bot. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
