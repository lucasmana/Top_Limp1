import React from 'react';
import './Equipes.css';

const Equipes = () => {
  return (
    <div className="portaladm-equipes">
      <h2>Equipes - Gestão de Times</h2>
      
      <div className="equipes-actions">
        <button className="btn-primary">+ Nova Equipe</button>
        <button className="btn-secondary">Reorganizar Equipes</button>
      </div>

      <div className="equipes-filters">
        <select className="filter-select">
          <option value="">Todas as Equipes</option>
          <option value="ativas">Apenas Ativas</option>
        </select>
      </div>

      <div className="equipes-grid">
        <div className="equipe-card">
          <div className="equipe-header">
            <h3>Equipe Alpha</h3>
            <span className="equipe-status status-ativo">Ativa</span>
          </div>
          <div className="equipe-info">
            <div className="equipe-supervisor">
              <strong>Supervisor:</strong> João Silva
            </div>
            <div className="equipe-integrantes">
              <strong>Integrantes:</strong> 4 pessoas
            </div>
          </div>
          <div className="equipe-actions">
            <button className="btn-action">👥</button>
            <button className="btn-action">✏️</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Equipes;
