import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  Target, 
  BarChart3, 
  Shield, 
  Rocket, 
  MessageSquare,
  Check
} from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Button } from '../../components/ui/Button';
import styles from './Landing.module.css';

const plans = [
  {
    id: 'genin',
    name: 'Genin',
    price: 'Grátis',
    period: '7 dias',
    messages: '100 mensagens',
    features: [
      '1 bot ativo',
      'Suporte por email',
      'Funcionalidades básicas',
    ],
    highlighted: false,
  },
  {
    id: 'shunin',
    name: 'Shunin',
    price: 'R$ 49',
    period: '/mês',
    messages: '1.000 mensagens',
    features: [
      '3 bots ativos',
      'Suporte prioritário',
      'Relatórios básicos',
      'Integrações simples',
    ],
    highlighted: false,
  },
  {
    id: 'jounin',
    name: 'Jounin',
    price: 'R$ 99',
    period: '/mês',
    messages: '5.000 mensagens',
    features: [
      '10 bots ativos',
      'Suporte 24/7',
      'Relatórios avançados',
      'Todas as integrações',
      'API personalizada',
    ],
    highlighted: true,
  },
  {
    id: 'hokage',
    name: 'Hokage',
    price: 'R$ 199',
    period: '/mês',
    messages: '10.000 mensagens',
    features: [
      'Bots ilimitados',
      'Suporte dedicado',
      'Relatórios personalizados',
      'Todas as integrações',
      'API ilimitada',
      'White label',
    ],
    highlighted: false,
  },
];

const benefits = [
  {
    Icon: Zap,
    title: 'Respostas Instantâneas',
    description: 'Seu bot responde em segundos, 24 horas por dia, 7 dias por semana.',
  },
  {
    Icon: Target,
    title: 'IA Inteligente',
    description: 'Tecnologia avançada que entende e responde como um humano.',
  },
  {
    Icon: BarChart3,
    title: 'Análises Detalhadas',
    description: 'Acompanhe métricas e melhore o desempenho do seu bot.',
  },
  {
    Icon: Shield,
    title: 'Segurança Total',
    description: 'Seus dados e conversas protegidos com criptografia de ponta.',
  },
  {
    Icon: Rocket,
    title: 'Fácil Configuração',
    description: 'Configure seu bot em minutos, sem conhecimento técnico.',
  },
  {
    Icon: MessageSquare,
    title: 'Multi-Canais',
    description: 'WhatsApp pessoal ou business, você escolhe.',
  },
];

export const Landing: React.FC = () => {
  const handleTestBot = () => {
    window.open('https://wa.me/5511999999999?text=Olá! Quero testar o Uchiha Bot!', '_blank');
  };

  return (
    <div className={styles.page}>
      <Header />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            O Poder do <span className={styles.accent}>Sharingan</span> no Seu WhatsApp
          </h1>
          <p className={styles.heroSubtitle}>
            Crie bots inteligentes para WhatsApp em minutos. Automatize atendimentos, 
            venda produtos e conquiste clientes enquanto descansa.
          </p>
          <div className={styles.heroActions}>
            <Link to="/register">
              <Button variant="primary" size="lg">
                Começar Agora
              </Button>
            </Link>
            <Button variant="outline" size="lg" onClick={handleTestBot}>
              Testar Bot
            </Button>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>10K+</span>
              <span className={styles.statLabel}>Bots Ativos</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>1M+</span>
              <span className={styles.statLabel}>Mensagens/Dia</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>99.9%</span>
              <span className={styles.statLabel}>Uptime</span>
            </div>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.glowOrb} />
          <div className={styles.sharinganEye}>
            <div className={styles.eyeInner}>
              <div className={styles.tomoe} />
              <div className={styles.tomoe} />
              <div className={styles.tomoe} />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="beneficios" className={styles.benefits}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Por que escolher o Uchiha Bot?</h2>
          <p className={styles.sectionSubtitle}>
            Recursos poderosos para transformar seu atendimento
          </p>
        </div>
        <div className={styles.benefitsGrid}>
          {benefits.map((benefit, index) => (
            <div key={index} className={styles.benefitCard}>
              <span className={styles.benefitIcon}>
                <benefit.Icon size={28} />
              </span>
              <h3 className={styles.benefitTitle}>{benefit.title}</h3>
              <p className={styles.benefitDescription}>{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="precos" className={styles.pricing}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Planos para Todos os Ninjas</h2>
          <p className={styles.sectionSubtitle}>
            Escolha o plano ideal para o seu negócio
          </p>
        </div>
        <div className={styles.plansGrid}>
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`${styles.planCard} ${plan.highlighted ? styles.highlighted : ''}`}
            >
              {plan.highlighted && <span className={styles.badge}>Mais Popular</span>}
              <h3 className={styles.planName}>{plan.name}</h3>
              <div className={styles.planPrice}>
                <span className={styles.price}>{plan.price}</span>
                <span className={styles.period}>{plan.period}</span>
              </div>
              <p className={styles.planMessages}>{plan.messages}</p>
              <ul className={styles.planFeatures}>
                {plan.features.map((feature, index) => (
                  <li key={index} className={styles.planFeature}>
                    <Check size={16} className={styles.checkIcon} />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link to="/register" className={styles.planButton}>
                <Button
                  variant={plan.highlighted ? 'primary' : 'outline'}
                  fullWidth
                >
                  Escolher {plan.name}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className={styles.demo}>
        <div className={styles.demoContent}>
          <h2 className={styles.sectionTitle}>Experimente Agora</h2>
          <p className={styles.sectionSubtitle}>
            Teste nosso bot de demonstração e veja o poder do Uchiha Bot em ação
          </p>
          <Button variant="primary" size="lg" onClick={handleTestBot}>
            Testar Bot no WhatsApp
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};
