import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bot, HelpCircle, User, Building2, Trash2, Plus } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useAuth } from '../../hooks/useAuth';
import { useBots, Bot as BotType } from '../../hooks/useBots';
import { CreateBotWizard } from './components/CreateBotWizard';
import { EditBotModal } from './components/EditBotModal';
import styles from './Dashboard.module.css';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { bots, toggleBotStatus, deleteBot } = useBots();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingBot, setEditingBot] = useState<BotType | null>(null);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getPlanLabel = (plan: string) => {
    const labels: Record<string, string> = {
      genin: 'Genin (Grátis)',
      shunin: 'Shunin',
      jounin: 'Jounin',
      hokage: 'Hokage',
    };
    return labels[plan] || plan;
  };

  return (
    <div className={styles.dashboard}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link to="/" className={styles.logo}>
            <Bot size={24} className={styles.logoIcon} />
            <span className={styles.logoText}>Uchiha Bot</span>
          </Link>
        </div>

        <nav className={styles.nav}>
          <button className={`${styles.navItem} ${styles.active}`}>
            <Bot size={18} className={styles.navIcon} />
            Meus Bots
          </button>
          <Link to="/help" className={styles.navItem}>
            <HelpCircle size={18} className={styles.navIcon} />
            Ajuda
          </Link>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              {user?.nome?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className={styles.userDetails}>
              <span className={styles.userName}>{user?.nome || 'Usuário'}</span>
              <span className={styles.userEmail}>{user?.email || ''}</span>
            </div>
          </div>
          <button
            className={styles.logoutButton}
            onClick={() => setIsLogoutOpen(true)}
          >
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.pageTitle}>Meus Bots</h1>
            <p className={styles.pageSubtitle}>
              Gerencie todos os seus bots em um só lugar
            </p>
          </div>
          <Button variant="primary" onClick={() => setIsCreateOpen(true)}>
            <Plus size={18} style={{ marginRight: '0.5rem' }} />
            Criar Novo Bot
          </Button>
        </header>

        {bots.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <Bot size={48} />
            </div>
            <h2 className={styles.emptyTitle}>Nenhum bot criado</h2>
            <p className={styles.emptyDescription}>
              Comece criando seu primeiro bot para automatizar seu WhatsApp
            </p>
            <Button variant="primary" onClick={() => setIsCreateOpen(true)}>
              Criar Primeiro Bot
            </Button>
          </div>
        ) : (
          <div className={styles.botsGrid}>
            {bots.map((bot) => (
              <div key={bot.id} className={styles.botCard}>
                <div className={styles.botHeader}>
                  <h3 className={styles.botName}>{bot.nome}</h3>
                  <span
                    className={`${styles.status} ${
                      bot.status === 'ativo' ? styles.active : styles.inactive
                    }`}
                  >
                    {bot.status === 'ativo' ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                <div className={styles.botInfo}>
                  <span className={styles.botType}>
                    {bot.tipo === 'pessoal' ? (
                      <>
                        <User size={14} /> Pessoal
                      </>
                    ) : (
                      <>
                        <Building2 size={14} /> Empresarial
                      </>
                    )}
                  </span>
                  <span className={styles.botPlan}>{getPlanLabel(bot.plano)}</span>
                </div>
                <p className={styles.botDescription}>{bot.descricao}</p>
                <div className={styles.botActions}>
                  <Button
                    variant={bot.status === 'ativo' ? 'outline' : 'primary'}
                    size="sm"
                    onClick={() => toggleBotStatus(bot.id)}
                  >
                    {bot.status === 'ativo' ? 'Desativar' : 'Ativar'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingBot(bot)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteBot(bot.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Bot Wizard */}
      <CreateBotWizard
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      {/* Edit Bot Modal */}
      {editingBot && (
        <EditBotModal
          bot={editingBot}
          onClose={() => setEditingBot(null)}
        />
      )}

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        title="Confirmar Saída"
        size="sm"
      >
        <div className={styles.logoutModal}>
          <p>Tem certeza que deseja sair da sua conta?</p>
          <div className={styles.logoutActions}>
            <Button variant="outline" onClick={() => setIsLogoutOpen(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleLogout}>
              Sair
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
