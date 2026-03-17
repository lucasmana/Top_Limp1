import React from 'react';
import './Relatorios.css';

const Relatorios = () => {
  return (
    <div className="portaladm-relatorios">
      <h2>Relatórios - Análise Gerencial</h2>
      
      <div className="relatorios-actions">
        <button className="btn-primary">+ Gerar Relatório</button>
        <button className="btn-secondary">Relatórios Agendados</button>
      </div>

      <div className="relatorios-filters">
        <select className="filter-select">
          <option value="">Todos os Tipos</option>
          <option value="servicos">Serviços Executados</option>
          <option value="clientes">Clientes</option>
        </select>
        <input type="date" className="filter-input" />
      </div>

      <div className="relatorios-grid">
        <div className="relatorio-card">
          <div className="relatorio-header">
            <h3>Serviços Executados</h3>
            <span className="relatorio-badge">Mensal</span>
          </div>
          <div className="relatorio-info">
            <div className="relatorio-stats">
              <div className="relatorio-stat">
                <span className="stat-number">127</span>
                <span className="stat-label">Serviços</span>
              </div>
            </div>
          </div>
          <div className="relatorio-actions">
            <button className="btn-action">👁️</button>
            <button className="btn-action">⬇️</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Relatorios;
