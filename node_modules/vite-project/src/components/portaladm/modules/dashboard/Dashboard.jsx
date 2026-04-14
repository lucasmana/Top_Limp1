import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [dados, setDados] = useState({
    servicosVencidos: 12,
    servicosAVencer: 8,
    servicosSemAgendamento: 5,
    servicosAgendados: 45,
    servicosExecutados: 127,
    colaboradoresInaptos: 3,
    pendenciasDocumentais: 7,
    equipesEmCampo: 4,
    agendaDoDia: 23
  });

  useEffect(() => {
    // Simular atualização em tempo real dos dados
    const interval = setInterval(() => {
      setDados(prev => ({
        ...prev,
        servicosVencidos: Math.max(0, prev.servicosVencidos + Math.floor(Math.random() * 3) - 1),
        agendaDoDia: Math.max(0, prev.agendaDoDia + Math.floor(Math.random() * 5) - 2)
      }));
    }, 30000); // Atualiza a cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="portaladm-dashboard">
      <div className="dashboard-header">
        <h2>Dashboard Geral - Sistema Operacional TOP LIMP</h2>
        <div className="dashboard-timestamp">
          Última atualização: {new Date().toLocaleString('pt-BR')}
        </div>
      </div>
      
      {/* Indicadores Críticos - Tomada de Decisão Imediata */}
      <div className="dashboard-critical">
        <h3>Indicadores Críticos - Ação Imediata</h3>
        <div className="critical-cards">
          <div className="critical-card danger" onClick={() => alert('Ver serviços vencidos')}>
            <div className="critical-number">{dados.servicosVencidos}</div>
            <div className="critical-label">Serviços Vencidos</div>
            <div className="critical-action">Ação Imediata</div>
            <div className="critical-trend">↑ 2 hoje</div>
          </div>
          <div className="critical-card warning" onClick={() => alert('Ver serviços a vencer')}>
            <div className="critical-number">{dados.servicosAVencer}</div>
            <div className="critical-label">Serviços a Vencer</div>
            <div className="critical-action">Atenção</div>
            <div className="critical-trend">↑ 3 esta semana</div>
          </div>
          <div className="critical-card info" onClick={() => alert('Ver colaboradores inaptos')}>
            <div className="critical-number">{dados.colaboradoresInaptos}</div>
            <div className="critical-label">Colaboradores Inaptos</div>
            <div className="critical-action">Bloqueados</div>
            <div className="critical-trend">→ estável</div>
          </div>
          <div className="critical-card secondary" onClick={() => alert('Ver pendências')}>
            <div className="critical-number">{dados.pendenciasDocumentais}</div>
            <div className="critical-label">Pendências Documentais</div>
            <div className="critical-action">Regularizar</div>
            <div className="critical-trend">↓ 1 esta semana</div>
          </div>
        </div>
      </div>

      {/* Indicadores Operacionais */}
      <div className="dashboard-operational">
        <h3>Indicadores Operacionais</h3>
        <div className="operational-cards">
          <div className="operational-card">
            <div className="operational-number">{dados.servicosExecutados}</div>
            <div className="operational-label">Serviços Executados (Mês)</div>
            <div className="operational-progress">
              <div className="progress-bar" style={{width: '85%'}}></div>
            </div>
            <div className="operational-meta">Meta: 150</div>
          </div>
          <div className="operational-card">
            <div className="operational-number">{dados.servicosAgendados}</div>
            <div className="operational-label">Serviços Agendados</div>
            <div className="operational-progress">
              <div className="progress-bar" style={{width: '60%'}}></div>
            </div>
            <div className="operational-meta">Próximos 30 dias</div>
          </div>
          <div className="operational-card">
            <div className="operational-number">{dados.agendaDoDia}</div>
            <div className="operational-label">Agenda do Dia</div>
            <div className="operational-progress">
              <div className="progress-bar" style={{width: '92%'}}></div>
            </div>
            <div className="operational-meta">Capacidade: 25</div>
          </div>
          <div className="operational-card">
            <div className="operational-number">{dados.equipesEmCampo}</div>
            <div className="operational-label">Equipes em Campo</div>
            <div className="operational-progress">
              <div className="progress-bar" style={{width: '80%'}}></div>
            </div>
            <div className="operational-meta">Total: 5 equipes</div>
          </div>
        </div>
      </div>

      {/* Agenda do Dia - Visão Rápida */}
      <div className="dashboard-agenda">
        <div className="agenda-header">
          <h3>Agenda do Dia - {new Date().toLocaleDateString('pt-BR')}</h3>
          <div className="agenda-actions">
            <button className="btn-agenda-export">Exportar Agenda</button>
            <button className="btn-agenda-refresh">Atualizar</button>
          </div>
        </div>
        
        <div className="agenda-table">
          <table>
            <thead>
              <tr>
                <th>Horário</th>
                <th>Cliente</th>
                <th>Serviço</th>
                <th>Equipe</th>
                <th>Veículo</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr className="agenda-row-critical">
                <td>07:00</td>
                <td>Hospital São Lucas</td>
                <td>Reservatório 5000L</td>
                <td>Equipe Alpha</td>
                <td>VAN-1234</td>
                <td className="status-em-andamento">Em Andamento</td>
                <td>
                  <button className="btn-action" onClick={() => alert('Detalhes do serviço')}>Detalhes</button>
                  <button className="btn-action" onClick={() => alert('Localização no mapa')}>Mapa</button>
                  <button className="btn-action" onClick={() => alert('Comunicação com equipe')}>Contato</button>
                </td>
              </tr>
              <tr className="agenda-row-warning">
                <td>08:30</td>
                <td>Escola Municipal</td>
                <td>Bebedouros (4 unidades)</td>
                <td>Equipe Beta</td>
                <td>VAN-5678</td>
                <td className="status-agendado">Agendado</td>
                <td>
                  <button className="btn-action" onClick={() => alert('Detalhes do serviço')}>Detalhes</button>
                  <button className="btn-action" onClick={() => alert('Localização no mapa')}>Mapa</button>
                  <button className="btn-action" onClick={() => alert('Comunicação com equipe')}>Contato</button>
                </td>
              </tr>
              <tr className="agenda-row-normal">
                <td>10:00</td>
                <td>Restaurante Central</td>
                <td>Coifas (2 unidades)</td>
                <td>Equipe Gamma</td>
                <td>VAN-9012</td>
                <td className="status-agendado">Agendado</td>
                <td>
                  <button className="btn-action" onClick={() => alert('Detalhes do serviço')}>Detalhes</button>
                  <button className="btn-action" onClick={() => alert('Localização no mapa')}>Mapa</button>
                  <button className="btn-action" onClick={() => alert('Comunicação com equipe')}>Contato</button>
                </td>
              </tr>
              <tr className="agenda-row-problem">
                <td>14:00</td>
                <td>Shopping Center</td>
                <td>Reservatório 10000L</td>
                <td>Equipe Delta</td>
                <td>VAN-3456</td>
                <td className="status-pendente">Pendente</td>
                <td>
                  <button className="btn-action" onClick={() => alert('Problema: Colaborador inapto')}>Problema</button>
                  <button className="btn-action" onClick={() => alert('Remarcar serviço')}>Remarcar</button>
                  <button className="btn-action" onClick={() => alert('Alocar outra equipe')}>Realocar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Alertas e Notificações */}
      <div className="dashboard-alerts">
        <h3>Alertas e Notificações</h3>
        <div className="alerts-list">
          <div className="alert-item critical">
            <span className="alert-time">08:45</span>
            <span className="alert-message">Serviço vencido: Hospital São Lucas - Reservatório 5000L</span>
            <span className="alert-action">Ver</span>
          </div>
          <div className="alert-item warning">
            <span className="alert-time">09:15</span>
            <span className="alert-message">ASO vencendo em 7 dias: João Silva</span>
            <span className="alert-action">Agendar</span>
          </div>
          <div className="alert-item info">
            <span className="alert-time">10:30</span>
            <span className="alert-message">Nova solicitação de serviço: Shopping Center</span>
            <span className="alert-action">Analisar</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
