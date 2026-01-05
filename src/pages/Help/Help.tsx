import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, Clock, Bot, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import styles from './Help.module.css';

export const Help: React.FC = () => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <Bot size={28} className={styles.logoIcon} />
          <span className={styles.logoText}>Uchiha Bot</span>
        </Link>

        <h1 className={styles.title}>Central de Ajuda</h1>
        <p className={styles.subtitle}>
          Estamos aqui para ajudar! Entre em contato conosco através dos canais abaixo.
        </p>

        <div className={styles.contactCards}>
          <div className={styles.card}>
            <span className={styles.cardIcon}>
              <Phone size={24} />
            </span>
            <h3 className={styles.cardTitle}>Telefone</h3>
            <p className={styles.cardInfo}>+55 (11) 99999-9999</p>
            <p className={styles.cardDescription}>
              Segunda a Sexta, das 9h às 18h
            </p>
          </div>

          <div className={styles.card}>
            <span className={styles.cardIcon}>
              <Mail size={24} />
            </span>
            <h3 className={styles.cardTitle}>Email</h3>
            <p className={styles.cardInfo}>suporte@uchihabot.com</p>
            <p className={styles.cardDescription}>
              Respondemos em até 24 horas
            </p>
          </div>

          <div className={styles.card}>
            <span className={styles.cardIcon}>
              <Clock size={24} />
            </span>
            <h3 className={styles.cardTitle}>Horário de Atendimento</h3>
            <p className={styles.cardInfo}>Segunda a Sexta</p>
            <p className={styles.cardDescription}>
              Das 9h às 18h (Horário de Brasília)
            </p>
          </div>
        </div>

        <div className={styles.faq}>
          <h2 className={styles.faqTitle}>Perguntas Frequentes</h2>
          
          <div className={styles.faqItem}>
            <h4 className={styles.faqQuestion}>Como criar meu primeiro bot?</h4>
            <p className={styles.faqAnswer}>
              Acesse o Dashboard, clique em "Criar Novo Bot", escolha seu plano, 
              tipo de bot e preencha as informações necessárias.
            </p>
          </div>

          <div className={styles.faqItem}>
            <h4 className={styles.faqQuestion}>Posso usar meu WhatsApp pessoal?</h4>
            <p className={styles.faqAnswer}>
              Sim! Com o Bot Pessoal você pode usar qualquer número de WhatsApp. 
              Para o Bot Empresarial, é necessário ter uma conta WhatsApp Business.
            </p>
          </div>

          <div className={styles.faqItem}>
            <h4 className={styles.faqQuestion}>Como funciona a contagem de mensagens?</h4>
            <p className={styles.faqAnswer}>
              Cada mensagem enviada pelo bot conta como uma mensagem do seu plano. 
              Mensagens recebidas não são contabilizadas.
            </p>
          </div>

          <div className={styles.faqItem}>
            <h4 className={styles.faqQuestion}>Posso cancelar a qualquer momento?</h4>
            <p className={styles.faqAnswer}>
              Sim! Você pode cancelar sua assinatura a qualquer momento através 
              do Dashboard. O acesso continua até o fim do período pago.
            </p>
          </div>
        </div>

        <div className={styles.backLink}>
          <Link to="/dashboard">
            <Button variant="outline">
              <ArrowLeft size={16} style={{ marginRight: '0.5rem' }} />
              Voltar ao Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
