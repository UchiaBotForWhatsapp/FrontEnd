import React, { useState, useEffect } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Bot, useBots } from '../../../hooks/useBots';
import styles from './EditBotModal.module.css';

interface EditBotModalProps {
  bot: Bot;
  onClose: () => void;
}

export const EditBotModal: React.FC<EditBotModalProps> = ({ bot, onClose }) => {
  const { updateBot } = useBots();
  const [formData, setFormData] = useState({
    nome: bot.nome,
    descricao: bot.descricao,
    nomeEmpresa: bot.nomeEmpresa || '',
    descricaoEmpresa: bot.descricaoEmpresa || '',
    instrucoes: bot.instrucoes || '',
    produtos: bot.produtos || [{ nome: '', quantidade: 1 }],
  });

  const handleSubmit = () => {
    updateBot(bot.id, {
      nome: formData.nome,
      descricao: formData.descricao,
      nomeEmpresa: formData.nomeEmpresa,
      descricaoEmpresa: formData.descricaoEmpresa,
      instrucoes: formData.instrucoes,
      produtos: formData.produtos.filter((p) => p.nome),
    });
    onClose();
  };

  const addProduct = () => {
    setFormData({
      ...formData,
      produtos: [...formData.produtos, { nome: '', quantidade: 1 }],
    });
  };

  const updateProduct = (index: number, field: 'nome' | 'quantidade', value: string | number) => {
    const newProducts = [...formData.produtos];
    newProducts[index] = { ...newProducts[index], [field]: value };
    setFormData({ ...formData, produtos: newProducts });
  };

  const removeProduct = (index: number) => {
    const newProducts = formData.produtos.filter((_, i) => i !== index);
    setFormData({ ...formData, produtos: newProducts });
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={`Editar ${bot.nome}`} size="md">
      <div className={styles.form}>
        <Input
          label="Nome do Bot"
          value={formData.nome}
          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
        />

        <Input
          label="Descrição"
          value={formData.descricao}
          onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
        />

        {bot.tipo === 'empresarial' && (
          <>
            <Input
              label="Nome da Empresa"
              value={formData.nomeEmpresa}
              onChange={(e) => setFormData({ ...formData, nomeEmpresa: e.target.value })}
            />

            <Input
              label="Descrição da Empresa"
              value={formData.descricaoEmpresa}
              onChange={(e) => setFormData({ ...formData, descricaoEmpresa: e.target.value })}
            />

            <Input
              label="Instruções de Atendimento"
              value={formData.instrucoes}
              onChange={(e) => setFormData({ ...formData, instrucoes: e.target.value })}
            />

            <div className={styles.productsSection}>
              <label className={styles.sectionLabel}>Produtos</label>
              {formData.produtos.map((produto, index) => (
                <div key={index} className={styles.productRow}>
                  <Input
                    placeholder="Nome do produto"
                    value={produto.nome}
                    onChange={(e) => updateProduct(index, 'nome', e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Qtd"
                    value={produto.quantidade.toString()}
                    onChange={(e) => updateProduct(index, 'quantidade', parseInt(e.target.value) || 0)}
                  />
                  {formData.produtos.length > 1 && (
                    <Button variant="ghost" size="sm" onClick={() => removeProduct(index)}>
                      🗑️
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addProduct}>
                + Adicionar Produto
              </Button>
            </div>
          </>
        )}

        <div className={styles.actions}>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Salvar Alterações
          </Button>
        </div>
      </div>
    </Modal>
  );
};
