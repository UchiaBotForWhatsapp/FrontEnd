"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TermsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: () => void;
}

export function TermsModal({ open, onOpenChange, onAccept }: TermsModalProps) {
  const handleAccept = () => {
    onAccept();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[95vh] p-0 overflow-hidden flex flex-col gap-0 border-none sm:border">
        <DialogHeader className="p-3 sm:p-6 pb-2 sm:pb-4 border-b shrink-0 bg-background">
          <DialogTitle className="text-lg sm:text-2xl">
            Termos e Condições
          </DialogTitle>
          <DialogDescription className="text-[10px] sm:text-sm">
            Por favor, leia atentamente os nossos termos e condições de uso.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-hidden bg-background">
          <ScrollArea className="h-full w-full modal-scrollbar">
            <div className="px-3 sm:px-6 py-4 space-y-4 text-xs sm:text-sm">
              <section>
                <h3 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2">
                  1. Aceitação dos Termos
                </h3>
                <p className="text-muted-foreground">
                  Ao criar uma conta e utilizar a plataforma UchiaBot, você
                  concorda em cumprir e estar vinculado a estes Termos e
                  Condições. Se você não concordar com qualquer parte destes
                  termos, não deverá utilizar nossos serviços.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2">
                  2. Descrição do Serviço
                </h3>
                <p className="text-muted-foreground">
                  O UchiaBot é uma plataforma que permite aos usuários criar e
                  gerenciar bots para WhatsApp. Oferecemos diferentes planos de
                  serviço com recursos variados para atender às necessidades de
                  nossos usuários.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2">
                  3. Conta de Usuário
                </h3>
                <p className="text-muted-foreground">
                  Você é responsável por manter a confidencialidade de sua conta
                  e senha. Você concorda em aceitar a responsabilidade por todas
                  as atividades que ocorram sob sua conta. Você deve
                  notificar-nos imediatamente sobre qualquer uso não autorizado
                  de sua conta.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2">
                  4. Uso Aceitável
                </h3>
                <p className="text-muted-foreground">
                  Você concorda em usar o serviço apenas para fins legais e de
                  acordo com estes Termos. Você não deve:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground ml-2 sm:ml-4">
                  <li>
                    Usar o serviço de qualquer forma que viole leis locais,
                    nacionais ou internacionais
                  </li>
                  <li>Enviar spam ou mensagens não solicitadas</li>
                  <li>
                    Tentar obter acesso não autorizado a qualquer parte do
                    serviço
                  </li>
                  <li>
                    Interferir ou interromper o serviço ou servidores conectados
                    ao serviço
                  </li>
                  <li>
                    Usar o serviço para transmitir vírus ou código malicioso
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2">
                  5. Planos e Pagamentos
                </h3>
                <p className="text-muted-foreground">
                  Oferecemos diferentes planos de serviço. Os detalhes de preços
                  e recursos estão disponíveis em nossa página de planos. Você
                  concorda em pagar todas as taxas associadas ao plano
                  escolhido. Reservamo-nos o direito de modificar nossos preços
                  mediante aviso prévio.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2">
                  6. Privacidade e Dados
                </h3>
                <p className="text-muted-foreground">
                  Levamos a privacidade de seus dados a sério. Coletamos e
                  processamos dados pessoais de acordo com nossa Política de
                  Privacidade. Ao usar nosso serviço, você concorda com a coleta
                  e uso de informações conforme descrito em nossa Política de
                  Privacidade.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2">
                  7. Propriedade Intelectual
                </h3>
                <p className="text-muted-foreground">
                  O serviço e seu conteúdo original, recursos e funcionalidades
                  são e permanecerão propriedade exclusiva do UchiaBot e seus
                  licenciadores. O serviço é protegido por direitos autorais,
                  marcas registradas e outras leis.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2">
                  8. Limitação de Responsabilidade
                </h3>
                <p className="text-muted-foreground">
                  Em nenhum caso o UchiaBot, seus diretores, funcionários,
                  parceiros ou agentes serão responsáveis por quaisquer danos
                  indiretos, incidentais, especiais, consequenciais ou
                  punitivos, incluindo, sem limitação, perda de lucros, dados,
                  uso, boa vontade ou outras perdas intangíveis.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2">
                  9. Rescisão
                </h3>
                <p className="text-muted-foreground">
                  Podemos rescindir ou suspender sua conta imediatamente, sem
                  aviso prévio ou responsabilidade, por qualquer motivo,
                  incluindo, sem limitação, se você violar os Termos. Após a
                  rescisão, seu direito de usar o serviço cessará imediatamente.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2">
                  10. Alterações aos Termos
                </h3>
                <p className="text-muted-foreground">
                  Reservamo-nos o direito de modificar ou substituir estes
                  Termos a qualquer momento. Se uma revisão for material,
                  tentaremos fornecer um aviso de pelo menos 30 dias antes de
                  quaisquer novos termos entrarem em vigor. O que constitui uma
                  mudança material será determinado a nosso exclusivo critério.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2">
                  11. Contato
                </h3>
                <p className="text-muted-foreground">
                  Se você tiver alguma dúvida sobre estes Termos, entre em
                  contato conosco através dos canais de suporte disponíveis na
                  plataforma.
                </p>
              </section>

              <section className="pt-2 sm:pt-4 border-t">
                <p className="text-[10px] sm:text-xs text-muted-foreground italic">
                  Última atualização: {new Date().toLocaleDateString("pt-BR")}
                </p>
              </section>
            </div>
          </ScrollArea>
        </div>

        <DialogFooter className="p-3 sm:p-6 border-t bg-background shrink-0">
          <Button
            onClick={handleAccept}
            className="w-full bg-accent hover:bg-accent/90 h-10 sm:h-11 text-xs sm:text-base"
          >
            Aceitar Termos e Condições
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
